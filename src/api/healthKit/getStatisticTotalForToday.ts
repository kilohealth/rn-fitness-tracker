import { NativeModules } from 'react-native';

import { HealthDataType, UnitType } from '../../enums';
import { isIOS } from '../../utils';

/** @internal */
const { RNHealthTracker } = NativeModules;

/**
 * Gets statistic total for given health data type and unit for current day, same number as in health app
 * @param options.key {HealthDataType} e.g. `HealthDataType.Fiber`
 * @param options.unit {UnitType} e.g. `UnitType.grams`
 */
export const getStatisticTotalForToday = async (options: {
  key: HealthDataType;
  unit: UnitType;
}): Promise<number> => {
  if (isIOS) {
    const { key, unit } = options;
    const total = await RNHealthTracker.getStatisticTotalForToday(key, unit);
    return Number(total);
  }
};
