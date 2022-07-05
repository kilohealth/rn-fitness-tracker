import { GoogleFit } from '..';
import { GoogleFitDataTypes } from '../../enums';
import { isIOS } from '../../utils';

/**
 * Returns if specific permission is authorized and available on Android
 * @param permissions - List of permissions to check if tracking is available
 * @platform Android
 */
export const isTrackingAvailableAndroid = async (
  permissions: GoogleFitDataTypes[],
): Promise<boolean> => {
  if (!isIOS) {
    return await GoogleFit.isTrackingAvailable(permissions);
  }
};
