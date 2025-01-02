import { IExtraquestionAns, NewExtraquestionAns } from './extraquestion-ans.model';

export const sampleWithRequiredData: IExtraquestionAns = {
  id: 27442,
  questionans: 'overlooked fantasise',
};

export const sampleWithPartialData: IExtraquestionAns = {
  id: 19093,
  questionans: 'which well-made',
};

export const sampleWithFullData: IExtraquestionAns = {
  id: 32420,
  questionans: 'excepting however hopelessly',
};

export const sampleWithNewData: NewExtraquestionAns = {
  questionans: 'ha amid closed',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
