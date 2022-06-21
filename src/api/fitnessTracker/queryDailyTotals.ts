import { NativeModules } from 'react-native';

import { DailyData, FitnessDataType } from '../../types';
import { getDataTypeForHealthKit, isIOS } from '../../utils';
import { HealthKit } from '../..';

/** @internal */
const { RNFitnessTracker } = NativeModules;

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
    return RNFitnessTracker.queryDailyTotals(dataType, +startDate, +endDate);
  }
};
