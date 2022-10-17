import { AuthorizationPermissions } from '../../types';
import { GoogleFit, HealthKit } from '../..';
import { GoogleFitDataType, HealthKitDataType } from '../../enums';
import { isIOS } from '../../utils';

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
    const readTypes: HealthKitDataType[] =
      permissions.healthReadPermissions || [];
    const shareTypes: HealthKitDataType[] =
      permissions.healthWritePermissions || [];

    return HealthKit.authorize(shareTypes, readTypes);
  } else {
    const readTypes: GoogleFitDataType[] =
      permissions.googleFitReadPermissions || [];
    const shareTypes: GoogleFitDataType[] =
      permissions.googleFitWritePermissions || [];

    return GoogleFit.authorize(shareTypes, readTypes);
  }
};
