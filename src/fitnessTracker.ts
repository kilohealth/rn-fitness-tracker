import { NativeModules } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import { IStepTrackerData, IStepTrackerStatus, IWeekDailySteps } from './types';

const { RNFitnessTracker } = NativeModules;

const iosAuthorizationStatusCheck = (status: string): IStepTrackerStatus => {
  if (status === 'authorized') {
    return { authorized: true, shouldOpenAppSettings: false };
  } else if (status === 'notDetermined') {
    if (global.__DEV__ && DeviceInfo.isEmulatorSync()) {
      return { authorized: true, shouldOpenAppSettings: false };
    }
    return { authorized: false, shouldOpenAppSettings: false };
  } else {
    return { authorized: false, shouldOpenAppSettings: true };
  }
};

/**
 * `iOS only!` returns if step tracking is supported on device
 * @return {Promise<boolean>}
 */
const isStepTrackingSupported = (): Promise<boolean> =>
  new Promise(resolve => {
    RNFitnessTracker.isStepTrackingSupported((available: number) => {
      resolve(available ? true : false);
    });
  });

/**
 * Returns if step tracking is authorized and available on `Android`
 * @return {Promise<IStepTrackerStatus>}
 */
const isStepTrackingAvailableAndroid = (): Promise<IStepTrackerStatus> =>
  new Promise(resolve => {
    RNFitnessTracker.authorize((authorized: boolean) => {
      resolve({ authorized, shouldOpenAppSettings: false });
    });
  });

/**
 * Returns if step tracking is authorized and available on `iOS`
 * @return {Promise<IStepTrackerStatus>}
 */
const isStepTrackingAvailableIOS = (): Promise<IStepTrackerStatus> =>
  new Promise(resolve => {
    RNFitnessTracker.isAuthorizedToUseCoreMotion((status: string) => {
      resolve(iosAuthorizationStatusCheck(status));
    });
  });

/**
 * Returns if step tracking is authorized and available on both platforms
 * @return {Promise<IStepTrackerStatus>}
 */
const isStepTrackingAvailable = (): Promise<IStepTrackerStatus> =>
  new Promise(resolve => {
    if (global.isIOS) {
      RNFitnessTracker.isAuthorizedToUseCoreMotion((status: string) => {
        resolve(iosAuthorizationStatusCheck(status));
      });
    } else {
      RNFitnessTracker.authorize((authorized: boolean) => {
        resolve({ authorized, shouldOpenAppSettings: false });
      });
    }
  });

/**
 * Sets up step tracking and returns status
 * not supported iOS devices also return `trackingNotSupported: true` param inside the status object
 * @return {Promise<IStepTrackerStatus>}
 */
const setupStepTracking = (): Promise<IStepTrackerStatus> =>
  new Promise(resolve => {
    RNFitnessTracker.authorize((authorized: boolean) => {
      if (!global.isIOS) {
        resolve({ authorized, shouldOpenAppSettings: false });
      } else {
        if (authorized) {
          RNFitnessTracker.isAuthorizedToUseCoreMotion((status: string) => {
            resolve(iosAuthorizationStatusCheck(status));
          });
        } else {
          if (global.__DEV__ && DeviceInfo.isEmulatorSync()) {
            resolve({ authorized: true, shouldOpenAppSettings: false });
          }
          resolve({
            authorized: false,
            shouldOpenAppSettings: false,
            trackingNotSupported: true,
          });
        }
      }
    });
  });

/**
 * Returns number of steps today
 * @return {Promise<number>}
 */
const getStepsToday = (): Promise<number> =>
  new Promise(resolve => {
    if (global.__DEV__ && DeviceInfo.isEmulatorSync()) {
      resolve(420);
    }
    RNFitnessTracker.getStepsToday((steps: number) => {
      resolve(steps);
    });
  });

/**
 * Returns number of steps this week
 * @return {Promise<Number>}
 */
const getStepsThisWeek = (): Promise<number> =>
  new Promise(resolve => {
    RNFitnessTracker.getWeekData((steps: number) => {
      resolve(steps);
    });
  });

/**
 * Returns weekly steps object
 * @return {Promise<IWeekDailySteps>}
 */
const getWeeklySteps = (): Promise<IWeekDailySteps> =>
  new Promise(resolve => {
    RNFitnessTracker.getDailyWeekData((data: IWeekDailySteps) => {
      resolve(data);
    });
  });

/**
 * Returns steps today and this week steps object
 * on `iOS simulator` returns mock data
 * @return {Promise<IStepTrackerData>}
 */
const getSteps = (): Promise<IStepTrackerData> =>
  new Promise(resolve => {
    // Return mock data if device is iOS simulator
    if (global.__DEV__ && DeviceInfo.isEmulatorSync()) {
      resolve({
        stepsToday: 17771,
        stepsThisWeek: {
          '2020-01-21': 7770,
          '2020-01-22': 5000,
          '2020-01-23': 1200,
          '2020-01-24': 13210,
          '2020-01-25': 17771,
        },
      });
    } else {
      RNFitnessTracker.getStepsToday((steps: number) => {
        RNFitnessTracker.getDailyWeekData((data: IWeekDailySteps) => {
          if (data) {
            resolve({ stepsToday: steps, stepsThisWeek: data });
          } else {
            resolve({ stepsToday: steps, stepsThisWeek: {} });
          }
        });
      });
    }
  });

export const FitnessTrackerAPI = {
  getSteps,
  getStepsThisWeek,
  getStepsToday,
  getWeeklySteps,
  isStepTrackingAvailable,
  isStepTrackingAvailableAndroid,
  isStepTrackingAvailableIOS,
  isStepTrackingSupported,
  setupStepTracking,
};
