import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

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
const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case "Dashboard":
              iconName = "home-outline";
              break;
            case "AddExpense":
              iconName = "add-circle-outline";
              break;
            case "History":
              iconName = "list-outline";
              break;
            case "Profile":
              iconName = "person-outline";
              break;
            default:
              iconName = "ellipse-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#1E90FF",
        tabBarInactiveTintColor: "gray",
      })}
    >
      {/* Dashboard is the main feed-like tab */}
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="AddExpense" component={AddExpenseScreen} />
      <Tab.Screen name="History" component={ALLHistory} />
      <Tab.Screen name="Profile" component={MyAccount} />
    </Tab.Navigator>
  );
}


export default function App() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("userId");
      setInitialRoute(token ? "Splash" : "Splash"); // can adjust later if needed
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

        {/* Main App with Bottom Tabs */}
        <Stack.Screen name="Main" component={BottomTabs} />

        {/* Extra single screens that are not in tabs */}
        <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
        <Stack.Screen name="About" component={AboutUs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
