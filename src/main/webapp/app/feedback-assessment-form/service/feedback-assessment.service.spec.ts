import { TestBed } from '@angular/core/testing';

import { FeedbackAssessmentService } from './feedback-assessment.service';

describe('FeedbackAssessmentService', () => {
  let service: FeedbackAssessmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeedbackAssessmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
