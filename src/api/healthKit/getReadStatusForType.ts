import { NativeModules } from 'react-native';

import { HealthDataType, UnitType } from '../../enums';
import { isIOS } from '../../utils';
import { HealthKitAuthStatus } from '../../types';

/** @internal */
const { RNHealthTracker } = NativeModules;

/**
 * @deprecated Might be deleted in future releases.
 *
 * Returns read status for data type in Health API.
 *
 * `WARNING`! This method is unofficial. Queries for data in time span of 2 years with limit of one.
 *
 * **`note`** Try to avoid using this method and try to track user permission status in internal state.
 *
 * @param options.key e.g. `HealthDataType.Fiber`
 * @param options.unit e.g. `HealthDataType.Fiber`
 * @return {Promise<HealthKitAuthStatus>}
 * 0 - if permissions was never requested.
 *
 * 1 - if no records were found. This could be if user never gave permissions or user has no records for this type.
 *
 * 2 - if records were found.
 */
export const getReadStatusForType = async (options: {
  key: HealthDataType;
  unit: UnitType;
}): Promise<HealthKitAuthStatus> => {
  if (isIOS) {
    const { key, unit } = options;
    return await RNHealthTracker.getReadStatus(key, unit);
  }
};
