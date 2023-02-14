import { isIOS } from './helpers';

export const wrongPlatformErrorMessage = (methodName: string) => {
  if (isIOS) {
    return `HealthKit.${methodName} can not run in Android.`;
  }

  return `GoogleFit.${methodName} can not run in iOS.`;
};
