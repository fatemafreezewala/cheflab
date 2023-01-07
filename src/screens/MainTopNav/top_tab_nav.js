import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React, {useState} from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS, icons, SIZES} from '../../constants/index';
import Chef from '../Chef';
import DineOut from '../DineOut';
import Restaurant from '../Restaurant';

const Tab = createMaterialTopTabNavigator();

const CAMERA_TAB_ITEM_WIDTH = SIZES.width * 0.1;
const NORMAL_TAB_ITEM_WIDTH = SIZES.width / 2;

const MyTabBar = ({state, descriptors, navigation, position}) => {
  // console.log(
  //   'map >>> state => ',
  //   JSON.stringify(state) +
  //     ' descriptors > ' +
  //     JSON.stringify(descriptors) +
  //     ' navigation > ' +
  //     JSON.stringify(navigation) +
  //     ' position > ' +
  //     JSON.stringify(position),
  // );

  let lab = '';
  // state.routes.map((route, index) => {
  //   const {options} = descriptors[route.key];
  //   const label =
  //     options.tabBarLabel !== undefined
  //       ? options.tabBarLabel
  //       : options.title !== undefined
  //       ? options.title
  //       : route.name;
  //   // lab = label;
  // });

  const onPress = (key, name, isFocus) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: key,
      canPreventDefault: true,
    });

    if (!isFocus && !event.defaultPrevented) {
      navigation.navigate({
        name: name,
        merge: true,
      });
      lab = name;

      console.log('map >>> ', key + ' ' + name + ' ' + isFocus + ' ' + lab);
    }
  };

  const onLongPress = route_name => {
    navigation.emit({
      type: 'tabLongPress',
      target: route_name,
    });
  };

  return (
    <View
      style={{
        width: '100%',
      }}>
      <TouchableOpacity
        onPress={() => {
          // console.log('lab--->>> ', lab);
          if (lab == 'Chef') {
            navigation.navigate('ChefSearch');
          } else if (lab == 'Restaurant') {
            navigation.navigate('Search');
          } else if (lab == 'Dining') {
            navigation.navigate('DineoutSearch');
          }
        }}
        style={{
          height: 35,
          width: '95%',
          borderColor: '#707070',
          borderWidth: 1,
          borderRadius: 5,
          alignSelf: 'center',
          alignItems: 'center',
          marginBottom: 15,
          marginTop: 15,
          flexDirection: 'row',
        }}
        activeOpacity={0.8}>
        <Text
          style={{
            flex: 1,
            color: COLORS.darkGray,
            paddingStart: 10,
            fontFamily: 'Segoe UI',
          }}
          numberOfLines={1}>
          Search...
        </Text>
        <View
          style={{
            marginStart: 8,
            backgroundColor: 'rgba(112, 112, 112, 255)',
            height: 18,
            width: 1,
            marginEnd: 7,
          }}
        />
        <Image
          source={icons.search}
          style={[
            {
              width: 20,
              height: 20,
              resizeMode: 'center',
              marginEnd: 10,
            },
          ]}
        />
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          // backgroundColor: '#ff0000',
          paddingBottom: 5,
          marginVertical: 0,
          // marginVertical: 5,
          marginHorizontal: 5,
          // width: '100%',
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
          if (isFocused) {
            lab = label;
          }
          const tabBarItemWidth = NORMAL_TAB_ITEM_WIDTH;

          // const onPress = () => {
          //   const event = navigation.emit({
          //     type: 'tabPress',
          //     target: route.key,
          //     canPreventDefault: true,
          //   });

          //   if (!isFocused && !event.defaultPrevented) {
          //     navigation.navigate({
          //       name: route.name,
          //       merge: true,
          //     });
          //   }
          // };

          return (
            <TouchableOpacity
              key={route.name}
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={() => {
                onPress(route.key, route.name, isFocused);
              }}
              onLongPress={() => {
                onLongPress(route.key);
              }}
              style={{
                paddingHorizontal: 0,
                // height: 35,
                height: 0,
                backgroundColor: isFocused ? COLORS.primary : '#e7e7e7',
                borderRadius: 10,
                marginHorizontal: 5,
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              }}>
              <Animated.Text
                style={{
                  color: isFocused ? COLORS.white : COLORS.primaryColor,
                  fontSize: 16,
                  fontFamily: 'Segoe UI Bold',
                }}>
                {label}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
        {/* <TabBarIndicator state={state} /> */}
      </View>
    </View>
  );
};

const TopTabBar = ({items}) => {
  return (
    <Tab.Navigator
      tabBar={props => <MyTabBar {...props} />}
      style={{
        // backgroundColor: COLORS.white,
        // marginVertical: 5,
        marginVertical: 0,
      }}
      backBehavior="none"
      unmountOnBlur={true}
      screenOptions={
        {
          // header: ({route}) => {
          //   return <SearchCustomHeader customRoutes={route} />;
          // },
        }
      }>
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
      {/* <Tab.Screen
        name="Dining"
        component={DineOut}
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

const SearchCustomHeader = ({customRoutes}) => {
  /**
   * params
   * dishes
   * restaurants
   * chef
   */
  const [itemName, setItemName] = useState();

  const callApi = () => {
    let body = {
      keyword: 'pizza',
      search_for: 'dishes',
      search_for: 'restaurants',
      offset: '0',
    };
    // ApiCall('post');
  };

  return (
    <TouchableOpacity
      onPress={() => {}}
      style={{
        height: 35,
        width: '95%',
        borderColor: '#707070',
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center',
        // justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 15,
        flexDirection: 'row',
      }}
      activeOpacity={0.8}>
      <Text
        style={{
          flex: 1,
          color: COLORS.darkGray,
          paddingStart: 10,
          fontFamily: 'Segoe UI',
        }}
        numberOfLines={1}>
        Search...
        {/* Search by Chef or Dish... */}
      </Text>
      <View
        style={{
          marginStart: 8,
          backgroundColor: 'rgba(112, 112, 112, 255)',
          height: 18,
          width: 1,
          marginEnd: 7,
        }}
      />
      <Image
        source={icons.search}
        style={[
          {
            width: 20,
            height: 20,
            resizeMode: 'center',
            marginEnd: 10,
          },
        ]}
      />
    </TouchableOpacity>
  );
};
