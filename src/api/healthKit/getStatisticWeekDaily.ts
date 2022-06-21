import { NativeModules } from 'react-native';

import { DailyData } from '../../types';
import { HealthDataType, UnitType } from '../../enums';
import { isIOS } from '../../utils';

/** @internal */
const { RNHealthTracker } = NativeModules;

/**
 * Gets statistic daily total for given health data type and unit for current week, same number as in health app
 * @param options.key {HealthDataType} e.g. `HealthDataType.Fiber`
 * @param options.unit {UnitType} e.g. `UnitType.grams`
 */
export const getStatisticWeekDaily = async (options: {
  key: HealthDataType;
  unit: UnitType;
}): Promise<DailyData> => {
  if (isIOS) {
    const { key, unit } = options;
    return RNHealthTracker.getStatisticWeekDaily(key, unit);
  }
};
