import { NativeModules } from 'react-native';

import { HKDataType, HKUnit, HKWorkout } from '../types/dataTypes';
import {
  IHealthDataRecordQuery,
  IWorkoutQueryData,
} from '../types/fitnessTypes';
import { isIOS } from '../utils/helpers';

const { RNHealthTracker } = NativeModules;

/**
 * @module HealthTrackerAPI
 */

/**
 * `iOS only!` returns health tracking is supported
 * @return {Promise<boolean>}
 */
const isTrackingSupportedIOS = async (): Promise<boolean> => {
  if (isIOS) {
    const response = await RNHealthTracker.isTrackingSupported();
    return !!response;
  }
};

/**
 * `iOS only!` Sets up health tracking and returns status
 * @param shareTypes {HealthDataType[]} e.g. `[HealthDataTypes.Fiber]`
 * @param readTypes {HealthDataType[]} e.g. `[HealthDataTypes.Fiber]`
 * @return {Promise<boolean>}
 */
const setupTrackingIOS = async (
  shareTypes: HKDataType[],
  readTypes: HKDataType[],
): Promise<boolean> => {
  if (isIOS) {
    const authorized = await RNHealthTracker.authorize(shareTypes, readTypes);
    return !!authorized;
  }
};

/**
 * `iOS only!` Writes given health data to Health API
 * @param object {object}
 * @param object.key {HealthDataTypes}
 * @param object.unit {UnitKey}
 * @param object.quantity {Number}
 * @param object.metadata {object}
 * @param object.customUnixTimestamp {number} optional unix timestamp for record date
 * @return {Promise<boolean>}
 */
const writeDataIOS = async ({
  key,
  unit,
  quantity,
  metadata = {},
  timestamp = 0,
}: {
  key: HKDataType;
  unit: HKUnit;
  quantity: number;
  metadata: { [name: string]: any };
  timestamp: number;
}): Promise<boolean> => {
  if (isIOS) {
    return await RNHealthTracker.writeData(
      key,
      quantity,
      unit,
      metadata,
      timestamp,
    );
  }
};

/**
 * `iOS only!` Writes given health data array to Health API
 * @param dataArray {array}
 * @param dataArray.object {object}
 * @param dataArray.object.key {HealthDataTypes}
 * @param dataArray.object.unit {UnitKey}
 * @param dataArray.object.quantity {Number}
 * @param dataArray.object.metadata {object}
 * @return {Promise<boolean>}
 */
const writeDataArrayIOS = async (
  dataArray: Array<{
    key: HKDataType;
    unit: HKUnit;
    quantity: number;
    metadata: { [name: string]: any };
    timestamp: number;
  }>,
): Promise<boolean> => {
  if (isIOS) {
    return await RNHealthTracker.writeDataArray(dataArray);
  }
};

/**
 * `iOS only!` Gets absolute total for given health data type and unit for current day
 * @param key {HealthDataType} e.g. `HealthDataTypes.Fiber`
 * @param unit {UnitType} e.g. `UnitTypes.grams`
 * @return {Promise<number>}
 */
const getAbsoluteTotalForTodayIOS = async ({
  key,
  unit,
}: {
  key: HKDataType;
  unit: HKUnit;
}): Promise<number> => {
  if (isIOS) {
    const total = await RNHealthTracker.getAbsoluteTotalForToday(key, unit);
    return Number(total);
  }
};

/**
 * `iOS only!` Gets statistic total for given health data type and unit for current day, same number as in health app
 * @param key {HealthDataType} e.g. `HealthDataTypes.Fiber`
 * @param unit {UnitType} e.g. `UnitTypes.grams`
 * @return {Promise<number>}
 */
const getStatisticTotalForTodayIOS = async ({
  key,
  unit,
}: {
  key: HKDataType;
  unit: HKUnit;
}): Promise<number> => {
  if (isIOS) {
    const total = await RNHealthTracker.getStatisticTotalForToday(key, unit);
    return Number(total);
  }
};

