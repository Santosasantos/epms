import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription, catchError, finalize, forkJoin, map, of, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

// Components
import { FeedbackReviewSupervisorComponent } from '../feedback-review-supervisor.component';

// Models
import { IFeedback } from '../../entities/feedback/feedback.model';
import { IEmployee } from '../../entities/employee/employee.model';
import { FeedbackStatus } from 'app/entities/enumerations/feedback-status.model';

// Services
import { FeedbackReviewService } from '../service/feedback-review.service';
import {DataUtils} from "../../core/util/data-util.service";

interface StatusDisplay {
  text: string;
  icon: string;
  bgColor: string;
  textColor: string;
}

@Component({
  selector: 'jhi-feedback-supervisee-list',
  standalone: true,
  imports: [CommonModule, FeedbackReviewSupervisorComponent],
  templateUrl: './feedback-supervisee-list.component.html',
  styleUrl: './feedback-supervisee-list.component.scss'
})
export class FeedbackSuperviseeListComponent implements OnInit, OnDestroy {
  superviseeMap: Map<IEmployee, IFeedback | null> = new Map();
  isLoading = false;
  error: string | null = null;
  private subscription = new Subscription();
  selectedFeedbackId: number | null = null;
  private dataUtils = inject(DataUtils);

  // Enhanced status mappings with colors
  private readonly statusDisplayMap = new Map<string, StatusDisplay>([
    [FeedbackStatus.COMPLETED, {
      text: 'Completed',
      icon: 'fa-check-circle',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800'
    }],
    [FeedbackStatus.APPROVED, {
      text: 'Approved',
      icon: 'fa-check-circle',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800'
    }],
    [FeedbackStatus.NEW, {
      text: 'New',
      icon: 'fa-clock',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800'
    }],
    [FeedbackStatus.PENDING_FOR_ASSESSMENT, {
      text: 'Pending Assessment',
      icon: 'fa-clock',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800'
    }],
    [FeedbackStatus.SENT_TO_SUPERVISOR, {
      text: 'Sent to Supervisor',
      icon: 'fa-clock',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800'
    }],
    [FeedbackStatus.REJECTED, {
      text: 'Rejected',
      icon: 'fa-times-circle',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800'
    }],
    ['No feedback', {
      text: 'No Feedback',
      icon: 'fa-times-circle',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800'
    }]
  ]);

  constructor(
    private feedbackReviewService: FeedbackReviewService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.handleUnhandledRejection();
  }

  private handleUnhandledRejection(): void {
    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes('message channel closed')) {
        event.preventDefault();
        console.debug('Ignored message channel error');
      }
    });
  }

  ngOnInit(): void {
    this.loadSuperviseeData();
  }

  loadSuperviseeData(): void {
    this.isLoading = true;
    this.error = null;
    this.superviseeMap.clear();

    this.subscription.add(
      this.feedbackReviewService
        .getSuperviseeList('1002')
        .pipe(
          switchMap((supervisees: IEmployee[]) => {
            if (!supervisees.length) return of([]);

            const feedbackRequests = supervisees.map(supervisee =>
              this.feedbackReviewService.findFeedbackbySuperviseePin(supervisee.pin!).pipe(
                catchError((error: HttpErrorResponse) => {
                  console.error(`Error fetching feedback for PIN ${supervisee.pin}:`, error);
                  return of(null);
                })
              )
            );

            return forkJoin(feedbackRequests).pipe(
              map(feedbacks => supervisees.map((supervisee, index) => ({
                supervisee,
                feedback: feedbacks[index]
              })))
            );
          }),
          finalize(() => {
            this.isLoading = false;
            this.cdr.detectChanges();
          })
        )
        .subscribe({
          next: (result) => {
            result.forEach(({ supervisee, feedback }) => {
              this.superviseeMap.set(supervisee, feedback);
            });
            this.cdr.detectChanges();
          },
          error: (error: HttpErrorResponse) => {
            this.error = this.getErrorMessage(error);
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        })
    );
  }

  getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) return 'Network error. Please check your connection.';
    if (error.status === 404) return 'No supervisee data found.';
    return error.message || 'An unexpected error occurred.';
  }

  getStatusClasses(feedback: IFeedback | IFeedback[] | null): string {
    const status = this.getFeedbackStatus(feedback);
    const statusInfo = this.statusDisplayMap.get(status);
    return statusInfo ? `${statusInfo.bgColor} ${statusInfo.textColor}` : 'bg-gray-100 text-gray-800';
  }

  getStatusIcon(feedback: IFeedback | IFeedback[] | null): string {
    const status = this.getFeedbackStatus(feedback);
    return this.statusDisplayMap.get(status)?.icon || 'fa-question-circle';
  }

  isButtonDisabled(feedback: IFeedback | IFeedback[] | null): boolean {
    if (!feedback) return true;

    if (Array.isArray(feedback)) {
      return !feedback.length ||
        [FeedbackStatus.COMPLETED, FeedbackStatus.APPROVED, FeedbackStatus.PENDING_FOR_ASSESSMENT].includes(feedback[0].status as FeedbackStatus);
    }
    return false;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  getFeedbackStatus(feedback: IFeedback | IFeedback[] | null): string {
    if (!feedback) return 'No feedback';
    if (Array.isArray(feedback)) {
      return feedback.length === 0 ? 'No feedback' : feedback[0].status || 'Unknown';
    }
    return feedback.status || 'Unknown';
  }

  viewFeedback(feedback: IFeedback | IFeedback[] | null): void {
    if (Array.isArray(feedback) && feedback.length > 0 && feedback[0].id) {
      this.selectedFeedbackId = feedback[0].id;
      setTimeout(() => {
        const element = document.querySelector('jhi-feedback-review-supervisor');
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      console.error('Invalid feedback data');
    }
  }

  get isMapEmpty(): boolean {
    return this.superviseeMap.size === 0;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected readonly FeedbackStatus = FeedbackStatus;
}
