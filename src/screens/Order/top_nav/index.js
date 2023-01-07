import AsyncStorage from '@react-native-async-storage/async-storage';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Animated, StyleSheet, TouchableOpacity, View} from 'react-native';
import {COLORS, SIZES} from '../../../constants/index';
import ApiCall from '../../../network/ApiCall';
import {API_END_POINTS} from '../../../network/ApiEndpoints';
import ChefOrder from './ChefOrder';
import DiningOrder from './DiningOrder';
import RestaurantOrder from './RestaurantOrder';

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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // getInfoFromStorage();
    });
    return () => {
      // unsubscribe();
    };
  }, [navigation]);

  const getInfoFromStorage = async () => {
    let t = 0;
    try {
      await AsyncStorage.getItem('token', (err, value) => {
        if (err) {
        } else {
          if (value !== '' && value !== null) {
            t = value;
            setApiToken(value);
          } else {
            setApiToken('');
          }
        }
      });
      await AsyncStorage.getItem('userId', (err, value) => {
        if (err) {
        } else {
          if (value !== '' && value !== null) {
            setUserId(value);
            getRestDetailsPage(t, value);
            getRest(t, value);
            getDine(t, value);
          } else {
            setUserId('');
          }
        }
      });
    } catch (error) {
      console.log('profile data -> ', JSON.stringify(error));
    }
  };

  useEffect(() => {
    getInfoFromStorage();
    if (isFocused) {
      getInfoFromStorage();
    }
  }, []);

  const getRestDetailsPage = (value, _id) => {
    setLoading(true);
    let body = {
      order_for: 'chef',
      offset: '0',
    };
    // console.log('daa -> ', JSON.stringify(body) + value);
    ApiCall('post', body, API_END_POINTS.getUserOrder, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        console.log('profile data getUserOrder -> ', JSON.stringify(response));
        if (response?.data?.status) {
          // console.log(
          //   'profile data getUserOrder -> ',
          //   JSON.stringify(response?.data),
          // );
          setData(response?.data?.response?.length);
        } else {
          setData(0);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getDine = (value, _id) => {
    setLoading(true);
    let body = {
      order_for: 'dineout',
      offset: '0',
    };
    // console.log('daa -> ', JSON.stringify(body) + value);
    ApiCall('post', body, API_END_POINTS.getUserOrder, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        console.log('profile data getUserOrder -> ', JSON.stringify(response));
        if (response?.data?.status) {
          // console.log(
          //   'profile data getUserOrder -> ',
          //   JSON.stringify(response?.data),
          // );
          setDine(response?.data?.response?.length);
        } else {
          setDine(0);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getRest = (value, _id) => {
    setLoading(true);
    let body = {
      order_for: 'restaurant',
      offset: '0',
    };
    // console.log('daa -> ', JSON.stringify(body) + value);
    ApiCall('post', body, API_END_POINTS.getUserOrder, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        // console.log('profile data getUserOrder -> ', JSON.stringify(response));
        if (response?.data?.status) {
          // console.log(
          //   'profile data getUserOrder -> ',
          //   JSON.stringify(response?.data?.response?.length),
          // );
          setRest(parseInt(rest) + parseInt(response?.data?.response?.length));
        } else {
          setRest(0);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: COLORS.primaryColor,
        paddingBottom: 5,
        // marginVertical: 5,
        marginVertical: 0,
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
              // height: 35,
              height: 0,
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

            {data > 0 && label == 'Chef' ? (
              <Animated.Text
                style={{
                  color: COLORS.black,
                  fontSize: 11,
                  fontFamily: 'Segoe UI Bold',
                  marginEnd: 'auto',
                  marginStart: 'auto',
                  backgroundColor: COLORS.white,
                  paddingVertical: 2,
                  paddingHorizontal: 5,
                  borderRadius: 25,
                }}>
                {data}
              </Animated.Text>
            ) : null}

            {rest > 0 && label == 'Restaurant' ? (
              <Animated.Text
                style={{
                  color: COLORS.black,
                  fontSize: 11,
                  fontFamily: 'Segoe UI Bold',
                  marginEnd: 'auto',
                  marginStart: 'auto',
                  backgroundColor: COLORS.white,
                  paddingVertical: 2,
                  paddingHorizontal: 5,
                  borderRadius: 25,
                }}>
                {rest}
              </Animated.Text>
            ) : null}

            {dine > 0 && label == 'Dining' ? (
              <Animated.Text
                style={{
                  color: COLORS.black,
                  fontSize: 11,
                  fontFamily: 'Segoe UI Bold',
                  marginEnd: 'auto',
                  marginStart: 'auto',
                  backgroundColor: COLORS.white,
                  paddingVertical: 2,
                  paddingHorizontal: 5,
                  borderRadius: 25,
                }}></Animated.Text>
            ) : null}
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
        // backgroundColor: COLORS.white,
        marginVertical: 0,
        // marginVertical: 5,
      }}
      backBehavior="none"
      unmountOnBlur={true}
      screenOptions={{}}>
      {/* <Tab.Screen
        name="Chef"
        component={ChefOrder}
        options={{
          swipeEnabled: false,
          unmountOnBlur: true,
        }}
      /> */}
      <Tab.Screen
        name="Restaurant"
        component={RestaurantOrder}
        options={{
          unmountOnBlur: true,
          swipeEnabled: false,
        }}
      />
      {/* <Tab.Screen
        name="Dining"
        component={DiningOrder}
        options={{
          unmountOnBlur: true,
          swipeEnabled: false,
        }}
      /> */}
    </Tab.Navigator>
  );
};

export default TopTabBar;
const styles = StyleSheet.create({});
