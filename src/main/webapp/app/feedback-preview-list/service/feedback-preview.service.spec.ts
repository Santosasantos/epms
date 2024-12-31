import { TestBed } from '@angular/core/testing';

import { FeedbackPreviewService } from './feedback-preview.service';

describe('FeedbackPreviewService', () => {
  let service: FeedbackPreviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeedbackPreviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
