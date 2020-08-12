import { NativeModules } from 'react-native';

export const { RNFitnessTracker, RNHealthTracker } = NativeModules;

export {
  HealthDataTypes,
  UnitTypes,
  WorkoutTypes,
} from './src/utils/dataTypes';

export { HealthTrackerAPI } from './src/healthTracker';
export { FitnessTrackerAPI as default } from './src/fitnessTracker';
