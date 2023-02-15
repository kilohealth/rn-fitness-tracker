import { NativeModules } from 'react-native';
import {
  DailyData,
  FitnessDataType,
  GoogleFitDataType,
  GoogleFitWorkoutType,
} from '@kilohealth/rn-fitness-tracker';

import {
  handleAndroidMotionTrackingPermissions,
  isIOS,
  wrongPlatformErrorMessage,
} from '../utils';

/** @internal */
const { RNFitnessTracker } = NativeModules;

/**
 * Sets up GoogleFit tracking and returns status
 * @param shareTypes e.g. `[GoogleFitDataType.Steps]`
 * @param readTypes e.g. `[GoogleFitDataType.Steps]`
 *
 * @return Returns status of authentication.
 */
export const authorize = async (
  shareTypes: GoogleFitDataType[],
  readTypes: GoogleFitDataType[],
): Promise<boolean> => {
  if (!isIOS) {
    let motionAuthResult = await handleAndroidMotionTrackingPermissions(true);

    if (motionAuthResult) {
      motionAuthResult = await RNFitnessTracker.authorize(
        readTypes,
        shareTypes,
      );
    }

    return motionAuthResult;
  }

  throw new Error(wrongPlatformErrorMessage('authorize'));
};

/**
 * Deletes all workouts for given time period.
 *
 * @param startDate Unix timestamp or Date for start date.
 * @param endDate Unix timestamp or Date for end date.
 *
 * @return Returns status if no errors occurred.
 */
export const deleteWorkouts = async (
  startDate: Date | number,
  endDate: Date | number,
): Promise<boolean> => {
  if (!isIOS) {
    return RNFitnessTracker.deleteWorkouts(Number(startDate), Number(endDate));
  }

  throw new Error(wrongPlatformErrorMessage('authorize'));
};

/**
 * This method currently works with dataTypes: `Weight`, `Height`.
 *
 * Returns the latest record for specified data type.
 * @param dataType e.g. `FitnessDataType.Weight`
 */
export const getLatestDataRecord = async (
  dataType: FitnessDataType,
): Promise<number | null> => {
  if (!isIOS) {
    return RNFitnessTracker.getLatestDataRecord(dataType);
  }

  throw new Error(wrongPlatformErrorMessage('authorize'));
};

/**
 * Gets statistic total for given data type for current day.
 */
export const getStatisticTodayTotal = async (
  dataType: FitnessDataType,
): Promise<number> => {
  if (!isIOS) {
    return RNFitnessTracker.getStatisticTodayTotal(dataType);
  }

  throw new Error(wrongPlatformErrorMessage('authorize'));
};

/**
 * Gets statistic daily total for current week of given data type.
 */
export const getStatisticWeekDaily = async (
  dataType: FitnessDataType,
): Promise<DailyData> => {
  if (!isIOS) {
    return RNFitnessTracker.getStatisticWeekDaily(dataType);
  }

  throw new Error(wrongPlatformErrorMessage('authorize'));
};

/**
 * Gets statistic accumulated total for current week of given data type.
 */
export const getStatisticWeekTotal = async (
  dataType: FitnessDataType,
): Promise<number> => {
  if (!isIOS) {
    return RNFitnessTracker.getStatisticWeekTotal(dataType);
  }

  throw new Error(wrongPlatformErrorMessage('authorize'));
};

/**
 * Returns if specific permission is authorized and available on Android
 * If permissions are authorized, it will enable google fit.
 * @param readTypes - List of read permissions to check if tracking is available
 * @param shareTypes - List of write permissions to check if tracking is available
 */
export const isTrackingAvailable = async (
  readTypes: GoogleFitDataType[],
  shareTypes: GoogleFitDataType[],
): Promise<boolean> => {
  if (!isIOS) {
    let motionAuthResult = await handleAndroidMotionTrackingPermissions(false);

    if (motionAuthResult) {
      motionAuthResult = await RNFitnessTracker.isTrackingAvailable(
        readTypes,
        shareTypes,
      );
    }

    return motionAuthResult;
  }

  throw new Error(wrongPlatformErrorMessage('authorize'));
};

/**
 * Gets statistic daily total for specified time period.
 *
 * @param dataType e.g. `FitnessDataType.Steps`
 * @param startDate Unix timestamp or Date for record start date.
 * @param endDate Unix timestamp or Date for record end date.
 */
export const queryDailyTotals = async (
  dataType: FitnessDataType,
  startDate: Date | number,
  endDate: Date | number,
): Promise<DailyData> => {
  if (!isIOS) {
    return RNFitnessTracker.queryDailyTotals(
      dataType,
      Number(startDate),
      Number(endDate),
    );
  }

  throw new Error(wrongPlatformErrorMessage('authorize'));
};

/**
 * Gets statistic accumulated total for specified time period of given data type.
 *
 * @param dataType e.g. `FitnessDataType.Steps`
 * @param startDate Unix timestamp or Date for record start date.
 * @param endDate Unix timestamp or Date for record end date.
 */
export const queryTotal = async (
  dataType: FitnessDataType,
  startDate: Date | number,
  endDate: Date | number,
): Promise<number> => {
  if (!isIOS) {
    return RNFitnessTracker.queryTotal(
      dataType,
      Number(startDate),
      Number(endDate),
    );
  }

  throw new Error(wrongPlatformErrorMessage('authorize'));
};

/**
 * Records given workout data to GoogleFit API
 *
 * @param options.key Activity key e.g. `GoogleFitWorkoutType.Running`
 * @param options.name Activity name.
 * @param options.identifier Activity identifier.
 * @param options.startDate Unix timestamp or Date for record start date.
 * @param options.endDate Unix timestamp or Date for record end date.
 * @param options.description Activity description.
 * @param options.calories Activity calories.
 * @param options.steps Activity steps.
 *
 * @return Returns status if no errors occurred.
 */
export const writeWorkout = async (options: {
  key: GoogleFitWorkoutType;
  name: string;
  identifier: string;
  startDate: Date | number;
  endDate: Date | number;
  description?: string;
  calories?: number;
  steps?: number;
}): Promise<boolean> => {
  if (!isIOS) {
    Object.keys(options).forEach((key: string) =>
      options[key as keyof typeof options] === undefined
        ? delete options[key as keyof typeof options]
        : {},
    );

    return RNFitnessTracker.writeWorkout(
      Number(options.startDate),
      Number(options.endDate),
      options,
    );
  }

  throw new Error(wrongPlatformErrorMessage('authorize'));
};
