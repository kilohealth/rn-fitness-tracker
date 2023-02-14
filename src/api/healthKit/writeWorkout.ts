import { NativeModules } from 'react-native';

import { HealthKitMetadata } from '../../types';
import { HealthKitWorkoutType } from '../../enums';
import { isIOS } from '../../utils';

/** @internal */
const { RNHealthTracker } = NativeModules;

/**
 * Records given workout data to Health API
 *
 * @param options.key e.g. `HealthKitWorkoutType.Running`
 * @param options.startDate Unix timestamp or Date for record start date.
 * @param options.endDate Unix timestamp or Date for record end date.
 * @param options.energyBurned Number of calories in kcalHealthKit. default 0
 * @param options.totalDistance Total distance travelledHealthKit. default 0
 * @param options.metadata
 *
 * @return Returns status if no errors occurred.
 */
export const writeWorkout = async (options: {
  key: HealthKitWorkoutType;
  startDate: Date | number;
  endDate: Date | number;
  energyBurned?: number;
  totalDistance?: number;
  metadata?: HealthKitMetadata;
}): Promise<boolean> => {
  if (isIOS) {
    const {
      key,
      startDate,
      endDate,
      energyBurned = 0,
      totalDistance = 0,
      metadata = {},
    } = options;

    return RNHealthTracker.writeWorkout(
      key,
      +startDate,
      +endDate,
      energyBurned,
      totalDistance,
      metadata,
    );
  }
};
