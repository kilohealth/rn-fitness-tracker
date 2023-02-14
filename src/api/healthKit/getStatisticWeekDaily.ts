import { NativeModules } from 'react-native';

import { DailyData } from '../../types';
import { HealthKitDataType, HealthKitUnitType } from '../../enums';
import { isIOS, wrongPlatformErrorMessage } from '../../utils';

/** @internal */
const { RNHealthTracker } = NativeModules;

/**
 * Gets statistic daily total for given health data type and unit for current week, same number as in health app
 * @param options.key {HealthKitDataType} e.g. `HealthKitDataType.Fiber`
 * @param options.unit {HealthKitUnitType} e.g. `HealthKitUnitType.grams`
 */
export const getStatisticWeekDaily = async (options: {
  key: HealthKitDataType;
  unit: HealthKitUnitType;
}): Promise<DailyData> => {
  if (isIOS) {
    const { key, unit } = options;

    return RNHealthTracker.getStatisticWeekDaily(key, unit);
  }

  throw new Error(wrongPlatformErrorMessage('getStatisticWeekDaily'));
};
