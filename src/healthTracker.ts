import { NativeModules } from 'react-native';

import { HealthDataTypes, UnitTypes } from './utils/dataTypes';

const { RNHealthTracker } = NativeModules;

/**
 * @module RNHealthTracker
 */

/**
 * `iOS only!` returns if step, distance and floor tracking is supported on device
 * @return {Promise<boolean>}
 */
const isTrackingSupportedIOS = async (): Promise<boolean> => {
  const response = await RNHealthTracker.isTrackingSupported();
  return !!response;
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
  const authorized = await RNHealthTracker.authorize(shareTypes, readTypes);

  return !!authorized;
};

/**
 * Writes given health data to Health API
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
}): Promise<boolean> =>
  RNHealthTracker.writeData(key, quantity, unit, metadata);

/**
 * Writes given health data array to Health API
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
): Promise<boolean> => RNHealthTracker.writeDataArray(dataArray);

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
  const total = await RNHealthTracker.getAbsoluteTotalForToday(key, unit);
  return Number(total);
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
  const total = await RNHealthTracker.getStatisticTotalForToday(key, unit);
  return Number(total);
};

export const HealthTrackerAPI = {
  getAbsoluteTotalForToday,
  getStatisticTotalForToday,
  isTrackingSupportedIOS,
  setupTracking,
  writeData,
  writeDataArray,
};
