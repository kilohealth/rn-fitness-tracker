import { FitnessDataType, HealthKitKeyWithUnit } from '../types';
import { HealthKitDataType, HealthKitUnitType } from '../enums';

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
