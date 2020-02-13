import { NativeModules } from 'react-native';

import asyncStorage from './helpers/asyncStorage';

const { RNFitnessTracker } = NativeModules;

interface IStepTrackerStatus {
  authorized: boolean;
  shouldOpenAppSettings: boolean;
}

interface IWeekDailySteps {
  [key: string]: number;
}

interface IStepTrackerData {
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

export const isStepTrackingAvailableAndroid = (): Promise<any> =>
  new Promise(resolve => {
    asyncStorage
      .getFromAsyncStorage('fitnessTrackerAuthorized')
      .then((stepAuthorizationStatus: boolean) => {
        if (stepAuthorizationStatus) {
          resolve({ authorized: true, shouldOpenAppSettings: false });
        } else {
          resolve({ authorized: false, shouldOpenAppSettings: false });
        }
      });
  }).then(res => res);

export const isStepTrackingAvailableIOS = (): Promise<IStepTrackerStatus> =>
  new Promise(resolve => {
    RNFitnessTracker.isAuthorizedToUseCoreMotion((status: string) => {
      resolve(iosAuthorizationStatusCheck(status));
    });
  });

export const setupStepTracking = (): Promise<IStepTrackerStatus> =>
  new Promise(resolve => {
    RNFitnessTracker.authorize((authorized: boolean) => {
      if (!global.isIOS) {
        resolve({ authorized, shouldOpenAppSettings: false });
      } else {
        RNFitnessTracker.isAuthorizedToUseCoreMotion((status: string) => {
          resolve(iosAuthorizationStatusCheck(status));
        });
      }
    });
  });

export const getStepsToday = (): Promise<number> =>
  new Promise(resolve => {
    RNFitnessTracker.getStepsToday((steps: number) => {
      resolve(steps);
    });
  });

export const getStepsThisWeek = (): Promise<number> =>
  new Promise(resolve => {
    RNFitnessTracker.getWeekData((steps: number) => {
      resolve(steps);
    });
  });

export const getWeeklySteps = (): Promise<IWeekDailySteps> =>
  new Promise(resolve => {
    RNFitnessTracker.getDailyWeekData((data: IWeekDailySteps) => {
      resolve(data);
    });
  });

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
