import DeviceInfo from 'react-native-device-info';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { NativeModules } from 'react-native';
import { ResultMap } from 'react-native-permissions/dist/typescript/results';

import {
  DailyData,
  FitnessDataType,
  FitnessTrackerStatus,
  TodayAndDailyData,
} from '../types/fitnessTypes';
import {
  getDataTypeForHealthKit,
  isIOS,
  isObject,
  ValueOf,
} from '../utils/helpers';
import { GoogleFitDataTypes } from '../types/googleFitDataTypes';
import { HealthDataType } from '../types/healthKitDataTypes';
import { HealthTrackerAPI } from './health';

const { RNFitnessTracker } = NativeModules;

/**
 * @module FitnessTrackerAPI
 */

const handleAndroidMotionTrackingPermissions = async (
  shouldRequestPermission: boolean,
): Promise<FitnessTrackerStatus> => {
  const apiLevel = await DeviceInfo.getApiLevel();
  const isMotionAuthNeeded = apiLevel >= 29;

  const action = shouldRequestPermission ? request : check;
  const motionAuthorized: ValueOf<ResultMap> = await action(
    PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION,
  );

  if (!isMotionAuthNeeded || motionAuthorized === RESULTS.GRANTED) {
    return { authorized: true, shouldOpenAppSettings: false };
  } else if (motionAuthorized === RESULTS.DENIED) {
    return { authorized: false, shouldOpenAppSettings: false };
  } else {
    return { authorized: false, shouldOpenAppSettings: true };
  }
};

/**
 * Returns if step tracking is authorized and available on both platforms
 * @param permissions {Array<GoogleFitDataTypes>} - list of permissions to check if tracking is available
 * @return {Promise<FitnessTrackerStatus>}
 */
const isTrackingAvailableAndroid = async (
  permissions: GoogleFitDataTypes[],
): Promise<FitnessTrackerStatus> => {
  if (!isIOS) {
    const motionAuthResult = await handleAndroidMotionTrackingPermissions(
      false,
    );
    if (motionAuthResult.authorized) {
      motionAuthResult.authorized = await RNFitnessTracker.isTrackingAvailable(
        permissions,
      );
    }

    return motionAuthResult;
  }
};

/**
 * Sets up step tracking for walking & running steps and distance
 * @param permissions {Array<GoogleFitDataTypes>} - list of permissions to track
 * @return {Promise<FitnessTrackerStatus>}
 */
const authorize = async (permissions: {
  googleFitReadPermissions?: GoogleFitDataTypes[];
  googleFitWritePermissions?: GoogleFitDataTypes[];
  healthReadPermissions?: HealthDataType[];
  healthWritePermissions?: HealthDataType[];
}): Promise<boolean> => {
  if (isIOS) {
    const readTypes: HealthDataType[] = permissions.healthReadPermissions || [];
    const shareTypes: HealthDataType[] =
      permissions.healthWritePermissions || [];

    return await HealthTrackerAPI.authorize(shareTypes, readTypes);
  } else {
    const motionAuthResult = await handleAndroidMotionTrackingPermissions(true);
    if (motionAuthResult.authorized) {
      const readTypes: GoogleFitDataTypes[] =
        permissions.googleFitReadPermissions || [];
      motionAuthResult.authorized = await RNFitnessTracker.authorize(readTypes);
    }

    return motionAuthResult.authorized;
  }
};

/**
 * Returns number of steps today
 * @return {Promise<number>}
 */
const getStatisticTodayTotal = async (
  dataType: FitnessDataType,
): Promise<number> => {
  if (isIOS) {
    const healthKitDataType = getDataTypeForHealthKit(dataType);

    const total = await HealthTrackerAPI.getStatisticTotalForToday(
      healthKitDataType,
    );
    return Number(total);
  } else {
    return RNFitnessTracker.getStatisticTodayTotal(dataType);
  }
};

/**
 * Returns steps today and this week's steps object
 * @return {Promise<TodayAndDailyData>}
 */
const getData = async (
  dataType: FitnessDataType,
): Promise<TodayAndDailyData> => {
  let daily: DailyData;
  if (isIOS) {
    const healthKitDataType = getDataTypeForHealthKit(dataType);

    daily = await HealthTrackerAPI.getStatisticWeekDaily(healthKitDataType);
  } else {
    daily = await RNFitnessTracker.getStatisticWeekDaily(dataType);
  }

  let today = 0;

  if (isObject(daily)) {
    today = daily?.[Object.keys(daily).sort()[6]];
  }

  return { today, daily: daily || {} };
};

/**
 * Returns total distance in meters for given time range
 * @param dataType {GoogleFitDataTypes}
 * @param startDate {Date | number}
 * @param endDate {Date | number}
 * @return {Promise<Number>}
 */
const queryTotal = async (
  dataType: FitnessDataType,
  startDate: Date | number,
  endDate: Date | number,
): Promise<number> => {
  if (isIOS) {
    const healthKitDataType = getDataTypeForHealthKit(dataType);

    const total = await HealthTrackerAPI.queryTotal({
      ...healthKitDataType,
      startDate,
      endDate,
    });

    return Number(total);
  } else {
    return RNFitnessTracker.queryTotal(dataType, +startDate, +endDate);
  }
};

/**
 * Returns walking and running distance this week in meters
 * @return {Promise<Number>} number of meters
 */
const getStatisticWeekTotal = async (
  dataType: FitnessDataType,
): Promise<number> => {
  if (isIOS) {
    const healthKitDataType = getDataTypeForHealthKit(dataType);

    const total = await HealthTrackerAPI.getStatisticTotalForWeek(
      healthKitDataType,
    );

    return Number(total);
  } else {
    return RNFitnessTracker.getStatisticWeekTotal(dataType);
  }
};

/**
 * Returns total distance in meters for given time range
 * @param dataType {GoogleFitDataTypes}
 * @param startDate {Date | number}
 * @param endDate {Date | number}
 * @return {Promise<Number>}
 */
const queryDailyTotals = async (
  dataType: FitnessDataType,
  startDate: Date | number,
  endDate: Date | number,
): Promise<DailyData> => {
  if (isIOS) {
    const healthKitDataType = getDataTypeForHealthKit(dataType);

    return HealthTrackerAPI.queryDailyTotals({
      ...healthKitDataType,
      startDate,
      endDate,
    });
  } else {
    return RNFitnessTracker.queryDailyTotals(dataType, +startDate, +endDate);
  }
};

/**
 * Returns weekly steps object
 * @return {Promise<DailyData>}
 */
const getStatisticWeekDaily = async (
  dataType: FitnessDataType,
): Promise<DailyData> => {
  if (isIOS) {
    const healthKitDataType = getDataTypeForHealthKit(dataType);

    return HealthTrackerAPI.getStatisticWeekDaily(healthKitDataType);
  } else {
    return RNFitnessTracker.getStatisticWeekDaily(dataType);
  }
};

const getLatestWeightRecord = async () => {
  if (isIOS) {
    return HealthTrackerAPI.getLatestDataRecord(
      getDataTypeForHealthKit(FitnessDataType.Weight),
    );
  } else {
    // todo android implementation
  }
};

export const FitnessTrackerAPI = {
  authorize,
  getData,
  getLatestWeightRecord,
  getStatisticTodayTotal,
  getStatisticWeekDaily,
  getStatisticWeekTotal,
  isTrackingAvailableAndroid,
  queryDailyTotals,
  queryTotal,
};
