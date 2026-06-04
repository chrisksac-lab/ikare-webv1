import AsyncStorage from "@react-native-async-storage/async-storage";

export const setValue = async(key, value) => {
    await AsyncStorage.setItem(key, value)
}

export const setUser = async (value) => {
    await AsyncStorage.setItem("user", JSON.stringify(value))
}

export const getValue = async(key) => {
    let result = await AsyncStorage.getItem(key);
    return result
}

export const getStoredUser = async () => {
    let userString = await AsyncStorage.getItem("user")
    let userObject = JSON.parse(userString)
    return userObject;
}
