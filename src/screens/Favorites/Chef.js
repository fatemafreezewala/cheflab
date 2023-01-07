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
import {horizScale} from '../../constants/themes';
import ApiCall from '../../network/ApiCall';
import {API_END_POINTS} from '../../network/ApiEndpoints';
import Loader from '../../utils/Loader';

const Chef = ({navigation}) => {
  const restFavArray = useSelector(state => state?.state?.chefFavArray);
  const dispatch = useDispatch();
  const [showVector, setShowVector] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    getInfoFromStorage();
  }, []);

  const [userId, setUserId] = useState('');

  const getInfoFromStorage = async () => {
    let t = '';
    try {
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

  const [apiToken, setApiToken] = useState('');
  const [loading, setLoading] = useState(false);

  const updateAsyncFavDish = () => {
    AsyncStorage.setItem('favChef', JSON.stringify(restFavArray));
  };

  const removeFromIndex = idx => {
    let arr = [...data];
    arr.splice(idx, 1);
    setData(arr);
  };

  const userLatitude = useSelector(state => state?.state?.userLatitude);
  const userLongitude = useSelector(state => state?.state?.userLongitude);
  const getCuisines = value => {
    setLoading(false);
    let body = {
      // lat: 22.72418,
      // lng: 75.887257,
      lat: userLatitude,
      lng: userLongitude,
    };
    // ApiCall('post', body, API_END_POINTS.get_all_liked_chef, {
    ApiCall('post', body, API_END_POINTS.get_all_liked_rest, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        // console.log('ERROR IN getCuisines API -> ', JSON.stringify(response));

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

  // const renderItem = ({item, index}) => {
  //   // console.log('sdada=> ', JSON.stringify(item));
  //   return (
  //     <TouchableOpacity
  //       activeOpacity={0.8}
  //       style={[
  //         styles.content,
  //         {
  //           padding: 10,
  //           // width: '100%',
  //         },
  //       ]}
  //       onPress={() => {
  //         //   navigation.navigate('DishInformation', {item});
  //       }}>
  //       <View>
  //         <Image
  //           source={{uri: '' + item?.image}}
  //           style={{
  //             height: 100,
  //             width: 100,
  //             // margin: 10,
  //             borderRadius: 10,
  //           }}
  //         />
  //       </View>
  //       <View
  //         style={{
  //           marginStart: 15,
  //         }}>
  //         <View
  //           style={{
  //             flexDirection: 'row',
  //             justifyContent: 'space-between',
  //             // flex: 1,
  //           }}>
  //           <Text
  //             style={{
  //               color: COLORS.black,
  //               fontSize: 16,
  //               fontFamily: 'Segoe UI Bold',
  //               //   marginStart: -2,
  //               marginTop: 5,
  //             }}>
  //             {item?.name}{' '}
  //             <Image
  //               source={icons.pure_veg}
  //               style={{
  //                 width: 10,
  //                 height: 10,
  //                 marginStart: 2,
  //               }}
  //             />
  //           </Text>
  //           {/* {item?.vendor_food_type == '1' ? (
  //             <TouchableOpacity
  //               activeOpacity={0.8}
  //               onPress={() => {}}
  //               style={styles.fav}>

  //             </TouchableOpacity>
  //           ) : null} */}
  //         </View>
  //         <Text
  //           style={{
  //             color: COLORS.grey,
  //             marginTop: 5,
  //             fontFamily: 'Segoe UI',
  //             fontSize: 14,
  //             // flex: 1,
  //             marginEnd: 10,
  //           }}>
  //           {item?.categories}
  //         </Text>

  //         <View
  //           style={{
  //             // marginStart: 15,
  //             marginTop: 8,
  //             flexDirection: 'row',
  //             // justifyContent: 'center',
  //             alignItems: 'center',
  //           }}>
  //           {/* <Image source={icons.star} style={styles.distance_logo} /> */}
  //           <AntDesign name="staro" color={'gold'} />
  //           <AntDesign name="staro" color={'gold'} />
  //           <AntDesign name="staro" color={'gold'} />
  //           <AntDesign name="staro" color={'gold'} />
  //           <AntDesign name="staro" color={'gold'} />
  //           {item?.vendor_ratings > 0 ? (
  //             <Text style={[styles.distance]} numberOfLines={1}>
  //               {item?.vendor_ratings}
  //             </Text>
  //           ) : null}

  //           <View
  //             style={{
  //               position: 'absolute',
  //               right: 5,
  //             }}>
  //             {item?.customizable == 'true' ? (
  //               <TouchableOpacity>
  //                 <Text
  //                   style={{
  //                     fontFamily: 'Segoe UI',
  //                     fontSize: 10,
  //                     color: '#0638ff',
  //                     alignSelf: 'center',
  //                     marginVertical: 2,
  //                   }}>
  //                   Customizable
  //                 </Text>
  //               </TouchableOpacity>
  //             ) : null}
  //           </View>
  //         </View>
  //       </View>

  //       <TouchableOpacity
  //         onPress={() => {
  //           // updateFavUnFav(index);
  //           dispatch(removeItemFavRest(item));
  //           removeFromIndex(index);
  //           updateAsyncFavDish();
  //         }}
  //         style={{
  //           right: 5,
  //           top: 5,
  //           position: 'absolute',
  //           borderRadius: 50,
  //           backgroundColor: '#f5f5f5',
  //           // alignSelf: 'flex-end',
  //         }}>
  //         <Image
  //           source={icons.favorite}
  //           style={{
  //             width: 30,
  //             height: 30,
  //           }}
  //         />
  //       </TouchableOpacity>
  //     </TouchableOpacity>
  //   );
  // };

  const renderItem = ({item, index}) => {
    // console.log('aaaaaaaaaaaaaaaaaaaaaaaa -> ', JSON.stringify(item));
    // if (item?.vendor_type != 'restaurant') {
    //   setShowVector(true);
    // }
    return item?.vendor_type != 'restaurant' ? (
      <TouchableOpacity
        onPress={() => {
          // navigation.navigate('ChefDetails', item);
          // console.log(' ChefDetails ListCardView item -> ', JSON.stringify(item?.chef_id));

          navigation.navigate('ChefDetails', {bookTable: false, item});
        }}
        activeOpacity={0.9}
        style={{
          borderWidth: 1,
          borderColor: '#DB2728',
          borderRadius: 10,
          marginStart: 20,
          marginBottom: 5,
          marginTop: 15,
          height: 150,

          marginEnd: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <View
            style={
              {
                // backgroundColor: COLORS.primary,
                // height: 120,
                // padding: 5,
              }
            }>
            <View
              style={{
                height: 105,
                width: 104.5,
                borderRadius: 100,
                margin: 10,
                borderWidth: 2,
                borderColor: '#db2728',
                //   paddingStart: 5,
                justifyContent: 'center',
                backgroundColor: COLORS.white,
              }}>
              <Image
                source={{
                  uri: item?.image,
                }}
                style={{
                  height: 100,
                  width: 100,
                  borderRadius: 100,
                }}
              />
            </View>
            {item?.vendor_food_type == '1' ? (
              <View
                style={{
                  backgroundColor: COLORS.greenButtonBgColor,
                  borderRadius: 10,
                  position: 'absolute',
                  bottom: 8,
                  alignSelf: 'center',
                  paddingHorizontal: 3,
                }}>
                <Image
                  source={icons.rest_pure_veg}
                  style={{
                    width: 50,
                    height: 15,
                    resizeMode: 'contain',
                  }}
                />
              </View>
            ) : null}
          </View>
          <View
            activeOpacity={0.9}
            style={{
              borderColor: '#DB2728',
            }}>
            <View
              style={{
                borderRadius: 10,

                alignSelf: 'center',
                alignItems: 'flex-start',
                justifyContent: 'center',
              }}>
              <Text style={[styles.moodText, {fontSize: 16}]}>
                {item?.name}
              </Text>
              <Text
                style={{
                  fontFamily: 'Segoe UI',
                  fontSize: 13,
                  color: COLORS.grey,
                  // marginStart: 25,
                  marginTop: 5,
                }}>
                Age - {item?.Age} yrs, Cooking Exp - {item?.experience} Yrs
              </Text>
              <View
                style={{
                  // alignSelf: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: 10,
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
                      isDisabled={true}
                      showRating={false}
                  defaultRating={parseInt(item?.vendor_ratings)}
                  size={10}
                />
                {item?.vendor_ratings == 0 ? null : (
                  <Text
                    style={{
                      marginHorizontal: 3,
                      fontFamily: 'Segoe UI Bold',
                      fontSize: 14,
                      color: COLORS.black,
                      // marginTop: 0,
                      alignSelf: 'center',
                      // marginVertical: 2,
                    }}>
                    {item?.vendor_ratings}
                  </Text>
                )}
                {/* <Text
                  style={{
                    // marginHorizontal: 10,
                    fontFamily: 'Segoe UI',
                    fontSize: 10,
                    color: '#0638ff',
                    // marginTop: 0,
                    alignSelf: 'center',
                    marginVertical: 2,
                  }}>
                  ({item?.review_count} Reviews)
                </Text> */}
              </View>
            </View>

            <View
              style={{
                // marginHorizontal: 10,
                // alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginEnd: -10,
              }}>
              <Text
                style={{
                  // marginHorizontal: 3,
                  fontFamily: 'Segoe UI',
                  fontSize: 12,
                  color: COLORS.grey,
                  // paddingBottom: 10,
                }}>
                Order Served - {item?.order_served}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Image
                  source={icons.scooter}
                  style={[
                    styles.distance_logo,
                    {
                      marginEnd: 0,
                      marginBottom: 5,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.distance,
                    {
                      marginTop: 0,
                    },
                  ]}
                  numberOfLines={1}>
                  {item?.distance} KM
                </Text>
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                // setFavorite(!favorite);
                // onFavPress();

                // removeFromIndex(index);
                dislike(item, index);
              }}
              style={styles.fav}>
              <Image
                source={icons.favorite}
                style={{
                  width: 30,
                  height: 30,
                  // tintColor: item?.is_like ? '#ff0000' : '#e7e7e7',
                }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            backgroundColor: COLORS.black,
            alignItems: 'center',
            justifyContent: 'center',
            width: '105%',
            position: 'absolute',
            bottom: -1,
            marginStart: -8,
            paddingVertical: 3,
            borderRadius: 15,
            // top: 5,
          }}>
          <Text
            style={{
              fontFamily: 'Segoe UI',
              fontSize: horizScale(14),
              color: COLORS.white,
            }}>
            Specialty - {item?.food_specility}
          </Text>
        </View>
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
      <Loader loading={loading} />

      {showVector ? (
        <Text
          style={{
            color: COLORS.black,
            fontSize: 16,
            fontFamily: 'Segoe UI Bold',
            // backgroundColor: COLORS.red,
            alignSelf: 'center',
            marginTop: 20,
          }}>
          No Favorites Found
        </Text>
      ) : (
        <FlatList
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
          data={data}
          renderItem={renderItem}
          style={{
            flex: 1,
            // flexGrow: 1,
          }}
        />
      )}
    </View>
  );
};

export default Chef;

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
  fav: {
    right: -25,
    top: 5,
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: '#f5f5f5',
  },
  moodText: {
    fontFamily: 'Segoe UI Bold',
    fontSize: 18,
    color: 'rgba(0, 0, 0, 255)',
    marginTop: 15,
  },
});
