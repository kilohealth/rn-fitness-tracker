import DeviceInfo from 'react-native-device-info';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { ResultMap } from 'react-native-permissions/dist/typescript/results';

import { ValueOf } from './helpers';

/** @internal */
export const handleAndroidMotionTrackingPermissions = async (
  shouldRequestPermission: boolean,
): Promise<boolean> => {
  const apiLevel = await DeviceInfo.getApiLevel();
  const isMotionAuthNeeded = apiLevel >= 29;

  const action = shouldRequestPermission ? request : check;
  const motionAuthorized: ValueOf<ResultMap> = await action(
    PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION,
  );

  return !isMotionAuthNeeded || motionAuthorized === RESULTS.GRANTED;
};
