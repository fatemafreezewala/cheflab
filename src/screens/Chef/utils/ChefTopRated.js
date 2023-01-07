import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS, icons} from '../../../constants';
import {horizScale, SIZES} from '../../../constants/themes';
import ApiCall from '../../../network/ApiCall';
import {API_END_POINTS} from '../../../network/ApiEndpoints';
import {addItemToFavChef, removeItemFavChef} from '../../../redux/actions';
import {Rating, AirbnbRating} from 'react-native-elements';

const ChefTopRated = ({marginEnd, marginStart, items, smallText, heading}) => {
  // console.log('item -> ', JSON.stringify(items));
  // const [favorite, setFavorite] = useState("");
  /**[{"chef_id":3,"name":"Cook Ankur Bajaj","vendor_ratings":0,"review_count":0,
   * "image":"https://web10technologies.com/Chelab_full_project/public/vendors/default_chef_image.jpg",
   * "Age":17,"experience":"10","order_served":0,"is_like":0,"distance":134.3,"food_specility":"Marathi"}]
   */

  const dispatch = useDispatch();
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
      // await AsyncStorage.getItem('favChef', (err, value) => {
      //   if (err) {
      //   } else {
      //     if (value !== '' && value !== null) {
      //       console.log('aaaaaaaaaaaaaaaaaaaaaaaa 111 -> ', value);
      //     } else {
      //     }
      //   }
      // });
    } catch (error) {
      console.log('aaaaaaaaaaaaaaaaaaaaaaaa 111 -> ', error);
    }
  };

  const favChefArray = useSelector(state => state.state.chefFavArray);

  const updateAsyncStoreFavChef = () => {
    // [{"chef_id":5,"name":"Chef Ankur Bajaj","vendor_ratings":0,"review_count":0,"image":"https://web10technologies.com/Chelab_full_project/public/vendors/1667851300-profile-262.jpg","Age":30,"experience":"2","order_served":0,"is_like":0,"distance":2.9,"food_specility":"Italian"}]
    console.log(
      'faveChef array updateAsyncStoreFavChef ->>> ',
      JSON.stringify(favChefArray),
    );
    AsyncStorage.setItem('favChef', JSON.stringify(favChefArray));
  };

  const updateFavUnFav = idx => {
    let a = data.map((item, index) => {
      let temp = Object.assign({}, item);
      if (index == idx) {
        if (temp.is_like == 1) {
          temp.is_like = 0;
          let body = {user_id: userId, vendor_id: temp?.chef_id + ''};
          ApiCall('post', body, API_END_POINTS.restaurantRemoveFavorite, {
            Authorization: `Bearer ${apiToken}`,
          }).then(response => {
            console.log('restaurantRemoveFavorite ->>. ', response?.data);
            if (response?.data?.status) {
            }
          });
        } else {
          // console.log('aaaaaaaaaaaaaaaaaaaaaaaa 222 -> ', idx + ' ' + index);
          let body = {user_id: userId, vendor_id: temp?.chef_id + ''};

          ApiCall('post', body, API_END_POINTS.restaurantAddFavorite, {
            Authorization: `Bearer ${apiToken}`,
          }).then(response => {
            console.log('restaurantRemoveFavorite ->>. ', response?.data);
            if (response?.data?.status) {
              // ShowMessage(response?.data?.message);
            }
          });
          temp.is_like = 1;
        }
      }
      return temp;
    });
    setData(a);
  };

  const navigation = useNavigation();
  const renderItem = ({item, index}) => {
    // console.log('aaaaaaaaaaaaaaaaaaaaaaaa -> ', JSON.stringify(item));

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ChefDetails', {item});
        }}
        style={{
          marginEnd: index == data.length - 1 ? SIZES.padding + 10 : 5, // backgroundColor: '#dfd',
        }}
        activeOpacity={0.9}>
        <View
          activeOpacity={0.9}
          style={{
            borderWidth: 1,
            borderColor: '#DB2728',
            borderRadius: 10,
            marginStart: 20,
            marginTop: 25,
            height: 150,
            maxWidth: 320,
            width: 320,
          }}>
          <View
            activeOpacity={0.9}
            style={{
              borderColor: '#DB2728',
              width: 320,
            }}>
            <View
              style={{
                borderRadius: 10,
                paddingStart: 50,
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={[
                  styles.moodText,
                  {
                    fontSize: horizScale(18),
                  },
                ]}
                numberOfLines={2}>
                {item?.name}
              </Text>
              <Text
                style={{
                  fontFamily: 'Segoe UI',
                  fontSize: horizScale(14),
                  color: COLORS.grey,
                  marginStart: 25,
                  marginTop: 5,
                }}>
                Age - {item?.Age} yrs, Cooking Exp - {item?.experience} Yrs
              </Text>
              <View
                style={{
                  alignSelf: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: 5,
                  paddingBottom: 10,
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
                  defaultRating={parseInt(item?.vendor_ratings)}
                  size={10}
                />
                {item?.vendor_ratings == '0' ? null : (
                  <>
                    <Text
                      style={{
                        marginHorizontal: 5,
                        fontFamily: 'Segoe UI Bold',
                        fontSize: horizScale(14),
                        color: COLORS.black,
                        alignSelf: 'center',
                        marginVertical: 2,
                      }}>
                      {item?.vendor_ratings}
                    </Text>
                    <Text
                      style={{
                        // marginHorizontal: 10,
                        fontFamily: 'Segoe UI',
                        fontSize: horizScale(10),

                        color: '#0638ff',
                        // marginTop: 0,
                        alignSelf: 'center',
                        marginVertical: 2,
                      }}>
                      ({item?.review_count} Reviews)
                    </Text>
                  </>
                )}
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                updateFavUnFav(index);
              }}
              style={styles.fav}>
              <Image
                source={item?.is_like != 0 ? icons.favorite : icons.unfavorite}
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            </TouchableOpacity>

            <View
              style={{
                marginTop: 15,
                marginHorizontal: 10,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  marginHorizontal: 3,
                  fontFamily: 'Segoe UI',
                  fontSize: horizScale(14),
                  color: COLORS.black,
                }}>
                Order Served - {item?.order_served}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Image
                  source={icons.scooter}
                  style={[
                    styles.distance_logo,
                    {
                      marginBottom: 0,
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
          </View>
          <View
            style={{
              height: 105,
              width: 104.5,
              borderRadius: 100,
              position: 'absolute',
              left: -17,
              bottom: 60,
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
                height: 95,
                width: 95,
                borderRadius: 50,
                alignSelf: 'center',
                resizeMode: 'cover',
              }}
            />
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
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <>
      <Text
        style={[
          styles.smallText,
          {
            marginTop: 40,
          },
        ]}>
        {smallText}
      </Text>
      <Text
        style={[
          styles.moodText,
          {
            marginTop: 0,
          },
        ]}>
        {heading}
      </Text>
      <View
        style={{
          marginStart: 10,
        }}>
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
      </View>
    </>
  );
};

export default ChefTopRated;

export const ChefTopRatedSkeleton = () => {
  return (
    <View>
      <ShimmerPlaceHolder
        isReversed={true}
        LinearGradient={LinearGradient}
        height={25}
        width={Dimensions.get('window').width - 25}
        style={{
          marginTop: 25,
          alignSelf: 'center',
          borderRadius: 5,
          marginBottom: 10,
        }}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{}}>
        <View style={{flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              width={100}
              height={100}
              style={{
                marginStart: 15,
                borderRadius: 50,
              }}
            />
            <View
              style={{
                // alignSelf: 'center',
                marginStart: 15,
              }}>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                height={15}
                width={horizScale(220)}
                style={{
                  marginStart: 10,
                  marginTop: 10,
                  alignSelf: 'center',
                  borderRadius: 5,
                }}
              />
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                height={15}
                width={horizScale(220)}
                style={{
                  marginStart: 10,
                  marginTop: 10,
                  borderRadius: 5,
                }}
              />

              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                height={15}
                width={horizScale(220)}
                style={{
                  marginStart: 10,
                  marginTop: 10,
                  borderRadius: 5,
                }}
              />
            </View>
          </View>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              // flex: 1,
            }}>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={15}
              width={horizScale(100)}
              style={{
                marginStart: 20,
                marginTop: 10,
                borderRadius: 5,
              }}
            />
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={15}
              width={horizScale(100)}
              style={{
                // marginEnd: -15,
                marginTop: 10,
                borderRadius: 5,
                // alignSelf: 'flex-end',
              }}
            />
          </View>
          <View>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={15}
              width={horizScale(120)}
              style={{
                marginStart: 10,
                marginTop: 10,
                borderRadius: 5,
                alignSelf: 'center',
              }}
            />
          </View>
        </View>

        <View style={{flex: 1, marginStart: 10}}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              width={100}
              height={100}
              style={{
                marginStart: 15,
                borderRadius: 50,
              }}
            />
            <View
              style={{
                // alignSelf: 'center',
                marginStart: 15,
              }}>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                height={15}
                width={horizScale(220)}
                style={{
                  marginStart: 10,
                  marginTop: 10,
                  alignSelf: 'center',
                  borderRadius: 5,
                }}
              />
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                height={15}
                width={horizScale(220)}
                style={{
                  marginStart: 10,
                  marginTop: 10,
                  borderRadius: 5,
                }}
              />

              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                height={15}
                width={horizScale(220)}
                style={{
                  marginStart: 10,
                  marginTop: 10,
                  borderRadius: 5,
                }}
              />
            </View>
          </View>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              // flex: 1,
            }}>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={15}
              width={horizScale(100)}
              style={{
                marginStart: 20,
                marginTop: 10,
                borderRadius: 5,
              }}
            />
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={15}
              width={horizScale(100)}
              style={{
                // marginEnd: -15,
                marginTop: 10,
                borderRadius: 5,
                // alignSelf: 'flex-end',
              }}
            />
          </View>
          <View>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={15}
              width={horizScale(120)}
              style={{
                marginStart: 10,
                marginTop: 10,
                borderRadius: 5,
                alignSelf: 'center',
              }}
            />
          </View>
        </View>

        <View style={{flex: 1, marginStart: 10}}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              width={100}
              height={100}
              style={{
                marginStart: 15,
                borderRadius: 50,
              }}
            />
            <View
              style={{
                // alignSelf: 'center',
                marginStart: 15,
              }}>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                height={15}
                width={horizScale(220)}
                style={{
                  marginStart: 10,
                  marginTop: 10,
                  alignSelf: 'center',
                  borderRadius: 5,
                }}
              />
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                height={15}
                width={horizScale(220)}
                style={{
                  marginStart: 10,
                  marginTop: 10,
                  borderRadius: 5,
                }}
              />

              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                height={15}
                width={horizScale(220)}
                style={{
                  marginStart: 10,
                  marginTop: 10,
                  borderRadius: 5,
                }}
              />
            </View>
          </View>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              // flex: 1,
            }}>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={15}
              width={horizScale(100)}
              style={{
                marginStart: 20,
                marginTop: 10,
                borderRadius: 5,
              }}
            />
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={15}
              width={horizScale(100)}
              style={{
                // marginEnd: -15,
                marginTop: 10,
                borderRadius: 5,
                // alignSelf: 'flex-end',
              }}
            />
          </View>
          <View>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={15}
              width={horizScale(120)}
              style={{
                marginStart: 10,
                marginTop: 10,
                borderRadius: 5,
                alignSelf: 'center',
              }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  moodText: {
    fontFamily: 'Segoe UI Bold',
    fontSize: 18,
    color: 'rgba(0, 0, 0, 255)',
    marginStart: 15,
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
    fontSize: horizScale(12),

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
  smallText: {
    fontFamily: 'Segoe UI Bold',
    fontSize: 10,
    color: '#707070',
    marginStart: 16,
    marginTop: 25,
  },
});

