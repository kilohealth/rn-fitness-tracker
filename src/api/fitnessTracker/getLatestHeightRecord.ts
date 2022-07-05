import { FitnessDataType } from '../../types';
import { getDataTypeForHealthKit, isIOS } from '../../utils';
import { GoogleFit, HealthKit } from '../..';

// todo create return type
/**
 * Returns the latest height record.
 */
export const getLatestHeightRecord = async () => {
  if (isIOS) {
    const healthKitDataType = getDataTypeForHealthKit(FitnessDataType.Height);

    return HealthKit.getLatestDataRecord(healthKitDataType);
  } else {
    return GoogleFit.getLatestDataRecord(FitnessDataType.Height);
  }
};
