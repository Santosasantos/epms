import { IFeedbackSubType, NewFeedbackSubType } from './feedback-sub-type.model';

export const sampleWithRequiredData: IFeedbackSubType = {
  id: 16698,
  feedbacksubname: 'gracefully zowie bah',
  feedbackdescription: 'quirkily read',
};

export const sampleWithPartialData: IFeedbackSubType = {
  id: 18915,
  feedbacksubname: 'specific but swear',
  feedbackdescription: 'gah almost geez',
};

export const sampleWithFullData: IFeedbackSubType = {
  id: 22308,
  feedbacksubname: 'even whenever as',
  feedbackdescription: 'dapper ew',
};

export const sampleWithNewData: NewFeedbackSubType = {
  feedbacksubname: 'processor whenever forenenst',
  feedbackdescription: 'symptomize instead or',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
