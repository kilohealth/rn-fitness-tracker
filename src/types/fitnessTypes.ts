import { GoogleFitDataType, HealthKitDataType } from '../enums';

/**
 * Authorization object for requesting permissions.
 * Must have at least one permission key.
 */
export interface AuthorizationPermissions {
  /**
   * Read permissions for GoogleFit.
   */
  googleFitReadPermissions?: GoogleFitDataType[];
  /**
   * Write permissions for GoogleFit.
   */
  googleFitWritePermissions?: GoogleFitDataType[];
  /**
   * Read permissions for HealthKit.
   */
  healthReadPermissions?: HealthKitDataType[];
  /**
   * Write permissions for HealthKit.
   */
  healthWritePermissions?: HealthKitDataType[];
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
