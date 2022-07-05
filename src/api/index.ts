/**
 * Api methods for HealthKit and GoogleFit.
 *
 * These methods work for both platforms: `iOS` and `Android`.
 */
import * as FitnessTracker from './fitnessTracker';
/**
 * Api methods for HealthKit.
 * These methods only work for `iOS`.
 *
 * You can find api methods for both platforms [FitnessTracker](./FitnessTracker.md)
 */
import * as HealthKit from './healthKit';
/**
 * Api methods for GoogleFit.
 * These methods only work for `Android`.
 *
 * You can find api methods for both platforms [FitnessTracker](./FitnessTracker.md)
 */
import * as GoogleFit from './googleFit';

export { FitnessTracker, GoogleFit, HealthKit };
