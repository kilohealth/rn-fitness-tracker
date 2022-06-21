import { NativeModules } from 'react-native';

import { AuthorizationPermissions } from '../../types';
import { GoogleFitDataTypes, HealthDataType } from '../../enums';
import { handleAndroidMotionTrackingPermissions, isIOS } from '../../utils';
import { HealthKit } from '../..';

/** @internal */
const { RNFitnessTracker } = NativeModules;

/**
 * Authorize tracking for provided permissions.
 * @param permissions List of permissions to track.
 * @return
 * For `iOS` returns true if errors did not occur.
 *
 * For `Android` returns true if user gave permission access.
 */
export const authorize = async (
  permissions: AuthorizationPermissions,
): Promise<boolean> => {
  if (isIOS) {
    const readTypes: HealthDataType[] = permissions.healthReadPermissions || [];
    const shareTypes: HealthDataType[] =
      permissions.healthWritePermissions || [];

    return await HealthKit.authorize(shareTypes, readTypes);
  } else {
    let motionAuthResult = await handleAndroidMotionTrackingPermissions(true);
    if (motionAuthResult) {
      const readTypes: GoogleFitDataTypes[] =
        permissions.googleFitReadPermissions || [];
      motionAuthResult = await RNFitnessTracker.authorize(readTypes);
    }

    return motionAuthResult;
  }
};
