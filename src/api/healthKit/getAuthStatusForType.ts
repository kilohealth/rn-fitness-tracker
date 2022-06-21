import { NativeModules } from 'react-native';

import { HealthDataType } from '../../enums';
import { isIOS } from '../../utils';
import { HealthKitAuthStatus } from '../../types';

/** @internal */
const { RNHealthTracker } = NativeModules;

/**
 * Returns write (share) status for data type in Health API.
 * @param key {HealthDataType} e.g. `HealthDataType.Fiber`
 * @return {Promise<HealthKitAuthStatus>} 0 - NotDetermined, 1 - Denied, 2 - Authorized
 */
export const getAuthStatusForType = async (
  key: HealthDataType,
): Promise<HealthKitAuthStatus> => {
  if (isIOS) {
    return await RNHealthTracker.getAuthorizationStatusForType(key);
  }
};
