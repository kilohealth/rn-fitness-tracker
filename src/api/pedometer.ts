import { NativeModules } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';

import { mockData } from '../utils/mockData';
import {
  IDistanceDaily,
  IDistanceData,
  IFitnessTrackerAvailability,
  IFitnessTrackerStatus,
  IFloorsDaily,
  IFloorsData,
  IStepsDaily,
  IStepsData,
} from '../types/fitnessTypes';
import { isIOS } from '../utils/helpers';

const { RNFitnessTracker } = NativeModules;

const isSimulator = __DEV__ && isIOS && DeviceInfo.isEmulatorSync();

const iosAuthorizationStatusCheck = (status: string): IFitnessTrackerStatus => {
  if (status === 'authorized') {
    return { authorized: true, shouldOpenAppSettings: false };
  } else if (status === 'notDetermined') {
    if (isSimulator) {
      return { authorized: true, shouldOpenAppSettings: false };
    }
    return { authorized: false, shouldOpenAppSettings: false };
  } else {
    return { authorized: false, shouldOpenAppSettings: true };
  }
};

/**
 * @module PedometerAPI
 */

/**
 * `iOS only!` returns if step, distance and floor tracking is supported on device
 * equals to 1 if supported or 0 if not.
 * @return {Promise<IFitnessTrackerAvailability>}
 */
const isTrackingSupportedIOS = async (): Promise<IFitnessTrackerAvailability> => {
  const response = await RNFitnessTracker.isTrackingSupported();
  return { steps: response[0], distance: response[1], floors: response[2] };
};

/**
 * Returns if step tracking is authorized and available on both platforms
 * @return {Promise<IFitnessTrackerStatus>}
 */
const isTrackingAvailable = async (): Promise<IFitnessTrackerStatus> => {
  if (isIOS) {
    const status: string = await RNFitnessTracker.isAuthorizedToUseCoreMotion();
    return iosAuthorizationStatusCheck(status);
  } else {
    const authorized: boolean = await RNFitnessTracker.isTrackingAvailable();
    return { authorized, shouldOpenAppSettings: false };
  }
};

/**
 * Sets up step tracking and returns status
 * not supported iOS devices also return `trackingNotSupported: true` param inside the status object
 * @return {Promise<IFitnessTrackerStatus>}
 */
const setupTracking = async (): Promise<IFitnessTrackerStatus> => {
  if (!isIOS) {
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
  } else {
    const authorized: boolean = await RNFitnessTracker.authorize();
    if (authorized) {
      const status: string = await RNFitnessTracker.isAuthorizedToUseCoreMotion();
      return iosAuthorizationStatusCheck(status);
    } else {
      if (isSimulator) {
        return { authorized: true, shouldOpenAppSettings: false };
      }
      return {
        authorized: false,
        shouldOpenAppSettings: true,
      };
    }
  }
};

/**
 * Returns number of steps today
 * on `iOS simulator` returns mock data
 * @return {Promise<number>}
 */
const getStepsToday = async (): Promise<number> => {
  if (isSimulator) {
    return mockData.steps.stepsToday;
  }

  return RNFitnessTracker.getStepsToday();
};

/**
 * Returns number of steps this week
 * on `iOS simulator` returns mock data
 * @return {Promise<Number>}
 */
const getStepsWeekTotal = async (): Promise<number> => {
  if (isSimulator) {
    return mockData.stepsWeekTotal;
  }

  return RNFitnessTracker.getStepsWeekTotal();
};

/**
 * Returns weekly steps object
 * on `iOS simulator` returns mock data
 * @return {Promise<IWeekDailySteps>}
 */
const getStepsDaily = async (): Promise<IStepsDaily> => {
  if (isSimulator) {
    return mockData.steps.stepsDaily;
  }

  return RNFitnessTracker.getStepsDaily();
};

/**
 * Returns steps today and this week's steps object
 * on `iOS simulator` returns mock data
 * @return {Promise<IStepTrackerData>}
 */
