import { FitnessDataType, HealthKitKeyWithUnit } from '../types/fitnessTypes';
import { HealthDataType, UnitType } from '../types/healthKitDataTypes';

export const HealthKitKeyUnitByKey: {
  [key in FitnessDataType]: HealthKitKeyWithUnit;
} = {
  [FitnessDataType.Distance]: {
    key: HealthDataType.DistanceWalkingRunning,
    unit: UnitType.meters,
  },
  [FitnessDataType.Steps]: {
    key: HealthDataType.StepCount,
    unit: UnitType.count,
  },
};
