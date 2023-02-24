import { NativeModules } from 'react-native';

import { HealthKitWorkoutType } from '../../enums';
import { HealthKitAnchoredWorkoutResult } from '../../types';
import { isIOS } from '../../utils';

/** @internal */
const { RNHealthTracker } = NativeModules;

/**
 * Query workouts with anchor
 * Passing anchor will return all workouts that have been added since that anchor point
 *
 * @param options.anchor last query anchor point
 * @param options.key e.g. `HealthKitWorkoutType.Running`HealthKit
 * @param options.limit limits the number of workouts returned from the anchor point to the newest workout
 *
 * @return Returns an object with the latest anchor point and data array with new workouts
 */
export const queryAnchoredWorkouts = async (options?: {
  anchor?: number;
  key?: HealthKitWorkoutType;
  limit?: number;
}): Promise<HealthKitAnchoredWorkoutResult> => {
  if (isIOS) {
    const { anchor = 0, key = 0, limit = 0 } = options || {};

    return RNHealthTracker.anchoredQueryWorkouts(key, anchor, limit);
  }

  throw new Error('queryAnchoredWorkouts is implemented only for iOS platform');
};
