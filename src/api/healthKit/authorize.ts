import { NativeModules } from 'react-native';

import { HealthDataType } from '../../enums';
import { isIOS } from '../../utils';

/** @internal */
const { RNHealthTracker } = NativeModules;

/**
 * Sets up health tracking and returns status
 * @param shareTypes e.g. `[HealthDataType.Fiber]`
 * @param readTypes e.g. `[HealthDataType.Fiber]`
 *
 * @return Returns status if no errors occurred.
 */
export const authorize = async (
  shareTypes: HealthDataType[],
  readTypes: HealthDataType[],
): Promise<boolean> => {
  if (isIOS) {
    const authorized = await RNHealthTracker.authorize(shareTypes, readTypes);
    return !!authorized;
  }
};
