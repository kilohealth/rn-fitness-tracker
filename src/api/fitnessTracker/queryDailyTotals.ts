import { DailyData, FitnessDataType } from '../../types';
import { getDataTypeForHealthKit, isIOS } from '../../utils';
import { GoogleFit, HealthKit } from '../..';

/**
 * Gets statistic daily total for specified time period.
 *
 * @param dataType e.g. `FitnessDataType.Steps`
 * @param startDate Unix timestamp or Date for record start date.
 * @param endDate Unix timestamp or Date for record end date.
 */
export const queryDailyTotals = async (
  dataType: FitnessDataType,
  startDate: Date | number,
  endDate: Date | number,
): Promise<DailyData> => {
  if (isIOS) {
    const healthKitDataType = getDataTypeForHealthKit(dataType);

    return HealthKit.queryDailyTotals({
      ...healthKitDataType,
      startDate,
      endDate,
    });
  } else {
    return GoogleFit.queryDailyTotals(dataType, startDate, endDate);
  }
};
