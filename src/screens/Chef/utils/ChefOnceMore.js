import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {COLORS, icons} from '../../../constants';
import {Rating, AirbnbRating} from 'react-native-elements';

const ChefOnceMore = ({
  image,
  title,
  distance,
  star,
  marginEnd,
  marginStart,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={{
        borderWidth: 1,
        borderColor: '#DB2728',
        borderRadius: 10,
        marginStart: 25,
        marginTop: 25,
        height: 125,
        maxWidth: 320,
        width: 320,
        marginEnd: 10,
      }}>
      <View
        style={{
          borderRadius: 10,
          paddingStart: 50,
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={styles.moodText}>Chef Ankur Bajaj</Text>
        <Text
          style={{
            fontFamily: 'Segoe UI',
            fontSize: 14,
            color: COLORS.grey,
            marginStart: 25,
            marginTop: 5,
          }}>
          Age - 31 yrs, Cooking Exp - 2 Yrs
        </Text>
        <View
          style={{
            alignSelf: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            marginTop: 5,
            paddingBottom: 10,
          }}>
          {/* <Image source={icons.star} style={styles.star_logo} /> */}
          {/* <AntDesign name="staro" color={'gold'} />
          <AntDesign name="staro" color={'gold'} />
          <AntDesign name="staro" color={'gold'} />
          <AntDesign name="staro" color={'gold'} />
          <AntDesign name="staro" color={'gold'} /> */}
          <AirbnbRating
            count={5}
            showRating={false}
            defaultRating={parseInt(item?.product_rating)}
            size={10}
          />
          <Text
            style={{
              marginHorizontal: 3,
              fontFamily: 'Segoe UI Bold',
              fontSize: 14,
              color: COLORS.black,
              // marginTop: 0,
              alignSelf: 'center',
              marginVertical: 2,
            }}>
            4.5
          </Text>
          <Text
            style={{
              // marginHorizontal: 10,
              fontFamily: 'Segoe UI',
              fontSize: 10,
              color: '#0638ff',
              // marginTop: 0,
              alignSelf: 'center',
              marginVertical: 2,
            }}>
            (15 Reviews)
          </Text>
        </View>
      </View>
      <View
        style={{
          height: 105,
          width: 104.5,
          borderRadius: 100,
          position: 'absolute',
          left: -17,
          bottom: 35,
          borderWidth: 2,
          borderColor: '#db2728',
          //   paddingStart: 5,
          justifyContent: 'center',
          backgroundColor: COLORS.white,
        }}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fGNoZWZ8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
          }}
          style={{
            height: 100,
            width: 100,
            borderRadius: 100,
            // position: 'absolute',
            // left: -15,
            // bottom: 35,
          }}
        />
      </View>
      {/* <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          // setFavorite(!favorite);
        }}
        style={styles.fav}>
        <Image
          source={icons.favorite}
          style={{
            width: 30,
            height: 30,
            tintColor: '#ff0000',
          }}
        />
      </TouchableOpacity> */}
      <View
        style={{
          marginHorizontal: 10,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            marginHorizontal: 3,
            fontFamily: 'Segoe UI',
            fontSize: 14,
            color: COLORS.black,
            paddingBottom: 10,
            marginVertical: 2,
          }}>
          Order Served - 12
        </Text>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Image source={icons.scooter} style={styles.distance_logo} />
          <Text style={styles.distance} numberOfLines={1}>
            2.0 KM
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChefOnceMore;

const styles = StyleSheet.create({
  moodText: {
    fontFamily: 'Segoe UI Bold',
    fontSize: 18,
    color: 'rgba(0, 0, 0, 255)',
    marginTop: 15,
  },
  fav: {
    right: -12,
    top: -12,
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: '#f5f5f5',
  },
  star_logo: {
    width: 12,
    height: 12,

    resizeMode: 'cover',
  },
  distance: {
    color: COLORS.grey,
    marginTop: 2,
    fontFamily: 'Segoe UI',
    fontSize: 12,
    marginStart: 10,
    // paddingBottom: 15,
  },
  distance_logo: {
    // paddingBottom: 15,
    width: 15,
    height: 15,
    marginBottom: 10,
    resizeMode: 'cover',
  },
});
