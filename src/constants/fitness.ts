import { FitnessDataType, HealthKitKeyWithUnit } from '../types';
import {
  GoogleFitDataType,
  HealthKitDataType,
  HealthKitUnitType,
} from '../enums';

export const HealthKitKeyUnitByKey: {
  [key in FitnessDataType]: HealthKitKeyWithUnit;
} = {
  [FitnessDataType.Distance]: {
    key: HealthKitDataType.DistanceWalkingRunning,
    unit: HealthKitUnitType.Meters,
  },
  [FitnessDataType.Height]: {
    key: HealthKitDataType.Height,
    unit: HealthKitUnitType.Meters,
  },
  [FitnessDataType.Steps]: {
    key: HealthKitDataType.StepCount,
    unit: HealthKitUnitType.Count,
  },
  [FitnessDataType.Weight]: {
    key: HealthKitDataType.BodyMass,
    unit: HealthKitUnitType.Kilograms,
  },
};

export const GoogleFitDataTypeByKey: {
  [key in FitnessDataType]: GoogleFitDataType;
} = {
  [FitnessDataType.Distance]: GoogleFitDataType.Distance,
  [FitnessDataType.Height]: GoogleFitDataType.Height,
  [FitnessDataType.Steps]: GoogleFitDataType.Steps,
  [FitnessDataType.Weight]: GoogleFitDataType.Weight,
};
