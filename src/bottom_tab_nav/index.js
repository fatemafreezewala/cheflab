import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {COLORS} from '../constants/index';
import Home from '../screens/Home/index';
import Profile from '../screens/Profile/index';
import Wallet from '../screens/Wallet/index';
import Order from '../screens/Order/index';
import {STRING} from '../constants/Strings';
import {icons} from '../constants/index';

const Tab = createBottomTabNavigator();

const BottomTabNav = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          height: 56,
          borderTopRightRadius: 15,
          borderTopLeftRadius: 15,
        },
        tabBarItemStyle: {
          marginHorizontal: 10,
        },
      }}
      initialRouteName="Home"
      style={{
        backgroundColor: COLORS.white,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                // backgroundColor: COLORS.greenButtonBgColor,
                flex: 1,
              }}>
              <Image
                source={icons.home}
                style={[
                  styles.image,
                  {tintColor: focused ? COLORS.primary : COLORS.grey},
                ]}
              />
              {focused ? (
                <View
                  style={[
                    {
                      backgroundColor: focused ? COLORS.primary : COLORS.grey,
                    },
                    styles.bottomLine,
                  ]}
                />
              ) : null}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Order"
        component={Order}
        options={{
          tabBarIcon: ({focused}) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                // backgroundColor: COLORS.greenButtonBgColor,
                flex: 1,
              }}>
              <Image
                source={icons.order}
                style={[
                  styles.image,
                  {tintColor: focused ? COLORS.primary : COLORS.grey},
                ]}
              />
              {focused ? (
                <View
                  style={[
                    {
                      backgroundColor: focused ? COLORS.primary : COLORS.grey,
                    },
                    styles.bottomLine,
                  ]}
                />
              ) : null}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={Wallet}
        initialParams={{item: {}}}
        options={{
          tabBarIcon: ({focused}) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                // backgroundColor: COLORS.greenButtonBgColor,
                flex: 1,
              }}>
              <Image
                source={icons.wallet}
                style={[
                  styles.image,
                  {tintColor: focused ? COLORS.primary : COLORS.grey},
                ]}
              />
              {focused ? (
                <View
                  style={[
                    {
                      backgroundColor: focused ? COLORS.primary : COLORS.grey,
                    },
                    styles.bottomLine,
                  ]}
                />
              ) : null}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({focused}) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                // backgroundColor: COLORS.greenButtonBgColor,
                flex: 1,
              }}>
              <Image
                source={icons.user_profile}
                style={[
                  styles.image,
                  {tintColor: focused ? COLORS.primary : COLORS.grey},
                ]}
              />
              {focused ? (
                <View
                  style={[
                    {
                      backgroundColor: focused ? COLORS.primary : COLORS.grey,
                    },
                    styles.bottomLine,
                  ]}
                />
              ) : null}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNav;

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  image: {
    width: 25,
    resizeMode: 'contain',
    height: 25,
  },
  bottomLine: {
    height: 3,
    width: '70%',
    position: 'absolute',
    bottom: 0,

    borderRadius: 15,
  },
});
