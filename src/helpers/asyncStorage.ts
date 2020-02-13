import AsyncStorage from '@react-native-community/async-storage';

export const setInAsyncStorage = (item: string, title: string): void => {
  try {
    AsyncStorage.setItem(title, item);
  } catch (e) {
    console.log(e);
  }
};

export const getFromAsyncStorage = (
  title: string,
): Promise<string | boolean | number | null> => {
  try {
    return AsyncStorage.getItem(title);
  } catch (e) {
    console.log(e);
  }
};

export const removeFromAsyncStorage = async (title: string): Promise<void> => {
  try {
    return await AsyncStorage.removeItem(title);
  } catch (e) {
    console.log(e);
  }
};

const asyncStorage = {
  setInAsyncStorage,
  getFromAsyncStorage,
  removeFromAsyncStorage,
};

export default asyncStorage;
