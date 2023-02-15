/**
 * Api methods for HealthKit and GoogleFit.
 *
 * These methods work for both platforms: `iOS` and `Android`.
 */
export * as FitnessTracker from './api/FitnessTracker';

/**
 * Api methods for HealthKit.
 * These methods only work for `iOS`.
 *
 * You can find api methods for both platforms [FitnessTracker](./FitnessTracker.md)
 */
export * as HealthKit from './api/HealthKit';

/**
 * Api methods for GoogleFit.
 * These methods only work for `Android`.
 *
 * You can find api methods for both platforms [FitnessTracker](./FitnessTracker.md)
 */
export * as GoogleFit from './api/GoogleFit';

/**
 * Enums
 */
export * from './enums/googleFitDataType';
export * from './enums/healthKitDataType';

/**
 * Types
 */
export * from './types/fitnessTypes';
export * from './types/healthKitTypes';
