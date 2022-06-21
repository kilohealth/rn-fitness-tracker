import { NativeModules } from 'react-native';

import { HealthDataType } from '../../enums';
import { isIOS } from '../../utils';

/** @internal */
const { RNHealthTracker } = NativeModules;

/**
 * Delete record from Health API.
 *
 * Must provide uuid of the record or startDate and endDate of records you wish to delete.
 *
 * @param options.key e.g. `HealthDataType.Fiber`
 * @param options.uuid Unique healthKit record id.
 * @param options.startDate Unix timestamp or Date for record start date.
 * @param options.endDate Unix timestamp or Date for record end date.
 *
 * @return The number of deleted records.
 */
export const deleteRecord = async (options: {
  key: HealthDataType;
  uuid?: string;
  startDate?: Date | number;
  endDate?: Date | number;
}): Promise<number> => {
  if (isIOS) {
    return await RNHealthTracker.deleteRecord(
      options.key,
      options.uuid,
      +options.startDate,
      // TODO remove 1000ms
      +options.endDate + 1000,
    );
  }
};
