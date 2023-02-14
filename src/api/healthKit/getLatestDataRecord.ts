import { NativeModules } from 'react-native';

import { HealthKitDataType, HealthKitUnitType } from '../../enums';
import { isIOS } from '../../utils';
import { HealthDataRecord } from '../../types';

/** @internal */
const { RNHealthTracker } = NativeModules;

/**
 * @param options.key e.g. `HealthKitDataType.Fiber`
 * @param options.unit e.g. `HealthKitUnitType.grams`
 *
 * @return Returns the latest record for specified data type and unit.
 */
export const getLatestDataRecord = async (options: {
  key: HealthKitDataType;
  unit: HealthKitUnitType;
}): Promise<HealthDataRecord> => {
  if (isIOS) {
    const { key, unit } = options;

    return RNHealthTracker.getLatestDataRecord(key, unit);
  }
};
