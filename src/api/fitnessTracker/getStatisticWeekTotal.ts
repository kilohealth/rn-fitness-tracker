import { NativeModules } from 'react-native';

import { FitnessDataType } from '../../types';
import { getDataTypeForHealthKit, isIOS } from '../../utils';
import { HealthKit } from '../..';

/** @internal */
const { RNFitnessTracker } = NativeModules;

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
    return RNFitnessTracker.getStatisticWeekTotal(dataType);
  }
};
