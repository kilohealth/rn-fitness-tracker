import { NativeModules } from 'react-native';

import { FitnessDataType } from '../../types';
import { isIOS } from '../../utils';

/** @internal */
const { RNFitnessTracker } = NativeModules;

/**
 * Gets statistic accumulated total for current week of given data type.
 */
export const getStatisticWeekTotal = async (
  dataType: FitnessDataType,
): Promise<number> => {
  if (!isIOS) {
    return RNFitnessTracker.getStatisticWeekTotal(dataType);
  }
};
