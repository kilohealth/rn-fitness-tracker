import { NativeModules } from 'react-native';

import { isIOS } from '../../utils';

/** @internal */
const { RNFitnessTracker } = NativeModules;

/**
 * Deletes all workouts for given time period.
 *
 * @param startDate Unix timestamp or Date for start date.
 * @param endDate Unix timestamp or Date for end date.
 *
 * @return Returns status if no errors occurred.
 */
export const deleteWorkouts = async (
  startDate: Date | number,
  endDate: Date | number,
): Promise<boolean> => {
  if (!isIOS) {
    return RNFitnessTracker.deleteWorkouts(+startDate, +endDate);
  }
};
