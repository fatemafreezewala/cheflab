import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import {COLORS} from '../../constants';
import {horizScale} from '../../constants/themes';

const WhatsMind = ({
  id,
  image,
  title,
  fromRestaurant,
  fromCuisine,
  marginStart,
  marginEnd,
}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        console.log('fromRestaurant ->>', fromRestaurant);
        fromRestaurant
          ? navigation.navigate('RestaurantList', {title, id, fromCuisine})
          : navigation.navigate('ChefList', {title, id});

        // fromRestaurant
        //   ? navigation.navigate('RestaurantNavigation', {
        //       screen: 'RestaurantList',
        //       params: {title: title},
        //     })
        //   : navigation.navigate('ChefNavigation', {
        //       screen: 'ChefList',
        //       params: {title: title},
        //     });
      }}
      activeOpacity={0.8}
      style={{
        alignItems: 'center',
        marginEnd: marginEnd,
        marginStart: marginStart,
        paddingHorizontal: 5,
      }}>
      <Image source={{uri: image + ''}} style={styles.image} />
      <Text style={styles.text} numberOfLines={1}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default WhatsMind;

export const WhatsMindSkeleton = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
      }}>
      <View>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={65}
          height={65}
          style={{
            marginTop: 10,
            marginStart: 10,
            borderRadius: 60,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={65}
          height={15}
          style={{
            marginTop: 10,
            marginStart: 10,
            borderRadius: 10,
          }}
        />
      </View>
      <View>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={65}
          height={65}
          style={{
            marginTop: 10,
            marginStart: 10,
            borderRadius: 60,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={65}
          height={15}
          style={{
            marginTop: 10,
            marginStart: 10,
            borderRadius: 10,
          }}
        />
      </View>
      <View>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={65}
          height={65}
          style={{
            marginTop: 10,
            marginStart: 10,
            borderRadius: 60,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={65}
          height={15}
          style={{
            marginTop: 10,
            marginStart: 10,
            borderRadius: 10,
          }}
        />
      </View>
      <View>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={65}
          height={65}
          style={{
            marginTop: 10,
            marginStart: 10,
            borderRadius: 60,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={65}
          height={15}
          style={{
            marginTop: 10,
            marginStart: 10,
            borderRadius: 10,
          }}
        />
      </View>
      <View>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={65}
          height={65}
          style={{
            marginTop: 10,
            marginStart: 10,
            borderRadius: 60,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={65}
          height={15}
          style={{
            marginTop: 10,
            marginStart: 10,
            borderRadius: 10,
          }}
        />
      </View>
      <View>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={65}
          height={65}
          style={{
            marginTop: 10,
            marginStart: 10,
            borderRadius: 60,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={65}
          height={15}
          style={{
            marginTop: 10,
            marginStart: 10,
            borderRadius: 10,
          }}
        />
      </View>
      <View>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={65}
          height={65}
          style={{
            marginTop: 10,
            marginStart: 10,
            borderRadius: 60,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={65}
          height={15}
          style={{
            marginTop: 10,
            marginStart: 10,
            borderRadius: 10,
          }}
        />
      </View>
      <View>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={65}
          height={65}
          style={{
            marginTop: 10,
            marginStart: 10,
            borderRadius: 60,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={65}
          height={15}
          style={{
            marginTop: 10,
            marginStart: 10,
            borderRadius: 10,
          }}
        />
      </View>
    </View>
  );
};
export const WhatsMindTitleSkeleton = () => {
  return (
    <ShimmerPlaceHolder
      // shimmerColors={['#F2F8FC', '#F2F8FC', '#F2F8FC']}
      LinearGradient={LinearGradient}
      style={{
        marginTop: 5,
        marginStart: 15,
      }}
      width={Dimensions.get('window').width - 30}></ShimmerPlaceHolder>
  );
};
const styles = StyleSheet.create({
  image: {
    width: 60,
    height: 60,
    marginTop: 5,
    resizeMode: 'center',
    borderRadius: 50,
    // borderColor: COLORS.primary,
    // borderWidth: 1.5,
    padding: 5,
  },
  text: {
    // backgroundColor: COLORS.darkGray,
    color: COLORS.darkGray,
    marginTop: 5,
    fontFamily: 'Segoe UI',
    fontSize: horizScale(13),
    maxWidth: 75,
  },
});
