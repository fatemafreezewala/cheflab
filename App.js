import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {LogBox, StyleSheet, SafeAreaView} from 'react-native';
import BottomTabNav from './src/bottom_tab_nav';
import Login from './src/screens/Auth/Login/index';
import Signup from './src/screens/Auth/Signup/index';
import SignupInfo from './src/screens/Auth/SignupInfo';
import Splash from './src/screens/Auth/Splash/index';
import Chef from './src/screens/Chef';
import DineOut from './src/screens/DineOut';
import Restaurant from './src/screens/Restaurant';
import List from './src/screens/Restaurant/List';
// import RestaurantNavigation from './src/screens/Restaurant/navigation/RestaurantNavigation';
// import ChefNavigation from './src/screens/Chef/navigation/ChefNavigation';
import {Provider} from 'react-redux'; // redux
import configureStore from './src/redux/store/configureStore';
import About from './src/screens/About';
import AboutUs from './src/screens/About/AboutUs';
import CancellationPolicy from './src/screens/About/CancellationPolicy';
import ContactUs from './src/screens/About/ContactUs';
import FAQS from './src/screens/About/FAQS';
import PrivacyPolicy from './src/screens/About/PrivacyPolicy';
import TermsAndConditions from './src/screens/About/TermsAndConditions';
import Cart from './src/screens/Cart';
import ChefDetails from './src/screens/Chef/Details';
import DishInformation from './src/screens/Chef/DishInformation';
import ChefList from './src/screens/Chef/List';
import Profile from './src/screens/Chef/Profile';
import ChefSearch from './src/screens/Chef/Search';
import BookingStatus from './src/screens/DineOut/BookingStatus';
import Favorites from './src/screens/Favorites';
import MainTopNav from './src/screens/MainTopNav';
import OrderPlaced from './src/screens/Order/OrderPlaced';
import TrackOrder from './src/screens/Order/TrackOrder';
import Payment from './src/screens/Payment';
import EditProfile from './src/screens/Profile/EditProfile';
import RestaurantDetails from './src/screens/Restaurant/Details';
import RestDishInformation from './src/screens/Restaurant/DishInformation';
import Search from './src/screens/Restaurant/Search';
import SavedAddress from './src/screens/SavedAddress';
import RechargeWallet from './src/screens/Wallet/RechargeWallet';
import messaging from '@react-native-firebase/messaging';
import {enableScreens} from 'react-native-screens';
import DineoutSearch from './src/screens/DineOut/Search';
import Maps from './src/screens/Maps';
import OrderCancelled from './src/screens/Order/OrderCancelled';
import notifee, {AndroidImportance} from '@notifee/react-native';
enableScreens(false);

import {requestUserPermission} from './src/firebase/notificationService';
import AppContext from './src/AppContext';

// import {Notifications} from 'react-native-notifications';

const Stack = createNativeStackNavigator();
LogBox.ignoreAllLogs();
// LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
// LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.',
]);

const store = configureStore();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="SignupInfo" component={SignupInfo} />
    </Stack.Navigator>
  );
};

const App = () => {
  const [setting1value, setSetting1value] = useState('initialValue1');
  const [setting2value, setSetting2value] = useState(false);

  const [notificationData, setNotificationData] = useState({});

  const userSettings = {
    notificationData: notificationData,
  };

  useEffect(() => {
    requestUserPermission();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (
        remoteMessage.data?.data != null &&
        remoteMessage.data?.data != undefined
      ) {
        let data = JSON.parse(remoteMessage.data?.data);
        // console.log('unsubscribe onMessage -> ', data);
        setNotificationData(data);
        setNotificationData(remoteMessage);
      }
      DisplayNotification(remoteMessage);
    });
    return unsubscribe;
  }, []);

  /** notification start */
  useEffect(() => {
    // let subscription = DeviceEventEmitter.addListener(
    //   'notificationHandle',
    //   function (e) {
    //     console.log('notificationHandle -> ', JSON.stringify(e));
    //   },
    // );
    // return function cleanUp() {
    //   subscription.remove();
    // };
  }, []);
  /** notification end */

  const DisplayNotification = async remoteMessage => {
    const channelId = await notifee.createChannel({
      id: 'ChefLab',
      name: 'ChefLab_Channel',
      importance: AndroidImportance.HIGH,
    });
    await notifee.displayNotification({
      title: remoteMessage.notification.title,
      body: remoteMessage.notification.body,
      android: {
        channelId: channelId,
        actions: [
          {
            title: 'Accept',
            pressAction: {id: 'accept'},
          },
          {
            title: 'Decline',
            pressAction: {id: 'decline'},
          },
        ],
        loopSound: true,
      },
    });
  };
  if (!__DEV__) {
    console.log = () => {};
    console.info = () => {};
    console.warn = () => {};
    console.debug = () => {};
    console.error = () => {};
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <Provider store={store}>
        <AppContext.Provider value={userSettings}>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
              }}>
              <Stack.Screen name="Auth" component={AuthStack} />
              <Stack.Screen name="MainContainer" component={BottomTabNav} />
              <Stack.Screen name="MainTopNav" component={MainTopNav} />

              <Stack.Screen name="Restaurant" component={Restaurant} />
              <Stack.Screen name="RestaurantList" component={List} />
              <Stack.Screen name="ChefSearch" component={ChefSearch} />
              <Stack.Screen name="Search" component={Search} />
              <Stack.Screen name="Chef" component={Chef} />
              <Stack.Screen name="ChefList" component={ChefList} />
              <Stack.Screen name="Profile" component={Profile} />
              <Stack.Screen
                name="DishInformation"
                component={DishInformation}
              />
              {/* <Stack.Screen name="Search" component={Search} /> */}
              <Stack.Screen name="ChefDetails" component={ChefDetails} />
              <Stack.Screen name="DineOut" component={DineOut} />
              <Stack.Screen
                name="RestaurantDetails"
                component={RestaurantDetails}
              />
              {/* <Stack.Screen name="Chef" component={ChefNavigation} /> */}
              <Stack.Screen name="BookingStatus" component={BookingStatus} />
              <Stack.Screen name="Cart" component={Cart} />
              <Stack.Screen name="Payment" component={Payment} />
              <Stack.Screen name="OrderPlaced" component={OrderPlaced} />
              <Stack.Screen name="OrderCancelled" component={OrderCancelled} />
              <Stack.Screen name="About" component={About} />
              <Stack.Screen name="Favorites" component={Favorites} />
              <Stack.Screen name="SavedAddress" component={SavedAddress} />
              <Stack.Screen name="EditProfile" component={EditProfile} />
              <Stack.Screen name="AboutUs" component={AboutUs} />
              <Stack.Screen name="ContactUs" component={ContactUs} />
              <Stack.Screen name="FAQS" component={FAQS} />
              <Stack.Screen name="RechargeWallet" component={RechargeWallet} />
              <Stack.Screen name="DineoutSearch" component={DineoutSearch} />
              <Stack.Screen name="Maps" component={Maps} />
              <Stack.Screen
                name="TermsAndConditions"
                component={TermsAndConditions}
              />
              <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
              <Stack.Screen
                name="CancellationPolicy"
                component={CancellationPolicy}
              />
              <Stack.Screen
                name="RestDishInformation"
                component={RestDishInformation}
              />
              <Stack.Screen name="TrackOrder" component={TrackOrder} />
            </Stack.Navigator>
            {/* <TrackOrder /> */}
          </NavigationContainer>
        </AppContext.Provider>
      </Provider>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
});

