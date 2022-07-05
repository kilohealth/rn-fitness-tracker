import { NativeModules } from 'react-native';

import { FitnessDataType, HealthDataRecordQuery } from '../../types';
import { isIOS } from '../../utils';

/** @internal */
const { RNFitnessTracker } = NativeModules;

/**
 * Returns the latest record for specified data type.
 * @param dataType e.g. `FitnessDataType.Weight`
 */
export const getLatestDataRecord = async (
  dataType: FitnessDataType,
): Promise<HealthDataRecordQuery> => {
  if (isIOS) {
    return RNFitnessTracker.getLatestDataRecord(dataType);
  }
};
