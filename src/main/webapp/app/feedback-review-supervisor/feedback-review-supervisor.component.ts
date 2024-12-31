import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Subject, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';

// Services
import { FeedbackReviewService } from "./service/feedback-review.service";
import { EmployeeService } from "../entities/employee/service/employee.service";
import { FeedbackService } from "../entities/feedback/service/feedback.service";
import { FeedbackSubTypeService } from "../entities/feedback-sub-type/service/feedback-sub-type.service";
import { SkillDevelopmentTypeService } from "../entities/skill-development-type/service/skill-development-type.service";
import { ExtraquestionService } from "../entities/extraquestion/service/extraquestion.service";
import { FeedbackResponderService } from "../entities/feedback-responder/service/feedback-responder.service";

// Models
import { ISkillDevelopmentType } from "../entities/skill-development-type/skill-development-type.model";
import { IFeedbackSubType } from "../entities/feedback-sub-type/feedback-sub-type.model";
import { IEmployee } from "../entities/employee/employee.model";
import { IFeedback } from "../entities/feedback/feedback.model";
import { IExtraquestion, NewExtraquestion } from "../entities/extraquestion/extraquestion.model";
import { IFeedbackResponder } from "../entities/feedback-responder/feedback-responder.model";

// PrimeNG Components
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { ResponderCategory } from 'app/entities/enumerations/responder-category.model';
import {FeedbackStatus} from "../entities/enumerations/feedback-status.model";


interface IEmployeeReplacement {
  id: number;
  type: 'EMPLOYEE';
  employeeId: number | null;
}

interface IStakeholderReplacement {
  id: number;
  type: 'STAKEHOLDER';
  email: string;
}

type ReplacementData = IEmployeeReplacement | IStakeholderReplacement;

@Component({
  selector: 'jhi-feedback-review-supervisor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CardModule,
    TableModule,
    ChipModule,
    ButtonModule,
    InputTextareaModule,
    MessageModule,
    ProgressSpinnerModule,
    DialogModule,
    DropdownModule,
    TooltipModule
  ],
  templateUrl: './feedback-review-supervisor.component.html',
  styleUrl: './feedback-review-supervisor.component.scss'
})
export class FeedbackReviewSupervisorComponent implements OnChanges, OnDestroy {
  // Feedback and Employee Properties
  @Input() feedbackId!: number;

  loading = false;
  error: string | null = null;
  showExtraQuestionForm = false;
  extraQuestionForm!: FormGroup;

  selectedresponders: IFeedbackResponder[] = [];
  feedbackquestions: IFeedbackSubType[] = [];
  extraquestions: IExtraquestion[] = [];
  feedback!: IFeedback;
  // Replacement specific properties
  showReplaceDialog = false;
  selectedResponderId: number | null = null;
  replacementOptions: IEmployee[] = [];
  selectedReplacement: number | null = null;
  replacementType: 'EMPLOYEE' | 'STAKEHOLDER' = 'EMPLOYEE';
  replacementEmail = '';
  replacementError: string | null = null;
  updatedEmployee! :IEmployee;


  private destroy$ = new Subject<void>();

  protected readonly ResponderCategory = ResponderCategory;

