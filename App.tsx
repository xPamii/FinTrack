import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import AboutUs from "./screens/AboutUs";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

import BottomTabs from "./navigation/BottomTabs"; // ✅ import

const Stack = createStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("userId");
      setInitialRoute(token ? "Main" : "Main");
    };
    checkLoginStatus();
  }, []);

  if (!initialRoute) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        {/* Auth flow */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />

        {/* ✅ Bottom Tabs as the main app */}
        <Stack.Screen name="Main" component={BottomTabs} />

        {/* Other standalone screens */}
        <Stack.Screen name="About" component={AboutUs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
