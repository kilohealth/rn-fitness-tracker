import { FitnessDataType, HealthKitKeyWithUnit } from '../types';
import { HealthDataType, UnitType } from '../enums';

export const HealthKitKeyUnitByKey: {
  [key in FitnessDataType]: HealthKitKeyWithUnit;
} = {
  [FitnessDataType.Distance]: {
    key: HealthDataType.DistanceWalkingRunning,
    unit: UnitType.Meters,
  },
  [FitnessDataType.Height]: {
    key: HealthDataType.Height,
    unit: UnitType.Meters,
  },
  [FitnessDataType.Steps]: {
    key: HealthDataType.StepCount,
    unit: UnitType.Count,
  },
  [FitnessDataType.Weight]: {
    key: HealthDataType.BodyMass,
    unit: UnitType.Kilograms,
  },
};
