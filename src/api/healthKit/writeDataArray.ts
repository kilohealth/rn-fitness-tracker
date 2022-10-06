import { NativeModules } from 'react-native';

import { HealthKitWriteData } from '../../types';
import { isIOS } from '../../utils';

/** @internal */
const { RNHealthTracker } = NativeModules;

/**
 * Writes given health data array to Health API
 *
 * @return Returns status if no errors occurred.
 */
export const writeDataArray = async (
  dataArray: Array<HealthKitWriteData>,
): Promise<boolean> => {
  if (isIOS) {
    return RNHealthTracker.writeDataArray(dataArray);
  }
};
