import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useIsFocused} from '@react-navigation/native';
import React, {useState} from 'react';
import {Animated, StyleSheet, TouchableOpacity, View} from 'react-native';
import {COLORS, SIZES} from '../../constants/index';
import Chef from './Chef';
import Dining from './Dining';
import Restaurant from './Restaurant';

const Tab = createMaterialTopTabNavigator();

const CAMERA_TAB_ITEM_WIDTH = SIZES.width * 0.1;
const NORMAL_TAB_ITEM_WIDTH = SIZES.width / 2;

const MyTabBar = ({state, descriptors, navigation, position}) => {
  const [data, setData] = useState(0);
  const [rest, setRest] = useState(0);
  const [dine, setDine] = useState(0);
  const [apiToken, setApiToken] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);

  const isFocused = useIsFocused();

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: COLORS.primaryColor,
        paddingBottom: 5,
        marginVertical: 5,
        // marginVertical: 0,
        marginHorizontal: 5,
      }}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;
        const tabBarItemWidth = NORMAL_TAB_ITEM_WIDTH;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate({
              name: route.name,
              merge: true,
            });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            activeOpacity={0.8}
            key={route.name}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              paddingHorizontal: 0,
              height: 35,
              // height: 0,
              backgroundColor: isFocused ? COLORS.primary : '#e7e7e7',
              borderRadius: 10,
              // marginVertical: 10,
              marginHorizontal: 5,
              alignItems: 'center',
              //   justifyContent: 'center',
              flex: 1,
              flexDirection: 'row',
            }}>
            <Animated.Text
              style={{
                color: isFocused ? COLORS.white : COLORS.primaryColor,
                fontSize: 16,
                fontFamily: 'Segoe UI Bold',
                marginEnd: 'auto',
                marginStart: 'auto',
              }}>
              {label}
            </Animated.Text>
          </TouchableOpacity>
        );
      })}
      {/* <TabBarIndicator state={state} /> */}
    </View>
  );
};

let params = JSON.stringify({
  user_id: '25',
});

const TopTabBar = ({items}) => {
  return (
    <Tab.Navigator
      tabBar={props => <MyTabBar {...props} />}
      style={{
        // marginVertical: 0,
        marginVertical: 5,
      }}
      backBehavior="none"
      unmountOnBlur={true}
      screenOptions={{}}>
      {/* <Tab.Screen
        name="Chef"
        component={Chef}
        options={{
          swipeEnabled: false,
          unmountOnBlur: true,
        }}
      /> */}
      <Tab.Screen
        name="Restaurant"
        component={Restaurant}
        options={{
          unmountOnBlur: true,
          swipeEnabled: false,
        }}
      />
      <Tab.Screen
        name="Dishes"
        component={Dining}
        options={{
          unmountOnBlur: true,
          swipeEnabled: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default TopTabBar;
const styles = StyleSheet.create({});
