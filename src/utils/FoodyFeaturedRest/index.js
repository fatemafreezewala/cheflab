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
import {COLORS, icons, SIZES} from '../../constants';
import ApiCall from '../../network/ApiCall';
import {API_END_POINTS} from '../../network/ApiEndpoints';
import {ShowMessage} from '../Utility';
import {useDispatch, useSelector} from 'react-redux';
import {addItemToFavRest, removeItemFavRest} from '../../redux/actions';
import {Rating, AirbnbRating} from 'react-native-elements';

const FoodyFeaturedRest = ({items, smallText, heading, loading}) => {
  const dispatch = useDispatch();
  const restFavArray = useSelector(state => state?.state?.restFavArray);
  const updateAsyncFavDish = () => {
    AsyncStorage.setItem('favRest', JSON.stringify(restFavArray));
  };

  // const restFavArray = useSelector(state => state?.state?.restFavArray);

  // console.log('item -> ', JSON.stringify(items));
  /**

   */
  // const [favorite, setFavorite] = useState("");
  const navigation = useNavigation();

  const [data, setData] = useState({});
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
          dispatch(removeItemFavRest(item));
          updateAsyncFavDish();
          // console.log('aaaaaaaaaaaaaaaaaaaaaaaa 111 -> ', idx + ' ' + index);
          temp.is_like = false;
          let body = {user_id: userId, vendor_id: temp?.id + ''};
          ApiCall('post', body, API_END_POINTS.restaurantRemoveFavorite, {
            Authorization: `Bearer ${apiToken}`,
          }).then(response => {
            if (response?.data?.status) {
              // ShowMessage(response?.data?.message);
              console.log('restaurantRemoveFavorite ->>. ', response?.data);
            }
          });
        } else {
          dispatch(addItemToFavRest(item));
          updateAsyncFavDish();

          // console.log('aaaaaaaaaaaaaaaaaaaaaaaa 222 -> ', idx + ' ' + index);
          let body = {user_id: userId, vendor_id: temp?.id + ''};

          ApiCall('post', body, API_END_POINTS.restaurantAddFavorite, {
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

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('RestaurantDetails', {bookTable: false, item});
        }}
        activeOpacity={0.9}
        style={{
          marginTop: 10,
          marginBottom: 15,
          shadowOpacity: 0.7,
          backgroundColor: COLORS.white,
          elevation: 10,
          shadowRadius: 10,
          borderRadius: 10,
          // flex: 1,
          width: 165,
          marginStart: index == 0 ? SIZES.padding + 5 : 10,
          marginEnd: index == items?.length - 1 ? SIZES.padding + 2 : 0,
        }}>
        <View
          style={{
            margin: 5,
            elevation: 10,
            backgroundColor: COLORS.white,
            borderRadius: 10,
            shadowColor: COLORS.grey,
            shadowOpacity: 0.5,
          }}>
          <Image
            source={{
              uri: item?.image,
            }}
            style={{
              height: 150,
              width: 155,
              borderRadius: 10,
              // resizeMode: 'contain',
            }}
          />
          <TouchableOpacity
            onPress={() => {
              // setFavorite(!favorite);
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
                // tintColor: item?.is_like ? '#ff0000' : '#707070',
              }}
            />
          </TouchableOpacity>
          {item?.vendor_ratings > 0 ? (
            <View
              style={{
                marginEnd: 5,
                bottom: 5,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#829bff',
                paddingHorizontal: 4,
                paddingVertical: 2,
                borderRadius: 10,
                alignSelf: 'flex-end',
              }}>
              {/* <Image source={icons.star} style={styles.star_logo} /> */}
              {/* <AntDesign name="staro" color={'gold'} />
              <AntDesign name="staro" color={'gold'} />
              <AntDesign name="staro" color={'gold'} />
              <AntDesign name="staro" color={'gold'} /> 
              <AntDesign name="star" color={'gold'} /> */}
              <AirbnbRating
                count={1}
                isDisabled={true}
                showRating={false}
                defaultRating={parseInt(item?.vendor_ratings)}
                size={8}
              />
              <Text style={styles.starText} numberOfLines={1}>
                {item?.vendor_ratings}
              </Text>
            </View>
          ) : (
            <View
              style={{
                marginEnd: 5,
                bottom: 5,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: COLORS.white,
                paddingHorizontal: 4,
                paddingVertical: 2,
                borderRadius: 10,
                alignSelf: 'flex-end',
              }}></View>
          )}
        </View>
        <Text
          style={{
            marginHorizontal: 10,
            fontFamily: 'Segoe UI Bold',
            fontSize: 14,
            color: COLORS.black,
            marginTop: 5,
          }}>
          {item?.name}
        </Text>

        <View
          style={{
            marginStart: 12,
            marginTop: 5,
            flexDirection: 'row',
            // justifyContent: 'center',
            paddingBottom: 15,
            alignItems: 'center',
          }}>
          <Image source={icons.scooter} style={styles.distance_logo} />
          <Text style={styles.distance} numberOfLines={1}>
            {item?.distance} KM
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  // height={240}
  // width={Dimensions.get('window').width * 0.41}
  return (
    <View>
      {loading ? (
        <View
          style={{
            // flexDirection: 'row',
            // backgroundColor: '#ff4',
            paddingVertical: 10,
            marginTop: 10,
          }}>
          <ShimmerPlaceHolder
            // shimmerColors={[COLORS.shimmerColor, COLORS.shimmerColor]}
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
                height={15}
                width={Dimensions.get('window').width * 0.41}
                style={{
                  marginStart: 15,

                  marginBottom: 5,
                  elevation: 10,
                  shadowRadius: 10,
                  borderRadius: 2,
                }}></ShimmerPlaceHolder>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                activeOpacity={0.8}
                height={15}
                width={Dimensions.get('window').width * 0.41}
                style={{
                  marginStart: 15,

                  marginBottom: 15,
                  elevation: 10,
                  shadowRadius: 10,
                  borderRadius: 2,
                }}></ShimmerPlaceHolder>
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
                height={15}
                width={Dimensions.get('window').width * 0.41}
                style={{
                  marginStart: 15,

                  marginBottom: 5,
                  elevation: 10,
                  shadowRadius: 10,
                  borderRadius: 2,
                }}></ShimmerPlaceHolder>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                activeOpacity={0.8}
                height={15}
                width={Dimensions.get('window').width * 0.41}
                style={{
                  marginStart: 15,

                  marginBottom: 15,
                  elevation: 10,
                  shadowRadius: 10,
                  borderRadius: 2,
                }}></ShimmerPlaceHolder>
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
                height={15}
                width={Dimensions.get('window').width * 0.41}
                style={{
                  marginStart: 15,

                  marginBottom: 5,
                  elevation: 10,
                  shadowRadius: 10,
                  borderRadius: 2,
                }}></ShimmerPlaceHolder>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                activeOpacity={0.8}
                height={15}
                width={Dimensions.get('window').width * 0.41}
                style={{
                  marginStart: 15,

                  marginBottom: 15,
                  elevation: 10,
                  shadowRadius: 10,
                  borderRadius: 2,
                }}></ShimmerPlaceHolder>
            </View>
          </View>
         
        </View>
      ) : (
        <>
          {data?.length > 0 ? (
            <>
              <Text
                style={[
                  styles.smallText,
                  {
                    marginTop: 12,
                  },
                ]}>
                {smallText}
              </Text>
              <Text style={styles.moodText}>{heading}</Text>
            </>
          ) : null}
          <FlatList
            extraData={data}
            data={data}
            horizontal
            style={{
              // paddingEnd: 50,
              // marginEnd: 10,
              flexGrow: 1,
            }}
            showsHorizontalScrollIndicator={false}
            renderItem={renderItem}
          />
        </>
      )}
    </View>
  );
};

export default FoodyFeaturedRest;

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
    width: 10,
    height: 10,

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
    marginTop: 25,
  },
});

/***
 sha1 debug - 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
 sha1 release - 98:62:2A:0F:1D:19:71:1D:B0:BD:39:8C:43:73:74:D9:E0:0C:3F:50
 sha256 release - BD:41:2B:6E:E7:02:FF:9E:02:2A:92:D4:3B:39:13:01:5D:0D:F6:46:30:28:84:9C:42:C1:E7:1E:DF:75:1B:B9
 sha256 debug - FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C
 */
