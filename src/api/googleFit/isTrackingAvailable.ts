import { NativeModules } from 'react-native';

import { GoogleFitDataType } from '../../enums';
import { handleAndroidMotionTrackingPermissions, isIOS } from '../../utils';

/** @internal */
const { RNFitnessTracker } = NativeModules;

/**
 * Returns if specific permission is authorized and available on Android
 * If permissions are authorized, it will enable google fit.
 * @param readTypes - List of read permissions to check if tracking is available
 * @param shareTypes - List of write permissions to check if tracking is available
 */
export const isTrackingAvailable = async (
  readTypes: GoogleFitDataType[],
  shareTypes: GoogleFitDataType[],
): Promise<boolean> => {
  if (!isIOS) {
    let motionAuthResult = await handleAndroidMotionTrackingPermissions(false);

    if (motionAuthResult) {
      motionAuthResult = await RNFitnessTracker.isTrackingAvailable(
        readTypes,
        shareTypes,
      );
    }

    return motionAuthResult;
  }
};
