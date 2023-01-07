import LottieView from 'lottie-react-native';
import React, {useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Animations, COLORS} from '../../constants';
import {horizScale} from '../../constants/themes';

const OrderPlaced = ({navigation, route}) => {
  let {item} = route?.params;
  useEffect(() => {
    setTimeout(() => {
      // navigation.reset({
      //   index: 0,
      //   routes: [{name: 'MainContainer'}],
      // });
      // navigation.replace('MainContainer', {
      //   screen: 'Home',
      //   params: {
      //     intentFromMap: false,
      //   },
      // });
      navigation.replace('TrackOrder', {item});
    }, 3000);
  }, []);
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
      }}>
      {/* <Image
        source={{
          uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgL54f8y2KvkViOnugSECHrjF6P0VazvrhZg&usqp=CAU',
        }}
        style={{
          width: 150,
          height: 150,
          // resizeMode: 'center',
          marginVertical: 20,
        }}
      /> */}
      <LottieView
        source={Animations.check_mark}
        // source={Animations.process_failed}
        style={{
          height: 200,
          width: 200,
          marginVertical: 15,
        }}
        autoPlay={true}
        loop={false}
      />
      <Text
        style={{
          fontSize: 22,
          color: COLORS.darkGray,
          fontFamily: 'Segoe UI Bold',
          marginStart: horizScale(12),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        Order Placed Successfully
      </Text>

      <TouchableOpacity
        onPress={() => {
          navigation.replace('TrackOrder', {item: {}});

          // navigation.reset({
          //   index: 0,
          //   routes: [{name: 'MainContainer'}],
          // });
          // navigation.replace('MainContainer', {
          //   screen: 'Order',
          //   params: {
          //     intentFromMap: false,
          //   },
          // });
        }}
        activeOpacity={0.8}
        style={{
          paddingHorizontal: 50,
          backgroundColor: COLORS.primary,
          alignItems: 'center',
          alignSelf: 'center',
          justifyContent: 'center',
          paddingVertical: 10,
          borderRadius: 10,
          marginVertical: 25,
          // position: 'relative',
          // bottom: 15,
          width: '90%',
        }}>
        <Text
          style={{
            fontFamily: 'Segoe UI Bold',
            fontSize: 22,
            color: COLORS.white,
          }}>
          {/* Back to Home */}
          Track Order
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderPlaced;

const styles = StyleSheet.create({});
