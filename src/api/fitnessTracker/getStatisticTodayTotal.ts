import { FitnessDataType } from '../../types';
import { getDataTypeForHealthKit, isIOS } from '../../utils';
import { GoogleFit, HealthKit } from '../..';

/**
 * Gets statistic total for given data type for current day.
 */
export const getStatisticTodayTotal = async (
  dataType: FitnessDataType,
): Promise<number> => {
  if (isIOS) {
    const healthKitDataType = getDataTypeForHealthKit(dataType);

    const total = await HealthKit.getStatisticTotalForToday(healthKitDataType);

    return Number(total);
  } else {
    return GoogleFit.getStatisticTodayTotal(dataType);
  }
};
