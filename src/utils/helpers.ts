import { Platform } from 'react-native';

export const isObject = function(obj: any) {
  var type = typeof obj;
  return type === 'function' || type === 'object' && !!obj;
};

export const isIOS = Platform.OS === 'ios';
