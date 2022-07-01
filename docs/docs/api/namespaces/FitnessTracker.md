---
id: "FitnessTracker"
title: "Namespace: FitnessTracker"
sidebar_label: "FitnessTracker"
sidebar_position: 0
custom_edit_url: null
---

Api methods for HealthKit and GoogleFit.

These methods work for both platforms: `iOS` and `Android`.

## Functions

### authorize

▸ **authorize**(`permissions`): `Promise`<`boolean`\>

Authorize tracking for provided permissions.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `permissions` | [`AuthorizationPermissions`](../interfaces/AuthorizationPermissions.md) | List of permissions to track. |

#### Returns

`Promise`<`boolean`\>

For `iOS` returns true if errors did not occur.

For `Android` returns true if user gave permission access.

#### Defined in

[api/fitnessTracker/authorize.ts:19](https://github.com/rn-fitness-tracker/rn-fitness-tracker/blob/a4a790c/src/api/fitnessTracker/authorize.ts#L19)

___

### getData

▸ **getData**(`dataType`): `Promise`<[`TodayAndDailyData`](../interfaces/TodayAndDailyData.md)\>

Returns steps total for today and this week's steps daily values.

#### Parameters

| Name | Type |
| :------ | :------ |
| `dataType` | [`FitnessDataType`](../enums/FitnessDataType.md) |

#### Returns

`Promise`<[`TodayAndDailyData`](../interfaces/TodayAndDailyData.md)\>

#### Defined in

[api/fitnessTracker/getData.ts:14](https://github.com/rn-fitness-tracker/rn-fitness-tracker/blob/a4a790c/src/api/fitnessTracker/getData.ts#L14)

___

### getLatestHeightRecord

▸ **getLatestHeightRecord**(): `Promise`<`any`\>

Returns the latest height record.

#### Returns

`Promise`<`any`\>

#### Defined in

[api/fitnessTracker/getLatestHeightRecord.ts:14](https://github.com/rn-fitness-tracker/rn-fitness-tracker/blob/a4a790c/src/api/fitnessTracker/getLatestHeightRecord.ts#L14)

___

### getLatestWeightRecord

▸ **getLatestWeightRecord**(): `Promise`<`any`\>

Returns the latest weight record.

#### Returns

`Promise`<`any`\>

#### Defined in

[api/fitnessTracker/getLatestWeightRecord.ts:14](https://github.com/rn-fitness-tracker/rn-fitness-tracker/blob/a4a790c/src/api/fitnessTracker/getLatestWeightRecord.ts#L14)

___

### getStatisticTodayTotal

▸ **getStatisticTodayTotal**(`dataType`): `Promise`<`number`\>

Gets statistic total for given data type for current day.

#### Parameters

| Name | Type |
| :------ | :------ |
| `dataType` | [`FitnessDataType`](../enums/FitnessDataType.md) |

#### Returns

`Promise`<`number`\>

#### Defined in

[api/fitnessTracker/getStatisticTodayTotal.ts:13](https://github.com/rn-fitness-tracker/rn-fitness-tracker/blob/a4a790c/src/api/fitnessTracker/getStatisticTodayTotal.ts#L13)

___

### getStatisticWeekDaily

▸ **getStatisticWeekDaily**(`dataType`): `Promise`<[`DailyData`](../interfaces/DailyData.md)\>

Gets statistic daily total for current week of given data type.

#### Parameters

| Name | Type |
| :------ | :------ |
| `dataType` | [`FitnessDataType`](../enums/FitnessDataType.md) |

#### Returns

`Promise`<[`DailyData`](../interfaces/DailyData.md)\>

#### Defined in

[api/fitnessTracker/getStatisticWeekDaily.ts:13](https://github.com/rn-fitness-tracker/rn-fitness-tracker/blob/a4a790c/src/api/fitnessTracker/getStatisticWeekDaily.ts#L13)

___

### getStatisticWeekTotal

▸ **getStatisticWeekTotal**(`dataType`): `Promise`<`number`\>

Gets statistic accumulated total for current week of given data type.

#### Parameters

| Name | Type |
| :------ | :------ |
| `dataType` | [`FitnessDataType`](../enums/FitnessDataType.md) |

#### Returns

`Promise`<`number`\>

#### Defined in

[api/fitnessTracker/getStatisticWeekTotal.ts:13](https://github.com/rn-fitness-tracker/rn-fitness-tracker/blob/a4a790c/src/api/fitnessTracker/getStatisticWeekTotal.ts#L13)

___

### isTrackingAvailableAndroid

▸ **isTrackingAvailableAndroid**(`permissions`): `Promise`<`boolean`\>

Returns if specific permission is authorized and available on Android

**`platform`** Android

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `permissions` | [`GoogleFitDataTypes`](../enums/GoogleFitDataTypes.md)[] | List of permissions to check if tracking is available |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[api/fitnessTracker/isTrackingAvailableAndroid.ts:14](https://github.com/rn-fitness-tracker/rn-fitness-tracker/blob/a4a790c/src/api/fitnessTracker/isTrackingAvailableAndroid.ts#L14)

___

### queryDailyTotals

▸ **queryDailyTotals**(`dataType`, `startDate`, `endDate`): `Promise`<[`DailyData`](../interfaces/DailyData.md)\>

Gets statistic daily total for specified time period.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `dataType` | [`FitnessDataType`](../enums/FitnessDataType.md) | e.g. `FitnessDataType.Steps` |
| `startDate` | `number` \| `Date` | Unix timestamp or Date for record start date. |
| `endDate` | `number` \| `Date` | Unix timestamp or Date for record end date. |

#### Returns

`Promise`<[`DailyData`](../interfaces/DailyData.md)\>

#### Defined in

[api/fitnessTracker/queryDailyTotals.ts:17](https://github.com/rn-fitness-tracker/rn-fitness-tracker/blob/a4a790c/src/api/fitnessTracker/queryDailyTotals.ts#L17)

___

### queryTotal

▸ **queryTotal**(`dataType`, `startDate`, `endDate`): `Promise`<`number`\>

Gets statistic accumulated total  for specified time period of given data type.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `dataType` | [`FitnessDataType`](../enums/FitnessDataType.md) | e.g. `FitnessDataType.Steps` |
| `startDate` | `number` \| `Date` | Unix timestamp or Date for record start date. |
| `endDate` | `number` \| `Date` | Unix timestamp or Date for record end date. |

#### Returns

`Promise`<`number`\>

#### Defined in

[api/fitnessTracker/queryTotal.ts:17](https://github.com/rn-fitness-tracker/rn-fitness-tracker/blob/a4a790c/src/api/fitnessTracker/queryTotal.ts#L17)
