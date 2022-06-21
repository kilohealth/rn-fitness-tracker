import { NativeModules } from 'react-native';

import { FitnessDataType } from '../../types';
import { getDataTypeForHealthKit, isIOS } from '../../utils';
import { HealthKit } from '../..';

/** @internal */
const { RNFitnessTracker } = NativeModules;

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
    return RNFitnessTracker.queryTotal(dataType, +startDate, +endDate);
  }
};
