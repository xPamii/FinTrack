import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Feather from '@expo/vector-icons/Feather'
import AntDesign from '@expo/vector-icons/AntDesign'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs' // ✅ import types

const Colors = {
  primary: "#006eebff",
  text: "#333",
}

const TabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  // infer route names directly from state
  type RouteName = typeof state.routes[number]["name"]

  const icons: Partial<Record<RouteName, (props: { color: string }) => React.ReactNode>> = {
    Dashboard: (props) => <AntDesign name="home" size={24} {...props} />,
    AddExpense: (props) => <AntDesign name="plus" size={28} {...props} />,
    AllHistory: (props) => <Feather name="search" size={24} {...props} />,
    Reports: (props) => <AntDesign name="barchart" size={24} {...props} />,
    MyAccount: (props) => <AntDesign name="user" size={24} {...props} />,
  }

  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const rawLabel =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name

        const label = typeof rawLabel === "string" ? rawLabel : route.name


        if (['_sitemap', '+not-found'].includes(route.name)) return null

        const isFocused = state.index === index

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params)
          }
        }

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          })
        }

        return (
          <TouchableOpacity
            key={route.name}
            style={styles.tabbarItem}
            onPress={() => navigation.navigate(route.name, route.params)}
          >
            {icons[route.name]
              ? icons[route.name]!({ color: isFocused ? Colors.primary : Colors.text })
              : null}
            <Text style={{ color: isFocused ? Colors.primary : Colors.text }}>
              {label}
            </Text>
          </TouchableOpacity>

        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  tabbar: {
    position: 'absolute',
    bottom: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    borderCurve: 'continuous',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  tabbarItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default TabBar
