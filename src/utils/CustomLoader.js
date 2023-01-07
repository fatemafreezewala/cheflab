// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React from 'react';
import {ActivityIndicator, Modal, StyleSheet, View} from 'react-native';
import {COLORS} from '../constants/index';

const CustomLoader = props => {
  const {loading, ...attributes} = props;

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={loading}
      onRequestClose={() => {
        console.log('close modal');
      }}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator
            animating={true}
            color={COLORS.primary}
            size="large"
            style={styles.activityIndicator}
          />
        </View>
      </View>
    </Modal>
  );
};

export default CustomLoader;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: COLORS.transparent,
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
});
/*
1) Current Location fetching not accurate
2)User to Restaurant Location fetching not accurate
3)Without processing payment it is showing "Order Succesfull"
4)WATI Dashboard
5)Set Delivery Charges as per km. Kilometer is showing wrong from current location to restaurant.
 zomato and Google map location are same.
6)Plus and Minus Button for AddOns 
7)Veg and NonVeg Check Box in Variants and Addons. 
8)If someone search a restaurant which is closed, it should show in the search but closed so they know it 
is there with us but closed for now.
9)Closed restaurants should not be shown in Dishes search.
10) Delete extra restaurants from Admin Panel. Activate that feature.
11)Multiple cuisine are made of same name. Need to delete dishes and put in one and then delete the
remaining cuisene
12)Explain Promotion Tab in Vendor and Admin Panel in detail. Image/ Time slot/ Payment 
13)Food Category numbering Sequence is not set right. Item Code and Category
14)If the restaurant is Closed it should be shown in Featured Dishes or Restaurant.
15)How will rider unique code will be generated.
16)When we are listing a new vendor and its activated. it will show in the user app. We should have 
feature to complete the restaurant in Inactive mode then Live it
17)Same Restaurant Brands with multiple outlets. we need feature to copy paste the product and prices.
18)Rest. will only have access to Activate/De-active the dish & set the sequence of Menu Catalog. 
Rest every thing Edit / Add New or Delete anything should go in review.
19)Once we are in Market. De-active the Product Delete button from Vendor Panel.
20)When we search any dish. It only show 5 Results.
21)Increase the limit of Menu Catalog per page to 15 or 20. 
22)Time zone in Panel is not right.It is showing 5-6 hours before time
23)Forgot Password OTP To registered Mobile and Email
24)In search dishes it is showing products of inactive rests.also and from there we are able to enter the rest. menu
25)Browse Menu sequence is not showing correct how we are putting position.Also if we click on something it takes us to some other menu.
26)If veg/ non veg is not selected. By default it makes it Non Veg Restaurant
27)1 Rs issue is not solved till now
28)Msg to chef and Cutlery is not showing in Vendor panel.
*/
