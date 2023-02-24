import { NativeModules } from 'react-native';

import { HealthKitWorkoutType } from '../../enums';
import { HealthWorkoutRecordQuery } from '../../types';
import { isIOS } from '../../utils';

/** @internal */
const { RNHealthTracker } = NativeModules;

/**
 * @param options.startDate Unix timestamp or Date for record start date
 * @param options.endDate Unix timestamp or Date for record end date
 * @param options.key e.g. `HealthKitWorkoutType.Running`HealthKit
 *
 * @return Returns workouts array for specified timeframe, filters by workout type if specified
 */
export const queryWorkouts = async (options: {
  startDate: Date | number;
  endDate: Date | number;
  key?: HealthKitWorkoutType;
}): Promise<HealthWorkoutRecordQuery> => {
  if (isIOS) {
    const { startDate, endDate, key = 0 } = options;

    return RNHealthTracker.queryWorkouts(key, +startDate, +endDate);
  }
};
