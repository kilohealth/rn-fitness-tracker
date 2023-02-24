import { NativeModules } from 'react-native';

import { HealthKitDataType, HealthKitUnitType } from '../../enums';
import { isIOS } from '../../utils';

/** @internal */
const { RNHealthTracker } = NativeModules;

/**
 * @param options.key e.g. `HealthKitDataType.Fiber`
 * @param options.unit e.g. `HealthKitUnitType.grams`
 * @param options.startDate Unix timestamp or Date for record start date.
 * @param options.endDate Unix timestamp or Date for record end date.
 *
 * @return Returns total for specified data type and unit for specified time frame
 */
export const queryTotal = async (options: {
  key: HealthKitDataType;
  unit: HealthKitUnitType;
  startDate: Date | number;
  endDate: Date | number;
}): Promise<{ [date: string]: number }> => {
  if (isIOS) {
    const { key, unit, startDate, endDate } = options;

    return RNHealthTracker.queryTotal(key, unit, +startDate, +endDate);
  }
};
