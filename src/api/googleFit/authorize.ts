import { NativeModules } from 'react-native';

import { GoogleFitDataType } from '../../enums';
import { handleAndroidMotionTrackingPermissions, isIOS } from '../../utils';

/** @internal */
const { RNFitnessTracker } = NativeModules;

/**
 * Sets up GoogleFit tracking and returns status
 * @param shareTypes e.g. `[GoogleFitDataType.Steps]`
 * @param readTypes e.g. `[GoogleFitDataType.Steps]`
 *
 * @return Returns status of authentication.
 */
export const authorize = async (
  shareTypes: GoogleFitDataType[],
  readTypes: GoogleFitDataType[],
): Promise<boolean> => {
  if (!isIOS) {
    let motionAuthResult = await handleAndroidMotionTrackingPermissions(true);

    if (motionAuthResult) {
      motionAuthResult = await RNFitnessTracker.authorize(
        readTypes,
        shareTypes,
      );
    }

    return motionAuthResult;
  }
};
