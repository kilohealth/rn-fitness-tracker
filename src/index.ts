import { NativeModules } from 'react-native';

export const { RNFitnessTracker, RNHealthTracker } = NativeModules;

export {
  HealthDataTypes,
  UnitTypes,
  WorkoutTypes,
} from './types/healthKitDataTypes';
export { GoogleFitDataTypes } from './types/googleFitDataTypes';

export { FitnessTrackerAPI as default } from './api/fitness';
export { HealthTrackerAPI } from './api/health';
