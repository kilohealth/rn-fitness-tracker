import { NativeModules } from 'react-native';

import { DailyData, FitnessDataType } from '../../types';
import { isIOS } from '../../utils';

/** @internal */
const { RNFitnessTracker } = NativeModules;

/**
 * Gets statistic daily total for current week of given data type.
 */
export const getStatisticWeekDaily = async (
  dataType: FitnessDataType,
): Promise<DailyData> => {
  if (!isIOS) {
    return RNFitnessTracker.getStatisticWeekDaily(dataType);
  }
};
