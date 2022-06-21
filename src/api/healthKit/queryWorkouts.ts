import { NativeModules } from 'react-native';

import { WorkoutType } from '../../enums';
import { isIOS } from '../../utils';
import { HealthWorkoutRecordQuery } from '../../types';

/** @internal */
const { RNHealthTracker } = NativeModules;

/**
 * Returns workouts array for specified timeframe, filters by workout type if specified
 *
 * @param options.startDate Unix timestamp or Date for record start date.
 * @param options.endDate Unix timestamp or Date for record end date.
 * @param options.key e.g. `WorkoutType.Running`HealthKit
 */
export const queryWorkouts = async (options: {
  startDate: Date | number;
  endDate: Date | number;
  key?: WorkoutType;
}): Promise<HealthWorkoutRecordQuery> => {
  if (isIOS) {
    // todo test if 0 is set
    const { startDate, endDate, key = 0 } = options;
    return RNHealthTracker.queryWorkouts(key, +startDate, +endDate);
  }
};
