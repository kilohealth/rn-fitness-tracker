import { FitnessDataType } from '../../types';
import { getDataTypeForHealthKit, isIOS } from '../../utils';
import { GoogleFit, HealthKit } from '../..';

/**
 * Returns the latest height record.
 */
export const getLatestHeight = async (): Promise<number | null> => {
  if (isIOS) {
    const healthKitDataType = getDataTypeForHealthKit(FitnessDataType.Height);

    const records = await HealthKit.getLatestDataRecord(healthKitDataType);

    if (records.length === 0) {
      return null;
    } else {
      return records[0].quantity;
    }
  } else {
    return GoogleFit.getLatestDataRecord(FitnessDataType.Height);
  }
};
