import { FitnessDataType } from '../../types';
import { getDataTypeForHealthKit, isIOS } from '../../utils';
import { GoogleFit, HealthKit } from '../..';

// todo create return type
/**
 * Returns the latest weight record.
 */
export const getLatestWeightRecord = async () => {
  if (isIOS) {
    const healthKitDataType = getDataTypeForHealthKit(FitnessDataType.Weight);

    return HealthKit.getLatestDataRecord(healthKitDataType);
  } else {
    return GoogleFit.getLatestDataRecord(FitnessDataType.Weight);
  }
};
