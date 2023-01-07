import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {COLORS, icons} from '../../../constants';
import {Rating, AirbnbRating} from 'react-native-elements';

const ListCardView = ({item}) => {
  // console.log(
  //   'data -------------------------------------------',
  //   JSON.stringify(item),
  // );

  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('RestaurantDetails', {bookTable: true, item});
      }}
      activeOpacity={0.9}
      style={{
        margin: 10,
        backgroundColor: COLORS.white,
        elevation: 10,
        borderRadius: 10,
      }}>
      <View
        style={
          {
            // backgroundColor: COLORS.grey,
          }
        }>
        <ImageBackground
          imageStyle={{
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            resizeMode: 'cover',
          }}
          source={{
            uri: item?.image,
          }}
          style={{
            height: 150,
            width: '100%',
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              // setFavorite(!favorite);
            }}
            style={{
              right: 5,
              top: 5,
              position: 'absolute',
              borderRadius: 50,
              backgroundColor: '#f5f5f5',
              alignSelf: 'flex-end',
            }}>
            <Image
              source={icons.favorite}
              style={{
                width: 30,
                height: 30,
                tintColor: item?.is_like != 0 ? '#ff0000' : '#707070',
              }}
            />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              // justifyContent: 'space-between',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 10,
            }}>
            {/* <Image
              style={{
                height: 15,
                width: 80,
                resizeMode: 'center',
              }}
              source={icons.rest_open_now}
            /> */}
            {item?.vendor_food_type != '1' ? (
              <Image
                style={{
                  height: 15,
                  alignSelf: 'center',
                  resizeMode: 'center',
                  width: 80,
                  backgroundColor: COLORS.greenButtonBgColor,
                  borderRadius: 10,
                }}
                source={icons.restpure_veg}
              />
            ) : null}
          </View>
        </ImageBackground>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              marginTop: 10,
              marginHorizontal: 15,
              fontFamily: 'Segoe UI Bold',
              fontSize: 16,
              color: COLORS.black,
              alignSelf: 'flex-start',
            }}>
            {item.name}
          </Text>
          <View
            style={{
              marginEnd: 15,
              marginTop: 5,
              flexDirection: 'row',
              paddingBottom: 15,
              alignItems: 'center',
              marginTop: 5,
            }}>
            <Image source={icons.scooter} style={styles.distance_logo} />
            <Text style={styles.distance} numberOfLines={1}>
              {item?.distance} KM
            </Text>
          </View>
        </View>
        <Text
          style={{
            color: COLORS.grey,
            // marginTop: 2,
            fontFamily: 'Segoe UI',
            fontSize: 14,
            marginStart: 15,
          }}
          numberOfLines={1}>
          {item?.categories.toString()}
        </Text>

        <View
          style={{
            // alignSelf: 'flex-start',
            alignItems: 'center',
            flexDirection: 'row',
            marginStart: 15,
            marginTop: 5,
            paddingBottom: 10,
          }}>
          {item?.vendor_ratings == 0 ? null : (
            <>
              {/* <AntDesign name="staro" color={'gold'} />
              <AntDesign name="staro" color={'gold'} />
              <AntDesign name="staro" color={'gold'} />
              <AntDesign name="staro" color={'gold'} />
              <AntDesign name="staro" color={'gold'} /> */}
              <AirbnbRating
                count={5}
                isDisabled={true}
                showRating={false}
                defaultRating={parseInt(item?.vendor_ratings)}
                size={10}
              />
            </>
          )}

          {item?.vendor_ratings == 0 ? null : (
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
              {item?.vendor_ratings}
            </Text>
          )}
          {item?.vendor_ratings == 0 ? null : (
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
              ({item?.vendor_ratings} Reviews)
            </Text>
          )}
        </View>
        <Text
          style={{
            // marginHorizontal: 10,
            fontFamily: 'Segoe UI',
            fontSize: 12,
            color: COLORS.greenButtonBgColor,
            alignSelf: 'flex-end',
            paddingVertical: 2,
            marginEnd: 10,
            marginBottom: 10,
          }}>
          <Image
            source={icons.flat_offer}
            style={[
              styles.star_logo,
              {
                marginEnd: 5,
                width: 15,
                height: 15,
              },
            ]}
          />
          Flat {item?.discount_percent}% OFF on Total bill
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ListCardView;

const styles = StyleSheet.create({
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
    resizeMode: 'cover',
  },
  star_logo: {
    width: 12,
    height: 12,
    resizeMode: 'cover',
  },
});
