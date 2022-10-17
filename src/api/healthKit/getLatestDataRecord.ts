import { NativeModules } from 'react-native';

import { HealthKitDataType, HealthKitUnitType } from '../../enums';
import { isIOS } from '../../utils';
import { HealthDataRecord } from '../../types';

/** @internal */
const { RNHealthTracker } = NativeModules;

/**
 * Returns the latest record for specified data type and unit.
 * @param options.key e.g. `HealthKitDataType.Fiber`
 * @param options.unit e.g. `HealthKitUnitType.grams`
 */
export const getLatestDataRecord = async (options: {
  key: HealthKitDataType;
  unit: HealthKitUnitType;
}): Promise<HealthDataRecord | undefined> => {
  if (isIOS) {
    const { key, unit } = options;

    return RNHealthTracker.getLatestDataRecord(key, unit);
  }
};
