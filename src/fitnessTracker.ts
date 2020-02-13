import { NativeModules } from 'react-native';

const { RNFitnessTracker } = NativeModules;

export interface IStepTrackerStatus {
  authorized: boolean;
  shouldOpenAppSettings: boolean;
  trackingNotSupported?: boolean;
}

export interface IWeekDailySteps {
  [key: string]: number;
}

export interface IStepTrackerData {
  stepsToday: number;
  stepsThisWeek: IWeekDailySteps;
}

const iosAuthorizationStatusCheck = (status: string): IStepTrackerStatus => {
  if (status === 'authorized') {
    return { authorized: true, shouldOpenAppSettings: false };
  } else if (status === 'notDetermined') {
    return { authorized: false, shouldOpenAppSettings: false };
  } else {
    return { authorized: false, shouldOpenAppSettings: true };
  }
};

/**
 * `iOS only!` returns if step tracking is supported on device
 * @return {Promise<boolean>}
 */
export const isStepTrackingSupported = (): Promise<boolean> =>
  new Promise(resolve => {
    RNFitnessTracker.isStepTrackingSupported((available: number) => {
      resolve(available ? true : false);
    });
  });

/**
 * Returns if step tracking is authorized and available on `Android`
 * @return {Promise<IStepTrackerStatus>}
 */
export const isStepTrackingAvailableAndroid = (): Promise<IStepTrackerStatus> =>
  new Promise(resolve => {
    RNFitnessTracker.authorize((authorized: boolean) => {
      resolve({ authorized, shouldOpenAppSettings: false });
    });
  });

/**
 * Returns if step tracking is authorized and available on `iOS`
 * @return {Promise<IStepTrackerStatus>}
 */
export const isStepTrackingAvailableIOS = (): Promise<IStepTrackerStatus> =>
  new Promise(resolve => {
    RNFitnessTracker.isAuthorizedToUseCoreMotion((status: string) => {
      resolve(iosAuthorizationStatusCheck(status));
    });
  });

/**
 * Returns if step tracking is authorized and available on both platforms
 * @return {Promise<IStepTrackerStatus>}
 */
export const isStepTrackingAvailable = (): Promise<IStepTrackerStatus> =>
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
export const setupStepTracking = (): Promise<IStepTrackerStatus> =>
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
export const getStepsToday = (): Promise<number> =>
  new Promise(resolve => {
    RNFitnessTracker.getStepsToday((steps: number) => {
      resolve(steps);
    });
  });

/**
 * Returns number of steps this week
 * @return {Promise<Number>}
 */
export const getStepsThisWeek = (): Promise<number> =>
  new Promise(resolve => {
    RNFitnessTracker.getWeekData((steps: number) => {
      resolve(steps);
    });
  });

/**
 * Returns weekly steps object
 * @return {Promise<IWeekDailySteps>}
 */
export const getWeeklySteps = (): Promise<IWeekDailySteps> =>
  new Promise(resolve => {
    RNFitnessTracker.getDailyWeekData((data: IWeekDailySteps) => {
      resolve(data);
    });
  });

/**
 * Returns steps today and this week steps object
 * @return {Promise<IStepTrackerData>}
 */
export const getSteps = (): Promise<IStepTrackerData> =>
  new Promise(resolve => {
    RNFitnessTracker.getStepsToday((steps: number) => {
      RNFitnessTracker.getDailyWeekData((data: IWeekDailySteps) => {
        if (data) {
          resolve({ stepsToday: steps, stepsThisWeek: data });
        } else {
          resolve({ stepsToday: steps, stepsThisWeek: {} });
        }
      });
    });
  });
