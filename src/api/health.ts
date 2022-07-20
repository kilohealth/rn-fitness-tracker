import { NativeModules } from 'react-native';

import { HealthDataRecordQuery, WorkoutQueryData } from '../types/fitnessTypes';
import {
  HealthDataType,
  HealthKitAuthStatus,
  HealthKitMetadata,
  UnitType,
  WorkoutType,
} from '../types/healthKitDataTypes';
import { isIOS } from '../utils/helpers';

const { RNHealthTracker } = NativeModules;

/**
 * @module HealthTrackerAPI
 */

/**
 * `iOS only!` Returns a Boolean value that indicates whether HealthKit is available on this device.
 * note: HealthKit is not available on iPad.
 * @return {Promise<boolean>}
 */
const isHealthDataAvailable = async (): Promise<boolean> => {
  if (isIOS) {
    const response = await RNHealthTracker.isHealthDataAvailable();
    return !!response;
  }
};

/**
 * `iOS only!` Sets up health tracking and returns status
 * @param shareTypes {HealthDataType[]} e.g. `[HealthDataType.Fiber]`
 * @param readTypes {HealthDataType[]} e.g. `[HealthDataType.Fiber]`
 * @return {Promise<boolean>}
 */
const authorize = async (
  shareTypes: HealthDataType[],
  readTypes: HealthDataType[],
): Promise<boolean> => {
  if (isIOS) {
    const authorized = await RNHealthTracker.authorize(shareTypes, readTypes);
    return !!authorized;
  }
};

/**
 * `iOS only!` Writes given health data to Health API
 * @param object {object}
 * @param object.key {HealthDataType}
 * @param object.unit {UnitType}
 * @param object.amount {number}
 * @param object.metadata {object}
 * @param object.timestamp {number} optional unix timestamp for record date
 * @return {Promise<boolean>}
 */
const writeData = async ({
  key,
  unit,
  amount,
  metadata = {},
  timestamp = 0,
}: {
  key: HealthDataType;
  unit: UnitType;
  amount: number;
  metadata?: HealthKitMetadata;
  timestamp?: number;
}): Promise<boolean> => {
  if (isIOS) {
    return await RNHealthTracker.writeData(
      key,
      unit,
      amount,
      metadata,
      timestamp,
    );
  }
};

/**
 * `iOS only!` Writes given health data array to Health API
 * @param dataArray {array}
 * @param dataArray.object {object}
 * @param dataArray.object.key {HealthDataType}
 * @param dataArray.object.unit {UnitType}
 * @param dataArray.object.quantity {Number}
 * @param dataArray.object.metadata {object}
 * @return {Promise<boolean>}
 */
const writeDataArray = async (
  dataArray: Array<{
    key: HealthDataType;
    unit: UnitType;
    amount: number;
    metadata: HealthKitMetadata;
    timestamp?: number;
  }>,
): Promise<boolean> => {
  if (isIOS) {
    return await RNHealthTracker.writeDataArray(dataArray);
  }
};

/**
 * `iOS only!` Gets absolute total for given health data type and unit for current day
 * @param key {HealthDataType} e.g. `HealthDataType.Fiber`
 * @param unit {UnitType} e.g. `UnitType.grams`
 * @return {Promise<number>}
 */
const getAbsoluteTotalForToday = async ({
  key,
  unit,
}: {
  key: HealthDataType;
  unit: UnitType;
}): Promise<number> => {
  if (isIOS) {
    const total = await RNHealthTracker.getAbsoluteTotalForToday(key, unit);
    return Number(total);
  }
};

/**
 * `iOS only!` Gets statistic total for given health data type and unit for current day, same number as in health app
 * @param key {HealthDataType} e.g. `HealthDataType.Fiber`
 * @param unit {UnitType} e.g. `UnitType.grams`
 * @return {Promise<number>}
 */
const getStatisticTotalForToday = async ({
  key,
  unit,
}: {
  key: HealthDataType;
  unit: UnitType;
}): Promise<number> => {
  if (isIOS) {
    const total = await RNHealthTracker.getStatisticTotalForToday(key, unit);
    return Number(total);
  }
};

/**
 * `iOS only!` Gets statistic total for given health data type and unit for current week, same number as in health app
 * @param key {HealthDataType} e.g. `HealthDataType.Fiber`
 * @param unit {UnitType} e.g. `UnitType.grams`
 * @return {Promise<number>}
 */