  constructor(
    private feedbackService: FeedbackService,
    private feedbackResponderService: FeedbackResponderService,
    private feedbackSubTypeService: FeedbackSubTypeService,
    private extraQuestionService: ExtraquestionService,
    private employeeService: EmployeeService,
    private fb: FormBuilder
  ) {
    this.extraQuestionForm = this.fb.group({
      question: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['feedbackId']) {
      this.loadInfo();
    }
  }

  loadInfo(): void {
    this.loading = true;
    this.error = null;

    forkJoin({
      responders: this.feedbackResponderService.findFeedbackResponders(this.feedbackId).pipe(map((res: HttpResponse<IFeedbackResponder[]>) => res.body ?? [])),
      questions: this.feedbackSubTypeService.query().pipe(map((res: HttpResponse<IFeedbackSubType[]>) => res.body ?? [])),
      extraquestions: this.extraQuestionService.findByFeedbackId(this.feedbackId).pipe(map((res: HttpResponse<IExtraquestion[]>) => res.body ?? [])),
    }).subscribe({
      next: ({ responders, questions, extraquestions }) => {
        this.selectedresponders = responders.map(responder => this.createResponderObject(responder));
        this.sortResponders();
        this.feedbackquestions = questions;
        this.extraquestions = extraquestions;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.error = 'Failed to load data. Please try again.';
        this.loading = false;
      }
    });
  }

  createResponderObject(responder: IFeedbackResponder): IFeedbackResponder {
    return {
      id: responder.id,
      category: responder.category,
      employee: responder.employee,
      stakeholderEmail: responder.stakeholderEmail,
      responderStatus: responder.responderStatus,
      feedback: responder.feedback
    };
  }

  sortResponders(): void {
    const categoryOrder = ['SELF', 'SUPERVISOR', 'PEER', 'SUPERVISEE', 'STAKEHOLDER'];
    this.selectedresponders.sort((a, b) => {
      return categoryOrder.indexOf(a.category!) - categoryOrder.indexOf(b.category!);
    });
  }

  replaceResponder(responder: IFeedbackResponder): void {
    this.selectedResponderId = responder.id ?? null;
    this.replacementType = responder.category === ResponderCategory.STAKEHOLDER ? 'STAKEHOLDER' : 'EMPLOYEE';

    if (this.replacementType === 'EMPLOYEE') {
      this.loadEmployeeReplacements(responder);
    } else {
      this.replacementEmail = '';
    }
    this.showReplaceDialog = true;
  }

  private loadEmployeeReplacements(responder: IFeedbackResponder): void {
    if (!responder.feedback?.createdBy) return;

    this.feedbackService.searchEmployees(responder.category!, responder.feedback.createdBy)
      .pipe(
        map(response => response.body ?? []),
        map(employees => employees.filter(emp =>
          !this.selectedresponders.some(r => r.employee?.id === emp.id)
        )),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (employees) => {
          this.replacementOptions = employees;
          this.replacementError = null;
        },
        error: (error) => {
          console.error('Error loading replacements:', error);
          this.replacementError = 'Failed to load replacement options';
        }
      });
  }

  confirmReplacement(): void {
    if (!this.selectedResponderId) {
      console.log('No responderId selected');
      return;
    }

    const currentResponder = this.selectedresponders.find(r => r.id === this.selectedResponderId);
    console.log('Current responder:', currentResponder);

    if (!currentResponder) {
      console.error('Responder not found');
      return;
    }

    let updatedResponder: IFeedbackResponder;

    if (currentResponder.category === ResponderCategory.STAKEHOLDER) {
      updatedResponder = {
        id: this.selectedResponderId,
        category: currentResponder.category,
        stakeholderEmail: this.replacementEmail,
        employee: null,
        responderStatus: currentResponder.responderStatus,
        feedback: currentResponder.feedback
      };
      console.log('Updating stakeholder with:', updatedResponder);
    } else {
      if (!this.selectedReplacement) {
        console.error('No employee selected for replacement');
        return;
      }

      const selectedEmployee = this.replacementOptions.find(e => e.id === this.selectedReplacement);
      console.log('Selected employee:', selectedEmployee);

      if (!selectedEmployee) {
        console.error('Employee not found in options');
        return;
      }

      updatedResponder = {
        id: this.selectedResponderId,
        category: currentResponder.category,
        employee: selectedEmployee,
        stakeholderEmail: null,
        responderStatus: currentResponder.responderStatus,
        feedback: currentResponder.feedback
      };
      console.log('Updating employee with:', updatedResponder);
    }

    this.feedbackResponderService.update(updatedResponder).subscribe({
      next: (res) => {
        console.log('Update response:', res);
        if (res.body) {
          const index = this.selectedresponders.findIndex(r => r.id === this.selectedResponderId);
          if (index !== -1) {
            this.selectedresponders[index] = res.body;
            console.log('Updated responders:', this.selectedresponders);
          }
        }
        this.closeReplaceDialog();
        this.loadInfo();
      },
      error: (error) => {
        console.error('Update failed:', error);
        this.replacementError = 'Failed to replace responder';
      }
    });
  }

