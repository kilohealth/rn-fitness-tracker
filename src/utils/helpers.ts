import { Platform } from 'react-native';

export const isObject = function (obj: any) {
  const type = typeof obj;
  return type === 'function' || (type === 'object' && !!obj);
};

export const isIOS = Platform.OS === 'ios';
