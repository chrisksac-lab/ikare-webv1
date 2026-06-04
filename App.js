import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import SplashScreen from "./src/views/other/SplashScreen";
import LoginScreen from "./src/views/auth/LoginScreen";
import RegisterScreen from "./src/views/auth/RegisterScreen";
import Patient from "./src/views/other/Patient";
import HealthProfessional from "./src/views/other/HealthProfessional";
import ProfessionalStack from "./src/views/other/ProfessionalStack";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "./Navigation";
import Toast from "react-native-toast-message";
import { useEffect, useState } from "react";
import { getValue } from "./src/services/storage";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient();
export default function App() {
  const Stack = createStackNavigator();
  const [token, setToken] = useState();
  const screenOptions = {
    headerShown: false,
  };
  return (
    <>
    <QueryClientProvider client={queryClient}>
      <StatusBar />
        <NavigationContainer>
          <Navigation />
        </NavigationContainer>
      <Toast />
      </QueryClientProvider>
    </>
  );
}
