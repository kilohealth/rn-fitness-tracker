import { NativeModules } from 'react-native';

export const { RNFitnessTracker } = NativeModules;

export { FitnessTrackerAPI as default } from './src/fitnessTracker';
