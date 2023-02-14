import { NativeModules } from 'react-native';

import { isIOS } from '../../utils';
import { HealthKitMetadata } from '../../types';

/** @internal */
const { RNHealthTracker } = NativeModules;

/**
 * Writes given blood pressure data to Health.
 *
 * @param options.systolicPressure
 * @param options.diastolicPressure
 * @param options.startDate Unix timestamp or Date for record start date.
 * @param options.endDate Unix timestamp or Date for record end date.
 * @param options.metadata
 *
 * @return Returns status if no errors occurred.
 */
export const writeBloodPressure = async (options: {
  systolicPressure: number;
  diastolicPressure: number;
  startDate: Date | number;
  endDate: Date | number;
  metadata?: HealthKitMetadata;
}): Promise<boolean> => {
  if (isIOS) {
    const {
      systolicPressure,
      diastolicPressure,
      startDate,
      endDate,
      metadata = {},
    } = options;

    return RNHealthTracker.writeBloodPressure(
      systolicPressure,
      diastolicPressure,
      +startDate,
      +endDate,
      metadata,
    );
  }
};
