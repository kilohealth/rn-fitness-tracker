import {
  HealthKitDataType,
  HealthKitUnitType,
  HealthKitWorkoutType,
} from '../enums';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HealthKitMetadata = { [key: string]: any } | null;

export interface HealthWorkoutRecord {
  uuid: string;
  duration: number;
  distance: number | null;
  energyBurned: number;
  startDate: string;
  endDate: string;
  type: HealthKitWorkoutType | 0;
  metadata: HealthKitMetadata;
  source: {
    name: string;
    device: string;
    id: string;
  };
}

export type HealthWorkoutRecordQuery = Array<HealthWorkoutRecord>;

export interface HealthKitAnchoredWorkoutResult {
  anchor: number;
  newRecords: HealthWorkoutRecordQuery;
  deletedRecords: HealthKitDeletedWorkoutRecord[];
}

export interface HealthDataRecord {
  date: string;
  quantity: number;
  metadata: HealthKitMetadata;
  source: {
    device: string;
    id: string;
    name: string;
    version: string;
  };
  uuid: string;
}

export interface HealthKitDeletedWorkoutRecord {
  uuid: string;
  metadata: HealthKitMetadata;
}

export type HealthDataRecordQuery = Array<HealthDataRecord>;

export interface HealthKitKeyWithUnit {
  key: HealthKitDataType;
  unit: HealthKitUnitType;
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
  key: HealthKitDataType;
  unit: HealthKitUnitType;
  amount: number;
  metadata?: HealthKitMetadata;
  timestamp?: number;
};
