import { NativeModules } from 'react-native';

import { FitnessDataType } from '../../types';
import { isIOS } from '../../utils';

/** @internal */
const { RNFitnessTracker } = NativeModules;

/**
 * This method currently works with dataTypes: `Weight`, `Height`.
 *
 * Returns the latest record for specified data type.
 * @param dataType e.g. `FitnessDataType.Weight`
 */
export const getLatestDataRecord = async (
  dataType: FitnessDataType,
): Promise<number | null> => {
  if (!isIOS) {
    return RNFitnessTracker.getLatestDataRecord(dataType);
  }
};
