---
id: usage-instructions
sidebar_position: 2
---

# Usage instructions

:::danger
You should always wrap your code in a `try/catch` block, as methods may throw an error.
:::

## Authorize

:::caution
Since HealthKit doesn't provide us to with permission status, `FitnessTracker.authorize()` works differently on **iOS** and **Android**.

- On **iOS** it returns `true` if no errors have occurred.
- On **Android** it returns the permission authorization status:
  - `true` if user has given permission
  - `false` if user has not given permission.

Also, there's no method on **iOS** to check if user has given read permission. So for example, if you call a method to get steps amount and user hasn't allowed you to do so, HealthKit returned amount will be `0`.

Therefore, you should save, whether you have asked the user for permissions on **iOS** and get the data from `HealthKit`.

If the returned amount is `0`, you should show a message, that possibly there's no data in `HealthKit` or
user has not given required permissions.
:::

## Steps

Here you can see an example, how to get today's steps with FinessTracker for both platforms **iOS** and **Android**.

```tsx
const permissions: AuthorizationPermissions = {
  healthReadPermissions: [HealthKitDataType.StepCount],
  googleFitReadPermissions: [GoogleFitDataType.Steps],
};

const getStepsToday = async () => {
  try {
    const authorized = await FitnessTracker.authorize(permissions);

    if (!authorized) return;

    const stepsToday = await FitnessTracker.getStatisticTodayTotal(
      FitnessDataType.Steps,
    );

    // returns the number of steps walked today, e.g. 320
    console.log(stepsToday);
  } catch (error) {
    // Handle error here
    console.log(error);
  }
};
```
