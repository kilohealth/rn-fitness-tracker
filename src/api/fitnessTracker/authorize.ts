import { AuthorizationPermissions } from '../../types';
import { GoogleFit, HealthKit } from '../..';
import { GoogleFitDataTypes, HealthDataType } from '../../enums';
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
    const readTypes: HealthDataType[] = permissions.healthReadPermissions || [];
    const shareTypes: HealthDataType[] =
      permissions.healthWritePermissions || [];

    return await HealthKit.authorize(shareTypes, readTypes);
  } else {
    const readTypes: GoogleFitDataTypes[] =
      permissions.googleFitReadPermissions || [];
    const shareTypes: GoogleFitDataTypes[] =
      permissions.googleFitWritePermissions || [];

    return await GoogleFit.authorize(shareTypes, readTypes);
  }
};
