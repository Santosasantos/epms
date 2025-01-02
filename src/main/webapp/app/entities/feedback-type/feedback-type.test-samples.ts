import { IFeedbackType, NewFeedbackType } from './feedback-type.model';

export const sampleWithRequiredData: IFeedbackType = {
  id: 6776,
  feedbackname: 'quicksand mixed gentrify',
};

export const sampleWithPartialData: IFeedbackType = {
  id: 17140,
  feedbackname: 'consequently',
};

export const sampleWithFullData: IFeedbackType = {
  id: 16660,
  feedbackname: 'dunk cruise clear-cut',
};

export const sampleWithNewData: NewFeedbackType = {
  feedbackname: 'storm fumigate',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
