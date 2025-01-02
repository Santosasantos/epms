import dayjs from 'dayjs/esm';

import { IEmployee, NewEmployee } from './employee.model';

export const sampleWithRequiredData: IEmployee = {
  id: 18947,
  firstname: 'coil beard crushing',
  lastname: 'alpenglow comestible',
  pin: 'inasmuch',
  employeeCategory: 'REGULAR',
  jobStatus: 'ACTIVE',
  employeeStatus: 'NONCONFIRM',
  gender: 'MALE',
};

export const sampleWithPartialData: IEmployee = {
  id: 5278,
  firstname: 'butcher insignifican',
  lastname: 'brilliant extremely',
  pin: 'parse lo',
  project: 'past of on',
  employeeCategory: 'UNKNOWN',
  designation: 'apropos slight',
  currentOffice: 'valid where keenly',
  jobStatus: 'INACTIVE',
  employeeStatus: 'NONCONFIRM',
  gender: 'OTHER',
  mobile: 'more yippee variety',
  email: 'Amelia_Huels66@yahoo.com',
  grade: 12785,
  profile: '../fake-data/blob/hipster.png',
  profileContentType: 'unknown',
};

export const sampleWithFullData: IEmployee = {
  id: 19818,
  firstname: 'present lest vice',
  lastname: 'circa',
  pin: 'brief',
  project: 'guacamole',
  employeeCategory: 'REGULAR',
  designation: 'zowie key',
  functionalDesignation: 'whether barring ugh',
  joiningDate: dayjs('2024-12-05T23:03'),
  currentOffice: 'fortunately edible discretion',
  jobStatus: 'ACTIVE',
  employeeStatus: 'CONFIRM',
  dateOfBirth: dayjs('2024-12-06'),
  gender: 'FEMALE',
  mobile: 'milk chaos',
  email: 'Athena_Bode88@yahoo.com',
  grade: 28986,
  profile: '../fake-data/blob/hipster.png',
  profileContentType: 'unknown',
};

export const sampleWithNewData: NewEmployee = {
  firstname: 'jovial',
  lastname: 'clearance',
  pin: 'coolly r',
  employeeCategory: 'REGULAR',
  jobStatus: 'INACTIVE',
  employeeStatus: 'NONCONFIRM',
  gender: 'OTHER',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
