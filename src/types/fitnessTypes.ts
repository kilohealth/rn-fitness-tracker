import { GoogleFitDataTypes, HealthDataType } from '../enums';

/**
 * Authorization object for requesting permissions.
 * Must have at least one permission key.
 */
export interface AuthorizationPermissions {
  /**
   * Read permissions for GoogleFit.
   */
  googleFitReadPermissions?: GoogleFitDataTypes[];
  /**
   * Write permissions for GoogleFit.
   */
  googleFitWritePermissions?: GoogleFitDataTypes[];
  /**
   * Read permissions for HealthKit.
   */
  healthReadPermissions?: HealthDataType[];
  /**
   * Write permissions for HealthKit.
   */
  healthWritePermissions?: HealthDataType[];
}

/**
 * Returned data ordered by date for specific data type.
 */
export interface DailyData {
  [date: string]: number;
}

/**
 * Returned data for today and daily values.
 */
export interface TodayAndDailyData {
  /**
   * Today value for specific data type.
   */
  today: number;
  daily: DailyData;
}

/**
 * General fitness data types for both platforms.
 */
export enum FitnessDataType {
  Distance = 'Distance',
  Height = 'Height',
  Steps = 'Steps',
  Weight = 'Weight',
}
