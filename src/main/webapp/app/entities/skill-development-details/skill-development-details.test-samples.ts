import { ISkillDevelopmentDetails, NewSkillDevelopmentDetails } from './skill-development-details.model';

export const sampleWithRequiredData: ISkillDevelopmentDetails = {
  id: 16405,
};

export const sampleWithPartialData: ISkillDevelopmentDetails = {
  id: 13927,
};

export const sampleWithFullData: ISkillDevelopmentDetails = {
  id: 28642,
};

export const sampleWithNewData: NewSkillDevelopmentDetails = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
