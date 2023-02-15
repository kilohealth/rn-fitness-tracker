import { NativeModules } from 'react-native';
import {
  DailyData,
  HealthDataRecord,
  HealthDataRecordQuery,
  HealthKitAnchoredWorkoutResult,
  HealthKitAuthStatus,
  HealthKitDataType,
  HealthKitMetadata,
  HealthKitUnitType,
  HealthKitWorkoutType,
  HealthKitWriteData,
  HealthWorkoutRecordQuery,
} from '@kilohealth/rn-fitness-tracker';

import { isIOS, wrongPlatformErrorMessage } from '../utils';

/** @internal */
const { RNHealthTracker } = NativeModules;

/**
 * Sets up health tracking and returns status
 * @param shareTypes e.g. `[HealthKitDataType.Fiber]`
 * @param readTypes e.g. `[HealthKitDataType.Fiber]`
 *
 * @return Returns status if no errors occurred.
 */
export const authorize = async (
  shareTypes: HealthKitDataType[],
  readTypes: HealthKitDataType[],
): Promise<boolean> => {
  if (isIOS) {
    const authorized = await RNHealthTracker.authorize(shareTypes, readTypes);

    return Boolean(authorized);
  }

  throw new Error(wrongPlatformErrorMessage('authorize'));
};

/**
 * Delete record from Health API.
 *
 * Must provide uuid of the record or startDate and endDate of records you wish to delete.
 *
 * @param options.key e.g. `HealthKitDataType.Fiber`
 * @param options.uuid Unique healthKit record id.
 * @param options.startDate Unix timestamp or Date for record start date.
 * @param options.endDate Unix timestamp or Date for record end date.
 *
 * @return The number of deleted records.
 */
export const deleteRecord = async (options: {
  key: HealthKitDataType;
  uuid?: string;
  startDate?: Date | number;
  endDate?: Date | number;
}): Promise<number> => {
  if (isIOS) {
    const startDate = options.startDate ? Number(options.startDate) : 0;
    const endDate = options.endDate ? Number(options.endDate) : 0;

    return RNHealthTracker.deleteRecord(
      options.key,
      options.uuid,
      startDate,
      endDate,
    );
  }

  throw new Error(wrongPlatformErrorMessage('deleteRecord'));
};

/**
 * Gets absolute total for given health data type and unit for current day
 * @param options.key e.g. `HealthKitDataType.Fiber`
 * @param options.unit e.g. `HealthKitUnitType.grams`
 */
export const getAbsoluteTotalForToday = async (options: {
  key: HealthKitDataType;
  unit: HealthKitUnitType;
}): Promise<number> => {
  if (isIOS) {
    const { key, unit } = options;
    const total = await RNHealthTracker.getAbsoluteTotalForToday(key, unit);

    return Number(total);
  }

  throw new Error(wrongPlatformErrorMessage('getAbsoluteTotalForToday'));
};

/**
 * Returns write (share) status for data type in Health API.
 * @param key e.g. `HealthKitDataType.Fiber`
 *
 * @return {Promise<HealthKitAuthStatus>} 0 - NotDetermined, 1 - Denied, 2 - Authorized
 */
export const getAuthStatusForType = async (
  key: HealthKitDataType,
): Promise<HealthKitAuthStatus> => {
  if (isIOS) {
    return RNHealthTracker.getAuthorizationStatusForType(key);
  }

  throw new Error(wrongPlatformErrorMessage('getAuthStatusForType'));
};

/**
 * @param options.key e.g. `HealthKitDataType.Fiber`
 * @param options.unit e.g. `HealthKitUnitType.grams`
 *
 * @return Returns the latest record for specified data type and unit.
 */
export const getLatestDataRecord = async (options: {
  key: HealthKitDataType;
  unit: HealthKitUnitType;
}): Promise<HealthDataRecord> => {
  if (isIOS) {
    const { key, unit } = options;

    return RNHealthTracker.getLatestDataRecord(key, unit);
  }

  throw new Error(wrongPlatformErrorMessage('getLatestDataRecord'));
};

/**
 * @deprecated Might be deleted in future releases.
 *
 * Returns read status for data type in Health API.
 *
 * `WARNING`! This method is unofficial. Queries for data in time span of 2 years with limit of one.
 *
 * **`note`** Try to avoid using this method and try to track user permission status in internal state.
 *
 * @param options.key e.g. `HealthKitDataType.Fiber`
 * @param options.unit e.g. `HealthKitDataType.Fiber`
 * @return {Promise<HealthKitAuthStatus>}
 * 0 - if permissions was never requested.
 *
 * 1 - if no records were found. This could be if user never gave permissions or user has no records for this type.
 *
 * 2 - if records were found.
 */
export const getReadStatusForType = async (options: {
  key: HealthKitDataType;
  unit: HealthKitUnitType;
}): Promise<HealthKitAuthStatus> => {
  if (isIOS) {
    const { key, unit } = options;

    return RNHealthTracker.getReadStatus(key, unit);
  }

  throw new Error(wrongPlatformErrorMessage('getReadStatusForType'));
};

