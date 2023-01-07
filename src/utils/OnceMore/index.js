import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {COLORS, icons} from '../../constants';
import {Rating, AirbnbRating} from 'react-native-elements';

const OnceMore = ({image, title, distance, star, marginEnd, marginStart}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={{
        padding: 10,
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        marginEnd: marginEnd,
        marginStart: marginStart,
        elevation: 10,
        borderRadius: 10,
        width: 200,
        marginTop: 5,
        // paddingBottom: 10,
        marginBottom: 10,
      }}>
      <View
        style={{
          backgroundColor: COLORS.white,
          borderRadius: 10,
          elevation: 10,
        }}>
        <Image source={image} style={styles.image} />
      </View>
      <View
        style={{
          alignItems: 'flex-start',
        }}>
        <Text style={styles.text} numberOfLines={1}>
          {title}
        </Text>
        <View
          style={{
            marginStart: 10,
            marginTop: 8,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image source={icons.scooter} style={styles.distance_logo} />
          <Text style={styles.distance} numberOfLines={1}>
            {distance}
          </Text>
        </View>
        <View
          style={{
            marginStart: 10,
            marginTop: 8,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#829bff',
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 10,
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
            defaultRating={parseInt(star)}
            isDisabled={true}
            size={10}
          />
          <Text style={styles.starText} numberOfLines={1}>
            {star}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OnceMore;

const styles = StyleSheet.create({
  image: {
    width: 70,
    height: 70,
    marginTop: 5,
    resizeMode: 'cover',
  },
  distance_logo: {
    width: 15,
    height: 15,
    resizeMode: 'cover',
  },
  star_logo: {
    width: 10,
    height: 10,

    resizeMode: 'cover',
  },
  text: {
    color: COLORS.black,
    // marginTop: 5,
    fontFamily: 'Segoe UI Bold',
    fontSize: 14,
    marginStart: 10,
  },
  distance: {
    color: COLORS.black,
    marginTop: 5,
    fontFamily: 'Segoe UI',
    fontSize: 12,
    marginStart: 10,
  },
  starText: {
    color: COLORS.white,
    // marginTop: 5,
    fontFamily: 'Segoe UI Bold',
    fontSize: 10,
    marginStart: 5,
  },
});
