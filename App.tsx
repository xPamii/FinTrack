import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import Dashboard from "./screens/Dashboard";
import AddExpenseScreen from "./screens/AddExpense";
import MyAccount from "./screens/MyAccount";
import AboutUs from "./screens/AboutUs";
import ALLHistory from "./screens/AllHistory";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const Stack = createStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("userId");
      setInitialRoute(token ? "Dashboard" : "Dashboard"); // can adjust later if needed
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
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Profile" component={MyAccount} />
        <Stack.Screen name="History" component={ALLHistory} />
        <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
        <Stack.Screen name="About" component={AboutUs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
