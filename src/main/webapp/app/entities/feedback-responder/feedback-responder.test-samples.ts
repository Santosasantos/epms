import { IFeedbackResponder, NewFeedbackResponder } from './feedback-responder.model';

export const sampleWithRequiredData: IFeedbackResponder = {
  id: 13363,
  category: 'SUPERVISOR',
  responderStatus: 'SENT_TO_SUPERVISOR',
};

export const sampleWithPartialData: IFeedbackResponder = {
  id: 29379,
  category: 'STAKEHOLDER',
  responderStatus: 'REJECTED',
};

export const sampleWithFullData: IFeedbackResponder = {
  id: 23665,
  category: 'SUPERVISEE',
  stakeholderEmail: 'primate',
  responderStatus: 'COMPLETED',
};

export const sampleWithNewData: NewFeedbackResponder = {
  category: 'STAKEHOLDER',
  responderStatus: 'PENDING_FOR_ASSESSMENT',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
