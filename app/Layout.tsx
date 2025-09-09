import React from 'react';
import { Tabs } from 'expo-router';
import TabBar from '../components/TabBar';


export default function Layout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen
        name="Dashboard"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="AddExpense"
        options={{
          title: "Add",
        }}
      />
      <Tabs.Screen
        name="AllHistory"
        options={{
          title: "History",
        }}
      />
      <Tabs.Screen
        name="MyAccount"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  )
}
