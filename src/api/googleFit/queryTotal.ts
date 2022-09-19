import { NativeModules } from 'react-native';

import { FitnessDataType } from '../../types';
import { isIOS } from '../../utils';

/** @internal */
const { RNGoogleFit } = NativeModules;

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
    return RNGoogleFit.queryTotal(dataType, +startDate, +endDate);
  }
};
