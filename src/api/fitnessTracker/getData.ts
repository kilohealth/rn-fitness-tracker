import { NativeModules } from 'react-native';

import { DailyData, FitnessDataType, TodayAndDailyData } from '../../types';
import { getDataTypeForHealthKit, isIOS, isObject } from '../../utils';
import { HealthKit } from '../..';

/** @internal */
const { RNFitnessTracker } = NativeModules;

/**
 * Returns steps total for today and this week's steps daily values.
 * @return {Promise<TodayAndDailyData>}
 */
export const getData = async (
  dataType: FitnessDataType,
): Promise<TodayAndDailyData> => {
  let daily: DailyData;
  if (isIOS) {
    const healthKitDataType = getDataTypeForHealthKit(dataType);

    daily = await HealthKit.getStatisticWeekDaily(healthKitDataType);
  } else {
    daily = await RNFitnessTracker.getStatisticWeekDaily(dataType);
  }

  let today = 0;

  if (isObject(daily)) {
    today = daily?.[Object.keys(daily).sort()[6]];
  }

  return { today, daily: daily || {} };
};
