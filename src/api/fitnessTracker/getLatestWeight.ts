import { FitnessDataType } from '../../types';
import { getDataTypeForHealthKit, isIOS } from '../../utils';
import { GoogleFit, HealthKit } from '../..';

/**
 * Returns the latest weight value or null if weight does not exist.
 */
export const getLatestWeight = async (): Promise<number | null> => {
  if (isIOS) {
    const healthKitDataType = getDataTypeForHealthKit(FitnessDataType.Weight);

    const record = await HealthKit.getLatestDataRecord(healthKitDataType);

    if (!record) {
      return null;
    }

    return record.quantity;
  } else {
    return GoogleFit.getLatestDataRecord(FitnessDataType.Weight);
  }
};
