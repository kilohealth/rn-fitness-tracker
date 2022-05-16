import { NativeModules } from 'react-native';

export const { RNFitnessTracker, RNHealthTracker } = NativeModules;

export { FitnessDataType } from './types/fitnessTypes';
export { GoogleFitDataTypes } from './types/googleFitDataTypes';
export * from './types/healthKitDataTypes';

export { FitnessTrackerAPI as default } from './api/fitness';
export { HealthTrackerAPI } from './api/health';
