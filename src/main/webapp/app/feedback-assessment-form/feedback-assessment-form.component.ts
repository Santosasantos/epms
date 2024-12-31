import { Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2, ViewChild, inject } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StepsModule } from 'primeng/steps';
import { CardModule } from 'primeng/card';
import { RatingModule } from 'primeng/rating';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { StepperModule } from 'primeng/stepper';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ChipModule } from 'primeng/chip';
import { SkeletonModule } from 'primeng/skeleton';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import {IFeedback} from "../entities/feedback/feedback.model";
import {NewTeachOther} from "../entities/teach-other/teach-other.model";
import {IFeedbackSubType} from "../entities/feedback-sub-type/feedback-sub-type.model";
import {Subscription, forkJoin, map, takeUntil } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ISkillDevelopmentType } from 'app/entities/skill-development-type/skill-development-type.model';
import {DataUtils} from "../core/util/data-util.service";
import {FeedbackDetailsService} from "../entities/feedback-details/service/feedback-details.service";
import {ActivatedRoute, Router } from '@angular/router';
import {TeachOtherService} from "../entities/teach-other/service/teach-other.service";
import { TeachOtherFormService } from 'app/entities/teach-other/update/teach-other-form.service';
import {
  SkillDevelopmentDetailsService
} from "../entities/skill-development-details/service/skill-development-details.service";
import {
  SkillDevelopmentDetailsFormService
} from "../entities/skill-development-details/update/skill-development-details-form.service";
import { SkillDevelopmentTypeService } from 'app/entities/skill-development-type/service/skill-development-type.service';
import {FeedbackSubTypeService} from "../entities/feedback-sub-type/service/feedback-sub-type.service";
import {FeedbackService} from "../entities/feedback/service/feedback.service";
import {FeedbackDetailsFormService} from "../entities/feedback-details/update/feedback-details-form.service";
import {IFeedbackResponder} from "../entities/feedback-responder/feedback-responder.model";
import {FeedbackResponderService} from "../entities/feedback-responder/service/feedback-responder.service";
import { CommonModule } from '@angular/common';
import {FeedbackAssessmentService} from "./service/feedback-assessment.service";
import {IFeedbackAssessmentDraftModel} from "./feedback-assessment-draft.model";
import { NewFeedbackDetails } from 'app/entities/feedback-details/feedback-details.model';
import {FeedbackStatus} from "../entities/enumerations/feedback-status.model";

@Component({
  selector: 'jhi-feedback-assessment-form',
  standalone: true,
  imports: [ReactiveFormsModule,
    CommonModule,
    StepsModule,
    CardModule,
    RatingModule,
    MultiSelectModule,
    ButtonModule,
    InputTextareaModule,
    StepperModule,
    ToggleButtonModule,
    DropdownModule,
    InputTextModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    ChipModule,
    SkeletonModule,],
  templateUrl: './feedback-assessment-form.component.html',
  styleUrl: './feedback-assessment-form.component.scss'
})
export class FeedbackAssessmentFormComponent implements OnInit, OnDestroy {
  @ViewChild('stepper') stepper!: StepperModule;
  @ViewChild('multiSelect') multiselect: any;
  @ViewChild('chipSection') chipSection!: ElementRef;


  requestForm: FormGroup;
  feedback: IFeedback | null = null;
  responderId!: number;
  feedbackResponder: IFeedbackResponder | null = null;
  feedbackSubTypesSharedCollection: IFeedbackSubType[] = [];
  skillDevelopmentTypesSharedCollection: ISkillDevelopmentType[] = [];
  ratingList: string[] = [];
  badgeList = ['danger', 'warning', 'info', 'success'];
  active = 0;
  showStrengthField = false;
  showWhyField = false;
  isLoading = true;
  reviewData: any = {};
  selectedSkills: any[] = [];
  recommendOptions: any[];
  private skillSubscription!: Subscription;

