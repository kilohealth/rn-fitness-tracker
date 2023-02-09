import { NativeModules } from 'react-native';

import { HealthKitDataType, HealthKitUnitType } from '../../enums';
import { isIOS } from '../../utils';

/** @internal */
const { RNHealthTracker } = NativeModules;

/**
 * Gets statistic total for given health data type and unit for current day, same number as in health app
 * @param options.key {HealthKitDataType} e.g. `HealthKitDataType.Fiber`
 * @param options.unit {HealthKitUnitType} e.g. `HealthKitUnitType.grams`
 */
export const getStatisticTotalForToday = async (options: {
  key: HealthKitDataType;
  unit: HealthKitUnitType;
}): Promise<number | undefined> => {
  if (isIOS) {
    const { key, unit } = options;
    const total = await RNHealthTracker.getStatisticTotalForToday(key, unit);

    return Number(total);
  }
};
