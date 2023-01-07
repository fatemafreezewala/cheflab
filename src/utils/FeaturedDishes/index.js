import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {COLORS, icons, SIZES} from '../../constants';
import ApiCall from '../../network/ApiCall';
import {API_END_POINTS} from '../../network/ApiEndpoints';
import {ShowMessage} from '../Utility';
import {Rating, AirbnbRating} from 'react-native-elements';

const FeaturedDishes = ({
  items,
  smallText,
  heading,
  loading,
  onPress,
  // quantityHandler,
}) => {
  const navigation = useNavigation();

  const [data, setData] = useState([]);
  const [apiToken, setApiToken] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    setData(items);
  }, [items]);

  useEffect(() => {
    getInfoFromStorage();
  }, []);

  const getInfoFromStorage = async () => {
    try {
      await AsyncStorage.getItem('token', (err, value) => {
        if (err) {
        } else {
          if (value !== '' && value !== null) {
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
          } else {
            setUserId('');
          }
        }
      });
    } catch (error) {
      console.log('aaaaaaaaaaaaaaaaaaaaaaaa 111 -> ', error);
    }
  };

  const updateFavUnFav = idx => {
    // if (item?.is_like) {
    //   ApiCall('post', body, API_END_POINTS.restaurantRemoveFavorite, {});
    // } else {
    //   ApiCall('post', body, API_END_POINTS.restaurantAddFavorite, {});
    // }
    let a = data.map((item, index) => {
      let temp = Object.assign({}, item);
      if (index == idx) {
        if (temp.is_like) {
          console.log(
            'aaaaaaaaaaaaaaaaaaaaaaaa 111 -> ',
            idx + ' ' + JSON.stringify(temp),
          );
          temp.is_like = false;
          let body = {user_id: userId, product_id: temp?.id + ''};
          ApiCall('post', body, API_END_POINTS.productRemoveFavorite, {
            Authorization: `Bearer ${apiToken}`,
          }).then(response => {
            if (response?.data?.status) {
              // ShowMessage(response?.data?.message);
              console.log('restaurantRemoveFavorite ->>. ', response?.data);
            }
          });
        } else {
          // console.log('aaaaaaaaaaaaaaaaaaaaaaaa 222 -> ', idx + ' ' + index);
          let body = {user_id: userId, product_id: temp?.id + ''};

          ApiCall('post', body, API_END_POINTS.productAddFavorite, {
            Authorization: `Bearer ${apiToken}`,
          }).then(response => {
            if (response?.data?.status) {
              // ShowMessage(response?.data?.message);

              console.log('restaurantRemoveFavorite ->>. ', response?.data);
            }
          });
          temp.is_like = true;
        }
      }
      return temp;
    });
    // console.log('aaaaaaaaaaaaaaaaaaaaaaaa -> ', JSON.stringify(a));
    // items = a;
    // console.log('aaaaaaaaaaaaaaaaaaaaaaaa -> ', JSON.stringify(items));
    setData(a);
  };

  const [showAdd, setShowAdd] = useState(false);
  // console.log('item -> ', JSON.stringify(items));

  /**{"product_name":"MC Family Pack Burger","product_price":"250.00",
   * "customizable":"true",
   * "image":"https://web10technologies.com/Chelab_full_project/public/products/16628321
   * 39-restaurant-product-707.png"},{"product_name":"MC Donald Pizza",
   * "product_price":"250.00","customizable":"true","image":""} */

  const quantityHandler = (action, index) => {
    // const newItems = data; // clone the array

    // let currentQty = newItems[index]['qty'];
    // console.log(
    //   'item featured dishes -> ',
    //   action + ' ' + index + ' ' + currentQty,
    // );

    // if (action == 'more') {
    //   newItems[index]['qty'] = currentQty + 1;
    // } else if (action == 'less') {
    //   newItems[index]['qty'] = currentQty > 1 ? currentQty - 1 : 1;
    // }
    // console.log('item featured dishes -> ', JSON.stringify(newItems));

    let a = data.map((item, i) => {
      let temp = Object.assign({}, item);
      let currentQty = temp.qty;

      if (action == 'more') {
        if (index == i) {
          temp.qty = currentQty + 1;
        }
      } else {
        if (index == i) {
          // temp.qty = currentQty > 1 ? currentQty - 1 : 1;
          temp.qty = currentQty - 1;
        }
      }
      return temp;
    });

    setData(a);
  };

  const renderItem = ({item, index}) => {
    // console.log('item featured dishes -> ', JSON.stringify(item));

    let chilli = [];

    // for (let i = 0; i < noGuest; i++) {
    //   chilli.push(<View key={i}></View>);
    // }

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('RestDishInformation', {
            item,
          });
        }}
        activeOpacity={0.8}
        style={{
          marginTop: 10,
          backgroundColor: COLORS.white,
          elevation: 10,
          borderRadius: 10,
          marginBottom: 15,
          shadowColor: '#C0C0C1',
          marginStart: index == 0 ? SIZES.padding + 5 : 10,
          marginEnd: index == items?.length - 1 ? SIZES.padding + 2 : 0,
        }}>
        <Image
          source={{uri: item.image}}
          style={{
            height: 180,
            width: 180,
            margin: 5,
            resizeMode: 'contain',
            alignSelf: 'center',
          }}
        />
        <TouchableOpacity
          onPress={() => {
            // setFavorite(!favorite);3
            updateFavUnFav(index);
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
            source={item?.is_like ? icons.favorite : icons.unfavorite}
            style={{
              width: 30,
              height: 30,
              // tintColor: item?.favorite ? '#ff0000' : '#707070',
            }}
          />
        </TouchableOpacity>

        <Text
          style={{
            marginHorizontal: 10,
            fontFamily: 'Segoe UI Bold',
            fontSize: 14,
            color: COLORS.black,
            marginTop: 8,
            alignSelf: 'center',
          }}>
          {item?.product_name}
          {/* {chilli} */}
        </Text>
        <Text
          style={{
            marginHorizontal: 10,
            fontFamily: 'Segoe UI',
            fontSize: 12,
            color: COLORS.grey,
            // marginTop: 0,
            alignSelf: 'center',
            marginVertical: 2,
          }}>
          {/* ({item?.siteName}) */}
          (North Indian)
        </Text>
        <Text
          style={{
            marginHorizontal: 10,
            fontFamily: 'Segoe UI',
            fontSize: 14,
            color: COLORS.grey,
            marginVertical: 2,
            alignSelf: 'center',
          }}>
          {item?.restaurantName}
          {/* Sai Pooja */}
        </Text>
        <View
          style={{
            alignSelf: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          {/* <Image source={icons.star} style={styles.star_logo} /> */}
          {/* <AntDesign name="staro" color={'gold'} />
          <AntDesign name="staro" color={'gold'} />
          <AntDesign name="staro" color={'gold'} />
          <AntDesign name="staro" color={'gold'} />
          <AntDesign name="staro" color={'gold'} /> */}

          <AirbnbRating
            count={5}
            isDisabled={true}
            showRating={false}
            defaultRating={parseInt(item?.star)}
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
            {item.star}
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
            {/* ({item?.reviewCount})12 Reviews */}
            (12) Reviews
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            paddingBottom: 10,
            marginTop: 20,
          }}>
          {/* <View>*/}
          {item?.customizable == 'true' ? (
            <Text
              style={{
                // marginHorizontal: 10,
                fontFamily: 'Segoe UI',
                fontSize: 10,
                color: '#0638ff',
                position: 'absolute',
                alignSelf: 'center',
                marginVertical: 2,
                top: -15,
                left: 15,
              }}>
              Customizable
            </Text>
          ) : null}

          {item?.qty >= 1 ? (
            <View
              style={{
                height: 30,
                // width: 80,
                // flex: 1,
                backgroundColor: COLORS.primary,
                marginStart: 12,
                borderRadius: 15,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 5,
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={{
                  paddingStart: 3,
                  paddingEnd: 2,
                }}
                onPress={() => {
                  quantityHandler('less', index, data);
                }}>
                <FontAwesome size={15} color={COLORS.white} name="minus" />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 18,
                  color: COLORS.white,
                  paddingHorizontal: 5,
                }}>
                {item.qty}
              </Text>
              <TouchableOpacity
                style={{
                  paddingStart: 2,
                  paddingEnd: 3,
                }}
                onPress={() => {
                  quantityHandler('more', index, data);
                  // dining karna hai
                }}>
                {/* <Text
                  style={{
                    fontSize: 20,
                    color: COLORS.white,
                  }}>
                  +
                </Text> */}

                <FontAwesome size={15} color={COLORS.white} name="plus" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => {
                onPress(item, index, data);
              }}>
              <Text
                style={{
                  marginHorizontal: 10,
                  fontFamily: 'Segoe UI Bold',
                  fontSize: 16,
                  paddingVertical: 5,
                  paddingHorizontal: 20,
                  alignSelf: 'center',
                  color: COLORS.primary,
                  borderColor: COLORS.primary,
                  borderWidth: 1,
                  borderRadius: 15,
                }}>
                Add
              </Text>
            </TouchableOpacity>
          )}
          {/* </View> */}
          <Text
            style={{
              fontFamily: 'Segoe UI Bold',
              fontSize: 18,
              position: 'absolute',
              bottom: 10,
              right: 15,
              marginTop: 0,
              paddingVertical: 5,
              alignSelf: 'flex-end',
              marginVertical: 2,
              color: COLORS.black,
            }}>
            ₹{item?.product_price}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{}}>
      {loading ? (
        <View
          style={{
            // flexDirection: 'row',
            // backgroundColor: '#ff4',
            paddingVertical: 10,
            marginTop: 10,
          }}>
          <ShimmerPlaceHolder
            // shimmerColors={}
            LinearGradient={LinearGradient}
            height={10}
            width={100}
            style={{
              marginStart: 15,
              borderRadius: 2,
              marginTop: 10,
            }}
          />
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            height={25}
            width={Dimensions.get('window').width * 0.9}
            style={{
              borderRadius: 5,
              marginStart: 15,
              marginTop: 10,
            }}
          />
          <View
            style={{
              flexDirection: 'row',
            }}>
            <View>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                activeOpacity={0.8}
                // shimmerColors={[COLORS.shimmerColor, COLORS.shimmerColor]}
                height={160}
                width={Dimensions.get('window').width * 0.41}
                style={{
                  marginStart: 15,
                  marginTop: 10,
                  marginBottom: 5,
                  elevation: 10,
                  shadowRadius: 10,
                  borderRadius: 10,
                }}></ShimmerPlaceHolder>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                activeOpacity={0.8}
                height={12}
                width={Dimensions.get('window').width * 0.4}
                style={{
                  marginStart: 15,
                  marginTop: 5,
                  marginBottom: 5,
                  elevation: 10,
                  alignSelf: 'center',
                  shadowRadius: 10,
                  borderRadius: 2,
                }}></ShimmerPlaceHolder>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                activeOpacity={0.8}
                height={10}
                width={Dimensions.get('window').width * 0.24}
                style={{
                  marginStart: 16,
                  // alignSelf: 'center',
                  marginBottom: 5,
                  elevation: 10,
                  shadowRadius: 10,
                  borderRadius: 2,
                }}></ShimmerPlaceHolder>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                activeOpacity={0.8}
                height={10}
                width={Dimensions.get('window').width * 0.25}
                style={{
                  marginStart: 16,
                  // alignSelf: 'center',
                  marginBottom: 5,
                  elevation: 10,
                  shadowRadius: 10,
                  borderRadius: 2,
                }}></ShimmerPlaceHolder>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                activeOpacity={0.8}
                height={10}
                width={Dimensions.get('window').width * 0.26}
                style={{
                  marginStart: 16,
                  // alignSelf: 'center',
                  marginBottom: 5,
                  elevation: 10,
                  shadowRadius: 10,
                  borderRadius: 2,
                }}></ShimmerPlaceHolder>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                height={25}
                width={Dimensions.get('window').width * 0.41}
                style={{
                  borderRadius: 5,
                  marginStart: 15,
                  marginTop: 5,
                }}
              />
            </View>
            <View>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                activeOpacity={0.8}
                height={160}
                width={Dimensions.get('window').width * 0.41}
                style={{
                  marginStart: 15,
                  marginTop: 10,
                  marginBottom: 5,
                  elevation: 10,
                  shadowRadius: 10,
                  borderRadius: 10,
                }}></ShimmerPlaceHolder>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                activeOpacity={0.8}
                height={12}
                width={Dimensions.get('window').width * 0.4}
                style={{
                  marginStart: 15,
                  marginTop: 5,
                  marginBottom: 5,
                  elevation: 10,
                  alignSelf: 'center',
                  shadowRadius: 10,
                  borderRadius: 2,
                }}></ShimmerPlaceHolder>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                activeOpacity={0.8}
                height={10}
                width={Dimensions.get('window').width * 0.24}
                style={{
                  marginStart: 16,
                  // alignSelf: 'center',
                  marginBottom: 5,
                  elevation: 10,
                  shadowRadius: 10,
                  borderRadius: 2,
                }}></ShimmerPlaceHolder>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                activeOpacity={0.8}
                height={10}
                width={Dimensions.get('window').width * 0.25}
                style={{
                  marginStart: 16,
                  // alignSelf: 'center',
                  marginBottom: 5,
                  elevation: 10,
                  shadowRadius: 10,
                  borderRadius: 2,
                }}></ShimmerPlaceHolder>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                activeOpacity={0.8}
                height={10}
                width={Dimensions.get('window').width * 0.26}
                style={{
                  marginStart: 16,
                  // alignSelf: 'center',
                  marginBottom: 5,
                  elevation: 10,
                  shadowRadius: 10,
                  borderRadius: 2,
                }}></ShimmerPlaceHolder>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                height={25}
                width={Dimensions.get('window').width * 0.41}
                style={{
                  borderRadius: 5,
                  marginStart: 15,
                  marginTop: 5,
                }}
              />
            </View>
            <View>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                activeOpacity={0.8}
                height={160}
                width={Dimensions.get('window').width * 0.41}
                style={{
                  marginStart: 15,
                  marginTop: 10,
                  marginBottom: 5,
                  elevation: 10,
                  shadowRadius: 10,
                  borderRadius: 10,
                }}></ShimmerPlaceHolder>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                activeOpacity={0.8}
                height={12}
                width={Dimensions.get('window').width * 0.4}
                style={{
                  marginStart: 15,
                  marginTop: 5,
                  marginBottom: 5,
                  elevation: 10,
                  alignSelf: 'center',
                  shadowRadius: 10,
                  borderRadius: 2,
                }}></ShimmerPlaceHolder>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                activeOpacity={0.8}
                height={10}
                width={Dimensions.get('window').width * 0.24}
                style={{
                  marginStart: 16,
                  // alignSelf: 'center',
                  marginBottom: 5,
                  elevation: 10,
                  shadowRadius: 10,
                  borderRadius: 2,
                }}></ShimmerPlaceHolder>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                activeOpacity={0.8}
                height={10}
                width={Dimensions.get('window').width * 0.25}
                style={{
                  marginStart: 16,
                  // alignSelf: 'center',
                  marginBottom: 5,
                  elevation: 10,
                  shadowRadius: 10,
                  borderRadius: 2,
                }}></ShimmerPlaceHolder>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                activeOpacity={0.8}
                height={10}
                width={Dimensions.get('window').width * 0.26}
                style={{
                  marginStart: 16,
                  // alignSelf: 'center',
                  marginBottom: 5,
                  elevation: 10,
                  shadowRadius: 10,
                  borderRadius: 2,
                }}></ShimmerPlaceHolder>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                height={25}
                width={Dimensions.get('window').width * 0.41}
                style={{
                  borderRadius: 5,
                  marginStart: 15,
                  marginTop: 5,
                }}
              />
            </View>
            <View>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                activeOpacity={0.8}
                height={160}
                width={Dimensions.get('window').width * 0.41}
                style={{
                  marginStart: 15,
                  marginTop: 10,
                  marginBottom: 5,
                  elevation: 10,
                  shadowRadius: 10,
                  borderRadius: 10,
                }}></ShimmerPlaceHolder>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                activeOpacity={0.8}
                height={12}
                width={Dimensions.get('window').width * 0.4}
                style={{
                  marginStart: 15,
                  marginTop: 5,
                  marginBottom: 5,
                  elevation: 10,
                  alignSelf: 'center',
                  shadowRadius: 10,
                  borderRadius: 2,
                }}></ShimmerPlaceHolder>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                activeOpacity={0.8}
                height={10}
                width={Dimensions.get('window').width * 0.24}
                style={{
                  marginStart: 16,
                  // alignSelf: 'center',
                  marginBottom: 5,
                  elevation: 10,
                  shadowRadius: 10,
                  borderRadius: 2,
                }}></ShimmerPlaceHolder>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                activeOpacity={0.8}
                height={10}
                width={Dimensions.get('window').width * 0.25}
                style={{
                  marginStart: 16,
                  // alignSelf: 'center',
                  marginBottom: 5,
                  elevation: 10,
                  shadowRadius: 10,
                  borderRadius: 2,
                }}></ShimmerPlaceHolder>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                activeOpacity={0.8}
                height={10}
                width={Dimensions.get('window').width * 0.26}
                style={{
                  marginStart: 16,
                  // alignSelf: 'center',
                  marginBottom: 5,
                  elevation: 10,
                  shadowRadius: 10,
                  borderRadius: 2,
                }}></ShimmerPlaceHolder>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                height={25}
                width={Dimensions.get('window').width * 0.41}
                style={{
                  borderRadius: 5,
                  marginStart: 15,
                  marginTop: 5,
                }}
              />
            </View>
          </View>
        </View>
      ) : (
        <>
          <Text
            style={[
              styles.smallText,
              {
                marginTop: 15,
              },
            ]}>
            {smallText}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
            }}>
            <Text style={styles.moodText}>{heading}</Text>
            {/* <TouchableOpacity
              style={{
                position: 'absolute',
                right: 20,
              }}>
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity> */}
          </View>
          <FlatList
            extraData={data}
            data={data}
            horizontal
            style={{
              marginBottom: 10,
              flex: 1,
              // marginBottom: 10,
            }}
            showsHorizontalScrollIndicator={false}
            renderItem={renderItem}
          />
        </>
      )}
    </View>
  );
};

export default FeaturedDishes;

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
  starText: {
    color: COLORS.white,
    // marginTop: 5,
    fontFamily: 'Segoe UI Bold',
    fontSize: 10,
    marginStart: 5,
  },
  moodText: {
    fontFamily: 'Segoe UI Bold',
    fontSize: 18,
    color: 'rgba(0, 0, 0, 255)',
    marginStart: 15,
    // marginTop: 28,
  },
  smallText: {
    fontFamily: 'Segoe UI Bold',
    fontSize: 10,
    color: '#707070',
    marginStart: 16,
    marginTop: 28,
  },
  viewAll: {
    fontFamily: 'Segoe UI',
    fontSize: 14,
    color: '#0638ff',
    alignSelf: 'flex-end',
    marginVertical: 2,
    textDecorationLine: 'underline',
  },
});