const getStatisticTotalForWeek = async ({
  key,
  unit,
}: {
  key: HealthDataType;
  unit: UnitType;
}): Promise<number> => {
  if (isIOS) {
    const total = await RNHealthTracker.getStatisticTotalForWeek(key, unit);
    return Number(total);
  }
};

/**
 * `iOS only!` Gets statistic daily total for given health data type and unit for current week, same number as in health app
 * @param key {HealthDataType} e.g. `HealthDataType.Fiber`
 * @param unit {UnitType} e.g. `UnitType.grams`
 * @return {Promise<object>}
 */
const getStatisticWeekDaily = async ({
  key,
  unit,
}: {
  key: HealthDataType;
  unit: UnitType;
}): Promise<{ [name: string]: number }> => {
  if (isIOS) {
    return RNHealthTracker.getStatisticWeekDaily(key, unit);
  }
};

/**
 * `iOS only!` Returns every record for specified data type and unit for specified number of days
 * @param key {HealthDataType} e.g. `HealthDataType.Fiber`
 * @param unit {UnitType} e.g. `UnitType.grams`
 * @param startDate {Date | number}
 * @param endDate {Date | number}
 * @return {Promise<number>}
 */
const queryDataRecords = async ({
  key,
  unit,
  startDate,
  endDate,
}: {
  key: HealthDataType;
  unit: UnitType;
  startDate: Date | number;
  endDate: Date | number;
}): Promise<HealthDataRecordQuery> => {
  if (isIOS) {
    return RNHealthTracker.queryDataRecords(key, unit, +startDate, +endDate);
  }
};

/**
 * `iOS only!` Returns the latest record for specified data type and unit
 * @param key {HealthDataType} e.g. `HealthDataType.Fiber`
 * @param unit {UnitType} e.g. `UnitType.grams`
 * @return {Promise<number>}
 */
const getLatestDataRecord = async ({
  key,
  unit,
}: {
  key: HealthDataType;
  unit: UnitType;
}): Promise<HealthDataRecordQuery> => {
  if (isIOS) {
    return RNHealthTracker.getLatestDataRecord(key, unit);
  }
};

/**
 * `iOS only!` Returns workouts array for specified timeframe, filters by workout type if specified
 * @param startDate {Date | number}
 * @param endDate {Date | number}
 * @param key {WorkoutType} e.g. `WorkoutType.Running` (Optional)
 * @return {Promise<WorkoutQueryData>}
 */
const queryWorkouts = async ({
  startDate,
  endDate,
  key = 0,
}: {
  startDate: Date | number;
  endDate: Date | number;
  key?: WorkoutType | 0;
}): Promise<WorkoutQueryData<WorkoutType>> => {
  if (isIOS) {
    return RNHealthTracker.queryWorkouts(key, +startDate, +endDate);
  }
};

/**
 * `iOS only!` Returns daily totals for specified data type and unit for specified time frame
 * @param key {HealthDataType} e.g. `HealthDataType.Fiber`
 * @param unit {UnitType} e.g. `UnitType.grams`
 * @param startDate {Date | number}
 * @param endDate {Date | number}
 * @return {Promise<object>}
 */
const queryDailyTotals = async ({
  key,
  unit,
  startDate,
  endDate,
}: {
  key: HealthDataType;
  unit: UnitType;
  startDate: Date | number;
  endDate: Date | number;
}): Promise<{ [date: string]: number }> => {
  if (isIOS) {
    return RNHealthTracker.queryDailyTotals(key, unit, +startDate, +endDate);
  }
};

/**
 * `iOS only!` Returns total for specified data type and unit for specified time frame
 * @param key {HealthDataType} e.g. `HealthDataType.Fiber`
 * @param unit {UnitType} e.g. `UnitType.grams`
 * @param startDate {Date | number}
 * @param endDate {Date | number}
 * @return {Promise<object>}
 */
const queryTotal = async ({
  key,
  unit,
  startDate,
  endDate,
}: {
  key: HealthDataType;
  unit: UnitType;
  startDate: Date | number;
  endDate: Date | number;
}): Promise<{ [date: string]: number }> => {
  if (isIOS) {
    return RNHealthTracker.queryTotal(key, unit, +startDate, +endDate);
  }
};

