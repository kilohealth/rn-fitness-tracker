import { NativeModules } from 'react-native';

import { HealthDataType, UnitType } from '../../enums';
import { HealthKitMetadata } from '../../types';
import { isIOS } from '../../utils';

/** @internal */
const { RNHealthTracker } = NativeModules;

/**
 * Writes given health data to Health.
 *
 * @param options.key e.g. `HealthDataType.Fiber`
 * @param options.unit e.g. `UnitType.grams`
 * @param options.amount
 * @param options.metadata
 * @param options.timestamp optional unix timestamp for record date
 * @return Returns status if no errors occurred.
 */
export const writeData = async (options: {
  key: HealthDataType;
  unit: UnitType;
  amount: number;
  metadata?: HealthKitMetadata;
  timestamp?: number;
}): Promise<boolean> => {
  if (isIOS) {
    const { key, unit, amount, metadata = {}, timestamp = 0 } = options;

    return await RNHealthTracker.writeData(
      key,
      unit,
      amount,
      metadata,
      timestamp,
    );
  }
};
