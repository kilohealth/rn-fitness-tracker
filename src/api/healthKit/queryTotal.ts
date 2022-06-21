import { NativeModules } from 'react-native';

import { HealthDataType, UnitType } from '../../enums';
import { isIOS } from '../../utils';

/** @internal */
const { RNHealthTracker } = NativeModules;

/**
 * Returns total for specified data type and unit for specified time frame
 *
 * @param options.key e.g. `HealthDataType.Fiber`
 * @param options.unit e.g. `UnitType.grams`
 * @param options.startDate Unix timestamp or Date for record start date.
 * @param options.endDate Unix timestamp or Date for record end date.
 */
export const queryTotal = async (options: {
  key: HealthDataType;
  unit: UnitType;
  startDate: Date | number;
  endDate: Date | number;
}): Promise<{ [date: string]: number }> => {
  if (isIOS) {
    const { key, unit, startDate, endDate } = options;
    return RNHealthTracker.queryTotal(key, unit, +startDate, +endDate);
  }
};
