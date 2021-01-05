import { NativeModules } from 'react-native';

import { HealthDataTypes, UnitTypes, WorkoutTypes } from '../types/dataTypes';
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
 * @param shareTypes {HealthDataType} e.g. `HealthDataTypes.Fiber`
 * @param readTypes {HealthDataType} e.g. `HealthDataTypes.Fiber`
 * @return {Promise<boolean>}
 */
const setupTrackingIOS = async <DataKey extends keyof typeof HealthDataTypes>(
  shareTypes: DataKey,
  readTypes: DataKey,
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
const writeDataIOS = async <
  DataKey extends keyof typeof HealthDataTypes,
  UnitKey extends keyof typeof UnitTypes
>({
  key,
  unit,
  quantity,
  metadata = {},
  customUnixTimestamp = 0,
}: {
  key: DataKey;
  unit: UnitKey;
  quantity: number;
  metadata: { [name: string]: any };
  customUnixTimestamp: number;
}): Promise<boolean> => {
  if (isIOS) {
    return await RNHealthTracker.writeData(
      key,
      quantity,
      unit,
      metadata,
      customUnixTimestamp,
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
const writeDataArrayIOS = async <
  DataKey extends keyof typeof HealthDataTypes,
  UnitKey extends keyof typeof UnitTypes
>(
  dataArray: Array<{
    key: DataKey;
    unit: UnitKey;
    quantity: number;
    metadata: { [name: string]: any };
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
const getAbsoluteTotalForTodayIOS = async <
  DataKey extends keyof typeof HealthDataTypes,
  UnitKey extends keyof typeof UnitTypes
>({
  key,
  unit,
}: {
  key: DataKey;
  unit: UnitKey;
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
const getStatisticTotalForTodayIOS = async <
  DataKey extends keyof typeof HealthDataTypes,
  UnitKey extends keyof typeof UnitTypes
>({
  key,
  unit,
}: {
  key: DataKey;
  unit: UnitKey;
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
const getStatisticTotalForWeekIOS = async <
  DataKey extends keyof typeof HealthDataTypes,
  UnitKey extends keyof typeof UnitTypes
>({
  key,
  unit,
}: {
  key: DataKey;
  unit: UnitKey;
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
const getStatisticWeekDailyIOS = async <
  DataKey extends keyof typeof HealthDataTypes,
  UnitKey extends keyof typeof UnitTypes
>({
  key,
  unit,
}: {
  key: DataKey;
  unit: UnitKey;
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
const queryDataRecordsIOS = async <
  DataKey extends keyof typeof HealthDataTypes,
  UnitKey extends keyof typeof UnitTypes
>({
  key,
  unit,
  numberOfDays,
}: {
  key: DataKey;
  unit: UnitKey;
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
const queryWorkoutsIOS = async <WorkoutKey extends keyof typeof WorkoutTypes>({
  startDate,
  endDate,
  key = 0,
}: {
  startDate: Date | number;
  endDate: Date | number;
  key: WorkoutKey | 0;
}): Promise<IWorkoutQueryData<WorkoutKey>> => {
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
const queryDailyTotalsIOS = async <
  DataKey extends keyof typeof HealthDataTypes,
  UnitKey extends keyof typeof UnitTypes
>({
  key,
  unit,
  startDate,
  endDate,
}: {
  key: DataKey;
  unit: UnitKey;
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
const queryTotalIOS = async <
  DataKey extends keyof typeof HealthDataTypes,
  UnitKey extends keyof typeof UnitTypes
>({
  key,
  unit,
  startDate,
  endDate,
}: {
  key: DataKey;
  unit: UnitKey;
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
const recordWorkoutIOS = async <DataKey extends keyof typeof WorkoutTypes>({
  key,
  startDate,
  endDate,
  energyBurned = 0,
  totalDistance = 0,
  metadata = {},
}: {
  key: DataKey;
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
const getAuthStatusForTypeIOS = async <
  DataKey extends keyof typeof WorkoutTypes
>(
  key: DataKey,
): Promise<boolean> => {
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
const getReadStatusForTypeIOS = async <
  DataKey extends keyof typeof HealthDataTypes,
  UnitKey extends keyof typeof UnitTypes
>({
  key,
  unit,
}: {
  key: DataKey;
  unit: UnitKey;
}): Promise<number> => {
  if (isIOS) {
    return await RNHealthTracker.getReadStatus(key, unit);
  }
};

export const HealthTrackerAPI = {
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
