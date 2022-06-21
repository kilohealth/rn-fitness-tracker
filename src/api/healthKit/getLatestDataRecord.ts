import { NativeModules } from 'react-native';

import { HealthDataType, UnitType } from '../../enums';
import { isIOS } from '../../utils';
import { HealthDataRecordQuery } from '../../types';

/** @internal */
const { RNHealthTracker } = NativeModules;

/**
 * Returns the latest record for specified data type and unit.
 * @param options.key e.g. `HealthDataType.Fiber`
 * @param options.unit e.g. `UnitType.grams`
 */
export const getLatestDataRecord = async (options: {
  key: HealthDataType;
  unit: UnitType;
}): Promise<HealthDataRecordQuery> => {
  if (isIOS) {
    const { key, unit } = options;
    return RNHealthTracker.getLatestDataRecord(key, unit);
  }
};
