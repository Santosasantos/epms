import { IFeedbackDetails, NewFeedbackDetails } from './feedback-details.model';

export const sampleWithRequiredData: IFeedbackDetails = {
  id: 3791,
};

export const sampleWithPartialData: IFeedbackDetails = {
  id: 7140,
};

export const sampleWithFullData: IFeedbackDetails = {
  id: 8195,
  commentsforfeedbacksubtype: 'very yahoo till',
  ratingvalue: 7467,
};

export const sampleWithNewData: NewFeedbackDetails = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
