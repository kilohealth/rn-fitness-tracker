import { Platform } from 'react-native';

import { FitnessDataType, HealthKitKeyWithUnit } from '../types';
import { HealthKitKeyUnitByKey } from '../constants/fitness';

export const isObject = function (obj: unknown): boolean {
  const type = typeof obj;
  return type === 'function' || (type === 'object' && !!obj);
};

export const isIOS = Platform.OS === 'ios';

export type ValueOf<T> = T[keyof T];

export const getDataTypeForHealthKit = (
  dataType: FitnessDataType,
): HealthKitKeyWithUnit => {
  const healthDataType = HealthKitKeyUnitByKey?.[dataType];
  if (!healthDataType) {
    throw 'Provided incorrect dataType';
  }

  return healthDataType;
};