/**
  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const paddingToBottom = 100;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };
 */

/**
 * search
 * cuisine me search sah i se data
 *
 */

/**
 * 1 - veg
 * 2 - eggs
 * 3 - non veg
 */

/**
https://web10technologies.com/Chelab_full_project/public/api/view-cart
request 
{
    "user_id": "3"
}

 {
    "status": true,
    "message": "Data Get Successfully",
    "response": {
        "cart_id": 39,
        "cart": [
            {
                "variants": [
                    {
                        "variant_name": "3 Burger",
                        "variant_price": "150.00",
                        "variant_id": 13,
                        "added": true,
                        "qty": 5
                    },
                    {
                        "variant_name": "2222",
                        "variant_price": "26.00",
                        "variant_id": 6678,
                        "added": false
                    }
                ],
                "addons": [
                    {
                        "id": 4,
                        "addon": "Chopped Onion",
                        "price": "10.00",
                        "added": true,
                        "qty": 1
                    },
                    {
                        "id": 1481,
                        "addon": "test",
                        "price": "200.00",
                        "added": false
                    },
                    {
                        "id": 1483,
                        "addon": "Brownies",
                        "price": "25.00",
                        "added": false
                    }
                ],
                "product_id": 2,
                "product_name": "Burger",
                "product_qty": 5,
                "product_image": "https://web10technologies.com/Chelab_full_project/public/products/1665854004-restaurant-product-908.jpg",
                "category": 88,
                "menu_id": 1,
                "dis": "Burger",
                "type": "veg",
                "product_price": "150.00",
                "customizable": "true",
                "product_for": "3",
                "product_rating": "0"
            }
        ],
        "vendor": {
            "id": 1,
            "name": "jaini food",
            "owner_name": null,
            "email": "jainifood@gmail.com",
            "password": "$2y$10$DAE6r6J29Y075HIGwihpXep1iEvG0xrG/pKXelje2uUIE.CS6k5ke",
            "dob": null,
            "experience": null,
            "is_online": 1,
            "vendor_type": "restaurant",
            "deal_categories": "88,91,92,99,101",
            "deal_cuisines": "1,2,4,5,8,11,21,22",
            "status": "1",
            "mobile": "9424567807",
            "pincode": "452001",
            "address": "bchbckshcbmscbhjav",
            "fssai_lic_no": "22664113313",
            "gst_available": "1",
            "gst_no": null,
            "tax": "5",
            "other_document": null,
            "other_document_image": null,
            "image": "logo-4KWdksbVeK6348326dad336.png",
            "profile_image": "",
            "banner_image": "[\"1668772550-banner-271.png\"]",
            "speciality": null,
            "licence_image": null,
            "wallet": "0.00",
            "commission": "9",
            "vendor_ratings": 4,
            "review_count": 4,
            "vendor_food_type": "1",
            "long": 75.887257000000005291440174914896488189697265625,
            "lat": 22.724180000000000489990270580165088176727294921875,
            "pancard_number": "",
            "pancard_image": "",
            "fcm_token": null,
            "aadhar_number": "",
            "aadhar_card_image": "",
            "table_service": "1",
            "is_all_setting_done": 1,
            "bio": null,
            "deleted_at": null,
            "created_at": "2022-10-13T15:39:04.000000Z",
            "updated_at": "2022-11-18T11:55:50.000000Z"
        },
        "wallet_amount": 7869,
        "max_cod_amount": ""
    }
}

chef ke register now button 

redirect karna hai

////////// CHECF FUNCTION
Love cooking for Others ?

Then we are looking for you.

Register your 5 speciality Dishes with us and we will share it with the world.

REGISTER NOW



///////////////// DINING FUNCT
Coming Soon...

Now you can offer discounts to your customers on their DineIn bills with Cheflab.

REGISTER NOW  ---- CLICK REDIRECT ---- https://cheflab.in/dinning/
 */
