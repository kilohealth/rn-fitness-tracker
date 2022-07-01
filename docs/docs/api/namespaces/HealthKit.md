---
id: "HealthKit"
title: "Namespace: HealthKit"
sidebar_label: "HealthKit"
sidebar_position: 0
custom_edit_url: null
---

## Functions

### authorize

▸ **authorize**(`shareTypes`, `readTypes`): `Promise`<`boolean`\>

Sets up health tracking and returns status

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `shareTypes` | [`HealthDataType`](../enums/HealthDataType.md)[] | e.g. `[HealthDataType.Fiber]` |
| `readTypes` | [`HealthDataType`](../enums/HealthDataType.md)[] | e.g. `[HealthDataType.Fiber]` |

#### Returns

`Promise`<`boolean`\>

Returns status if no errors occurred.

#### Defined in

[api/healthKit/authorize.ts:16](https://github.com/rn-fitness-tracker/rn-fitness-tracker/blob/909937e4/src/api/healthKit/authorize.ts#L16)

___

### deleteRecord

▸ **deleteRecord**(`options`): `Promise`<`number`\>

Delete record from Health API.

Must provide uuid of the record or startDate and endDate of records you wish to delete.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.endDate?` | `number` \| `Date` | Unix timestamp or Date for record end date. |
| `options.key` | [`HealthDataType`](../enums/HealthDataType.md) | e.g. `HealthDataType.Fiber` |
| `options.startDate?` | `number` \| `Date` | Unix timestamp or Date for record start date. |
| `options.uuid?` | `string` | Unique healthKit record id. |

#### Returns

`Promise`<`number`\>

The number of deleted records.

#### Defined in

[api/healthKit/deleteRecord.ts:21](https://github.com/rn-fitness-tracker/rn-fitness-tracker/blob/909937e4/src/api/healthKit/deleteRecord.ts#L21)

___

### getAbsoluteTotalForToday

▸ **getAbsoluteTotalForToday**(`options`): `Promise`<`number`\>

Gets absolute total for given health data type and unit for current day

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.key` | [`HealthDataType`](../enums/HealthDataType.md) | e.g. `HealthDataType.Fiber` |
| `options.unit` | [`UnitType`](../enums/UnitType.md) | e.g. `UnitType.grams` |

#### Returns

`Promise`<`number`\>

#### Defined in

[api/healthKit/getAbsoluteTotalForToday.ts:14](https://github.com/rn-fitness-tracker/rn-fitness-tracker/blob/909937e4/src/api/healthKit/getAbsoluteTotalForToday.ts#L14)

___

### getAuthStatusForType

▸ **getAuthStatusForType**(`key`): `Promise`<[`HealthKitAuthStatus`](../enums/HealthKitAuthStatus.md)\>

Returns write (share) status for data type in Health API.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | [`HealthDataType`](../enums/HealthDataType.md) | e.g. `HealthDataType.Fiber` |

#### Returns

`Promise`<[`HealthKitAuthStatus`](../enums/HealthKitAuthStatus.md)\>

0 - NotDetermined, 1 - Denied, 2 - Authorized

#### Defined in

[api/healthKit/getAuthStatusForType.ts:15](https://github.com/rn-fitness-tracker/rn-fitness-tracker/blob/909937e4/src/api/healthKit/getAuthStatusForType.ts#L15)

___

### getLatestDataRecord

▸ **getLatestDataRecord**(`options`): `Promise`<[`HealthDataRecordQuery`](../#healthdatarecordquery)\>

Returns the latest record for specified data type and unit.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.key` | [`HealthDataType`](../enums/HealthDataType.md) | e.g. `HealthDataType.Fiber` |
| `options.unit` | [`UnitType`](../enums/UnitType.md) | e.g. `UnitType.grams` |

#### Returns

`Promise`<[`HealthDataRecordQuery`](../#healthdatarecordquery)\>

#### Defined in

[api/healthKit/getLatestDataRecord.ts:15](https://github.com/rn-fitness-tracker/rn-fitness-tracker/blob/909937e4/src/api/healthKit/getLatestDataRecord.ts#L15)

___

### getReadStatusForType

▸ **getReadStatusForType**(`options`): `Promise`<[`HealthKitAuthStatus`](../enums/HealthKitAuthStatus.md)\>

**`deprecated`** Might be deleted in future releases.

Returns read status for data type in Health API.

`WARNING`! This method is unofficial. Queries for data in time span of 2 years with limit of one.

**`note`** Try to avoid using this method and try to track user permission status in internal state.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.key` | [`HealthDataType`](../enums/HealthDataType.md) | e.g. `HealthDataType.Fiber` |
| `options.unit` | [`UnitType`](../enums/UnitType.md) | e.g. `HealthDataType.Fiber` |

#### Returns

`Promise`<[`HealthKitAuthStatus`](../enums/HealthKitAuthStatus.md)\>

0 - if permissions was never requested.

1 - if no records were found. This could be if user never gave permissions or user has no records for this type.

2 - if records were found.

#### Defined in

[api/healthKit/getReadStatusForType.ts:28](https://github.com/rn-fitness-tracker/rn-fitness-tracker/blob/909937e4/src/api/healthKit/getReadStatusForType.ts#L28)

___

### getStatisticTotalForToday

▸ **getStatisticTotalForToday**(`options`): `Promise`<`number`\>

Gets statistic total for given health data type and unit for current day, same number as in health app

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.key` | [`HealthDataType`](../enums/HealthDataType.md) | e.g. `HealthDataType.Fiber` |
| `options.unit` | [`UnitType`](../enums/UnitType.md) | e.g. `UnitType.grams` |

#### Returns

`Promise`<`number`\>

#### Defined in

[api/healthKit/getStatisticTotalForToday.ts:14](https://github.com/rn-fitness-tracker/rn-fitness-tracker/blob/909937e4/src/api/healthKit/getStatisticTotalForToday.ts#L14)

___

### getStatisticTotalForWeek

▸ **getStatisticTotalForWeek**(`options`): `Promise`<`number`\>

Gets statistic total for given health data type and unit for current week, same number as in health app

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.key` | [`HealthDataType`](../enums/HealthDataType.md) | e.g. `HealthDataType.Fiber` |
| `options.unit` | [`UnitType`](../enums/UnitType.md) | e.g. `UnitType.grams` |

#### Returns

`Promise`<`number`\>

#### Defined in

[api/healthKit/getStatisticTotalForWeek.ts:14](https://github.com/rn-fitness-tracker/rn-fitness-tracker/blob/909937e4/src/api/healthKit/getStatisticTotalForWeek.ts#L14)

___

### getStatisticWeekDaily

▸ **getStatisticWeekDaily**(`options`): `Promise`<[`DailyData`](../interfaces/DailyData.md)\>

Gets statistic daily total for given health data type and unit for current week, same number as in health app

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.key` | [`HealthDataType`](../enums/HealthDataType.md) | e.g. `HealthDataType.Fiber` |
| `options.unit` | [`UnitType`](../enums/UnitType.md) | e.g. `UnitType.grams` |

#### Returns

`Promise`<[`DailyData`](../interfaces/DailyData.md)\>

#### Defined in

[api/healthKit/getStatisticWeekDaily.ts:15](https://github.com/rn-fitness-tracker/rn-fitness-tracker/blob/909937e4/src/api/healthKit/getStatisticWeekDaily.ts#L15)

___

### queryDailyTotals

▸ **queryDailyTotals**(`options`): `Promise`<{ `[date: string]`: `number`;  }\>

Returns daily totals for specified data type and unit for specified time frame

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.endDate` | `number` \| `Date` | Unix timestamp or Date for record end date. |
| `options.key` | [`HealthDataType`](../enums/HealthDataType.md) | e.g. `HealthDataType.Fiber` |
| `options.startDate` | `number` \| `Date` | Unix timestamp or Date for record start date. |
| `options.unit` | [`UnitType`](../enums/UnitType.md) | e.g. `UnitType.grams` |

#### Returns

`Promise`<{ `[date: string]`: `number`;  }\>

#### Defined in

[api/healthKit/queryDailyTotals.ts:17](https://github.com/rn-fitness-tracker/rn-fitness-tracker/blob/909937e4/src/api/healthKit/queryDailyTotals.ts#L17)

___

### queryDataRecords

▸ **queryDataRecords**(`options`): `Promise`<[`HealthDataRecordQuery`](../#healthdatarecordquery)\>

Returns every record for specified data type and unit for specified time frame

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.endDate` | `number` \| `Date` | Unix timestamp or Date for record end date. |
| `options.key` | [`HealthDataType`](../enums/HealthDataType.md) | e.g. `HealthDataType.Fiber` |
| `options.startDate` | `number` \| `Date` | Unix timestamp or Date for record start date. |
| `options.unit` | [`UnitType`](../enums/UnitType.md) | e.g. `UnitType.grams` |

#### Returns

`Promise`<[`HealthDataRecordQuery`](../#healthdatarecordquery)\>

#### Defined in

[api/healthKit/queryDataRecords.ts:17](https://github.com/rn-fitness-tracker/rn-fitness-tracker/blob/909937e4/src/api/healthKit/queryDataRecords.ts#L17)

___

### queryTotal

▸ **queryTotal**(`options`): `Promise`<{ `[date: string]`: `number`;  }\>

Returns total for specified data type and unit for specified time frame

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.endDate` | `number` \| `Date` | Unix timestamp or Date for record end date. |
| `options.key` | [`HealthDataType`](../enums/HealthDataType.md) | e.g. `HealthDataType.Fiber` |
| `options.startDate` | `number` \| `Date` | Unix timestamp or Date for record start date. |
| `options.unit` | [`UnitType`](../enums/UnitType.md) | e.g. `UnitType.grams` |

#### Returns

`Promise`<{ `[date: string]`: `number`;  }\>

#### Defined in

[api/healthKit/queryTotal.ts:17](https://github.com/rn-fitness-tracker/rn-fitness-tracker/blob/909937e4/src/api/healthKit/queryTotal.ts#L17)

___

### queryWorkouts

▸ **queryWorkouts**(`options`): `Promise`<[`HealthWorkoutRecordQuery`](../#healthworkoutrecordquery)\>

Returns workouts array for specified timeframe, filters by workout type if specified

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.endDate` | `number` \| `Date` | Unix timestamp or Date for record end date. |
| `options.key?` | [`WorkoutType`](../enums/WorkoutType.md) | e.g. `WorkoutType.Running`HealthKit |
| `options.startDate` | `number` \| `Date` | Unix timestamp or Date for record start date. |

#### Returns

`Promise`<[`HealthWorkoutRecordQuery`](../#healthworkoutrecordquery)\>

#### Defined in

[api/healthKit/queryWorkouts.ts:17](https://github.com/rn-fitness-tracker/rn-fitness-tracker/blob/909937e4/src/api/healthKit/queryWorkouts.ts#L17)

___

### writeBloodPressure

▸ **writeBloodPressure**(`options`): `Promise`<`boolean`\>

Writes given blood pressure data to Health.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.diastolicPressure` | `number` |  |
| `options.endDate` | `number` \| `Date` | Unix timestamp or Date for record end date. |
| `options.metadata?` | [`HealthKitMetadata`](../interfaces/HealthKitMetadata.md) |  |
| `options.startDate` | `number` \| `Date` | Unix timestamp or Date for record start date. |
| `options.systolicPressure` | `number` |  |

#### Returns

`Promise`<`boolean`\>

Returns status if no errors occurred.

#### Defined in

[api/healthKit/writeBloodPressure.ts:19](https://github.com/rn-fitness-tracker/rn-fitness-tracker/blob/909937e4/src/api/healthKit/writeBloodPressure.ts#L19)

___

### writeData

▸ **writeData**(`options`): `Promise`<`boolean`\>

Writes given health data to Health.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.amount` | `number` |  |
| `options.key` | [`HealthDataType`](../enums/HealthDataType.md) | e.g. `HealthDataType.Fiber` |
| `options.metadata?` | [`HealthKitMetadata`](../interfaces/HealthKitMetadata.md) |  |
| `options.timestamp?` | `number` | optional unix timestamp for record date |
| `options.unit` | [`UnitType`](../enums/UnitType.md) | e.g. `UnitType.grams` |

#### Returns

`Promise`<`boolean`\>

Returns status if no errors occurred.

#### Defined in

[api/healthKit/writeData.ts:20](https://github.com/rn-fitness-tracker/rn-fitness-tracker/blob/909937e4/src/api/healthKit/writeData.ts#L20)

___

### writeDataArray

▸ **writeDataArray**(`dataArray`): `Promise`<`boolean`\>

Writes given health data array to Health API

#### Parameters

| Name | Type |
| :------ | :------ |
| `dataArray` | [`HealthKitWriteData`](../#healthkitwritedata)[] |

#### Returns

`Promise`<`boolean`\>

Returns status if no errors occurred.

#### Defined in

[api/healthKit/writeDataArray.ts:14](https://github.com/rn-fitness-tracker/rn-fitness-tracker/blob/909937e4/src/api/healthKit/writeDataArray.ts#L14)

___

### writeWorkout

▸ **writeWorkout**(`options`): `Promise`<`boolean`\>

Records given workout data to Health API

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.endDate` | `number` \| `Date` | Unix timestamp or Date for record end date. |
| `options.energyBurned?` | `number` | Number of calories in kcalHealthKit. default 0 |
| `options.key` | [`WorkoutType`](../enums/WorkoutType.md) | e.g. `WorkoutType.Running` |
| `options.metadata?` | [`HealthKitMetadata`](../interfaces/HealthKitMetadata.md) |  |
| `options.startDate` | `number` \| `Date` | Unix timestamp or Date for record start date. |
| `options.totalDistance?` | `number` | Total distance travelledHealthKit. default 0 |

#### Returns

`Promise`<`boolean`\>

Returns status if no errors occurred.

#### Defined in

[api/healthKit/writeWorkout.ts:22](https://github.com/rn-fitness-tracker/rn-fitness-tracker/blob/909937e4/src/api/healthKit/writeWorkout.ts#L22)
