import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackAssessmentFormComponent } from './feedback-assessment-form.component';

describe('FeedbackAssessmentFormComponent', () => {
  let component: FeedbackAssessmentFormComponent;
  let fixture: ComponentFixture<FeedbackAssessmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackAssessmentFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FeedbackAssessmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
