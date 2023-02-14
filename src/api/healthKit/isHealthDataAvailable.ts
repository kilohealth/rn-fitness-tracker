import { NativeModules } from 'react-native';

import { isIOS } from '../../utils';

/** @internal */
const { RNHealthTracker } = NativeModules;

/**
 * Returns a Boolean value that indicates whether HealthKit is available on this device.
 * **`note`** HealthKit is not available on iPad.
 *
 * @return Returns true if HealthKit is available; otherwise, false.
 */
export const isHealthDataAvailable = async (): Promise<boolean> => {
  if (isIOS) {
    const response = await RNHealthTracker.isHealthDataAvailable();

    return !!response;
  }
};