  private feedbackdetailsformservice = inject(FeedbackDetailsFormService);
  private feedbackService = inject(FeedbackService);
  private feedbackResponderService = inject(FeedbackResponderService);
  private feedbackSubTypeService = inject(FeedbackSubTypeService);
  private skillDevelopmentTypeService = inject(SkillDevelopmentTypeService);
  private skillDevelopmentDetailsFormService = inject(SkillDevelopmentDetailsFormService);
  private skillDevelopmentDetailsService = inject(SkillDevelopmentDetailsService);
  private teachOtherFormService = inject(TeachOtherFormService);
  private teachOtherService = inject(TeachOtherService);
  protected activatedRoute = inject(ActivatedRoute);
  protected router = inject(Router);
  private feedbackDetailsService = inject(FeedbackDetailsService);
  private localStorageService = inject(FeedbackAssessmentService);
  private fb = inject(FormBuilder);
  private renderer = inject(Renderer2);
  private dataUtils = inject(DataUtils);

  constructor() {
    this.requestForm = this.fb.group({
      feedbackForm: this.fb.array([]),
      skillForm: this.fb.group({
        selectedSkills: [[], Validators.required]
      }),
      teachOtherForm: this.fb.group({
        id: [null],
        technicalSkill: ['', Validators.required],
        recommendation: [null, Validators.required],
        particularStrengh: [''],
        whynotRecommend: [''],
        responder: [null]
      }),
    });
    this.recommendOptions = [
      {label: 'Yes', value: 'Yes'},
      {label: 'No', value: 'No'}
    ];
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const id = +params['responderId'];
      console.log('id', id);
      if (!isNaN(id)) {
        this.responderId = id;
        this.loadRelationshipsOptions();
        console.log('ratingList', this.ratingList);
        this.initSelectedSkills();
        this.checkRecommendationField();
      } else {
        this.previousState();
      }
    });
    this.requestForm.valueChanges.subscribe(value => {
      console.log('Form value:', value);
    });
    console.log(this.isLoading);
  }

  next() {
    this.active++;
  }

  prev() {
    this.active--;
  }

  initSelectedSkills() {
    const selectedSkillsControl = this.requestForm.get('skillForm.selectedSkills');
    if (selectedSkillsControl) {
      this.selectedSkills = selectedSkillsControl.value || [];
      this.skillSubscription = selectedSkillsControl.valueChanges.subscribe(value => {
        this.selectedSkills = value || [];
      });
    }
  }

  onDropdownShow() {
    setTimeout(() => {
      const panel = this.multiselect.el.nativeElement.querySelector('.p-multiselect-panel');
      if (panel) {
        const panelRect = panel.getBoundingClientRect();
        this.renderer.setStyle(this.chipSection.nativeElement, 'position', 'absolute');
        this.renderer.setStyle(this.chipSection.nativeElement, 'top', `${panelRect.bottom}px`);
        this.renderer.setStyle(this.chipSection.nativeElement, 'width', `${panelRect.width}px`);
        this.renderer.setStyle(this.chipSection.nativeElement, 'left', `${panelRect.left}px`);
      }
    });
  }

  onDropdownHide() {
    this.renderer.removeStyle(this.chipSection.nativeElement, 'position');
    this.renderer.removeStyle(this.chipSection.nativeElement, 'top');
    this.renderer.removeStyle(this.chipSection.nativeElement, 'width');
    this.renderer.removeStyle(this.chipSection.nativeElement, 'left');
  }

  onSkillChange(event: any) {
    this.requestForm.get('skillForm.selectedSkills')?.setValue(event.value);
  }

  getBadgeClass(rating: number): string {
    const index = Math.floor(((rating - 1) / (this.ratingList.length - 1)) * (this.badgeList.length - 1));
    return this.badgeList[Math.min(index, this.badgeList.length - 1)];
  }

  onRate(event: any, index: number) {
    const control = this.feedbackForm.at(index);
    control.patchValue({ratingvalue: event.value});
    console.log(`Rating for item ${index}: ${event.value} - ${this.ratingList[event.value - 1]}`);
  }

  removeSkill(skill: any) {
    const updatedSkills = this.selectedSkills.filter(s => s.id !== skill.id);
    this.requestForm.get('skillForm.selectedSkills')?.setValue(updatedSkills);
  }

  get feedbackForm(): FormArray {
    return this.requestForm.get('feedbackForm') as FormArray;
  }

  get skillForm(): FormGroup {
    return this.requestForm.get('skillForm') as FormGroup;
  }

  get teachOtherForm(): FormGroup {
    return this.requestForm.get('teachOtherForm') as FormGroup;
  }

  checkRecommendationField() {
    const recommendation = this.teachOtherForm.get('recommendation')?.value;
    this.showStrengthField = recommendation === 'Yes';
    this.showWhyField = recommendation === 'No';
  }

  onRecommendChange(event: any): void {
    this.showStrengthField = event.value === 'Yes';
    this.showWhyField = event.value === 'No';
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  protected loadRelationshipsOptions(): void {
    this.isLoading = true;
    forkJoin({
      responder: this.feedbackResponderService.find(this.responderId!).pipe(map((res: HttpResponse<IFeedbackResponder>) => res.body ?? null)),
      subtypes: this.feedbackSubTypeService.query().pipe(map((res: HttpResponse<IFeedbackSubType[]>) => res.body ?? [])),
      skills: this.skillDevelopmentTypeService.query().pipe(map((res: HttpResponse<ISkillDevelopmentType[]>) => res.body ?? [])),
    }).subscribe({
      next: ({responder, subtypes, skills}) => {
        this.feedbackResponder = responder;
        this.feedbackSubTypesSharedCollection = subtypes;
        console.log('feedbackSubType', this.feedbackSubTypesSharedCollection);
        console.log('feedbackId', responder?.feedback?.id);
        this.feedbackService.find(responder?.feedback?.id!).subscribe(res => {
          console.log(res);
          this.ratingList = res?.body?.ratingScale?.ratingscales?.split(',').map(scale => scale.trim()) || [];
          this.feedback = res.body;
        });
        console.log('feedback', this.feedback);

        this.skillDevelopmentTypesSharedCollection = skills;
        this.initializeForm();
        this.loadDraft();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.isLoading = false;
      }
    });
  }

  private initializeForm(): void {
    this.feedbackSubTypesSharedCollection.forEach(subtype => {
      this.feedbackForm.push(this.createSubtypeFormGroup(subtype));
    });
    if (this.feedbackResponder) {
      this.updateTeachOtherForm(this.feedbackResponder);
    }
  }

  private createSubtypeFormGroup(subtype: IFeedbackSubType, values: any = null): FormGroup {
    return this.fb.group({
      id: [values ? values.id : null],
      responder: [values ? values.responder : this.feedbackResponder],
      feedbacksubtypes: [values ? values.feedbacksubtypes : subtype],
      commentsforfeedbacksubtype: [values ? values.commentsforfeedbacksubtype : ''],
      ratingvalue: [values ? values.ratingvalue : '', [Validators.required, Validators.min(1), Validators.max(this.ratingList.length)]]
    });
  }

  private updateTeachOtherForm(feedbackResponder: IFeedbackResponder): void {
    // Instead of immediately transforming, first prepare the form
    const defaultValues = {
      technicalSkill: '',
      recommendation: null, // or a default value from RecommendationValue
      particularStrengh: '',
      whynotRecommend: '',
      responder: feedbackResponder
    };

    this.teachOtherForm.patchValue(defaultValues);
  }

  private loadDraft(): void {
    this.localStorageService.getDraft(this.responderId!)
      .subscribe({
        next: (response) => {
          const draft = response.body as IFeedbackAssessmentDraftModel;
          if (draft) {
            try {
              // Handle feedbackForm
              if (draft.feedbackForm && Array.isArray(draft.feedbackForm)) {
                // Clear existing array
                while (this.feedbackForm.length) {
                  this.feedbackForm.removeAt(0);
                }

                // Add each item from draft
                draft.feedbackForm.forEach(item => {
                  const formGroup = this.fb.group({
                    id: [item.id],
                    responder: [item.responder],
                    feedbacksubtypes: [item.feedbacksubtypes],
                    commentsforfeedbacksubtype: [item.commentsforfeedbacksubtype || ''],
                    ratingvalue: [item.ratingvalue || '']
                  });
                  this.feedbackForm.push(formGroup);
                });
              }

              // Handle skillForm
              const skillFormValue = draft.skillForm?.selectedSkills || [];
              this.requestForm.get('skillForm')?.patchValue({selectedSkills: skillFormValue});
              this.selectedSkills = skillFormValue;

              // Handle teachOtherForm
              if (draft.teachOtherForm) {
                this.teachOtherForm.patchValue({
                  id: draft.teachOtherForm.id,
                  technicalSkill: draft.teachOtherForm.technicalSkill || '',
                  recommendation: draft.teachOtherForm.recommendation,
                  particularStrengh: draft.teachOtherForm.particularStrengh || '',
                  whynotRecommend: draft.teachOtherForm.whynotRecommend || '',
                  responder: draft.teachOtherForm.responder
                });

                // Update conditional fields visibility
                this.checkRecommendationField();
              }

              console.log('Form updated with draft:', this.requestForm.value);
            } catch (error) {
              console.error('Error while applying draft data:', error);
            }
          }
        },
        error: (error) => {
          if (error.status !== 404) {
            console.error('Error loading draft:', error);
          }
        }
      });
  }

  saveDraft(): void {
    this.localStorageService.saveDraft(this.responderId!, this.requestForm.value)
      .subscribe({
        next: () => console.log('Draft saved successfully'),
        error: (error) => console.error('Error saving draft:', error)
      });
  }

  prepareReviewData(): void {
    this.reviewData = {
      feedbackDetails: this.feedbackForm.value,
      selectedSkills: this.requestForm.get('skillForm.selectedSkills')?.value,
      teachOtherDetails: this.teachOtherForm.value
    };
    console.log('review Data:', this.reviewData);
  }

  submit() {
    if (this.requestForm.invalid) {
      return;
    }

    // Debug logs to understand the data structure
    console.log('Full Form Value:', this.requestForm.value);
    console.log('FeedbackForm Array:', this.feedbackForm.value);
    console.log('Feedback SubTypes Collection:', this.feedbackSubTypesSharedCollection);

    // Get all the form values
    const feedbackDetails = this.feedbackForm.value;
    const selectedSkills = this.skillForm.get('selectedSkills')?.value || [];

    // Create feedback details submissions with proper mapping
    const feedbackSubmissions = feedbackDetails.map((detail: { commentsforfeedbacksubtype: any; ratingvalue: any; }, index: number) => {
      const submissionData = {
        id: null,
        commentsforfeedbacksubtype: detail.commentsforfeedbacksubtype,
        ratingvalue: detail.ratingvalue,
        feedbackSubType: this.feedbackSubTypesSharedCollection[index],
        responder: this.feedbackResponder
      };
      return this.feedbackDetailsService.create(submissionData);
    });

    // Create skill development submissions
    const skillSubmissions = selectedSkills.map((skill: any) => {
      const skillData = {
        id: null,
        skillDevelopmentType: skill,
        responder: this.feedbackResponder
      };
      return this.skillDevelopmentDetailsService.create(skillData);
    });

    // Create teach other submission
    const teachOtherSubmission = this.teachOtherService.create(
      this.teachOtherFormService.transformToNewTechOther(
        this.teachOtherForm,
        this.feedbackResponder!
      )
    );

    // Combine all submissions
    const submissions = [
      ...feedbackSubmissions,
      ...skillSubmissions,
      teachOtherSubmission
    ];

    // Execute all submissions
    forkJoin(submissions).subscribe({
      next: (response) => {
        console.log('All submissions successful:', response);
        this.updateResponderStatus(this.responderId,'completed');
        // this.updateFeedbackStatus('completed');
        this.localStorageService.deleteDraft(this.responderId).subscribe(
          () => {
            console.log('Draft deleted successfully');
            this.requestForm.reset();
            this.router.navigate(['/']);
          },
          error => console.error('Error deleting draft:', error)
        );
      },
      error: (error) => {
        console.error('Error submitting form:', error);
      }
    });
  }

   updateResponderStatus(responderId: number, responderStatus: string) {
    try {
        this.feedbackResponderService.updateResponderStatus(responderId, responderStatus)
          .subscribe(res => {
            if(res){
              console.log(res);
            }
          })
    } catch (error) {
      console.error('Error updating responder statuses:', error);
    }
  }

  updateFeedbackStatus(feedbackstatus: string): void {
    console.log('staus in Feedback',feedbackstatus);
    console.log('status in string',status);
    this.feedbackService.updateStatus(this.feedbackResponder?.feedback?.id!, feedbackstatus).subscribe({
      next: (res) => console.log('Feedback status updated:', res),
      error: (error) => console.error('Error updating feedback status:', error)
    });
  }

  private previousState() {
    this.router.navigateByUrl('/feedback-requestee');
  }

  ngOnDestroy(): void {
    if (this.skillSubscription) {
      this.skillSubscription.unsubscribe();
    }
    this.saveDraft();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event: any) {
    this.saveDraft();
  }
}
