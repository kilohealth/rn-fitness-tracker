import { NativeModules } from 'react-native';

export const { RNFitnessTracker, RNHealthTracker } = NativeModules;

export { HealthDataTypes, UnitTypes, WorkoutTypes } from './types/dataTypes';
export { AndroidPermissions } from './types/permissions';

export { FitnessTrackerAPI as default } from './api/fitness';
export { HealthTrackerAPI } from './api/health';
export { PedometerAPI } from './api/pedometer';
