import { NativeModules, Platform } from 'react-native';

import { HealthDataTypes, UnitTypes, WorkoutTypes } from './utils/dataTypes';

const { RNHealthTracker } = NativeModules;

const isIOS = Platform.OS === 'ios';

/**
 * @module RNHealthTracker
 */

/**
 * `iOS only!` returns if step, distance and floor tracking is supported on device
 * @return {Promise<boolean>}
 */
const isTrackingSupportedIOS = async (): Promise<boolean> => {
  if (isIOS) {
    const response = await RNHealthTracker.isTrackingSupported();
    return !!response;
  }
};

/**
 * Sets up health tracking and returns status
 * @param shareTypes {HealthDataType} e.g. `HealthDataTypes.Fiber`
 * @param readTypes {HealthDataType} e.g. `HealthDataTypes.Fiber`
 * @return {Promise<boolean>}
 */
const setupTracking = async <DataKey extends keyof typeof HealthDataTypes>(
  shareTypes: DataKey,
  readTypes: DataKey,
): Promise<boolean> => {
  if (isIOS) {
    const authorized = await RNHealthTracker.authorize(shareTypes, readTypes);
    return !!authorized;
  }
};

/**
 * Writes given health data to Health API
 * @param object {object}
 * @param object.key {HealthDataTypes}
 * @param object.unit {UnitKey}
 * @param object.quantity {Number}
 * @param object.metadata {object}
 * @return {Promise<boolean>}
 */
const writeData = async <
  DataKey extends keyof typeof HealthDataTypes,
  UnitKey extends keyof typeof UnitTypes
>({
  key,
  unit,
  quantity,
  metadata = {},
}: {
  key: DataKey;
  unit: UnitKey;
  quantity: number;
  metadata: {};
}): Promise<boolean> => {
  if (isIOS) {
    return await RNHealthTracker.writeData(key, quantity, unit, metadata);
  }
};

/**
 * Writes given health data array to Health API
 * @param dataArray {array}
 * @param dataArray.object {object}
 * @param dataArray.object.key {HealthDataTypes}
 * @param dataArray.object.unit {UnitKey}
 * @param dataArray.object.quantity {Number}
 * @param dataArray.object.metadata {object}
 * @return {Promise<boolean>}
 */
const writeDataArray = async <
  DataKey extends keyof typeof HealthDataTypes,
  UnitKey extends keyof typeof UnitTypes
>(
  dataArray: Array<{
    key: DataKey;
    unit: UnitKey;
    quantity: number;
    metadata: {};
  }>,
): Promise<boolean> => {
  if (isIOS) {
    return await RNHealthTracker.writeDataArray(dataArray);
  }
};

/**
 * Gets absolute total for given health data type and unit for current day
 * @param key {HealthDataType} e.g. `HealthDataTypes.Fiber`
 * @param unit {UnitType} e.g. `UnitTypes.grams`
 * @return {Promise<number>}
 */
const getAbsoluteTotalForToday = async <
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
 * Gets statistic total for given health data type and unit for current day, same number as in health app
 * @param key {HealthDataType} e.g. `HealthDataTypes.Fiber`
 * @param unit {UnitType} e.g. `UnitTypes.grams`
 * @return {Promise<number>}
 */
const getStatisticTotalForToday = async <
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
 * Gets statistic total for given health data type and unit for current week, same number as in health app
 * @param key {HealthDataType} e.g. `HealthDataTypes.Fiber`
 * @param unit {UnitType} e.g. `UnitTypes.grams`
 * @return {Promise<number>}
 */
const getStatisticTotalForWeek = async <
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
 * Gets statistic daily total for given health data type and unit for current week, same number as in health app
 * @param key {HealthDataType} e.g. `HealthDataTypes.Fiber`
 * @param unit {UnitType} e.g. `UnitTypes.grams`
 * @return {Promise<number>}
 */
const getStatisticWeekDaily = async <
  DataKey extends keyof typeof HealthDataTypes,
  UnitKey extends keyof typeof UnitTypes
>({
  key,
  unit,
}: {
  key: DataKey;
  unit: UnitKey;
}): Promise<{}> => {
  if (isIOS) {
    const total = await RNHealthTracker.getStatisticWeekDaily(key, unit);
    return total;
  }
};

/**
 * Records given workout data to Health API
 * @param object {object}
 * @param object.startDate {Date | number}
 * @param object.endDate {Date | number}
 * @param object.energyBurned {Number} number of calories in kcal
 * @param object.metadata {object}
 * @return {Promise<boolean>}
 */
const recordWorkout = async <DataKey extends keyof typeof WorkoutTypes>({
  key,
  startDate,
  endDate,
  energyBurned,
  metadata = {},
}: {
  key: DataKey;
  startDate: Date | number;
  endDate: Date | number;
  energyBurned: number;
  metadata: {};
}): Promise<boolean> => {
  if (isIOS) {
    return await RNHealthTracker.recordWorkout(
      key,
      +startDate,
      +endDate,
      energyBurned,
      metadata,
    );
  }
};

/**
 * Returns auth status for data type in Health API
 * @param object {object}
 * @param object.startDate {Date | number}
 * @param object.endDate {Date | number}
 * @param object.energyBurned {Number} number of calories in kcal
 * @param object.metadata {object}
 * @return {Promise<number>} 0 - notDetermined, 1 - sharingDenied, 2 - sharingAuthorized
 */
const getAuthStatusForType = async <DataKey extends keyof typeof WorkoutTypes>(
  key: DataKey,
): Promise<boolean> => {
  if (isIOS) {
    return await RNHealthTracker.getAuthorizationStatusForType(key);
  }
};

export const HealthTrackerAPI = {
  getAuthStatusForType,
  getAbsoluteTotalForToday,
  getStatisticTotalForToday,
  getStatisticTotalForWeek,
  getStatisticWeekDaily,
  isTrackingSupportedIOS,
  recordWorkout,
  setupTracking,
  writeData,
  writeDataArray,
};