/**
 * `iOS only!` Gets statistic total for given health data type and unit for current week, same number as in health app
 * @param key {HealthDataType} e.g. `HealthDataTypes.Fiber`
 * @param unit {UnitType} e.g. `UnitTypes.grams`
 * @return {Promise<number>}
 */
const getStatisticTotalForWeekIOS = async ({
  key,
  unit,
}: {
  key: HKDataType;
  unit: HKUnit;
}): Promise<number> => {
  if (isIOS) {
    const total = await RNHealthTracker.getStatisticTotalForWeek(key, unit);
    return Number(total);
  }
};

/**
 * `iOS only!` Gets statistic daily total for given health data type and unit for current week, same number as in health app
 * @param key {HealthDataType} e.g. `HealthDataTypes.Fiber`
 * @param unit {UnitType} e.g. `UnitTypes.grams`
 * @return {Promise<object>}
 */
const getStatisticWeekDailyIOS = async ({
  key,
  unit,
}: {
  key: HKDataType;
  unit: HKUnit;
}): Promise<{ [name: string]: number }> => {
  if (isIOS) {
    return RNHealthTracker.getStatisticWeekDaily(key, unit);
  }
};

/**
 * `iOS only!` Returns every record for specified data type and unit for specified number of days
 * @param key {HealthDataType} e.g. `HealthDataTypes.Fiber`
 * @param unit {UnitType} e.g. `UnitTypes.grams`
 * @param numberOfDays {number}
 * @return {Promise<number>}
 */
const queryDataRecordsIOS = async ({
  key,
  unit,
  numberOfDays,
}: {
  key: HKDataType;
  unit: HKUnit;
  numberOfDays: number;
}): Promise<IHealthDataRecordQuery> => {
  if (isIOS) {
    return RNHealthTracker.queryDataRecordsForNumberOfDays(
      key,
      unit,
      numberOfDays,
    );
  }
};

/**
 * `iOS only!` Returns workouts array for specified timeframe, filters by workout type if specified
 * @param object.startDate {Date | number}
 * @param object.endDate {Date | number}
 * @param object.key {WorkoutTypes} e.g. `WorkoutTypes.Running` (Optional)
 * @return {Promise<IWorkoutQueryData>}
 */
const queryWorkoutsIOS = async ({
  startDate,
  endDate,
  key = 0,
}: {
  startDate: Date | number;
  endDate: Date | number;
  key: HKWorkout | 0;
}): Promise<IWorkoutQueryData<HKWorkout>> => {
  if (isIOS) {
    return RNHealthTracker.queryWorkouts(key, +startDate, +endDate);
  }
};

/**
 * `iOS only!` Returns daily totals for specified data type and unit for specified time frame
 * @param object.key {HealthDataType} e.g. `HealthDataTypes.Fiber`
 * @param object.unit {UnitType} e.g. `UnitTypes.grams`
 * @param object.startDate {Date | number}
 * @param object.endDate {Date | number}
 * @return {Promise<object>}
 */
const queryDailyTotalsIOS = async ({
  key,
  unit,
  startDate,
  endDate,
}: {
  key: HKDataType;
  unit: HKUnit;
  startDate: Date | number;
  endDate: Date | number;
}): Promise<{ [date: string]: number }> => {
  if (isIOS) {
    return RNHealthTracker.queryDailyTotals(key, unit, +startDate, +endDate);
  }
};

/**
 * `iOS only!` Returns total for specified data type and unit for specified time frame
 * @param object.key {HealthDataType} e.g. `HealthDataTypes.Fiber`
 * @param object.unit {UnitType} e.g. `UnitTypes.grams`
 * @param object.startDate {Date | number}
 * @param object.endDate {Date | number}
 * @return {Promise<object>}
 */
const queryTotalIOS = async ({
  key,
  unit,
  startDate,
  endDate,
}: {
  key: HKDataType;
  unit: HKUnit;
  startDate: Date | number;
  endDate: Date | number;
}): Promise<{ [date: string]: number }> => {
  if (isIOS) {
    return RNHealthTracker.queryTotal(key, unit, +startDate, +endDate);
  }
};

