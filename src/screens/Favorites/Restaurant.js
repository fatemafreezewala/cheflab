import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {AirbnbRating} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS, icons} from '../../constants';
import ApiCall from '../../network/ApiCall';
import {API_END_POINTS} from '../../network/ApiEndpoints';

const Restaurant = ({navigation}) => {
  const restFavArray = useSelector(state => state?.state?.restFavArray);
  // console.log(
  //   'item restFavArrayrestFavArrayrestFavArray ->>>> ',
  //   JSON.stringify(restFavArray),
  // );

  const dispatch = useDispatch();
  const [showVector, setShowVector] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    getInfoFromStorage();
  }, []);

  const getInfoFromStorage = async () => {
    let t = '';
    try {
      // await AsyncStorage.getItem('favRest', (err, value) => {
      //   if (err) {
      //   } else {
      //     if (value !== '' && value !== null) {
      //       setData(JSON.parse(value));
      //       setShowVector(false);
      //       console.log('item JSON.parse ->>>> ', JSON.parse(value));
      //     } else {
      //       setData([]);
      //       setShowVector(true);
      //     }
      //   }
      // });

      await AsyncStorage.getItem('token', (err, value) => {
        if (err) {
        } else {
          if (value !== '' && value !== null) {
            t = value;
            setApiToken(value);
            getCuisines(value);
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
    } catch (error) {}
  };
  const [userId, setUserId] = useState('');

  const dislike = (value, index) => {
    console.log('item 0> ' + JSON.stringify(value));
    let body = {
      user_id: userId,
      vendor_id: value?.id + '',
    };
    // ApiCall('post', body, API_END_POINTS.get_all_liked_chef, {
    ApiCall('post', body, API_END_POINTS.restaurantRemoveFavorite, {
      Authorization: `Bearer ${apiToken}`,
    })
      .then(response => {
        console.log('ERROR IN getCuisines API -> ', JSON.stringify(response));

        if (response?.data?.status) {
          removeFromIndex(index);
          getCuisines(apiToken);
        } else {
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [loading, setLoading] = useState(false);

  const [apiToken, setApiToken] = useState('');

  const updateAsyncFavDish = () => {
    AsyncStorage.setItem('favDish', JSON.stringify(restFavArray));
  };

  const updateAsyncFavRest = () => {
    AsyncStorage.setItem('favRest', JSON.stringify(restFavArray));
  };

  const removeFromIndex = idx => {
    let arr = [...data];
    arr.splice(idx, 1);
    setData(arr);
    updateAsyncFavRest();
  };
  const userLatitude = useSelector(state => state?.state?.userLatitude);
  const userLongitude = useSelector(state => state?.state?.userLongitude);
  const getCuisines = value => {
    let body = {
      // lat: 22.72418,
      // lng: 75.887257,
      lat: userLatitude,
      lng: userLongitude,
    };
    ApiCall('post', body, API_END_POINTS.get_all_liked_rest, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        console.log('repspnns = >   ', JSON.stringify(response?.data));
        if (response?.data?.status) {
          setData(response?.data?.vendors);
        } else {
          setData([]);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // const restFavArray = useSelector(state => state?.state?.restFavArray);

  const renderItem = ({item, index}) => {
    // console.log('sdada=> ', JSON.stringify(item));
    // if (item?.vendor_type == 'chef') {
    //   setShowVector(true);
    // }
    return item?.vendor_type == 'restaurant' ? (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.content,
          {
            padding: 10,
            // width: '100%',
          },
        ]}
        onPress={() => {
          navigation.navigate('RestaurantDetails', {
            bookTable: false,
            item: item,
          });
        }}>
        <View>
          <Image
            source={{uri: '' + item?.image}}
            style={{
              height: 100,
              width: 100,
              // margin: 10,
              borderRadius: 10,
            }}
          />
        </View>
        <View
          style={{
            marginTop: 15,
            marginStart: 15,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              // flex: 1,
            }}>
            <Text
              style={{
                color: COLORS.black,
                fontSize: 16,
                fontFamily: 'Segoe UI Bold',
                //   marginStart: -2,
                marginTop: 5,
              }}>
              {item?.name}{' '}
              <Image
                source={icons.pure_veg}
                style={{
                  width: 10,
                  height: 10,
                  marginStart: 2,
                }}
              />
            </Text>
            {/* {item?.vendor_food_type == '1' ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {}}
                style={styles.fav}>
             
              </TouchableOpacity>
            ) : null} */}
          </View>
          <Text
            style={{
              color: COLORS.grey,
              marginTop: 5,
              fontFamily: 'Segoe UI',
              fontSize: 14,
              // flex: 1,
              maxWidth: '85%',
            }}
            numberOfLines={1}>
            {item?.categories}
          </Text>

          <View
            style={{
              // marginStart: 15,
              marginTop: 8,
              flexDirection: 'row',
              // justifyContent: 'center',
              alignItems: 'center',
            }}>
            {/* <Image source={icons.star} style={styles.distance_logo} /> */}
            {/* <AntDesign name="staro" color={'gold'} />
            <AntDesign name="staro" color={'gold'} />
            <AntDesign name="staro" color={'gold'} />
            <AntDesign name="staro" color={'gold'} />
            <AntDesign name="staro" color={'gold'} /> */}
            <AirbnbRating
              count={5}
              // reviews={[
              //   'Terrible',
              //   'Bad',
              //   'Meh',
              //   'OK',
              //   'Good',
              //   'Hmm...',
              //   'Very Good',
              //   'Wow',
              //   'Amazing',
              //   'Unbelievable',
              //   'Jesus',
              // ]}
              isDisabled={true}
              showRating={false}
              defaultRating={parseInt(item?.vendor_ratings)}
              size={10}
            />
            {item?.vendor_ratings > 0 ? (
              <Text style={[styles.distance]} numberOfLines={1}>
                {item?.vendor_ratings}
              </Text>
            ) : null}

            <View
              style={{
                position: 'absolute',
                right: 5,
              }}>
              {item?.customizable == 'true' ? (
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
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            // updateFavUnFav(index);
            // dispatch(removeItemFavRest(item));
            // removeFromIndex(index);
            // updateAsyncFavDish();
            dislike(item, index);
          }}
          style={{
            right: 5,
            top: 5,
            position: 'absolute',
            borderRadius: 50,
            backgroundColor: '#f5f5f5',
            // alignSelf: 'flex-end',
          }}>
          <Image
            source={icons.favorite}
            style={{
              width: 30,
              height: 30,
            }}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    ) : null;
  };

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 20,
        backgroundColor: COLORS.white,
      }}>
      {showVector ? (
        <Text
          style={{
            marginStart: 15,
            marginEnd: 15,
            color: COLORS.black,
            fontSize: 16,
            fontFamily: 'Segoe UI Bold',
            alignSelf: 'center',
          }}>
          No Favorites Found
        </Text>
      ) : (
        <FlatList
          data={data}
          // ListEmptyComponent={() => {
          //   return loading ? null : (
          //     <Text
          //       style={{
          //         marginStart: 15,
          //         marginEnd: 15,
          //         color: COLORS.black,
          //         fontSize: 16,
          //         fontFamily: 'Segoe UI Bold',
          //         alignSelf: 'center',
          //       }}>
          //       No Favorites Found
          //     </Text>
          //   );
          // }}
          renderItem={renderItem}
          style={{
            flex: 1,
          }}
        />
      )}
    </View>
  );
};

export default Restaurant;

const styles = StyleSheet.create({
  content: {
    paddingLeft: 10,
    borderRadius: 10,
    margin: 10,
    // elevation: 10,
    paddingRight: 10,
    // backgroundColor: '#fff',
    flexDirection: 'row',
  },
  fav: {
    right: 5,
    top: 5,
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: '#f5f5f5',
  },
});
