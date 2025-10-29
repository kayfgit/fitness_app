import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveObject<T>(key: string, value: T): Promise<void> {
  const json = JSON.stringify(value);
  await AsyncStorage.setItem(key, json);
}

export async function loadObject<T>(key: string): Promise<T | null> {
  const json = await AsyncStorage.getItem(key);
  if (!json) return null;
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export async function saveString(key: string, value: string): Promise<void> {
  await AsyncStorage.setItem(key, value);
}

export async function loadString(key: string): Promise<string | null> {
  return AsyncStorage.getItem(key);
}

export async function remove(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}


