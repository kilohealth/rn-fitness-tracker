import { NativeModules } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';

import {
  IDistanceDaily,
  IDistanceData,
  IFitnessTrackerStatus,
  IStepsDaily,
  IStepsData,
} from '../types/fitnessTypes';

const { RNFitnessTracker, RNHealthTracker } = NativeModules;
import { HealthDataTypes, UnitTypes } from '../types/dataTypes';
import { isIOS, isObject } from '../utils/helpers';


/**
 * @module FitnessTrackerAPI
 */


/**
 * Returns if step tracking is authorized and available on both platforms
 * @return {Promise<IFitnessTrackerStatus>}
 */
const isTrackingAvailable = async (): Promise<IFitnessTrackerStatus> => {
  if (isIOS) {
    const status: number = await RNHealthTracker.getAuthorizationStatusForType(
      HealthDataTypes.StepCount,
    );
    if(status === 2) {
      return { authorized: true, shouldOpenAppSettings: false };
    } else {
      return { authorized: false, shouldOpenAppSettings: true };
    }
  } else {
    const authorized: boolean = await RNFitnessTracker.isTrackingAvailable();
    return { authorized, shouldOpenAppSettings: false };
  }
};

/**
 * Sets up step tracking for walking & running steps and distance
 * @return {Promise<IFitnessTrackerStatus>}
 */
const setupTracking = async (): Promise<IFitnessTrackerStatus> => {
  if (isIOS) {
    const authorized = await RNHealthTracker.authorize([], [HealthDataTypes.StepCount, HealthDataTypes.DistanceWalkingRunning]);
    return { 
      authorized: !!authorized, 
      shouldOpenAppSettings: !authorized 
    };
  } else {
    const apiLevel = await DeviceInfo.getApiLevel();
    const isMotionAuthNeeded = apiLevel >= 29;
    let motionAuthorized: 'unavailable' | 'denied' | 'blocked' | 'granted' =
      RESULTS.UNAVAILABLE;

    if (isMotionAuthNeeded) {
      motionAuthorized = await request(
        PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION,
      );
    }

    if (!isMotionAuthNeeded || motionAuthorized === RESULTS.GRANTED) {
      const authorized: boolean = await RNFitnessTracker.authorize();
      return { authorized, shouldOpenAppSettings: false };
    } else {
      return { authorized: false, shouldOpenAppSettings: true };
    }
  }
};

/**
 * Returns number of steps today
 * @return {Promise<number>}
 */
const getStepsToday = async (): Promise<number> => {
  if (isIOS) {
    const total = await RNHealthTracker.getStatisticTotalForToday(HealthDataTypes.StepCount, UnitTypes.count);
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
    const total = await RNHealthTracker.getStatisticTotalForWeek(HealthDataTypes.StepCount, UnitTypes.count);
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
    return RNHealthTracker.getStatisticWeekDaily(HealthDataTypes.StepCount, UnitTypes.count);
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
    stepsDaily = await RNHealthTracker.getStatisticWeekDaily(HealthDataTypes.StepCount, UnitTypes.count);
  } else {
    stepsDaily = await RNFitnessTracker.getStepsDaily();
  }

  let stepsToday = 0;

  if(isObject(stepsDaily)) {
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
    const total = await RNHealthTracker.getStatisticTotalForToday(HealthDataTypes.DistanceWalkingRunning, UnitTypes.meters);
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
    const total = await RNHealthTracker.getStatisticTotalForWeek(HealthDataTypes.DistanceWalkingRunning, UnitTypes.meters);
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
    return RNHealthTracker.getStatisticWeekDaily(HealthDataTypes.DistanceWalkingRunning, UnitTypes.meters);
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
    distanceDaily = await RNHealthTracker.getStatisticWeekDaily(HealthDataTypes.DistanceWalkingRunning, UnitTypes.meters);
  } else {
    distanceDaily = await RNFitnessTracker.getDistanceDaily();
  }

  let distanceToday = 0;

  if(isObject(distanceDaily)) {
    const today = Object.keys(distanceDaily).sort()[6];
    distanceToday = distanceDaily?.[today];
  }

  return { distanceToday, distanceDaily: distanceDaily || {} };
};

export const FitnessTrackerAPI = {
  getStepsToday,
  getStepsWeekTotal,
  getStepsDaily,
  getStepsData,
  getDistanceToday,
  getDistanceWeekTotal,
  getDistanceDaily,
  getDistanceData,
  isTrackingAvailable,
  setupTracking,
};
