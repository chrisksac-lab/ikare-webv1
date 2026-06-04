import React, { useEffect, useState, useCallback } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';
import { AppContext } from './src/providers/AppContext' 
import * as SplashScreen from "expo-splash-screen"
import { getValue, getStoredUser } from './src/services/storage';
import Index from './Index'
import { View } from 'react-native';

const Stack = createNativeStackNavigator()
const screenOptions = {
  headerShown: false,
}

export default function NavigationStacks(){
  
  const [authReady , setAuthReady] = useState(false);
  const [storedInformation, setStoredInformation] = useState("")
  
  const checkAuthenticationStatus = async () => {
      const userInfo = await getStoredUser();
      if(userInfo !== null && userInfo !== null){
        setStoredInformation(userInfo)
      }else{
        setStoredInformation(null)
      }
  }
  useEffect(() => {
    async function prepare() {
      try {
        // await SplashScreen.preventAutoHideAsync()
        checkAuthenticationStatus()
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAuthReady(true);
        // await SplashScreen.hideAsync()
      }
    }

    prepare();
  }, [authReady]);

  // const onLayoutRootView = async () => {
  //   if (authReady) {
  //     await SplashScreen.hideAsync();
  //   }
  // };

  // useEffect(() => {
  //   onLayoutRootView()
  // })

  if(!authReady){
      return null
  }

  return (
    <AppContext.Provider value={{ storedInformation, setStoredInformation }}>
      <Stack.Navigator screenOptions={screenOptions}>
          <Stack.Screen name="Index" component={Index} />
      </Stack.Navigator>
    </AppContext.Provider>
    )
}