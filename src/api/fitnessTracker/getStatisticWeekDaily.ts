import { DailyData, FitnessDataType } from '../../types';
import { getDataTypeForHealthKit, isIOS } from '../../utils';
import { GoogleFit, HealthKit } from '../..';

/**
 * Gets statistic daily total for current week of given data type.
 */
export const getStatisticWeekDaily = async (
  dataType: FitnessDataType,
): Promise<DailyData> => {
  if (isIOS) {
    const healthKitDataType = getDataTypeForHealthKit(dataType);

    return HealthKit.getStatisticWeekDaily(healthKitDataType);
  } else {
    return GoogleFit.getStatisticWeekDaily(dataType);
  }
};
