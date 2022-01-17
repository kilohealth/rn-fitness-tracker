import DeviceInfo from 'react-native-device-info';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { NativeModules } from 'react-native';
import { ResultMap } from 'react-native-permissions/dist/typescript/results';

import { AndroidPermissionValues } from '../types/permissions';
import { HealthDataTypes, HKDataType, UnitTypes } from '../types/dataTypes';
import { HealthTrackerAPI } from './health';
import {
  IDistanceDaily,
  IDistanceData,
  IFitnessTrackerStatus,
  IStepsDaily,
  IStepsData,
} from '../types/fitnessTypes';
import { isIOS, isObject, ValueOf } from '../utils/helpers';

const { RNFitnessTracker } = NativeModules;

/**
 * @module FitnessTrackerAPI
 */

const handleAndroidMotionTrackingPermissions = async (
  shouldRequestPermission: boolean,
): Promise<IFitnessTrackerStatus> => {
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
 * @param permissions {Array<AndroidPermissionValues>} - list of permissions to check if tracking is available
 * @return {Promise<IFitnessTrackerStatus>}
 */
const isTrackingAvailable = async (
  permissions: AndroidPermissionValues[],
): Promise<IFitnessTrackerStatus> => {
  if (isIOS) {
    const status: number = await HealthTrackerAPI.getReadStatusForTypeIOS({
      key: HealthDataTypes.StepCount,
      unit: UnitTypes.count,
    });

    if (status === 2) {
      return { authorized: true, shouldOpenAppSettings: false };
    } else if (status === 0) {
      return { authorized: false, shouldOpenAppSettings: false };
    } else {
      return { authorized: false, shouldOpenAppSettings: true };
    }
  } else {
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
 * @param permissions {Array<AndroidPermissionValues>} - list of permissions to track
 * @return {Promise<IFitnessTrackerStatus>}
 */
const setupTracking = async (
  permissions: AndroidPermissionValues[],
): Promise<IFitnessTrackerStatus> => {
  if (isIOS) {
    const { authorized, shouldOpenAppSettings } = await isTrackingAvailable(
      permissions,
    );
    if (!authorized && shouldOpenAppSettings) {
      return {
        authorized: authorized,
        shouldOpenAppSettings: shouldOpenAppSettings,
      };
    } else {
      const readTypes: HKDataType[] = [HealthDataTypes.StepCount];

      // Todo: update with new permission array
      // if (shouldTrackDistance) {
      //   readTypes.push(HealthDataTypes.DistanceWalkingRunning);
      // }

      const shareTypes: HKDataType[] = [];
      await HealthTrackerAPI.setupTrackingIOS(shareTypes, readTypes);

      const { authorized, shouldOpenAppSettings } = await isTrackingAvailable(
        permissions,
      );

      return {
        authorized: authorized,
        shouldOpenAppSettings: shouldOpenAppSettings,
      };
    }
  } else {
    const motionAuthResult = await handleAndroidMotionTrackingPermissions(true);
    if (motionAuthResult.authorized) {
      motionAuthResult.authorized = await RNFitnessTracker.authorize(
        permissions,
      );
    }

    return motionAuthResult;
  }
};

/**
 * Returns number of steps today
 * @return {Promise<number>}
 */
const getStepsToday = async (): Promise<number> => {
  if (isIOS) {
    const total = await HealthTrackerAPI.getStatisticTotalForTodayIOS({
      key: HealthDataTypes.StepCount,
      unit: UnitTypes.count,
    });
    return Number(total);
  } else {
    return RNFitnessTracker.getStepsToday();
  }
};

/**
 * Returns number of steps this week
 * @return {Promise<Number>}
 */
const getStepsWeekTotal = async (): Promise<number> => {
  if (isIOS) {
    const total = await HealthTrackerAPI.getStatisticTotalForWeekIOS({
      key: HealthDataTypes.StepCount,
      unit: UnitTypes.count,
    });
    return Number(total);
  } else {
    return RNFitnessTracker.getStepsWeekTotal();
  }
};

/**
 * Returns weekly steps object
 * @return {Promise<IStepsDaily>}
 */
const getStepsDaily = async (): Promise<IStepsDaily> => {
  if (isIOS) {
    return HealthTrackerAPI.getStatisticWeekDailyIOS({
      key: HealthDataTypes.StepCount,
      unit: UnitTypes.count,
    });
  } else {
    return RNFitnessTracker.getStepsDaily();
  }
};

/**
 * Returns daily totals of steps for specified time range
 * @param startDate {Date | number}
 * @param endDate {Date | number}
 * @return {Promise<IStepsDaily>}
 */
const queryStepsTotalDaily = async (
  startDate: Date | number,
  endDate: Date | number,
): Promise<IStepsDaily> => {
  if (isIOS) {
    return HealthTrackerAPI.queryDailyTotalsIOS({
      key: HealthDataTypes.StepCount,
      unit: UnitTypes.count,
      startDate,
      endDate,
    });
  } else {
    return RNFitnessTracker.queryStepsDaily(+startDate, +endDate);
  }
};

/**
 * Returns steps today and this week's steps object
 * @return {Promise<IStepsData>}
 */
const getStepsData = async (): Promise<IStepsData> => {
  let stepsDaily: IStepsDaily;
  if (isIOS) {
    stepsDaily = await HealthTrackerAPI.getStatisticWeekDailyIOS({
      key: HealthDataTypes.StepCount,
      unit: UnitTypes.count,
    });
  } else {
    stepsDaily = await RNFitnessTracker.getStepsDaily();
  }

  let stepsToday = 0;

  if (isObject(stepsDaily)) {
    const today = Object.keys(stepsDaily).sort()[6];
    stepsToday = stepsDaily?.[today];
  }

  return { stepsToday, stepsDaily: stepsDaily || {} };
};

/**
 * Returns walking and running distance today in meters
 * @return {Promise<number>} number of meters
 */
const getDistanceToday = async (): Promise<number> => {
  if (isIOS) {
    const total = await HealthTrackerAPI.getStatisticTotalForTodayIOS({
      key: HealthDataTypes.DistanceWalkingRunning,
      unit: UnitTypes.meters,
    });

    return Number(total);
  } else {
    return RNFitnessTracker.getDistanceToday();
  }
};

/**
 * Returns walking and running distance this week in meters
 * @return {Promise<Number>} number of meters
 */
const getDistanceWeekTotal = async (): Promise<number> => {
  if (isIOS) {
    const total = await HealthTrackerAPI.getStatisticTotalForWeekIOS({
      key: HealthDataTypes.DistanceWalkingRunning,
      unit: UnitTypes.meters,
    });

    return Number(total);
  } else {
    return RNFitnessTracker.getDistanceWeekTotal();
  }
};

/**
 * Returns daily distance object
 * @return {Promise<IDistanceDaily>}
 */
const getDistanceDaily = async (): Promise<IDistanceDaily> => {
  if (isIOS) {
    return HealthTrackerAPI.getStatisticWeekDailyIOS({
      key: HealthDataTypes.DistanceWalkingRunning,
      unit: UnitTypes.meters,
    });
  } else {
    return RNFitnessTracker.getDistanceDaily();
  }
};

/**
 * Returns distance today and this week's distance daily data object
 * @return {Promise<IDistanceData>}
 */
const getDistanceData = async (): Promise<IDistanceData> => {
  let distanceDaily: IDistanceDaily;
  if (isIOS) {
    distanceDaily = await HealthTrackerAPI.getStatisticWeekDailyIOS({
      key: HealthDataTypes.DistanceWalkingRunning,
      unit: UnitTypes.meters,
    });
  } else {
    distanceDaily = await RNFitnessTracker.getDistanceDaily();
  }

  let distanceToday = 0;

  if (isObject(distanceDaily)) {
    const today = Object.keys(distanceDaily).sort()[6];
    distanceToday = distanceDaily?.[today];
  }

  return { distanceToday, distanceDaily: distanceDaily || {} };
};

/**
 * Returns total distance in meters for given time range
 * @param dataType {AndroidPermissionValues}
 * @param startDate {Date | number}
 * @param endDate {Date | number}
 * @return {Promise<Number>}
 */
const queryTotal = async (
  dataType: AndroidPermissionValues,
  startDate: Date | number,
  endDate: Date | number,
): Promise<number> => {
  if (isIOS) {
    // Todo: make ios use DataType
    const total = await HealthTrackerAPI.queryTotalIOS({
      key: HealthDataTypes.DistanceWalkingRunning,
      unit: UnitTypes.meters,
      startDate,
      endDate,
    });

    return Number(total);
  } else {
    return RNFitnessTracker.queryTotal(dataType, +startDate, +endDate);
  }
};

export const FitnessTrackerAPI = {
  getDistanceDaily,
  getDistanceData,
  getDistanceToday,
  getDistanceWeekTotal,
  getStepsDaily,
  getStepsData,
  getStepsToday,
  getStepsWeekTotal,
  isTrackingAvailable,
  queryTotal,
  queryStepsTotalDaily,
  setupTracking,
};
