import { IExtraquestion, NewExtraquestion } from './extraquestion.model';

export const sampleWithRequiredData: IExtraquestion = {
  id: 7804,
  question: 'until',
};

export const sampleWithPartialData: IExtraquestion = {
  id: 2188,
  question: 'past',
};

export const sampleWithFullData: IExtraquestion = {
  id: 23468,
  question: 'secret',
};

export const sampleWithNewData: NewExtraquestion = {
  question: 'searchingly commonly provided',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
