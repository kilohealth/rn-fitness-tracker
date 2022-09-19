import DeviceInfo from 'react-native-device-info';
import { NativeModules } from 'react-native';

import { isIOS } from '../../utils';

/** @internal */
const { RNHealthConnect } = NativeModules;

/**
 * Sets up GoogleFit tracking and returns status
 *
 * @return Returns status of authentication.
 */
export const authorize = async (): Promise<boolean> => {
  if (!isIOS) {
    const apiLevel = await DeviceInfo.getApiLevel();

    if (apiLevel < 28) {
      throw 'Device Android sdk version must be higher than 28 to run health connect.';
    }

    return RNHealthConnect.authorize([], []);
  }
};