const getStepsData = async (): Promise<IStepsData> => {
  if (isSimulator) {
    return mockData.steps;
  }

  const stepsToday: number = await RNFitnessTracker.getStepsToday();
  const stepsDaily: IStepsDaily = await RNFitnessTracker.getStepsDaily();

  return { stepsToday, stepsDaily: stepsDaily || {} };
};

/**
 * Returns walking and running distance today in meters
 * on `iOS simulator` returns mock data
 * @return {Promise<number>} number of meters
 */
const getDistanceToday = async (): Promise<number> => {
  if (isSimulator) {
    return mockData.distance.distanceToday;
  }

  return RNFitnessTracker.getDistanceToday();
};

/**
 * Returns walking and running distance this week in meters
 * on `iOS simulator` returns mock data
 * @return {Promise<Number>} number of meters
 */
const getDistanceWeekTotal = async (): Promise<number> => {
  if (isSimulator) {
    return mockData.distanceWeekTotal;
  }

  return RNFitnessTracker.getDistanceWeekTotal();
};

/**
 * Returns daily distance object
 * on `iOS simulator` returns mock data
 * @return {Promise<IDistanceDaily>}
 */
const getDistanceDaily = async (): Promise<IDistanceDaily> => {
  if (isSimulator) {
    return mockData.distance.distanceDaily;
  }

  return RNFitnessTracker.getDistanceDaily();
};

/**
 * Returns distance today and this week's distance object
 * on `iOS simulator` returns mock data
 * @return {Promise<IDistanceData>}
 */
const getDistanceData = async (): Promise<IDistanceData> => {
  if (isSimulator) {
    return mockData.distance;
  }

  const distanceToday: number = await RNFitnessTracker.getDistanceToday();
  const distanceDaily: IDistanceDaily = await RNFitnessTracker.getDistanceDaily();
  return { distanceToday, distanceDaily: distanceDaily || {} };
};

/**
 * Returns walking and running distance today in meters
 * on `iOS simulator` returns mock data
 * @return {Promise<number>} number of meters
 */
const getFloorsTodayIOS = async (): Promise<number> => {
  if (isSimulator) {
    return mockData.floors.floorsToday;
  }

  return RNFitnessTracker.getFloorsToday();
};

/**
 * Returns walking and running distance this week in meters
 * on `iOS simulator` returns mock data
 * @return {Promise<Number>} number of meters
 */
const getFloorsWeekTotalIOS = async (): Promise<number> => {
  if (isSimulator) {
    return mockData.floorsWeekTotal;
  }

  return RNFitnessTracker.getFloorsWeekTotal();
};
/**
 * Returns daily distance object
 * on `iOS simulator` returns mock data
 * @return {Promise<IFloorsDaily>}
 */
const getFloorsDailyIOS = async (): Promise<IFloorsDaily> => {
  if (isSimulator) {
    return mockData.floors.floorsDaily;
  }

  return RNFitnessTracker.getFloorsDistance();
};

/**
 * Returns distance today and this week's distance object
 * on `iOS simulator` returns mock data
 * @return {Promise<IFloorsData>}
 */
const getFloorsDataIOS = async (): Promise<IFloorsData> => {
  if (isSimulator) {
    return mockData.floors;
  }

  const floorsToday: number = await RNFitnessTracker.getFloorsToday();
  const floorsDaily: IFloorsDaily = await RNFitnessTracker.getFloorsWeekData();
  return { floorsToday, floorsDaily: floorsDaily || {} };
};

export const PedometerAPI = {
  getStepsToday,
  getStepsWeekTotal,
  getStepsDaily,
  getStepsData,
  getDistanceToday,
  getDistanceWeekTotal,
  getDistanceDaily,
  getDistanceData,
  getFloorsTodayIOS,
  getFloorsWeekTotalIOS,
  getFloorsDailyIOS,
  getFloorsDataIOS,
  isTrackingAvailable,
  isTrackingSupportedIOS,
  setupTracking,
};
