import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {AirbnbRating} from 'react-native-elements';
import {COLORS, icons} from '../../../constants';
import ToolbarWithIcon from '../../../utils/ToolbarWithIcon';
import style from '../style';

const DishInformation = ({navigation, route}) => {
  const [receivedItem, setReceivedItem] = useState({});

  useEffect(() => {
    let {item} = route.params;
    setReceivedItem(item);
    console.log('item => ', JSON.stringify(item));
  }, []);

  return (
    <SafeAreaView style={style.mainContainer}>
      <ScrollView
        style={style.mainContainer}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: COLORS.white,
            elevation: 10,
          }}>
          <ToolbarWithIcon showShare={false} />
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Segoe UI Bold',
              color: COLORS.black,
              flexGrow: 1,
              maxWidth: Dimensions.get('window').width / 2 + 15,
            }}
            numberOfLines={1}
            ellipsizeMode="tail">
            {receivedItem?.product_name}
          </Text>

          <TouchableOpacity
            style={{
              width: 22,
              height: 22,
              alignSelf: 'center',
              marginHorizontal: 15,
              position: 'absolute',
              right: 5,
            }}
            onPress={() => {
              navigation.navigate('Cart');
            }}>
            <Image
              source={icons.cart}
              style={{
                width: 22,
                height: 22,
                alignSelf: 'center',
                marginHorizontal: 15,
                tintColor: COLORS.primary,
              }}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            elevation: 10,
            backgroundColor: COLORS.white,
            margin: 10,
            borderRadius: 15,
            width: '95%',
            // height: 350,
          }}>
          <Image
            source={{
              uri: receivedItem?.image,
            }}
            style={{
              width: '95%',
              height: 300,
              margin: 10,
              borderRadius: 10,
            }}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {}}
            style={style.fav}>
            <Image
              source={icons.favorite}
              style={{
                width: 30,
                height: 30,
                tintColor: '#ff0000',
              }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            // justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Segoe UI Bold',
              color: COLORS.black,
              //   flexGrow: 1,
              marginTop: 20,
              marginStart: 20,
              marginEnd: 5,
            }}
            numberOfLines={1}
            ellipsizeMode="tail">
            {receivedItem?.product_name}
          </Text>
          {receivedItem?.type == 'non_veg' ? (
            <Image
              source={icons.non_pure_veg}
              style={{
                width: 10,
                height: 10,
                alignSelf: 'center',
                marginTop: 15,
              }}
            />
          ) : (
            <Image
              source={icons.pure_veg}
              style={{
                width: 10,
                height: 10,
                alignSelf: 'center',
                marginTop: 15,
              }}
            />
          )}
          <Image
            source={icons.chilli_level}
            style={{
              width: 22,
              height: 22,
              alignSelf: 'center',
              marginTop: 15,
              marginStart: 0,
            }}
          />
          {/* <Image
            source={icons.chilli_level}
            style={{
              width: 13,
              height: 22,
              alignSelf: 'center',
              marginTop: 15,
            }}
          /> */}
        </View>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Segoe UI',
            color: COLORS.grey,
            marginTop: 10,
            marginStart: 20,
            marginEnd: 5,
          }}
          numberOfLines={1}
          ellipsizeMode="tail">
          {/* North Indian */}
        </Text>
        <View
          style={{
            marginStart: 20,
            marginTop: 8,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {/* <Image source={icons.star} style={styles.distance_logo} /> */}
          {/* <AntDesign name="staro" color={'gold'} />
          <AntDesign name="staro" color={'gold'} />
          <AntDesign name="staro" color={'gold'} />
          <AntDesign name="staro" color={'gold'} />
          <AntDesign name="staro" color={'gold'} /> */}
          {/* <AirbnbRating
            count={5}
            showRating={false}
            defaultRating={parseInt(item?.product_rating)}
            size={10}
          /> */}
          <Text style={[styles.distance]} numberOfLines={1}>
            4.5
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            // backgroundColor: COLORS.primary,
          }}>
          <Text
            style={[
              {
                alignSelf: 'flex-start',
                color: COLORS.black,
                fontFamily: 'Segoe UI',
                fontSize: 18,
                marginTop: 20,
                marginStart: 20,
              },
            ]}
            numberOfLines={1}>
            ₹ {receivedItem?.product_price}
          </Text>

          <View
            style={{
              marginEnd: 25,
            }}>
            {receivedItem?.customizable == 'true' ? (
              <TouchableOpacity>
                <Text
                  style={{
                    fontFamily: 'Segoe UI',
                    fontSize: 10,
                    color: '#0638ff',
                    alignSelf: 'center',
                    marginVertical: 2,
                  }}>
                  Customizable
                </Text>
              </TouchableOpacity>
            ) : null}
            {/* <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
              <Text
                style={{
                  marginHorizontal: 10,
                  fontFamily: 'Segoe UI Bold',
                  fontSize: 16,
                  // marginTop: 0,
                  paddingVertical: 5,
                  paddingHorizontal: 20,
                  alignSelf: 'center',
                  // marginVertical: 2,
                  color: COLORS.primary,
                  borderColor: COLORS.primary,
                  borderWidth: 1,
                  borderRadius: 15,
                }}>
                Add
              </Text>
            </TouchableOpacity> */}
          </View>
        </View>
        <Text
          style={[
            {
              alignSelf: 'flex-start',
              color: COLORS.black,
              fontFamily: 'Segoe UI',
              fontSize: 16,
              marginTop: 25,
              marginStart: 20,
              textDecorationLine: 'underline',
            },
          ]}
          numberOfLines={1}>
          Description
        </Text>

        <Text
          style={[
            {
              alignSelf: 'flex-start',
              color: COLORS.black,
              fontFamily: 'Segoe UI',
              fontSize: 14,
              marginTop: 15,
              marginEnd: 15,
              marginStart: 20,
            },
          ]}>
          {receivedItem?.description}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DishInformation;

const styles = StyleSheet.create({
  distance_logo: {
    width: 15,
    height: 15,
    resizeMode: 'cover',
    alignSelf: 'flex-start',
  },
  distance: {
    alignSelf: 'flex-start',
    color: COLORS.black,
    marginTop: 0,
    fontFamily: 'Segoe UI',
    fontSize: 14,
    marginStart: 5,
  },
});
