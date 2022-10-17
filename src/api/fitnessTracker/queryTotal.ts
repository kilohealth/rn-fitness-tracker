import { FitnessDataType } from '../../types';
import { getDataTypeForHealthKit, isIOS } from '../../utils';
import { GoogleFit, HealthKit } from '../..';

/**
 * Gets statistic accumulated total  for specified time period of given data type.
 *
 * @param dataType e.g. `FitnessDataType.Steps`
 * @param startDate Unix timestamp or Date for record start date.
 * @param endDate Unix timestamp or Date for record end date.
 */
export const queryTotal = async (
  dataType: FitnessDataType,
  startDate: Date | number,
  endDate: Date | number,
): Promise<number> => {
  if (isIOS) {
    const healthKitDataType = getDataTypeForHealthKit(dataType);

    const total = await HealthKit.queryTotal({
      ...healthKitDataType,
      startDate,
      endDate,
    });

    return Number(total);
  } else {
    return GoogleFit.queryTotal(dataType, startDate, endDate);
  }
};
