import { NativeModules } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { ResultMap } from 'react-native-permissions/dist/typescript/results';

import {
  IDistanceDaily,
  IDistanceData,
  IFitnessTrackerStatus,
  IStepsDaily,
  IStepsData,
} from '../types/fitnessTypes';
import { HealthDataTypes, HKDataType, UnitTypes } from '../types/dataTypes';
import { isIOS, isObject, ValueOf } from '../utils/helpers';

const { RNFitnessTracker, RNHealthTracker } = NativeModules;

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
 * @return {Promise<IFitnessTrackerStatus>}
 */
const isTrackingAvailable = async (): Promise<IFitnessTrackerStatus> => {
  if (isIOS) {
    const status: number = await RNHealthTracker.getReadStatus(
      HealthDataTypes.StepCount,
      UnitTypes.count,
    );

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
      const authorized: boolean = await RNFitnessTracker.isTrackingAvailable();
      motionAuthResult.authorized = authorized;
    }

    return motionAuthResult;
  }
};

/**
 * Sets up step tracking for walking & running steps and distance
 * @param shouldTrackDistance {boolean} - if true, adds permission to track distance in Health consent screen
 * @return {Promise<IFitnessTrackerStatus>}
 */
const setupTracking = async (
  shouldTrackDistance = false,
): Promise<IFitnessTrackerStatus> => {
  if (isIOS) {
    const { authorized, shouldOpenAppSettings } = await isTrackingAvailable();
    if (!authorized && shouldOpenAppSettings) {
      return {
        authorized: authorized,
        shouldOpenAppSettings: shouldOpenAppSettings,
      };
    } else {
      const readTypes: HKDataType[] = [HealthDataTypes.StepCount];

      if (shouldTrackDistance) {
        readTypes.push(HealthDataTypes.DistanceWalkingRunning);
      }

      await RNHealthTracker.authorize([], readTypes);

      const { authorized, shouldOpenAppSettings } = await isTrackingAvailable();

      return {
        authorized: authorized,
        shouldOpenAppSettings: shouldOpenAppSettings,
      };
    }
  } else {
    const motionAuthResult = await handleAndroidMotionTrackingPermissions(true);
    if (motionAuthResult.authorized) {
      const authorized: boolean = await RNFitnessTracker.authorize();
      motionAuthResult.authorized = authorized;

      return motionAuthResult;
    } else {
      return motionAuthResult;
    }
  }
};

/**
 * Returns number of steps today
 * @return {Promise<number>}
 */
const getStepsToday = async (): Promise<number> => {
  if (isIOS) {
    const total = await RNHealthTracker.getStatisticTotalForToday(
      HealthDataTypes.StepCount,
      UnitTypes.count,
    );
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
    const total = await RNHealthTracker.getStatisticTotalForWeek(
      HealthDataTypes.StepCount,
      UnitTypes.count,
    );
    return Number(total);
  } else {
    return RNFitnessTracker.getStepsWeekTotal();
  }
};

/**
 * Returns weekly steps object
 * @return {Promise<IWeekDailySteps>}
 */
const getStepsDaily = async (): Promise<IStepsDaily> => {
  if (isIOS) {
    return RNHealthTracker.getStatisticWeekDaily(
      HealthDataTypes.StepCount,
      UnitTypes.count,
    );
  } else {
    return RNFitnessTracker.getStepsDaily();
  }
};

/**
 * Returns steps today and this week's steps object
 * @return {Promise<IStepTrackerData>}
 */
const getStepsData = async (): Promise<IStepsData> => {
  let stepsDaily: IStepsDaily;
  if (isIOS) {
    stepsDaily = await RNHealthTracker.getStatisticWeekDaily(
      HealthDataTypes.StepCount,
      UnitTypes.count,
    );
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
 * Returns number of steps for given time range
 * @param startDate {Date | number}
 * @param endDate {Date | number}
 * @return {Promise<Number>}
 */
const queryStepsTotal = async (
  startDate: Date | number,
  endDate: Date | number,
): Promise<number> => {
  if (isIOS) {
    const total = await RNHealthTracker.queryTotal(
      HealthDataTypes.StepCount,
      UnitTypes.count,
      +startDate,
      +endDate,
    );

    return Number(total);
  } else {
    return RNFitnessTracker.queryStepsTotal(+startDate, +endDate);
  }
};

/**
 * Returns walking and running distance today in meters
 * @return {Promise<number>} number of meters
 */
const getDistanceToday = async (): Promise<number> => {
  if (isIOS) {
    const total = await RNHealthTracker.getStatisticTotalForToday(
      HealthDataTypes.DistanceWalkingRunning,
      UnitTypes.meters,
    );
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
    const total = await RNHealthTracker.getStatisticTotalForWeek(
      HealthDataTypes.DistanceWalkingRunning,
      UnitTypes.meters,
    );
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
    return RNHealthTracker.getStatisticWeekDaily(
      HealthDataTypes.DistanceWalkingRunning,
      UnitTypes.meters,
    );
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
    distanceDaily = await RNHealthTracker.getStatisticWeekDaily(
      HealthDataTypes.DistanceWalkingRunning,
      UnitTypes.meters,
    );
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
 * @param startDate {Date | number}
 * @param endDate {Date | number}
 * @return {Promise<Number>}
 */
const queryDistanceTotal = async (
  startDate: Date | number,
  endDate: Date | number,
): Promise<number> => {
  if (isIOS) {
    const total = await RNHealthTracker.queryTotal(
      HealthDataTypes.DistanceWalkingRunning,
      UnitTypes.meters,
      +startDate,
      +endDate,
    );

    return Number(total);
  } else {
    return RNFitnessTracker.queryDistanceTotal(+startDate, +endDate);
  }
};

export const FitnessTrackerAPI = {
  getStepsToday,
  getStepsWeekTotal,
  getStepsDaily,
  getStepsData,
  queryStepsTotal,
  getDistanceToday,
  getDistanceWeekTotal,
  getDistanceDaily,
  getDistanceData,
  queryDistanceTotal,
  isTrackingAvailable,
  setupTracking,
};
