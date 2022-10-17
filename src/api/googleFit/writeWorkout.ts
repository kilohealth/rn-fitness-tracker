import { NativeModules } from 'react-native';

import { GoogleFitWorkoutType } from '../../enums';
import { isIOS } from '../../utils';

/** @internal */
const { RNFitnessTracker } = NativeModules;

/**
 * Records given workout data to GoogleFit API
 *
 * @param options.key Activity key e.g. `GoogleFitWorkoutType.Running`
 * @param options.name Activity name.
 * @param options.identifier Activity identifier.
 * @param options.startDate Unix timestamp or Date for record start date.
 * @param options.endDate Unix timestamp or Date for record end date.
 * @param options.description Activity description.
 * @param options.calories Activity calories.
 * @param options.steps Activity steps.
 *
 * @return Returns status if no errors occurred.
 */
export const writeWorkout = async (options: {
  key: GoogleFitWorkoutType;
  name: string;
  identifier: string;
  startDate: Date | number;
  endDate: Date | number;
  description?: string;
  calories?: number;
  steps?: number;
}): Promise<boolean> => {
  if (!isIOS) {
    Object.keys(options).forEach((key: string) =>
      options[key as keyof typeof options] === undefined
        ? delete options[key as keyof typeof options]
        : {},
    );

    return RNFitnessTracker.writeWorkout(
      +options.startDate,
      +options.endDate,
      options,
    );
  }
};