/**
 * `iOS only!` Records given workout data to Health API
 * @param object {object}
 * @param object.startDate {Date | number}
 * @param object.endDate {Date | number}
 * @param object.energyBurned {Number} number of calories in kcal (Optional)
 * @param object.totalDistance {number} total distance travelled (Optional)
 * @param object.metadata {object} (Optional)
 * @return {Promise<boolean>}
 */
const recordWorkoutIOS = async ({
  key,
  startDate,
  endDate,
  energyBurned = 0,
  totalDistance = 0,
  metadata = {},
}: {
  key: HKDataType;
  startDate: Date | number;
  endDate: Date | number;
  energyBurned: number;
  totalDistance: number;
  metadata: { [name: string]: any };
}): Promise<boolean> => {
  if (isIOS) {
    return await RNHealthTracker.recordWorkout(
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
 * @param object {object}
 * @param object.systolicPressure {Number}
 * @param object.diastolicPressure {Number}
 * @param object.date {Date | number}
 * @param object.metadata {object}
 * @return {Promise<boolean>}
 */
const recordBloodPressureIOS = async ({
  systolicPressure,
  diastolicPressure,
  date,
  metadata = {},
}: {
  systolicPressure: number;
  diastolicPressure: number;
  date: Date | number;
  metadata: { [name: string]: any };
}): Promise<boolean> => {
  if (isIOS) {
    return await RNHealthTracker.recordBloodPressure(
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
 * @param dataType {HealthDataType} e.g. `HealthDataTypes.Fiber`
 * @return {Promise<number>} 0 - notDetermined, 1 - sharingDenied, 2 - sharingAuthorized
 */
const getAuthStatusForTypeIOS = async (key: HKDataType): Promise<boolean> => {
  if (isIOS) {
    return await RNHealthTracker.getAuthorizationStatusForType(key);
  }
};

/**
 * `iOS only!` Returns read status for data type in Health API
 * `WARNING`! This method is unofficial. Queries for data in time span of 2 years with limit of one, returns `readDenied` if no data is available.
 * @param dataType {HealthDataType} e.g. `HealthDataTypes.Fiber`
 * @param unit {HealthDataType} e.g. `HealthDataTypes.Fiber`
 * @return {Promise<number>} 0 - notDetermined, 1 - readDenied, 2 - readAuthorized
 */
const getReadStatusForTypeIOS = async ({
  key,
  unit,
}: {
  key: HKDataType;
  unit: HKUnit;
}): Promise<number> => {
  if (isIOS) {
    return await RNHealthTracker.getReadStatus(key, unit);
  }
};

/**
 * `iOS only!` Delete record from Health API
 * @param object.key {HealthDataType} e.g. `HealthDataTypes.Fiber`
 * @param object.uuid {number} optional unique healthkit record id
 * @param object.date {number} optional unix timestamp for record date
 * @return {Promise<number>} 0 - notDetermined, 1 - readDenied, 2 - readAuthorized
 */
const deleteRecordIOS = async ({
  key,
  uuid = null,
  date = 0,
}: {
  key: HKDataType;
  uuid?: string;
  date?: number;
}): Promise<number> => {
  if (isIOS) {
    return await RNHealthTracker.deleteRecord(
      key,
      uuid,
      date - 1000,
      date + 1000,
    );
  }
};

export const HealthTrackerAPI = {
  deleteRecordIOS,
  getAuthStatusForTypeIOS,
  getReadStatusForTypeIOS,
  getAbsoluteTotalForTodayIOS,
  getStatisticTotalForTodayIOS,
  getStatisticTotalForWeekIOS,
  getStatisticWeekDailyIOS,
  isTrackingSupportedIOS,
  recordBloodPressureIOS,
  recordWorkoutIOS,
  queryDataRecordsIOS,
  queryDailyTotalsIOS,
  queryTotalIOS,
  queryWorkoutsIOS,
  setupTrackingIOS,
  writeDataIOS,
  writeDataArrayIOS,
};
