import { FitnessDataType } from '../../types';
import { getDataTypeForHealthKit, isIOS } from '../../utils';
import { GoogleFit, HealthKit } from '../..';

/**
 * Returns the latest height value or null if height does not exist.
 */
export const getLatestHeight = async (): Promise<number | null> => {
  if (isIOS) {
    const healthKitDataType = getDataTypeForHealthKit(FitnessDataType.Height);

    const record = await HealthKit.getLatestDataRecord(healthKitDataType);

    if (!record) {
      return null;
    }

    return record.quantity;
  } else {
    return GoogleFit.getLatestDataRecord(FitnessDataType.Height);
  }
};
