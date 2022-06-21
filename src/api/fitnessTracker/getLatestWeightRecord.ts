import { NativeModules } from 'react-native';

import { FitnessDataType } from '../../types';
import { getDataTypeForHealthKit, isIOS } from '../../utils';
import { HealthKit } from '../..';

/** @internal */
const { RNFitnessTracker } = NativeModules;

// todo create return type
/**
 * Returns the latest weight record.
 */
export const getLatestWeightRecord = async () => {
  if (isIOS) {
    const healthKitDataType = getDataTypeForHealthKit(FitnessDataType.Weight);

    return HealthKit.getLatestDataRecord(healthKitDataType);
  } else {
    return RNFitnessTracker.getLatestDataRecord(FitnessDataType.Weight);
  }
};
