import { ITeachOther, NewTeachOther } from './teach-other.model';

export const sampleWithRequiredData: ITeachOther = {
  id: 9477,
  technicalSkill: 'chafe',
  recommendation: 'Yes',
};

export const sampleWithPartialData: ITeachOther = {
  id: 16310,
  technicalSkill: 'dig pie',
  recommendation: 'No',
};

export const sampleWithFullData: ITeachOther = {
  id: 26308,
  technicalSkill: 'accessory agriculture yahoo',
  recommendation: 'Yes',
  particularStrengh: 'telephone alien hungrily',
  whynotRecommend: 'until',
};

export const sampleWithNewData: NewTeachOther = {
  technicalSkill: 'lively dislike fooey',
  recommendation: 'Yes',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
