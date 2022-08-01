---
id: usage-instructions
sidebar_position: 2
---

# Usage instructions

## Authorize

Authorize method works differently on iOS and Android. On `iOS` it returns `true` if no errors have occurred. 
On `Android` it returns the permission authorization status, `true` if user has given permission, `false` if user has 
not given permission.

Also, `iOS` does not have method to check if user has given read permission. If you call a method to get steps 
for example that method will return `0` if user has not given permission.

Therefore, on `iOS` you should save the state if you have asked the user for permissions. And then show the data given
back form `HealthKit`, but if there is no data, you should show a message, that there is no data in `HealthKit` or the
user has not given permissions.

## Steps
Here you can see an example how to get steps today with FinessTracker for both platforms `iOS` and `Android`.

```js
  const permissions: AuthorizationPermissions = {
    healthReadPermissions: [HealthKitDataType.StepCount],
    googleFitReadPermissions: [GoogleFitDataType.Steps],
  };

  const getStepsToday = async () => {
    const authorized = await FitnessTracker.authorize(permissions);

    if (!authorized) return;

    const stepsToday = await FitnessTracker.getStatisticTodayTotal(
      FitnessDataType.Steps,
    );

    // returns the number of steps walked today, e.g. 320
    console.log(stepsToday);
  };
```
