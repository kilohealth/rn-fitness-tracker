import {
  AuthorizationPermissions,
  DailyData,
  FitnessDataType,
  TodayAndDailyData,
} from '../types';
import {
  getDataTypeForGoogleFit,
  getDataTypeForHealthKit,
  isIOS,
  isObject,
} from '../utils';
import { GoogleFitDataType, HealthKitDataType } from '../enums';

import * as HealthKit from './HealthKit';
import * as GoogleFit from './GoogleFit';

/**
 * Authorize tracking for provided permissions.
 * @param permissions List of permissions to track.
 * @return
 * For `iOS` returns true if errors did not occur.
 *
 * For `Android` returns true if user gave permission access.
 */
export const authorize = async (
  permissions: AuthorizationPermissions,
): Promise<boolean> => {
  if (isIOS) {
    const readTypes: HealthKitDataType[] =
      permissions.healthReadPermissions || [];
    const shareTypes: HealthKitDataType[] =
      permissions.healthWritePermissions || [];

    return HealthKit.authorize(shareTypes, readTypes);
  } else {
    const readTypes: GoogleFitDataType[] =
      permissions.googleFitReadPermissions || [];
    const shareTypes: GoogleFitDataType[] =
      permissions.googleFitWritePermissions || [];

    return GoogleFit.authorize(shareTypes, readTypes);
  }
};

/**
 * Returns steps total for today and this week's steps daily values.
 * @return {Promise<TodayAndDailyData>}
 */
export const getData = async (
  dataType: FitnessDataType,
): Promise<TodayAndDailyData> => {
  let daily: DailyData;

  if (isIOS) {
    const healthKitDataType = getDataTypeForHealthKit(dataType);

    daily = await HealthKit.getStatisticWeekDaily(healthKitDataType);
  } else {
    daily = await GoogleFit.getStatisticWeekDaily(dataType);
  }

  let today = 0;

  if (isObject(daily)) {
    today = daily?.[Object.keys(daily).sort()[6]];
  }

  return { today, daily: daily || {} };
};

/**
 * Returns the latest height value or null if height does not exist.
 */
export const getLatestHeight = async (): Promise<number | null> => {
  if (isIOS) {
    const healthKitDataType = getDataTypeForHealthKit(FitnessDataType.Height);

    const record = await HealthKit.getLatestDataRecord(healthKitDataType);

    if (!record) {
      return null;
    }

    return record.quantity;
  } else {
    return GoogleFit.getLatestDataRecord(FitnessDataType.Height);
  }
};

/**
 * Returns the latest weight value or null if weight does not exist.
 */
export const getLatestWeight = async (): Promise<number | null> => {
  if (isIOS) {
    const healthKitDataType = getDataTypeForHealthKit(FitnessDataType.Weight);

    const record = await HealthKit.getLatestDataRecord(healthKitDataType);

    if (!record) {
      return null;
    }

    return record.quantity;
  } else {
    return GoogleFit.getLatestDataRecord(FitnessDataType.Weight);
  }
};

/**
 * Gets statistic total for given data type for current day.
 */
export const getStatisticTodayTotal = async (
  dataType: FitnessDataType,
): Promise<number> => {
  if (isIOS) {
    const healthKitDataType = getDataTypeForHealthKit(dataType);

    const total = await HealthKit.getStatisticTotalForToday(healthKitDataType);

    return Number(total);
  } else {
    return GoogleFit.getStatisticTodayTotal(dataType);
  }
};

/**
 * Gets statistic daily total for current week of given data type.
 */
export const getStatisticWeekDaily = async (
  dataType: FitnessDataType,
): Promise<DailyData> => {
  if (isIOS) {
    const healthKitDataType = getDataTypeForHealthKit(dataType);

    return HealthKit.getStatisticWeekDaily(healthKitDataType);
  } else {
    return GoogleFit.getStatisticWeekDaily(dataType);
  }
};

/**
 * Gets statistic accumulated total for current week of given data type.
 */
export const getStatisticWeekTotal = async (
  dataType: FitnessDataType,
): Promise<number> => {
  if (isIOS) {
    const healthKitDataType = getDataTypeForHealthKit(dataType);

    const total = await HealthKit.getStatisticTotalForWeek(healthKitDataType);

    return Number(total);
  } else {
    return GoogleFit.getStatisticWeekTotal(dataType);
  }
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
  if (isIOS) {
    const healthKitDataType = getDataTypeForHealthKit(dataType);

    return HealthKit.queryDailyTotals({
      ...healthKitDataType,
      startDate,
      endDate,
    });
  } else {
    return GoogleFit.queryDailyTotals(dataType, startDate, endDate);
  }
};

/**
 * Gets statistic accumulated total  for specified time period of given data type.
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
  if (isIOS) {
    const healthKitDataType = getDataTypeForHealthKit(dataType);

    const total = await HealthKit.queryTotal({
      ...healthKitDataType,
      startDate,
      endDate,
    });

    return Number(total);
  } else {
    return GoogleFit.queryTotal(dataType, startDate, endDate);
  }
};

/**
 * UNSAFE method to check if fitness tracking is available.
 *
 * @platform Android
 * Returns if specific permission is authorized and available on Android
 *
 * @platform iOS
 * Checks if data record of this type exists in HealthKit.
 *
 * **`note`** For some data types, this method will return `false` even though permissions are allowed.
 * Because there might not be any records of that type in HealthKit.
 * This method should work fine with data types like `steps` because steps are always tracked in HealthKit.
 *
 * @param permission - List of permissions to check if tracking is available
 */
export const UNSAFE_isTrackingAvailable = async (
  permission: FitnessDataType,
): Promise<boolean> => {
  if (isIOS) {
    const healthKitDataType = getDataTypeForHealthKit(permission);

    let authorized = false;

    try {
      authorized = Boolean(
        await HealthKit.getLatestDataRecord(healthKitDataType),
      );
    } catch (error) {
      return false;
    }

    return authorized;
  } else {
    const googleFitDataType = getDataTypeForGoogleFit(permission);

    return GoogleFit.isTrackingAvailable([googleFitDataType], []);
  }
};
