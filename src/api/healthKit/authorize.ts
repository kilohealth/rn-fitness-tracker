import { NativeModules } from 'react-native';

import { HealthKitDataType } from '../../enums';
import { isIOS } from '../../utils';

/** @internal */
const { RNHealthTracker } = NativeModules;

/**
 * Sets up health tracking and returns status
 * @param shareTypes e.g. `[HealthKitDataType.Fiber]`
 * @param readTypes e.g. `[HealthKitDataType.Fiber]`
 *
 * @return Returns status if no errors occurred.
 */
export const authorize = async (
  shareTypes: HealthKitDataType[],
  readTypes: HealthKitDataType[],
): Promise<boolean> => {
  if (isIOS) {
    const authorized = await RNHealthTracker.authorize(shareTypes, readTypes);

    return !!authorized;
  }
};
