import { Platform } from 'react-native';

import { FitnessDataType, HealthKitKeyWithUnit } from '../types';
import {
  GoogleFitDataTypeByKey,
  HealthKitKeyUnitByKey,
} from '../constants/fitness';
import { GoogleFitDataType } from '../enums';

export const isObject = (obj: unknown): boolean => {
  const type = typeof obj;

  return type === 'function' || (type === 'object' && !!obj);
};

export const isIOS = Platform.OS === 'ios';

export type ValueOf<T> = T[keyof T];

export const getDataTypeForHealthKit = (
  dataType: FitnessDataType,
): HealthKitKeyWithUnit => {
  const HealthKitDataType = HealthKitKeyUnitByKey?.[dataType];

  if (!HealthKitDataType) {
    throw new Error('Provided incorrect dataType');
  }

  return HealthKitDataType;
};

export const getDataTypeForGoogleFit = (
  dataType: FitnessDataType,
): GoogleFitDataType => {
  const googleFitDataType = GoogleFitDataTypeByKey?.[dataType];

  if (!googleFitDataType) {
    throw new Error('Provided incorrect dataType');
  }

  return googleFitDataType;
};
