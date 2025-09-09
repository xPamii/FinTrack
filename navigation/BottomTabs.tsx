import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Dashboard from "../app/Dashboard";
import AddExpenseScreen from "../app/AddExpense";
import ALLHistory from "../app/AllHistory";
import MyAccount from "../app/MyAccount";
import TabBar from "../components/TabBar"; // your custom tab bar

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />} // ✅ custom tabbar here
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="AddExpense" component={AddExpenseScreen} />
      <Tab.Screen name="AllHistory" component={ALLHistory} />
      <Tab.Screen name="MyAccount" component={MyAccount} />
    </Tab.Navigator>
  );
}
