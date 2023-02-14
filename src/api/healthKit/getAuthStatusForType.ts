import { NativeModules } from 'react-native';

import { HealthKitDataType } from '../../enums';
import { isIOS } from '../../utils';
import { HealthKitAuthStatus } from '../../types';

/** @internal */
const { RNHealthTracker } = NativeModules;

/**
 * Returns write (share) status for data type in Health API.
 * @param key e.g. `HealthKitDataType.Fiber`
 *
 * @return {Promise<HealthKitAuthStatus>} 0 - NotDetermined, 1 - Denied, 2 - Authorized
 */
export const getAuthStatusForType = async (
  key: HealthKitDataType,
): Promise<HealthKitAuthStatus> => {
  if (isIOS) {
    return RNHealthTracker.getAuthorizationStatusForType(key);
  }
};
