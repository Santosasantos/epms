import { ISkillDevelopmentType, NewSkillDevelopmentType } from './skill-development-type.model';

export const sampleWithRequiredData: ISkillDevelopmentType = {
  id: 1066,
  skilldevelopmentname: 'scarce',
};

export const sampleWithPartialData: ISkillDevelopmentType = {
  id: 11759,
  skilldevelopmentname: 'assail',
};

export const sampleWithFullData: ISkillDevelopmentType = {
  id: 6984,
  skilldevelopmentname: 'gymnastics longingly yippee',
};

export const sampleWithNewData: NewSkillDevelopmentType = {
  skilldevelopmentname: 'judder',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
