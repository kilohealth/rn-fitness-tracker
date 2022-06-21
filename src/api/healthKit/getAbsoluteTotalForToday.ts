import { NativeModules } from 'react-native';

import { HealthDataType, UnitType } from '../../enums';
import { isIOS } from '../../utils';

/** @internal */
const { RNHealthTracker } = NativeModules;

/**
 * Gets absolute total for given health data type and unit for current day
 * @param options.key {HealthDataType} e.g. `HealthDataType.Fiber`
 * @param options.unit {UnitType} e.g. `UnitType.grams`
 */
export const getAbsoluteTotalForToday = async (options: {
  key: HealthDataType;
  unit: UnitType;
}): Promise<number> => {
  if (isIOS) {
    const { key, unit } = options;
    const total = await RNHealthTracker.getAbsoluteTotalForToday(key, unit);
    return Number(total);
  }
};
