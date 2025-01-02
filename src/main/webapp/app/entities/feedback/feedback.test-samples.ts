import dayjs from 'dayjs/esm';

import { IFeedback, NewFeedback } from './feedback.model';

export const sampleWithRequiredData: IFeedback = {
  id: 24930,
  requestDate: dayjs('2024-12-05T17:41'),
  status: 'NEW',
  createdBy: 'helplessly outgun',
  assessmentYear: 319,
};

export const sampleWithPartialData: IFeedback = {
  id: 25404,
  requestDate: dayjs('2024-12-05T23:14'),
  status: 'SAVE_AS_DRAFT',
  responseDate: dayjs('2024-12-05'),
  createdBy: 'sublet finally',
  assessmentYear: 7028,
};

export const sampleWithFullData: IFeedback = {
  id: 26064,
  requestDate: dayjs('2024-12-05T23:26'),
  status: 'NEW',
  responseDate: dayjs('2024-12-05'),
  createdBy: 'duel scripture fuzzy',
  assessmentYear: 26346,
};

export const sampleWithNewData: NewFeedback = {
  requestDate: dayjs('2024-12-06T07:00'),
  status: 'SENT_TO_SUPERVISOR',
  createdBy: 'however fooey',
  assessmentYear: 4661,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
