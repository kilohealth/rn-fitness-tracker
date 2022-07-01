---
id: "index"
title: "FitnessTracker"
sidebar_label: "Overview"
sidebar_position: 0.5
custom_edit_url: null
---

## Namespaces

- [FitnessTracker](namespaces/FitnessTracker.md)
- [HealthKit](namespaces/HealthKit.md)

## Enumerations

- [FitnessDataType](enums/FitnessDataType.md)
- [GoogleFitDataTypes](enums/GoogleFitDataTypes.md)
- [HealthDataType](enums/HealthDataType.md)
- [HealthKitAuthStatus](enums/HealthKitAuthStatus.md)
- [UnitType](enums/UnitType.md)
- [WorkoutType](enums/WorkoutType.md)

## Interfaces

- [AuthorizationPermissions](interfaces/AuthorizationPermissions.md)
- [DailyData](interfaces/DailyData.md)
- [HealthDataRecord](interfaces/HealthDataRecord.md)
- [HealthKitKeyWithUnit](interfaces/HealthKitKeyWithUnit.md)
- [HealthKitMetadata](interfaces/HealthKitMetadata.md)
- [HealthWorkoutRecord](interfaces/HealthWorkoutRecord.md)
- [TodayAndDailyData](interfaces/TodayAndDailyData.md)

## Type Aliases

### HealthDataRecordQuery

Ƭ **HealthDataRecordQuery**: [`HealthDataRecord`](interfaces/HealthDataRecord.md)[]

#### Defined in

[types/healthKitTypes.ts:33](https://github.com/rn-fitness-tracker/rn-fitness-tracker/blob/f2b314b9/src/types/healthKitTypes.ts#L33)

___

### HealthKitWriteData

Ƭ **HealthKitWriteData**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount` | `number` |
| `key` | [`HealthDataType`](enums/HealthDataType.md) |
| `metadata?` | [`HealthKitMetadata`](interfaces/HealthKitMetadata.md) |
| `timestamp?` | `number` |
| `unit` | [`UnitType`](enums/UnitType.md) |

#### Defined in

[types/healthKitTypes.ts:62](https://github.com/rn-fitness-tracker/rn-fitness-tracker/blob/f2b314b9/src/types/healthKitTypes.ts#L62)

___

### HealthWorkoutRecordQuery

Ƭ **HealthWorkoutRecordQuery**: [`HealthWorkoutRecord`](interfaces/HealthWorkoutRecord.md)[]

#### Defined in

[types/healthKitTypes.ts:19](https://github.com/rn-fitness-tracker/rn-fitness-tracker/blob/f2b314b9/src/types/healthKitTypes.ts#L19)
