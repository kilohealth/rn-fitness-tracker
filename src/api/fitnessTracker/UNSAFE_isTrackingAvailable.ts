import { GoogleFit, HealthKit } from '..';
import {
  getDataTypeForGoogleFit,
  getDataTypeForHealthKit,
  isIOS,
} from '../../utils';
import { FitnessDataType } from '../../types';

/**
 * UNSAFE method to check if fitness tracking is available.
 *
 * @platform Android
 * Returns if specific permission is authorized and available on Android
 *
 * @platform iOS
 * Checks if data record of this type exists in HealthKit.
 *
 * **`note`** For some data types, this method will return `false` even though permissions are allowed.
 * Because there might not be any records of that type in HealthKit.
 * This method should work fine with data types like `steps` because steps are always tracked in HealthKit.
 *
 * @param permission - List of permissions to check if tracking is available
 */
export const UNSAFE_isTrackingAvailable = async (
  permission: FitnessDataType,
): Promise<boolean> => {
  if (isIOS) {
    const healthKitDataType = getDataTypeForHealthKit(permission);

    let authorized = false;

    try {
      authorized = !!(await HealthKit.getLatestDataRecord(healthKitDataType));
    } catch (error) {
      return false;
    }

    return authorized;
  } else {
    const googleFitDataType = getDataTypeForGoogleFit(permission);

    return GoogleFit.isTrackingAvailable([googleFitDataType], []);
  }
};
