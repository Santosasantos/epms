import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { finalize, forkJoin, map, of, switchMap } from 'rxjs';
import dayjs from 'dayjs';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { SortEvent } from 'primeng/api';

// Services & Models
import { FeedbackPreviewService } from "./service/feedback-preview.service";
import { FeedbackResponderService } from "../entities/feedback-responder/service/feedback-responder.service";
import { FeedbackService } from "../entities/feedback/service/feedback.service";
import { IFeedbackResponder } from "../entities/feedback-responder/feedback-responder.model";
import { IFeedback } from "../entities/feedback/feedback.model";
import { FeedbackStatus } from '../entities/enumerations/feedback-status.model';
import { ResponderCategory } from '../entities/enumerations/responder-category.model';

interface IMappedFeedbackData {
  feedbackId: number;
  feedback: IFeedback | null;
  responder: IFeedbackResponder;
}

type FeedbackStatusType = keyof typeof FeedbackStatus | null | undefined;

@Component({
  selector: 'jhi-feedback-preview-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    CardModule,
    ProgressSpinnerModule,
    ChipModule,
    TooltipModule
  ],
  templateUrl: './feedback-preview-list.component.html',
  styleUrl: './feedback-preview-list.component.scss'
})
export class FeedbackPreviewListComponent implements OnInit {
  userPin: string = '6305';
  currentYear: number = 2024;
  isLoading = false;
  error: string | null = null;

  feedbackRequestList: IFeedbackResponder[] = [];
  feedbackList: IFeedback[] = [];
  mappedFeedbackData: Map<number, IMappedFeedbackData> = new Map();

  protected readonly ResponderCategory = ResponderCategory;
  protected readonly FeedbackStatus = FeedbackStatus;

  constructor(
    private feedbackPreviewService: FeedbackPreviewService,
    private feedbackResponderService: FeedbackResponderService,
    private feedbackService: FeedbackService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRequesteeList();
  }

  loadRequesteeList(): void {
    this.isLoading = true;
    this.error = null;
    this.feedbackList = [];
    this.mappedFeedbackData.clear();

    this.feedbackResponderService.getRequesteeList(this.userPin, this.currentYear).pipe(
      map(res => res.body ?? []),
      switchMap(responders => {
        this.feedbackRequestList = responders;
        console.log('Loaded responders:', responders);

        if (responders.length === 0) {
          return of([]);
        }

        const feedbackRequests = responders
          .filter(responder => responder?.feedback?.id)
          .map(responder =>
            this.feedbackService.find(responder.feedback!.id!).pipe(
              map(feedbackRes => ({
                feedbackId: responder.feedback!.id!,
                feedback: feedbackRes.body,
                responder: responder
              }))
            )
          );

        return forkJoin(feedbackRequests);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (mappedData) => {
        mappedData.forEach(data => {
          if (data.feedback) {
            this.mappedFeedbackData.set(data.feedbackId, data);
            this.feedbackList.push(data.feedback);
          }
        });
      },
      error: (error) => {
        console.error('Error loading requestee list:', error);
        this.error = 'Failed to load feedback data. Please try again.';
        this.isLoading = false;
      }
    });
  }

  getFeedbackData(feedbackId: number | undefined): IMappedFeedbackData | undefined {
    return feedbackId ? this.mappedFeedbackData.get(feedbackId) : undefined;
  }

  getCategoryLabel(feedbackId: number | undefined): string {
    if (!feedbackId) return '';
    const data = this.getFeedbackData(feedbackId);
    return data?.responder?.category?.toString() || '';
  }

  getResponderStatus(feedbackId: number | undefined): FeedbackStatusType {
    if (!feedbackId) return undefined;
    const data = this.getFeedbackData(feedbackId);
    return data?.responder?.responderStatus;
  }

  getResponderId(feedbackId: number | undefined): number | undefined {
    if (!feedbackId) return undefined;
    const data = this.getFeedbackData(feedbackId);
    return data?.responder?.id;
  }

  provideFeedback(responderId: number | undefined): void {
    if (!responderId) {
      console.error('Invalid responder ID');
      return;
    }
    this.router.navigate(['/feedback-assessment-form', responderId]);
  }

  getStatusColor(status: FeedbackStatusType): string {
    if (!status) return 'text-gray-500';

    switch (status) {
      case 'NEW':
        return 'text-blue-500';
      case 'SENT_TO_SUPERVISOR':
        return 'text-purple-500';
      case 'SAVE_AS_DRAFT':
        return 'text-gray-500';
      case 'APPROVED':
        return 'text-green-500';
      case 'REJECTED':
        return 'text-red-500';
      case 'PENDING_FOR_ASSESSMENT':
        return 'text-orange-500';
      case 'COMPLETED':
        return 'text-green-700';
      default:
        return 'text-gray-500';
    }
  }

  canProvideFeedback(feedbackId: number | undefined): boolean {
    if (!feedbackId) return false;
    const data = this.getFeedbackData(feedbackId);
    return data?.responder?.responderStatus === FeedbackStatus.PENDING_FOR_ASSESSMENT;
  }

  getFormattedDate(date: dayjs.Dayjs | null | undefined): string {
    return date ? dayjs(date).format('DD MMM YYYY') : 'N/A';
  }

  refreshList(): void {
    this.loadRequesteeList();
  }
}