/**
 * `iOS only!` Records given workout data to Health API
 * @param key {WorkoutType} e.g. `WorkoutType.Running`
 * @param startDate {Date | number}
 * @param endDate {Date | number}
 * @param energyBurned {Number} number of calories in kcal (Optional)
 * @param totalDistance {number} total distance travelled (Optional)
 * @param metadata {object} (Optional)
 * @return {Promise<boolean>}
 */
const writeWorkout = async ({
  key,
  startDate,
  endDate,
  energyBurned = 0,
  totalDistance = 0,
  metadata = {},
}: {
  key: WorkoutType;
  startDate: Date | number;
  endDate: Date | number;
  energyBurned?: number;
  totalDistance?: number;
  metadata?: HealthKitMetadata;
}): Promise<boolean> => {
  if (isIOS) {
    return await RNHealthTracker.writeWorkout(
      key,
      +startDate,
      +endDate,
      energyBurned,
      totalDistance,
      metadata,
    );
  }
};

/**
 * `iOS only!` Records given blood pressure data to Health API
 * @param systolicPressure {Number}
 * @param diastolicPressure {Number}
 * @param date {Date | number}
 * @param metadata {object}
 * @return {Promise<boolean>}
 */
const writeBloodPressure = async ({
  systolicPressure,
  diastolicPressure,
  date,
  metadata = {},
}: {
  systolicPressure: number;
  diastolicPressure: number;
  date: Date | number;
  metadata?: HealthKitMetadata;
}): Promise<boolean> => {
  if (isIOS) {
    return await RNHealthTracker.writeBloodPressure(
      systolicPressure,
      diastolicPressure,
      +date,
      +date,
      metadata,
    );
  }
};

/**
 * `iOS only!` Returns write (share) status for data type in Health API
 * @param key {HealthDataType} e.g. `HealthDataType.Fiber`
 * @return {Promise<HealthKitAuthStatus>} 0 - notDetermined, 1 - sharingDenied, 2 - sharingAuthorized
 */
const getAuthStatusForType = async (
  key: HealthDataType,
): Promise<HealthKitAuthStatus> => {
  if (isIOS) {
    return await RNHealthTracker.getAuthorizationStatusForType(key);
  }
};

/**
 * `iOS only!` Returns read status for data type in Health API
 * `WARNING`! This method is unofficial. Queries for data in time span of 2 years with limit of one, returns `readDenied` if no data is available.
 * @param dataType {HealthDataType} e.g. `HealthDataType.Fiber`
 * @param unit {HealthDataType} e.g. `HealthDataType.Fiber`
 * @return {Promise<HealthKitAuthStatus>} 0 - notDetermined, 1 - readDenied, 2 - readAuthorized
 */
const getReadStatusForType = async ({
  key,
  unit,
}: {
  key: HealthDataType;
  unit: UnitType;
}): Promise<HealthKitAuthStatus> => {
  if (isIOS) {
    return await RNHealthTracker.getReadStatus(key, unit);
  }
};

/**
 * `iOS only!` Delete record from Health API
 * @param key {HealthDataType} e.g. `HealthDataType.Fiber`
 * @param uuid {number} optional unique healthKit record id
 * @param date {number} optional unix timestamp for record date
 * @return {Promise<HealthKitAuthStatus>} 0 - notDetermined, 1 - readDenied, 2 - readAuthorized
 */
const deleteRecord = async ({
  key,
  uuid = null,
  startDate = 0,
  endDate = 0,
}: {
  key: HealthDataType;
  uuid?: string;
  startDate?: Date | number;
  endDate?: Date | number;
}): Promise<HealthKitAuthStatus> => {
  if (isIOS) {
    return await RNHealthTracker.deleteRecord(
      key,
      uuid,
      +startDate,
      // TODO remove 1000ms
      +endDate + 1000,
    );
  }
};

export const HealthTrackerAPI = {
  authorize,
  deleteRecord,
  getAbsoluteTotalForToday,
  getAuthStatusForType,
  getLatestDataRecord,
  getReadStatusForType,
  getStatisticTotalForToday,
  getStatisticTotalForWeek,
  getStatisticWeekDaily,
  isHealthDataAvailable,
  queryDailyTotals,
  queryDataRecords,
  queryTotal,
  queryWorkouts,
  writeWorkout,
  writeBloodPressure,
  writeDataArray,
  writeData,
};
