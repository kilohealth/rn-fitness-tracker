import { NativeModules } from 'react-native';

import { HealthDataType, UnitType } from '../../enums';
import { isIOS } from '../../utils';
import { HealthDataRecordQuery } from '../../types';

/** @internal */
const { RNHealthTracker } = NativeModules;

/**
 * Returns every record for specified data type and unit for specified time frame
 * @param options.key e.g. `HealthDataType.Fiber`
 * @param options.unit e.g. `UnitType.grams`
 * @param options.startDate Unix timestamp or Date for record start date.
 * @param options.endDate Unix timestamp or Date for record end date.
 */
export const queryDataRecords = async (options: {
  key: HealthDataType;
  unit: UnitType;
  startDate: Date | number;
  endDate: Date | number;
}): Promise<HealthDataRecordQuery> => {
  if (isIOS) {
    const { key, unit, startDate, endDate } = options;
    return RNHealthTracker.queryDataRecords(key, unit, +startDate, +endDate);
  }
};
