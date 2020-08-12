import { NativeModules } from 'react-native';

export const { RNFitnessTracker, RNHealthTracker } = NativeModules;

export { HealthDataTypes, UnitTypes } from './src/utils/dataTypes';

export { HealthTrackerAPI } from './src/healthTracker';
export { FitnessTrackerAPI as default } from './src/fitnessTracker';
