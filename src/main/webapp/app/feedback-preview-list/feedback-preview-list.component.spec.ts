import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackPreviewListComponent } from './feedback-preview-list.component';

describe('FeedbackPreviewListComponent', () => {
  let component: FeedbackPreviewListComponent;
  let fixture: ComponentFixture<FeedbackPreviewListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackPreviewListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FeedbackPreviewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