/**
 
                                    API MISSING POINTS

1.	Login otp verify ke baad user ki all details nhi aa rahi hai 

2. getRestaurantDetailPage  -- api end point

{
            "menuName": "Pizza",
            "id": 1,
            "products": [
                {
                    "product_name": "Pizza - 6 pics",
                    "product_price": "250.00",
                    "customizable": "true",
                    "image": "https://web10technologies.com/Chelab_full_project/public/products/1663421006-restaurant-product-470.png"
                }
            ]
}
 
// missing key
id, rating, like, type (veg non-veg), dish categories


3.	getProductDetail – api end point
 {
        "product_name": "Pizza - 6 pics",
        "product_price": "250.00",
        "customizable": "true",
        "image": "https://web10technologies.com/Chelab_full_project/public/products/1663421006-restaurant-product-470.png",
        "cuisinesName": "Chinese",
        "description": "best pizza"
    }

// missing key
  id, rating, like 

Jahan bhi  id se kaam hai us item ki id aap api me do 

Ho sake to har item ki id hoti hai vo aap do

4.	view-cart  -- api end point
{
    "status": false,
    "error": [
        "The cart id field is required."
    ]
}

Remove cart id from these fetch cart data only with user id

5. chef-home   -- api endpoint
{"name":"John Chef","vendor_ratings":0,"review_count":0,
    "image":"https://web10technologies.com/Chelab_full_project/public/vendors/1663419958-profile-806.jpg",
    "Age":26,"experience":"5"}

    // missing key 
    order served , distance , like


6. home -- api end point

      vendors:[{
                "name": "Delhi Darbar",
                "image": "https://web10technologies.com/Chelab_full_project/public/vendors/logo-A4ihwZeMct6325d0916ec1b.jpeg",
                "vendor_ratings": 0,
                "banner": ""
            }]

  // missing key
  id, distance ,rating, like 

  products:[{
 "product_name": "Pasta",
 "product_price": "200.00",
 "customizable": "false",
 "image": https://web10technologies.com/Chelab_full_project/public/products/163421842-restaurant-product-388.png
}]
// missing key
  id, rating, like , dish type (like continent like north indian/south indian) , restaurant name, rating, 
  reviews, 

7. getRestaurantByCategory  -- api end point
// missing key
rating number, distance, 


 */
