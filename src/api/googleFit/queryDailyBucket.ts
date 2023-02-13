import { NativeModules } from 'react-native';

import { DailyBucket, FitnessDataType } from '../../types';
import { isIOS } from '../../utils';

/** @internal */
const { RNFitnessTracker } = NativeModules;

type Response = Record<string, DailyBucket[]>;

/**
 * Gets statistic daily total for specified time period.
 *
 * @param dataType e.g. `FitnessDataType.Steps`
 * @param startDate Unix timestamp or Date for record start date.
 * @param endDate Unix timestamp or Date for record end date.
 * @param bucketUnit Optional bucket unit default to DAY
 */
export const queryDailyBucket = async (
  dataType: FitnessDataType,
  startDate: Date | number,
  endDate: Date | number,
  bucketUnit: String,
): Promise<Response> => {
  if (!isIOS) {
    return RNFitnessTracker.queryDailyBucket(
      dataType,
      +startDate,
      +endDate,
      bucketUnit,
    );
  }
};