/**
 * Gets statistic total for given health data type and unit for current day
 * @param options.key e.g. `HealthKitDataType.Fiber`
 * @param options.unit e.g. `HealthKitUnitType.grams`
 */
export const getStatisticTotalForToday = async (options: {
  key: HealthKitDataType;
  unit: HealthKitUnitType;
}): Promise<number> => {
  if (isIOS) {
    const { key, unit } = options;
    const total = await RNHealthTracker.getStatisticTotalForToday(key, unit);

    return Number(total);
  }

  throw new Error(wrongPlatformErrorMessage('getStatisticTotalForToday'));
};

/**
 * Gets statistic total for given health data type and unit for current week
 * @param options.key e.g. `HealthKitDataType.Fiber`
 * @param options.unit e.g. `HealthKitUnitType.grams`
 */
export const getStatisticTotalForWeek = async (options: {
  key: HealthKitDataType;
  unit: HealthKitUnitType;
}): Promise<number> => {
  if (isIOS) {
    const { key, unit } = options;
    const total = await RNHealthTracker.getStatisticTotalForWeek(key, unit);

    return Number(total);
  }

  throw new Error(wrongPlatformErrorMessage('getStatisticTotalForWeek'));
};

/**
 * Gets statistic daily total for given health data type and unit for current week
 * @param options.key e.g. `HealthKitDataType.Fiber`
 * @param options.unit e.g. `HealthKitUnitType.grams`
 */
export const getStatisticWeekDaily = async (options: {
  key: HealthKitDataType;
  unit: HealthKitUnitType;
}): Promise<DailyData> => {
  if (isIOS) {
    const { key, unit } = options;

    return RNHealthTracker.getStatisticWeekDaily(key, unit);
  }

  throw new Error(wrongPlatformErrorMessage('getStatisticWeekDaily'));
};

/**
 * Returns a Boolean value that indicates whether HealthKit is available on this device.
 * **`note`** HealthKit is not available on iPad.
 *
 * @return Returns true if HealthKit is available; otherwise, false.
 */
export const isHealthDataAvailable = async (): Promise<boolean> => {
  if (isIOS) {
    const response = await RNHealthTracker.isHealthDataAvailable();

    return Boolean(response);
  }

  throw new Error(wrongPlatformErrorMessage('isHealthDataAvailable'));
};

/**
 * Query workouts with anchor
 * Passing anchor will return all workouts that have been added since that anchor point
 *
 * @param options.anchor last query anchor point
 * @param options.key e.g. `HealthKitWorkoutType.Running`HealthKit
 * @param options.limit limits the number of workouts returned from the anchor point to the newest workout
 *
 * @return Returns an object with the latest anchor point and data array with new workouts
 */
export const queryAnchoredWorkouts = async (options?: {
  anchor?: number;
  key?: HealthKitWorkoutType;
  limit?: number;
}): Promise<HealthKitAnchoredWorkoutResult> => {
  if (isIOS) {
    const { anchor = 0, key = 0, limit = 0 } = options || {};

    return RNHealthTracker.anchoredQueryWorkouts(key, anchor, limit);
  }

  throw new Error(wrongPlatformErrorMessage('queryAnchoredWorkouts'));
};

/**
 * @param options.key e.g. `HealthKitDataType.Fiber`
 * @param options.unit e.g. `HealthKitUnitType.grams`
 * @param options.startDate Unix timestamp or Date for record start date.
 * @param options.endDate Unix timestamp or Date for record end date.
 *
 * @return Returns daily totals for specified data type and unit for specified time frame
 */
export const queryDailyTotals = async (options: {
  key: HealthKitDataType;
  unit: HealthKitUnitType;
  startDate: Date | number;
  endDate: Date | number;
}): Promise<{ [date: string]: number }> => {
  if (isIOS) {
    const { key, unit, startDate, endDate } = options;

    return RNHealthTracker.queryDailyTotals(
      key,
      unit,
      Number(startDate),
      Number(endDate),
    );
  }

  throw new Error(wrongPlatformErrorMessage('queryDailyTotals'));
};

/**
 * @param options.key e.g. `HealthKitDataType.Fiber`
 * @param options.unit e.g. `HealthKitUnitType.grams`
 * @param options.startDate Unix timestamp or Date for record start date
 * @param options.endDate Unix timestamp or Date for record end date
 *
 * @return Returns every record for specified data type and unit for specified time frame
 */
export const queryDataRecords = async (options: {
  key: HealthKitDataType;
  unit: HealthKitUnitType;
  startDate: Date | number;
  endDate: Date | number;
}): Promise<HealthDataRecordQuery> => {
  if (isIOS) {
    const { key, unit, startDate, endDate } = options;

    return RNHealthTracker.queryDataRecords(
      key,
      unit,
      Number(startDate),
      Number(endDate),
    );
  }

  throw new Error(wrongPlatformErrorMessage('queryDataRecords'));
};

