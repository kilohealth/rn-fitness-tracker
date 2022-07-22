import { NativeModules } from 'react-native';

import { GoogleFitDataTypes } from '../../enums';
import { handleAndroidMotionTrackingPermissions, isIOS } from '../../utils';

/** @internal */
const { RNFitnessTracker } = NativeModules;

/**
 * Sets up GoogleFit tracking and returns status
 * @param shareTypes e.g. `[GoogleFitDataTypes.Steps]`
 * @param readTypes e.g. `[GoogleFitDataTypes.Steps]`
 *
 * @return Returns status of authentication.
 */
export const authorize = async (
  shareTypes: GoogleFitDataTypes[],
  readTypes: GoogleFitDataTypes[],
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
