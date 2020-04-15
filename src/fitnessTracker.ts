import { NativeModules } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import { mockData } from './utils/mockData';
import {
  IDistanceDaily,
  IDistanceData,
  IFitnessTrackerAvailability,
  IFitnessTrackerStatus,
  IFloorsDaily,
  IFloorsData,
  IStepsDaily,
  IStepsData,
} from './types';

const { RNFitnessTracker } = NativeModules;

const isSimulator =
  global.__DEV__ && global.isIOS && DeviceInfo.isEmulatorSync();

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
 * @module TrackingSetup
 */

/**
 * `iOS only!` returns if step, distance and floor tracking is supported on device
 * equals to 1 if supported or 0 if not.
 * @return {Promise<IFitnessTrackerAvailability>}
 */
const isTrackingSupportedIOS = (): Promise<IFitnessTrackerAvailability> =>
  new Promise(resolve => {
    RNFitnessTracker.isTrackingSupported(
      (steps: number, distance: number, floors: number) => {
        resolve({ steps, distance, floors });
      },
    );
  });

/**
 * Returns if step tracking is authorized and available on both platforms
 * @return {Promise<IFitnessTrackerStatus>}
 */
const isTrackingAvailable = (): Promise<IFitnessTrackerStatus> =>
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
 * @return {Promise<IFitnessTrackerStatus>}
 */
const setupTracking = (): Promise<IFitnessTrackerStatus> =>
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
          if (isSimulator) {
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
 * @module StepTracking
 */

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
const getStepsWeekTotal = (): Promise<number> =>
  new Promise(resolve => {
    RNFitnessTracker.getStepsWeekTotal((steps: number) => {
      resolve(steps);
    });
  });

/**
 * Returns weekly steps object
 * @return {Promise<IWeekDailySteps>}
 */
const getStepsDaily = (): Promise<IStepsDaily> =>
  new Promise(resolve => {
    RNFitnessTracker.getStepsDaily((data: IStepsDaily) => {
      resolve(data);
    });
  });

/**
 * Returns steps today and this week's steps object
 * on `iOS simulator` returns mock data
 * @return {Promise<IStepTrackerData>}
 */
const getStepsData = (): Promise<IStepsData> =>
  new Promise(resolve => {
    if (isSimulator) {
      resolve(mockData.steps);
    } else {
      RNFitnessTracker.getStepsToday((stepsToday: number) => {
        RNFitnessTracker.getStepsDaily((stepsDaily: IStepsDaily) => {
          resolve({ stepsToday, stepsDaily: stepsDaily || {} });
        });
      });
    }
  });

/**
 * @module DistanceTracking
 */

/**
 * Returns walking and running distance today in meters
 * @return {Promise<number>} number of meters
 */
const getDistanceToday = (): Promise<number> =>
  new Promise(resolve => {
    RNFitnessTracker.getDistanceToday((distance: number) => {
      resolve(distance);
    });
  });

/**
 * Returns walking and running distance this week in meters
 * @return {Promise<Number>} number of meters
 */
const getDistanceWeekTotal = (): Promise<number> =>
  new Promise(resolve => {
    RNFitnessTracker.getDistanceWeekTotal((steps: number) => {
      resolve(steps);
    });
  });

/**
 * Returns daily distance object
 * @return {Promise<IDistanceDaily>}
 */
const getDistanceDaily = (): Promise<IDistanceDaily> =>
  new Promise(resolve => {
    RNFitnessTracker.getDistanceDaily((data: IDistanceDaily) => {
      resolve(data);
    });
  });

/**
 * Returns distance today and this week's distance object
 * on `iOS simulator` returns mock data
 * @return {Promise<IDistanceData>}
 */
const getDistanceData = (): Promise<IDistanceData> =>
  new Promise(resolve => {
    if (isSimulator) {
      resolve(mockData.distance);
    } else {
      RNFitnessTracker.getDistanceToday((distanceToday: number) => {
        RNFitnessTracker.getDistanceDaily((distanceDaily: IDistanceDaily) => {
          resolve({ distanceToday, distanceDaily: distanceDaily || {} });
        });
      });
    }
  });

/**
 * @module FloorTracking
 */

/**
 * Returns walking and running distance today in meters
 * @return {Promise<number>} number of meters
 */
const getFloorsTodayIOS = (): Promise<number> =>
  new Promise(resolve => {
    RNFitnessTracker.getDistanceToday((distance: number) => {
      resolve(distance);
    });
  });

/**
 * Returns walking and running distance this week in meters
 * @return {Promise<Number>} number of meters
 */
const getFloorsWeekTotalIOS = (): Promise<number> =>
  new Promise(resolve => {
    RNFitnessTracker.getDistanceWeekTotal((steps: number) => {
      resolve(steps);
    });
  });

/**
 * Returns daily distance object
 * @return {Promise<IFloorsDaily>}
 */
const getFloorsDailyIOS = (): Promise<IFloorsDaily> =>
  new Promise(resolve => {
    RNFitnessTracker.getWeeklyDistance((data: IFloorsDaily) => {
      resolve(data);
    });
  });

/**
 * Returns distance today and this week's distance object
 * on `iOS simulator` returns mock data
 * @return {Promise<IFloorsData>}
 */
const getFloorsDataIOS = (): Promise<IFloorsData> =>
  new Promise(resolve => {
    if (isSimulator) {
      resolve(mockData.floors);
    } else {
      RNFitnessTracker.getDistanceToday((floorsToday: number) => {
        RNFitnessTracker.getDailyWeekData((floorsDaily: IFloorsDaily) => {
          resolve({ floorsToday, floorsDaily: floorsDaily || {} });
        });
      });
    }
  });

export const FitnessTrackerAPI = {
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
