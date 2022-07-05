import { HealthDataType, UnitType, WorkoutType } from '../enums';

export interface HealthWorkoutRecord {
  uuid: string;
  duration: number;
  distance: number | null;
  energyBurned: number;
  startDate: string;
  endDate: string;
  type: WorkoutType | 0;
  metadata: { [name: string]: any };
  source: {
    name: string;
    device: string;
    id: string;
  };
}

export type HealthWorkoutRecordQuery = Array<HealthWorkoutRecord>;

export interface HealthDataRecord {
  date: string;
  quantity: number;
  metadata: { [name: string]: any } | null;
  source: {
    device: string;
    id: string;
    name: string;
    version: string;
  };
  uuid: string;
}

export type HealthDataRecordQuery = Array<HealthDataRecord>;

export interface HealthKitKeyWithUnit {
  key: HealthDataType;
  unit: UnitType;
}

export interface HealthKitMetadata {
  [key: string]: any;
}

export enum HealthKitAuthStatus {
  /**
   * Authorization is not determined. Usually means permissions not requested.
   * @return 0
   */
  NotDetermined = 0,
  /**
   * User has denied permissions.
   * @return 1
   */
  Denied = 1,
  /**
   * User has given permission.
   * @return 2
   */
  Authorized = 2,
}

export type HealthKitWriteData = {
  key: HealthDataType;
  unit: UnitType;
  amount: number;
  metadata?: HealthKitMetadata;
  timestamp?: number;
};
