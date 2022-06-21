import { NativeModules } from 'react-native';

import { GoogleFitDataTypes } from '../../enums';
import { handleAndroidMotionTrackingPermissions, isIOS } from '../../utils';

/** @internal */
const { RNFitnessTracker } = NativeModules;

/**
 * Returns if specific permission is authorized and available on Android
 * @param permissions - List of permissions to check if tracking is available
 * @platform Android
 */
export const isTrackingAvailableAndroid = async (
  permissions: GoogleFitDataTypes[],
): Promise<boolean> => {
  if (!isIOS) {
    let motionAuthResult = await handleAndroidMotionTrackingPermissions(false);
    if (motionAuthResult) {
      motionAuthResult = await RNFitnessTracker.isTrackingAvailable(
        permissions,
      );
    }

    return motionAuthResult;
  }
};
