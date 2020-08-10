import { NativeModules } from 'react-native';

import { HealthDataTypes, UnitTypes } from './utils/dataTypes';

const { RNHealthTracker } = NativeModules;

/**
 * @module RNHealthTracker
 */

/**
 * `iOS only!` returns if step, distance and floor tracking is supported on device
 * @return {Promise<IFitnessTrackerAvailability>}
 */
const isTrackingSupportedIOS = async (): Promise<boolean> => {
  const response = await RNHealthTracker.isTrackingSupported();
  return !!response;
};

/**
 * Sets up health tracking and returns status
 * @param shareTypes {HealthDataType} e.g. `HealthDataTypes.Fiber`
 * @param readTypes {HealthDataType} e.g. `HealthDataTypes.Fiber`
 * @return {Promise<IFitnessTrackerStatus>}
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
 * @return {Promise<number>}
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
}): Promise<number> => RNHealthTracker.writeData(key, quantity, unit, metadata);

/**
 * Gets total for given health data type and unit for current day
 * @param key {HealthDataType} e.g. `HealthDataTypes.Fiber`
 * @param unit {UnitType} e.g. `UnitTypes.grams`
 * @return {Promise<number>}
 */
const getTotalForToday = async <
  DataKey extends keyof typeof HealthDataTypes,
  UnitKey extends keyof typeof UnitTypes
>({
  key,
  unit,
}: {
  key: DataKey;
  unit: UnitKey;
}): Promise<number> => {
  const total = await RNHealthTracker.getTotalForToday(key, unit);
  return Number(total);
};

export const HealthTrackerAPI = {
  getTotalForToday,
  isTrackingSupportedIOS,
  setupTracking,
  writeData,
};
