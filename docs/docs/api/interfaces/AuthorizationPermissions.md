---
id: "AuthorizationPermissions"
title: "Interface: AuthorizationPermissions"
sidebar_label: "AuthorizationPermissions"
sidebar_position: 0
custom_edit_url: null
---

Authorization object for requesting permissions.
Must have at least one permission key.

## Properties

### googleFitReadPermissions

• `Optional` **googleFitReadPermissions**: [`GoogleFitDataTypes`](../enums/GoogleFitDataTypes.md)[]

Read permissions for GoogleFit.

#### Defined in

[types/fitnessTypes.ts:11](https://github.com/rn-fitness-tracker/rn-fitness-tracker/blob/f2b314b9/src/types/fitnessTypes.ts#L11)

___

### googleFitWritePermissions

• `Optional` **googleFitWritePermissions**: [`GoogleFitDataTypes`](../enums/GoogleFitDataTypes.md)[]

Write permissions for GoogleFit.

#### Defined in

[types/fitnessTypes.ts:15](https://github.com/rn-fitness-tracker/rn-fitness-tracker/blob/f2b314b9/src/types/fitnessTypes.ts#L15)

___

### healthReadPermissions

• `Optional` **healthReadPermissions**: [`HealthDataType`](../enums/HealthDataType.md)[]

Read permissions for HealthKit.

#### Defined in

[types/fitnessTypes.ts:19](https://github.com/rn-fitness-tracker/rn-fitness-tracker/blob/f2b314b9/src/types/fitnessTypes.ts#L19)

___

### healthWritePermissions

• `Optional` **healthWritePermissions**: [`HealthDataType`](../enums/HealthDataType.md)[]

Write permissions for HealthKit.

#### Defined in

[types/fitnessTypes.ts:23](https://github.com/rn-fitness-tracker/rn-fitness-tracker/blob/f2b314b9/src/types/fitnessTypes.ts#L23)