  // private updateEmployeeResponder(data: IEmployeeReplacement) {
  //   const selectedResponder = this.selectedresponders.find(r => r.id === data.id);
  //   if (!selectedResponder) throw new Error('Selected responder not found');
  //   console.log('selectedResponder',selectedResponder);
  //
  //   this.employeeService.find(data.employeeId!).subscribe(res =>{
  //     this.updatedEmployee = res.body!;
  //   })
  //
  //   return this.feedbackResponderService.partialUpdate({
  //     id: data.id,
  //     category: selectedResponder.category,
  //     employee: this.updatedEmployee,
  //     feedback: selectedResponder.feedback
  //   });
  // }
  //
  // private updateStakeholderResponder(data: IStakeholderReplacement) {
  //   return this.feedbackResponderService.partialUpdate({
  //     id: data.id,
  //     stakeholderEmail: data.email
  //   });
  // }

  closeReplaceDialog(): void {
    this.showReplaceDialog = false;
    this.selectedResponderId = null;
    this.selectedReplacement = null;
    this.replacementEmail = '';
    this.replacementOptions = [];
    this.replacementError = null;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  removeExtraQuestion(questionId: number): void {
    this.extraQuestionService.delete(questionId).subscribe({
      next: () => {
        this.extraquestions = this.extraquestions.filter(({ id }) => id !== questionId);
      },
      error: (error) => {
        console.error('Error deleting extra question:', error);
      }
    });
  }

  addExtraQuestion(): void {
    this.showExtraQuestionForm = true;
  }

  saveExtraQuestion(): void {
    if (this.extraQuestionForm.valid) {
      const newQuestion: NewExtraquestion = {
        id: null,
        question: this.extraQuestionForm.get('question')?.value,
        feedback: { id: this.feedbackId },
      };

      this.extraQuestionService.create(newQuestion).subscribe({
        next: (response) => {
          if (response.body) {
            this.extraquestions.push(response.body);
            this.showExtraQuestionForm = false;
            this.extraQuestionForm.reset();
          }
        },
        error: (error) => {
          console.error('Error adding extra question:', error);
        }
      });
    }
  }

  cancelAddExtraQuestion(): void {
    this.showExtraQuestionForm = false;
    this.extraQuestionForm.reset();
  }

  approveStatus(): void {
    this.updateResponderStatus(FeedbackStatus.PENDING_FOR_ASSESSMENT);
    this.updateFeedbackStatus(FeedbackStatus.PENDING_FOR_ASSESSMENT);
  }

  rejectStatus(): void {
    this.updateResponderStatus(FeedbackStatus.REJECTED);
    this.updateFeedbackStatus(FeedbackStatus.REJECTED);
  }

  async updateResponderStatus(responderStatus: keyof typeof FeedbackStatus): Promise<void> {
    try {
      console.log('responderStatus',responderStatus);
      const status:string = (responderStatus==FeedbackStatus.PENDING_FOR_ASSESSMENT)? 'approved': 'rejected';
      console.log('responder',status);
      const updatePromises = this.selectedresponders.map(responder =>

        this.feedbackResponderService.updateResponderStatus(responder.id!, status)
          .pipe(
            map(response => response),
            takeUntil(this.destroy$)
          )
          .toPromise()
      );

      await Promise.all(updatePromises);

      // Update all responders' status after successful API calls
      this.selectedresponders.forEach(responder => {
        responder.responderStatus = responderStatus;
      });
    } catch (error) {
      console.error('Error updating responder statuses:', error);
      this.error = 'Failed to update responder statuses';
    }
  }

  updateFeedbackStatus(feedbackstatus: string): void {
    console.log('staus in Feedback',feedbackstatus);
    const status:string = (feedbackstatus==FeedbackStatus.PENDING_FOR_ASSESSMENT)? 'approved': 'rejected';
    console.log('status in string',status);
    this.feedbackService.updateStatus(this.feedbackId, status).subscribe({
      next: (res) => console.log('Feedback status updated:', res),
      error: (error) => console.error('Error updating feedback status:', error)
    });
  }

  isButtonDisabled(value: any[]): boolean {
    if (value.length === 0) return true;
    const status = value[0].status;
    return ['NEW', 'APPROVED', 'REJECTED', 'PENDING_FOR_ASSESSMENT', 'COMPLETED'].includes(status);
  }

  canConfirmReplacement(): boolean {
    return this.replacementType === 'STAKEHOLDER' ?
      !!this.replacementEmail :
      !!this.selectedReplacement;
  }

  compareEmployees(e1: any, e2: any): boolean {
    return e1 && e2 ? e1 === e2 : e1 === e2;
  }

}