/**
 * @param options.key e.g. `HealthKitDataType.Fiber`
 * @param options.unit e.g. `HealthKitUnitType.grams`
 * @param options.startDate Unix timestamp or Date for record start date.
 * @param options.endDate Unix timestamp or Date for record end date.
 *
 * @return Returns total for specified data type and unit for specified time frame
 */
export const queryTotal = async (options: {
  key: HealthKitDataType;
  unit: HealthKitUnitType;
  startDate: Date | number;
  endDate: Date | number;
}): Promise<{ [date: string]: number }> => {
  if (isIOS) {
    const { key, unit, startDate, endDate } = options;

    return RNHealthTracker.queryTotal(
      key,
      unit,
      Number(startDate),
      Number(endDate),
    );
  }

  throw new Error(wrongPlatformErrorMessage('queryTotal'));
};

/**
 * @param options.startDate Unix timestamp or Date for record start date
 * @param options.endDate Unix timestamp or Date for record end date
 * @param options.key e.g. `HealthKitWorkoutType.Running`HealthKit
 *
 * @return Returns workouts array for specified timeframe, filters by workout type if specified
 */
export const queryWorkouts = async (options: {
  startDate: Date | number;
  endDate: Date | number;
  key?: HealthKitWorkoutType;
}): Promise<HealthWorkoutRecordQuery> => {
  if (isIOS) {
    const { startDate, endDate, key = 0 } = options;

    return RNHealthTracker.queryWorkouts(
      key,
      Number(startDate),
      Number(endDate),
    );
  }

  throw new Error(wrongPlatformErrorMessage('queryWorkouts'));
};

/**
 * Writes given blood pressure data to Health.
 *
 * @param options.systolicPressure
 * @param options.diastolicPressure
 * @param options.startDate Unix timestamp or Date for record start date.
 * @param options.endDate Unix timestamp or Date for record end date.
 * @param options.metadata
 *
 * @return Returns status if no errors occurred.
 */
export const writeBloodPressure = async (options: {
  systolicPressure: number;
  diastolicPressure: number;
  startDate: Date | number;
  endDate: Date | number;
  metadata?: HealthKitMetadata;
}): Promise<boolean> => {
  if (isIOS) {
    const {
      systolicPressure,
      diastolicPressure,
      startDate,
      endDate,
      metadata = {},
    } = options;

    return RNHealthTracker.writeBloodPressure(
      systolicPressure,
      diastolicPressure,
      Number(startDate),
      Number(endDate),
      metadata,
    );
  }

  throw new Error(wrongPlatformErrorMessage('writeBloodPressure'));
};

/**
 * Writes given health data to Health.
 *
 * @param options.key e.g. `HealthKitDataType.Fiber`
 * @param options.unit e.g. `HealthKitUnitType.grams`
 * @param options.amount
 * @param options.metadata
 * @param options.timestamp optional unix timestamp for record date
 *
 * @return Returns status if no errors occurred.
 */
export const writeData = async (options: {
  key: HealthKitDataType;
  unit: HealthKitUnitType;
  amount: number;
  metadata?: HealthKitMetadata;
  timestamp?: number;
}): Promise<boolean> => {
  if (isIOS) {
    const { key, unit, amount, metadata = {}, timestamp = -1 } = options;

    return RNHealthTracker.writeData(key, unit, amount, metadata, timestamp);
  }

  throw new Error(wrongPlatformErrorMessage('writeData'));
};

/**
 * Writes given health data array to Health API
 *
 * @return Returns status if no errors occurred.
 */
export const writeDataArray = async (
  dataArray: HealthKitWriteData[],
): Promise<boolean> => {
  if (isIOS) {
    return RNHealthTracker.writeDataArray(dataArray);
  }

  throw new Error(wrongPlatformErrorMessage('writeDataArray'));
};

/**
 * Records given workout data to Health API
 *
 * @param options.key e.g. `HealthKitWorkoutType.Running`
 * @param options.startDate Unix timestamp or Date for record start date.
 * @param options.endDate Unix timestamp or Date for record end date.
 * @param options.energyBurned Number of calories in kcalHealthKit. default 0
 * @param options.totalDistance Total distance travelledHealthKit. default 0
 * @param options.metadata
 *
 * @return Returns status if no errors occurred.
 */
export const writeWorkout = async (options: {
  key: HealthKitWorkoutType;
  startDate: Date | number;
  endDate: Date | number;
  energyBurned?: number;
  totalDistance?: number;
  metadata?: HealthKitMetadata;
}): Promise<boolean> => {
  if (isIOS) {
    const {
      key,
      startDate,
      endDate,
      energyBurned = 0,
      totalDistance = 0,
      metadata = {},
    } = options;

    return RNHealthTracker.writeWorkout(
      key,
      Number(startDate),
      Number(endDate),
      energyBurned,
      totalDistance,
      metadata,
    );
  }

  throw new Error(wrongPlatformErrorMessage('writeWorkout'));
};
