import { NativeModules } from 'react-native';

import { FitnessDataType } from '../../types';
import { isIOS, wrongPlatformErrorMessage } from '../../utils';

/** @internal */
const { RNFitnessTracker } = NativeModules;

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
