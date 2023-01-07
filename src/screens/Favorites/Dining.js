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

const Dining = ({navigation}) => {
  const restFavArray = useSelector(state => state?.state?.dishFavArray);
  const dispatch = useDispatch();
  const [showVector, setShowVector] = useState(false);
  const [data, setData] = useState(restFavArray);

  useEffect(() => {
    getInfoFromStorage();
  }, []);

  const getInfoFromStorage = async () => {
    let t = '';
    try {
      // await AsyncStorage.getItem('favDish', (err, value) => {
      //   if (err) {
      //   } else {
      //     if (value !== '' && value !== null) {
      //       setData(JSON.parse(value));
      //       setShowVector(false);

      //       console.log(
      //         'item  disdksdsakdjjkasdjkashdkjas  JSON.parseJSON.parseJSON.parseJSON.parse->>>> ',
      //         value,
      //       );
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

  const [loading, setLoading] = useState(false);

  const [apiToken, setApiToken] = useState('');

  const userLatitude = useSelector(state => state?.state?.userLatitude);
  const userLongitude = useSelector(state => state?.state?.userLongitude);

  const getCuisines = value => {
    let body = {
      // lat: 22.72418,
      // lng: 75.887257,

      lat: userLatitude,
      lng: userLongitude,
    };
    ApiCall('post', body, API_END_POINTS.get_all_liked_products, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        if (response?.data?.status) {
          // console.log(
          //   'repspnns prouct ladflasjflkasjfksajfksjf = > ',
          //   JSON.stringify(response?.data),
          // );

          setData(response?.data?.products);
          setShowVector(response?.data?.products?.length < 0);
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

  const updateAsyncFavDish = () => {
    AsyncStorage.setItem('favDish', JSON.stringify(restFavArray));
  };

  const [userId, setUserId] = useState('');

  const removeFromIndex = idx => {
    let arr = [...data];
    arr.splice(idx, 1);
    setData(arr);
  };

  const dislike = (value, index) => {
    console.log('item 0> ' + JSON.stringify(value));
    let body = {
      user_id: userId,
      product_id: value?.product_id + '',
    };

    ApiCall('post', body, API_END_POINTS.productRemoveFavorite, {
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
  //         },
  //       ]}
  //       onPress={() => {
  //         // navigation.navigate('RestDishInformation', {
  //         //   item,
  //         //   cart: cartProduct,
  //         //   vendorId: vendorId,
  //         // });
  //       }}>
  //       <View>
  //         <Image
  //           source={{
  //             uri: item?.image,
  //           }}
  //           style={{
  //             height: 115,
  //             width: 115,
  //             borderRadius: 10,
  //           }}
  //         />
  //         <TouchableOpacity
  //           activeOpacity={0.8}
  //           onPress={() => {
  //             // dispatch(removeItemFavDish(item));
  //             // updateAsyncFavDish();
  //             // removeFromIndex(index);
  //             dislike(item, index);
  //           }}
  //           style={styles.fav}>
  //           <Image
  //             source={icons.favorite}
  //             style={{
  //               width: 25,
  //               height: 25,
  //               // tintColor: '#ff0000',
  //             }}
  //           />
  //         </TouchableOpacity>
  //       </View>
  //       <View
  //         style={{
  //           flexDirection: 'column',
  //           marginStart: 15,
  //           // alignItems: 'flex-start',
  //           flex: 1,
  //         }}>
  //         <View
  //           style={{
  //             flexDirection: 'row',
  //             alignItems: 'center',
  //           }}>
  //           <Text
  //             style={{
  //               color: COLORS.black,
  //               fontSize: 16,
  //               fontFamily: 'Segoe UI Bold',
  //               marginStart: -2,
  //             }}>
  //             {item?.product_name}
  //           </Text>
  //           {/* {chilli} */}
  //         </View>
  //         <TouchableOpacity
  //           activeOpacity={0.8}
  //           onPress={() => {}}
  //           style={styles.fav}>
  //           <Image
  //             source={icons.pure_veg}
  //             style={{
  //               width: 10,
  //               height: 10,
  //             }}
  //           />
  //         </TouchableOpacity>
  //         {/* <Text
  //         style={{
  //           color: COLORS.grey,
  //           marginTop: 5,
  //           fontFamily: 'Segoe UI',
  //           fontSize: 14,
  //         }}>
  //         Pizza
  //       </Text> */}
  //         <Text
  //           style={{
  //             color: COLORS.black,
  //             fontSize: 16,
  //             fontFamily: 'Segoe UI',
  //             marginTop: 5,
  //           }}>
  //           ₹ {item?.product_price}
  //         </Text>
  //         <View
  //           style={{
  //             // marginStart: 15,
  //             marginTop: 8,
  //             flexDirection: 'row',
  //             // justifyContent: 'center',
  //             alignItems: 'center',
  //           }}>
  //           {item?.product_rating == '0' ? null : (
  //             <View
  //               style={{
  //                 flexDirection: 'row',
  //               }}>
  //               <AntDesign name="staro" color={'gold'} />
  //               <AntDesign name="staro" color={'gold'} />
  //               <AntDesign name="staro" color={'gold'} />
  //               <AntDesign name="staro" color={'gold'} />
  //               <AntDesign name="staro" color={'gold'} />
  //               <Text style={[styles.distance]} numberOfLines={1}></Text>
  //             </View>
  //           )}
  //           <View
  //             style={{
  //               position: 'absolute',
  //               right: 5,
  //               top: -15,
  //               marginTop: item?.product_rating == '0' ? 30 : 15,
  //             }}></View>
  //         </View>
  //       </View>
  //     </TouchableOpacity>
  //   );
  // };

  const renderItem = ({item, index}) => {
    let chilli = [];

    for (let i = 0; i < parseInt(item?.chili_level); i++) {
      chilli.push(
        <View key={i}>
          <Image
            source={icons.chilli_level}
            style={{
              width: 13,
              height: 13,
            }}
          />
        </View>,
      );
    }

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.content,
          {
            padding: 10,
            flexGrow: 1,
          },
        ]}
        onPress={() => {
          console.log('item -< <<<<<<< ', JSON.stringify(item));
          navigation.navigate('RestaurantDetails', {
            bookTable: false,
            item: {
              ...item,
              id: item?.vendor_id,
              vendor_id: item.vendor_id,
            },
          });
          // if (item?.customizable == 'true') {
          // } else {
          // }
        }}>
        <View>
          <Image
            source={{
              uri: item?.image,
            }}
            style={{
              height: 115,
              width: 115,
              // margin: 10,
              borderRadius: 10,
              // resizeMode: 'contain',
            }}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              dislike(item, index);
            }}
            style={styles.fav}>
            <Image
              source={icons.favorite}
              style={{
                width: 25,
                height: 25,
                // tintColor: '#ff0000',
              }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'column',
            marginStart: 15,
            // alignItems: 'flex-start',
            flex: 1,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: COLORS.black,
                fontSize: 16,
                fontFamily: 'Segoe UI Bold',
                marginEnd: 5,
                marginStart: -2,
              }}
              numberOfLines={2}
              ellipsizeMode="tail">
              {item?.product_name}
              {chilli}
            </Text>
          </View>
          <Text
            style={{
              color: COLORS.black,
              fontSize: 12,
              fontFamily: 'Segoe UI',
              marginVertical: 4,
              marginStart: -2,
            }}
            numberOfLines={2}
            ellipsizeMode="tail">
            {item?.dis}
          </Text>
          {item?.type == 'veg' ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {}}
              style={styles.fav}>
              <Image
                source={icons.pure_veg}
                style={{
                  width: 10,
                  height: 10,
                }}
              />
            </TouchableOpacity>
          ) : null}
          {/* <Text
        style={{
          color: COLORS.grey,
          marginTop: 5,
          fontFamily: 'Segoe UI',
          fontSize: 14,
        }}>
        Pizza
      </Text> */}
          <Text
            style={{
              color: COLORS.black,
              fontSize: 18,
              fontFamily: 'Segoe UI',
              marginTop: 5,
            }}>
            ₹ {item?.product_price}
          </Text>
          <View
            style={{
              // marginStart: 15,
              marginTop: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              // alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {/* <AntDesign name="staro" color={'gold'} />
              <AntDesign name="staro" color={'gold'} />
              <AntDesign name="staro" color={'gold'} />
              <AntDesign name="staro" color={'gold'} />
              <AntDesign name="staro" color={'gold'} /> */}
              <AirbnbRating
                count={5}
                isDisabled={true}
                showRating={false}
                defaultRating={parseInt(item?.product_rating)}
                size={10}
              />
              {item?.product_rating == '0' ? null : (
                <Text style={[styles.distance]} numberOfLines={1}>
                  {item?.product_rating}
                </Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
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
            flexGrow: 1,
          }}
        />
      )}
    </View>
  );
};

export default Dining;

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
