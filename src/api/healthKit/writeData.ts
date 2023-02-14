import { NativeModules } from 'react-native';

import { HealthKitDataType, HealthKitUnitType } from '../../enums';
import { HealthKitMetadata } from '../../types';
import { isIOS } from '../../utils';

/** @internal */
const { RNHealthTracker } = NativeModules;

/**
 * Writes given health data to Health.
 *
 * @param options.key e.g. `HealthKitDataType.Fiber`
 * @param options.unit e.g. `HealthKitUnitType.grams`
 * @param options.amount
 * @param options.metadata
 * @param options.timestamp optional unix timestamp for record date
 *
 * @return Returns status if no errors occurred.
 */
export const writeData = async (options: {
  key: HealthKitDataType;
  unit: HealthKitUnitType;
  amount: number;
  metadata?: HealthKitMetadata;
  timestamp?: number;
}): Promise<boolean> => {
  if (isIOS) {
    const { key, unit, amount, metadata = {}, timestamp = -1 } = options;

    return RNHealthTracker.writeData(key, unit, amount, metadata, timestamp);
  }
};
