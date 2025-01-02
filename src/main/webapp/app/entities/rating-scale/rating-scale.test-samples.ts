import { IRatingScale, NewRatingScale } from './rating-scale.model';

export const sampleWithRequiredData: IRatingScale = {
  id: 1483,
  scaletype: 'across',
  ratingscales: 'acoustics mostly not',
};

export const sampleWithPartialData: IRatingScale = {
  id: 13300,
  scaletype: 'ah',
  ratingscales: 'mockingly officially brr',
};

export const sampleWithFullData: IRatingScale = {
  id: 6611,
  scaletype: 'enchanting um yet',
  ratingscales: 'glittering freight',
};

export const sampleWithNewData: NewRatingScale = {
  scaletype: 'commonly hm whenever',
  ratingscales: 'above reoffend rightfully',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
