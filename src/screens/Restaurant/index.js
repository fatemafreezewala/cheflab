import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  InteractionManager,
} from 'react-native';
import {Rating, AirbnbRating} from 'react-native-elements';

import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS, icons, images, SIZES} from '../../constants/index';
import ApiCall from '../../network/ApiCall';
import {API_END_POINTS} from '../../network/ApiEndpoints';
import {updateCartCount} from '../../redux/actions/index';
import RadioButtons from '../../utils/AddItemRadioButton';
import FoodyFeaturedRest from '../../utils/FoodyFeaturedRest';
import {ShowMessage} from '../../utils/Utility';
import WhatsMind, {
  WhatsMindSkeleton,
  WhatsMindTitleSkeleton,
} from '../../utils/WhatsMind';
import ListCardView from './List/utils/ListCardView';
import style from './style';
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const Restaurant = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [apiToken, setApiToken] = useState('');
  const [cuisinesData, setCuisinesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const isFocused = useIsFocused();

  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    getInfoFromStorage();
    // if (isFocused) {
    //   getInfoFromStorage();
    // }
    setLoading(false);
    const interactionPromise = InteractionManager.runAfterInteractions(
      () => {},
    );
    return () => interactionPromise.cancel();
  }, []);

  const fetchConcurrentData = async (token, userid) => {
    let cartbody = {
      user_id: userid,
    };
    const userCart = ApiCall('post', cartbody, API_END_POINTS.viewCart, {
      Authorization: `Bearer ${token}`,
    }).then(response => response);

    let restbody = {
      lat: userLatitude,
      lng: userLongitude,
      vendor_offset: 0,
      vendor_limit: 10,
      product_offset: 0,
      product_limit: 10,
    };

    const restHomePageData = ApiCall(
      'post',
      restbody,
      API_END_POINTS.getRestaurantHomePage,
      {
        Authorization: `Bearer ${token}`,
      },
    ).then(response => response);

    return Promise.all([userCart, restHomePageData]);
  };

  const getNewData = (token, uid) => {
    fetchConcurrentData(token, uid)
      .then(response => {
        if (response[0]?.data?.status == false) {
          dispatch(updateCartCount(0));
          if (restHomeBlogData?.length == 0) {
            setRestHomeBlogData(response[1]?.data?.response?.blogs);
          }

          setRestHomePageData(response[1]?.data?.response);
          // console.log('\n');
          // console.log('\n');
          // console.log('\n');
          // console.log('\n');
          // console.log('\n');
          // console.log('BLOG DATA SET NEW CHANGE -> ');
          // console.log(response[1]?.data?.response?.blogs);
          // console.log('\n');
          // console.log('\n');
          // console.log('\n');
          // console.log('\n');
          // console.log('\n');
          setRestHomePageDataFoody(response[1]?.data?.response?.products);
          setRestMainHomePageDataFoody(response[1]?.data?.response?.products);
        } else {
          if (restHomeBlogData?.length == 0) {
            setRestHomeBlogData(response[1]?.data?.response?.blogs);
          }
          setRestHomePageData(response[1]?.data?.response);
          setRestHomePageDataFoody(response[1]?.data?.response?.products);
          setRestMainHomePageDataFoody(response[1]?.data?.response?.products);
        }
      })
      .catch(err => {
        console.log('fetchConcurrentData ERROR - >>> ', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getInfoFromStorage = async () => {
    let t = '';
    try {
      await AsyncStorage.getItem('token', (err, value) => {
        if (err) {
        } else {
          if (value !== '' && value !== null) {
            t = value;
            setApiToken(value);
            getHomeBanner(value);
            getCuisines(value);
            getCategories(value);
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
            getUserCartCount(t, value);

            fetchConcurrentData(t, value)
              .then(response => {
                if (response[0]?.data?.status == false) {
                  dispatch(updateCartCount(0));
                  // console.log(
                  //   JSON.stringify(response[1].data?.response?.blogs),
                  // );
                  if (restHomeBlogData?.length == 0) {
                    setRestHomeBlogData(response[1]?.data?.response?.blogs);
                  }
                  setRestHomePageData(response[1]?.data?.response);

                  setRestHomePageDataFoody(
                    response[1]?.data?.response?.products,
                  );
                  setRestMainHomePageDataFoody(
                    response[1]?.data?.response?.products,
                  );
                } else {
                  if (restHomeBlogData?.length == 0) {
                    setRestHomeBlogData(response[1]?.data?.response?.blogs);
                  }
                  setRestHomePageData(response[1]?.data?.response);

                  setRestHomePageDataFoody(
                    response[1]?.data?.response?.products,
                  );
                  setRestMainHomePageDataFoody(
                    response[1]?.data?.response?.products,
                  );
                }
              })
              .catch(err => {
                console.log('fetchConcurrentData ERROR - >>> ', err);
              })
              .finally(() => {
                setLoading(false);
              });
          } else {
            setUserId('');
          }
        }
      });

      await AsyncStorage.getItem('cart_id', (err, value) => {
        if (err) {
        } else {
          if (value !== '' && value !== null) {
            setCartId(value);
          } else {
          }
        }
      });
    } catch (error) {}
  };

  const [restaurantAllData, setAllRestaurantData] = useState([]);
  const [noMoreData, setNoMoreData] = useState(false);
  const [restaurantAllMainData, setAllRestaurantMainData] = useState([]);
  const [callOnce, setCallOnce] = useState(false);
  const [offset, setOffset] = useState(0);

  const getAllVendorRatingReview = async value => {
    setCallOnce(true);
    let body = {
      lat: userLatitude,
      lng: userLongitude,
      offset: offset,
      limit: 10,
    };

    ApiCall('post', body, API_END_POINTS.getAllVendorRatingReview, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        if (response?.data?.status) {
          setAllRestaurantMainData(response?.data?.response);
          let a = [...restaurantAllData, ...response?.data?.response];
          // console.log('getAllVendorRatingReview -> >>> ' + JSON.stringify(a));
          setAllRestaurantData(a);
          if (response?.data?.response?.length > 0) {
            setNoMoreData(false);
          } else {
            setNoMoreData(true);
            setLoadNextData(false);
          }
          setOffset(offset + 10);
        } else {
          setAllRestaurantData([]);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {
        setLoading(false);
        setCallOnce(false);
      });
  };

  useEffect(() => {
    const interactionPromise = InteractionManager.runAfterInteractions(() => {
      getInfoFromStorage();
    });
    return () => interactionPromise.cancel();
  }, [navigation, isFocused]);

  // useEffect(() => {
  //   const interactionPromise = InteractionManager.runAfterInteractions(() => {
  //     getInfoFromStorage();
  //   });
  //   return () => interactionPromise.cancel();
  // }, [isFocused]);

  const [notAvailLocation, setNotAvailLocation] = useState(false);

  const getCuisines = value => {
    let body = {
      lat: userLatitude,
      lng: userLongitude,
    };
    ApiCall('post', body, API_END_POINTS.getAllCuisines, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        console.log('\n\n');
        console.log('\n\n');

        console.log('\n\n');
        console.log('\n\n');

        if (response?.data?.status) {
          // console.log(
          //   'SUCCESS getAllCuisines ->>>>>>>',
          //   response?.data?.status,
          // );

          setCuisinesData(response?.data?.response);
          setNotAvailLocation(response?.data?.response == 0);
        } else {
          setNotAvailLocation(true);
          setCuisinesData([]);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [banner, setBanner] = useState([]);
  // console.log('usela set ' + userLatitude + ' ' + userLongitude);

  const getHomeBanner = t => {
    let body = {
      for: 'restaurant',
    };
    ApiCall('post', body, API_END_POINTS.getHomeBanner, {
      Authorization: `Bearer ${t}`,
    })
      .then(response => {
        console.log('\n\n');
        console.log('\n\n BANNER API RESPONSE: ');
        console.log(JSON.stringify(response.data));
        console.log('\n\n BANNER API RESPONSE: ');
        console.log('\n\n');
        console.log('\n\n');

        if (response?.data?.status) {
          setBanner(response?.data?.response);
        } else {
          setBanner([]);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {});
  };

  const getCategories = value => {
    let body = {
      lat: userLatitude,
      lng: userLongitude,
    };

    ApiCall('post', body, API_END_POINTS.getAllFoodCategories, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        if (response?.data?.status) {
          setCategoryData(response?.data?.response);
          setLoading(false);
          setNotAvailLocation(response?.data?.response == 0);
        } else {
          setNotAvailLocation(true);

          setCategoryData([]);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const closeAddModal = () => {
    setShowAdd(!showAdd);
    setAddonData([]);
    setVariantData([]);
    setTotalAddonPrice(0);
    setTotalProductPrice(0);
    setSelectedOption(null);
    setPresentInCart(false);
  };
  const [pData, setPData] = useState({});
  const [newCartIndex, setNewCartIndex] = useState(0);

  const [showAdd, setShowAdd] = useState(false);

  const [restHomeBlogData, setRestHomeBlogData] = useState([]);

  // console.log(restHomeBlogData?.length + ' length of array rest blog');

  const [restHomePageData, setRestHomePageData] = useState([]);

  const [counts, setCounts] = useState([]);
  const [restHomePageDataFoody, setRestHomePageDataFoody] = useState([]);
  const [restMainHomePageDataFoody, setRestMainHomePageDataFoody] = useState(
    [],
  );

  const [totalProductPrice, setTotalProductPrice] = useState(0);
  const [totalAddonPrice, setTotalAddonPrice] = useState(0);

  const onSelect = (item, addons) => {
    if (presentInCart) {
    } else {
      if (selectedOption && selectedOption.variant_name === item.variant_name) {
      } else {
        setSelectedOption(item);
        setTotalProductPrice(
          parseInt(item?.variant_price) * parseInt(item?.qty),
        );
      }
    }
  };

  const newItemExistPlus = productId => {
    let a = [...restHomePageDataFoody];
    let b = a.map(item => {
      let temp = Object.assign(item, {});
      if (productId == temp?.product_id) {
        const itemss = pData?.options?.find(x => x.id === selectedOption?.id);
        // console.log('item -> ', JSON.stringify(itemss));
        temp.cart_qty = parseInt(itemss?.variant_qty) || 1;
        addToCart(temp);
        getUserCartCount(apiToken, userId);
      } else {
        temp.cart_qty = 0;
      }
      return temp;
    });
    setRestHomePageDataFoody(b);
  };

  const onAddModalPlus = (id, arr, data, idx) => {
    let t = 0;
    let a = variantData?.map(item => {
      let temp = Object.assign({}, item);
      if (parseInt(item?.id) === parseInt(id)) {
        // if (parseInt(temp.cart_variant_qty) == 0) {
        //   temp.cart_variant_qty = parseInt(temp.cart_variant_qty) + 2;
        //   t = parseInt(totalProductPrice) + parseInt(temp?.variant_price);
        // } else {
        temp.qty = parseInt(temp.qty) + 1;
        temp.added = true;
        t = parseInt(totalProductPrice) + parseInt(temp?.variant_price);
        // }
      }
      return temp;
    });
    setTotalProductPrice(t);
    setVariantData(a);

    // restHomePageDataFoody[newCartIndex] = {
    //   ...pData,
    //   options: a,
    // };

    // console.log(
    //   'new index cart -> ',
    //   newCartIndex +
    //     ' ' +
    //     JSON.stringify({
    //       ...pData,
    //       options: a,
    //     }),
    // );

    // setRestHomePageDataFoody(restHomePageDataFoody);
  };

  const onAddModalMinus = (id, arr, data, idx) => {
    let t = 0;

    let a = variantData?.map(item => {
      let temp = Object.assign({}, item);
      if (parseInt(item?.id) === parseInt(id)) {
        if (parseInt(temp.qty) == 1) {
          t = parseInt(totalProductPrice);
        } else {
          // temp.cart_variant_qty = parseInt(temp.cart_variant_qty) - 1;
          temp.qty = parseInt(temp.qty) - 1;
          t = parseInt(totalProductPrice) - parseInt(temp?.variant_price);
        }
      }
      return temp;
    });

    setTotalProductPrice(t);
    setVariantData(a);
    // setPData({
    //   ...pData,
    //   options: a,
    // });
  };

  const [cartVendorId, setCartVendorId] = useState('');
  const [cartVendorName, setCartVendorName] = useState('');

  const getUserCartCount = (t, value) => {
    let body = {
      user_id: value,
    };

    ApiCall('post', body, API_END_POINTS.get_cart_count, {
      Authorization: `Bearer ${t}`,
    })
      .then(response => {
        if (response?.data?.status) {
          setCartVendorId(response?.data?.response?.cart?.vendor_id);
          setCartVendorName(
            response?.data?.response?.cart?.restaurant_name + '' || '',
          );

          setCartArrayCount(response?.data?.response?.cart?.products_count);

          setCartId(response?.data?.response?.cart?.id);

          dispatch(
            updateCartCount(response?.data?.response?.cart?.products_count),
          );
        } else {
          setCartArrayCount('');
          dispatch(updateCartCount(0));
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {});
  };

  const removeItemFromCart = async () => {
    let body = {
      user_id: userId + '',
    };
    await ApiCall('post', body, API_END_POINTS.removeEmptyCart, {
      Authorization: `Bearer ${apiToken}`,
    });
    AsyncStorage.setItem('cart_id', '');
  };

  const getRestHomePage = value => {
    let body = {
      lat: userLatitude,
      lng: userLongitude,
      vendor_offset: 0,
      vendor_limit: 10,
      product_offset: 0,
      product_limit: 10,
    };
    ApiCall('post', body, API_END_POINTS.getRestaurantHomePage, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        if (response?.data?.status) {
          if (restHomeBlogData?.length == 0) {
            setRestHomeBlogData(response[1]?.data?.response?.blogs);
          }
          setRestHomePageData(response?.data?.response);

          setRestHomePageDataFoody(response?.data?.response?.products);
        } else {
          setRestHomePageDataFoody([]);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getRestHomePageBlog = value => {
    let body = {
      lat: userLatitude,
      lng: userLongitude,
      vendor_offset: 0,
      vendor_limit: 10,
      product_offset: 0,
      product_limit: 10,
    };
    ApiCall('post', body, API_END_POINTS.getRestaurantHomePage, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        if (response?.data?.status) {
          if (restHomeBlogData?.length == 0) {
            setRestHomeBlogData(response[1]?.data?.response?.blogs);
          }
        } else {
          setRestHomeBlogData([]);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [userId, setUserId] = useState('');
  const [addonPrice, setAddonPrice] = useState(0);

  const addItemAddon = (arr, id, mainData) => {
    let t = 0;
    let b = 0;
    let a = addonData.map(item => {
      var temp = Object.assign({}, item);
      if (temp.addon === id) {
        temp.added = !temp.added;
        // if (parseInt(temp.cart_addon_qty) == 0) {
        //   temp.cart_addon_qty = 1;
        //   b = parseInt(temp.price) + parseInt(totalAddonPrice);
        // } else {
        if (temp?.added) {
          temp.qty = 1;
          b = parseInt(temp.price) + parseInt(totalAddonPrice);
        } else {
          b = parseInt(totalAddonPrice) - parseInt(temp.price);
        }
        // }
      }
      setTotalAddonPrice(b);
      return temp;
    });

    // setPData({...pData, addons: a});
    setAddonData(a);

    restHomePageDataFoody[newCartIndex] = {
      ...pData,
      addons: a,
    };

    setRestHomePageDataFoody(restHomePageDataFoody);
  };

  const userLatitude = useSelector(state => state?.state?.userLatitude);
  const userLongitude = useSelector(state => state?.state?.userLongitude);

  // console.log(
  //   `User Latitude: ${userLatitude} and user Longitude: ${userLongitude} and apitkey: ${apiToken}`,
  // );

  const [cartArrayCount, setCartArrayCount] = useState('');

  const [showItemExist, setShowItemExist] = useState(false);

  const [itemExistData, setItemExistData] = useState({});

  const renderItemExist = () => {
    return (
      <Modal
        visible={showItemExist}
        animationType="slide"
        transparent={true}
        statusBarTranslucent
        onRequestClose={() => setShowItemExist(false)}
        style={{flexGrow: 1}}>
        <View
          style={{
            backgroundColor: '#00000090',
            flexGrow: 1,
            justifyContent: 'flex-end',
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setShowItemExist(!showItemExist)}
            style={{flex: 1}}></TouchableOpacity>
          <View style={style.additemView}>
            <View
              style={[
                {
                  elevation: 10,
                  backgroundColor: COLORS.white,
                  borderTopRightRadius: 15,
                  borderTopLeftRadius: 15,
                },
                style.addItemHeader,
              ]}>
              <View
                style={[
                  style.rowView,
                  {
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    borderTopRightRadius: 15,
                    borderTopLeftRadius: 15,
                  },
                ]}>
                <View style={{flex: 1}}>
                  <Text style={style.addHeaderText}>Item already in cart</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setShowItemExist(!showItemExist)}>
                  <Image
                    source={icons.cancel}
                    style={{
                      width: 20,
                      height: 20,
                      marginRight: 10,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView
              style={[
                style.middleView,
                {
                  borderTopRightRadius: 0,
                  borderTopLeftRadius: 0,
                },
              ]}>
              <Text
                style={[
                  {
                    fontSize: 15,
                    fontFamily: 'Segoe UI',
                    color: COLORS.black,
                    marginEnd: 10,
                    marginStart: 15,
                    marginTop: 15,
                  },
                ]}>
                {/* Wait, you have some products of other restaurant. Do you want to
                continue ? */}
                Wait, you have some products of other restaurant "
                {cartVendorName}". Do you want to continue?
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginHorizontal: 10,
                  marginVertical: 10,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setShowItemExist(false);
                  }}
                  activeOpacity={0.8}
                  style={{
                    borderColor: COLORS.primary,
                    flex: 1,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginVertical: 5,
                    borderRadius: 10,
                    flexDirection: 'row',
                    marginHorizontal: 10,
                    borderWidth: 1,
                  }}>
                  <Text
                    style={[
                      {
                        color: COLORS.primary,
                        fontSize: 16,
                        fontFamily: 'Segoe UI Bold',
                        textAlign: 'center',
                      },
                    ]}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={async () => {
                    setShowItemExist(false);
                    await removeItemFromCart();
                    getUserCartCount(apiToken, userId);
                    setRestHomePageDataFoody([...restMainHomePageDataFoody]);
                    setCounts(0);
                    newItemExistPlus(itemExistData?.product_id);
                  }}
                  activeOpacity={0.8}
                  style={{
                    backgroundColor: COLORS.primary,
                    flex: 1,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginVertical: 5,
                    borderRadius: 10,
                    flexDirection: 'row',
                    borderWidth: 1,
                    borderColor: COLORS.primary,
                    marginHorizontal: 10,
                  }}>
                  <Text
                    style={[
                      // style.addressText,
                      {
                        color: COLORS.white,
                        fontSize: 16,
                        fontFamily: 'Segoe UI Bold',
                        textAlign: 'center',
                        // marginVertical: 10,
                      },
                    ]}>
                    Continue
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const [cartId, setCartId] = useState(null);

  const [selectedOption, setSelectedOption] = useState(null);

  const newPlus = productId => {
    let a = [...restHomePageDataFoody];
    let b = a.map(item => {
      let temp = Object.assign(item, {});
      if (productId == temp?.product_id) {
        const itemss = pData?.options?.find(x => x.id === selectedOption?.id);
        temp.cart_qty = parseInt(itemss?.cart_variant_qty) || 1;
        addToCart(temp);
        getUserCartCount(apiToken, userId);
        getNewData(apiToken, userId);
      }
      return temp;
    });
    setRestHomePageDataFoody(b);
  };

  const addToCart = async i => {
    console.log('add to cart rec item-> ', JSON.stringify(i));

    let body = {
      user_id: userId,
      vendor_id: i?.vendor_id + '',
      products: [
        {
          product_id: parseInt(i.product_id),
          product_qty: '1',
        },
      ],
    };

    // if (i.options) {
    // const itemss = i.options?.reduce(function (acc, cur) {
    //   if (selectedOption?.id == cur.id) {
    //     if (parseInt(cur.cart_variant_qty) == 0) {
    //       var o = {
    //         variant_id: cur?.id + '',
    //         variant_qty: '1',
    //       };
    //       body.products[0].product_qty = '1';
    //     } else {
    //       var o = {
    //         variant_id: cur?.id + '',
    //         variant_qty: cur.cart_variant_qty + '',
    //       };
    //       body.products[0].product_qty = cur.cart_variant_qty + '' || '1';
    //     }
    //     acc.push(o);
    //   }
    //   return acc;
    // }, []);
    //   if (itemss) {
    //     let temp = Object.assign({}, body.products[0]);
    //     temp.variants = itemss || [];
    //     console.log(
    //       'temp.variants itemmmmmmmmmmmmmmmmmmm=> ' + JSON.stringify(temp),
    //     );
    //     body.products[0] = temp;
    //   }
    // }

    if (variantData && variantData?.length > 0) {
      var o;
      let a = variantData?.reduce(function (acc, cur) {
        if (cur.added) {
          if (selectedOption?.id == cur.id) {
            // if (parseInt(cur.qty) == 1) {
            //   var o = {
            //     variant_id: cur?.id + '',
            //     variant_qty: '1',
            //   };
            //   body.products[0].product_qty = '1';
            // } else {
            o = {
              variant_id: cur?.id + '',
              variant_qty: cur.qty + '',
            };
            body.products[0].product_qty = cur.qty + '' || '1';
            // }
            acc.push(o);
          } else {
            // o = {
            //   variant_id: cur?.id + '',
            //   variant_qty: '1',
            // };
          }
        } else {
          if (selectedOption?.id == cur.id) {
            o = {
              variant_id: cur?.id + '',
              variant_qty: cur.qty + '',
            };
            body.products[0].product_qty = cur.qty + '' || '1';
            acc.push(o);
          }
        }
        return acc;
      }, []);

      if (a) {
        let temp = Object.assign({}, body.products[0]);
        temp.variants = a || [];
        console.log(
          'temp.variants itemmmmmmmmmmmmmmmmmmm=> ' + JSON.stringify(temp),
        );
        body.products[0] = temp;
      }
    }

    if (addonData && addonData?.length > 0) {
      var o;
      let ads = addonData?.reduce(function (acc, cur) {
        console.log(
          'addonData ->>> ',
          cur.added + ' ---- ' + cur.id + ' ---- ' + cur.qty,
        );
        if (cur.added) {
          o = {addon_id: cur?.id + '', addon_qty: '1'};
          acc.push(o);
        } else {
          // o = {addon_id: cur?.id + '', addon_qty: '1'};
        }
        return acc;
      }, []);

      if (ads) {
        let temp = Object.assign({}, body.products[0]);
        temp.addons = ads || [];
        body.products[0] = temp;
      }
    }

    console.log(
      'add to cart rece item temp inb lasrt body else statement  --> ',
      JSON.stringify(body),
    );

    ApiCall('post', body, API_END_POINTS.productAddToCart, {
      Authorization: `Bearer ${apiToken}`,
    })
      .then(response => {
        console.log(
          'add to caret api response p --> ',
          JSON.stringify(response?.data),
        );
        if (response?.data?.status) {
          // ShowMessage(response?.data?.message);
          setCartId(response?.data?.response?.cart_id);
          AsyncStorage.setItem(
            'cart_id',
            JSON.stringify(response?.data?.response?.cart_id),
          );
          getUserCartCount(apiToken, userId);
        } else {
          ShowMessage(response?.data?.error + '');
        }
      })
      .catch(error => {
        console.log('ERROR IN ADD TO CART API =-> ', error);
      });
    setLoading(false);
  };

  const newPlusOut = productId => {
    let a = [...restHomePageDataFoody];
    let b = a.map(item => {
      let temp = Object.assign(item, {});
      if (productId == temp?.product_id) {
        temp.cart_qty = parseInt(temp.cart_qty) + 1;
        updateCart(temp);
        getNewData(apiToken, userId);
      }
      return temp;
    });
    setRestHomePageDataFoody(b);
  };

  const newMinusOut = productId => {
    let a = [...restHomePageDataFoody];
    let b = a.map(item => {
      let temp = Object.assign({}, item);
      if (productId == temp.product_id + '') {
        temp.cart_qty = parseInt(temp.cart_qty) - 1;
        updateCart(temp);
      }
      return temp;
    });

    setRestHomePageDataFoody(b);
  };

  const updateCart = async i => {
    let body = {
      cart_id: cartId,
      user_id: userId,
      vendor_id: i?.vendor_id + '',
      products: [
        {
          product_id: parseInt(i.product_id),
          product_qty: parseInt(i.cart_qty) + '',
        },
      ],
    };

    if (i.options) {
      const itemss = i.options?.reduce(function (acc, cur) {
        if (parseInt(cur?.cart_variant_qty) > 0) {
          var o = {
            variant_id: cur?.id + '',
            variant_qty: i.cart_qty + '',
          };
          acc.push(o);
        }
        return acc;
      }, []);
      if (itemss) {
        let temp = Object.assign({}, body.products[0]);
        temp.variants = itemss || [];
        console.log(
          'temp.variants itemmmmmmmmmmmmmmmmmmm=> ' + JSON.stringify(temp),
        );
        body.products[0] = temp;
      }
    }

    if (i?.addons) {
      let ads = i?.addons?.reduce(function (acc, cur) {
        if (parseInt(cur?.cart_addon_qty) > 0) {
          var o = {addon_id: cur?.id + '', addon_qty: '1'};
          acc.push(o);
        }
        return acc;
      }, []);

      if (ads) {
        let temp = Object.assign({}, body.products[0]);

        temp.addons = ads || [];

        body.products[0] = temp;
      }
    }

    console.log(
      'final add to cart array  update cart api last body = > ',
      JSON.stringify(body),
    );

    ApiCall('post', body, API_END_POINTS.updateCart, {
      Authorization: `Bearer ${apiToken}`,
    })
      .then(response => {
        // console.log(
        //   'add to caret api resoinse p  updateCart r--> ',
        //   JSON.stringify(response?.data),
        // );
        if (response?.data?.status) {
          getUserCartCount(apiToken, userId);
        } else {
          ShowMessage(response?.data?.error + '');
        }
      })
      .catch(error => {
        console.log('ERROR IN ADD TO CART API =-> ', error);
      });
  };

  /** ADD TO CART API END */

  const renderAddModal = () => {
    return (
      <Modal
        visible={showAdd}
        animationType="slide"
        transparent={true}
        statusBarTranslucent
        onRequestClose={() => closeAddModal()}
        style={{flexGrow: 1}}>
        <View
          style={{
            backgroundColor: '#00000090',
            flexGrow: 1,
            justifyContent: 'flex-end',
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => closeAddModal()}
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
              // backgroundColor: COLORS.cartCountBgColor,
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => closeAddModal()}>
              <Image
                source={icons.cancel}
                style={{
                  width: 40,
                  height: 40,
                  margin: 10,
                }}
              />
            </TouchableOpacity>
          </TouchableOpacity>
          <View style={style.additemView}>
            <ScrollView
              style={[
                style.middleView,
                {
                  paddingTop: 10,
                },
              ]}>
              <View
                style={
                  {
                    // paddingBottom: 10,
                  }
                }></View>
              <View
                style={{
                  elevation: 10,
                  backgroundColor: COLORS.white,
                  marginHorizontal: 10,
                  borderRadius: 15,
                  width: '95%',
                  // height: 350,
                }}>
                <Image
                  source={{
                    uri: pData?.image,
                  }}
                  style={{
                    width: '95%',
                    height: 250,
                    margin: 10,
                    resizeMode: 'stretch',
                    borderRadius: 5,
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    updateFavUnFav(pData?.product_id);
                  }}
                  style={{
                    borderRadius: 50,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 50,
                    borderWidth: 1,
                    right: 15,
                    top: 15,
                    position: 'absolute',
                  }}>
                  <Image
                    source={pData?.is_like ? icons.favorite : icons.unfavorite}
                    style={{
                      width: 30,
                      height: 30,
                    }}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {}}
                style={{
                  // backgroundColor: '#e7e7e7',
                  flexDirection: 'row',
                  width: '100%',
                  // borderTopRightRadius: 15,
                  // borderTopLeftRadius: 15,
                  justifyContent: 'space-between',
                  paddingVertical: 5,
                }}>
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: COLORS.black,
                        fontSize: 18,
                        fontFamily: 'Segoe UI Bold',
                        // marginBottom: 5,
                        marginTop: 5,
                        marginEnd: 8,
                        marginStart: 20,

                        paddingBottom: pData?.product_rating == 0 ? 10 : 0,
                      }}>
                      {pData?.product_name}
                    </Text>
                  </View>

                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: 14,
                      fontFamily: 'Segoe UI',
                      marginEnd: 8,
                      marginStart: 20,
                      maxWidth: Dimensions.get('screen').width - 50,
                    }}>
                    {pData?.dis}
                  </Text>

                  <View
                    style={{
                      alignSelf: 'flex-start',
                      alignItems: 'center',
                      flexDirection: 'row',
                      marginTop: 15,
                      // marginBottom: 5,
                      marginStart: 20,
                      // backgroundColor: COLORS.primary,
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
                      defaultRating={parseInt(pData?.product_rating)}
                      size={10}
                    />
                    {pData?.product_rating != 0 ? (
                      <>
                        <Text
                          style={{
                            marginHorizontal: 3,
                            fontFamily: 'Segoe UI Bold',
                            fontSize: 12,
                            color: COLORS.black,
                            // marginTop: 0,
                            alignSelf: 'center',
                            marginVertical: 2,
                          }}>
                          {pData.product_rating}
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
                          {/* ({item?.reviewCount})12 Reviews */}(
                          {pData.product_rating}) Reviews
                        </Text>
                      </>
                    ) : null}
                  </View>
                  {/* <Text
                    style={{
                      color: COLORS.grey,
                      fontSize: 1,
                      fontFamily: 'Segoe UI',
                      // marginTop: 5,
                      marginStart: 20,
                    }}>
                   South Indian 
                  </Text> */}
                  {/* <Text
                    style={{
                      color: COLORS.darkGray,
                      fontSize: 16,
                      fontFamily: 'Segoe UI',
                      marginTop: 5,
                      marginStart: 20,
                      paddingBottom: 10,
                    }}>
                    ₹ {pData?.product_price}
                  </Text> */}
                </View>
                <TouchableOpacity
                  onPress={() => {
                    closeAddModal();
                    setSelectedOption(null);
                  }}>
                  {pData?.type == 'veg' ? (
                    <Image
                      source={icons.pure_veg}
                      style={{
                        width: 8,
                        height: 8,
                        marginTop: 5,
                        marginEnd: 15,
                      }}
                    />
                  ) : (
                    <Image
                      source={icons.non_pure_veg}
                      style={{
                        width: 8,
                        height: 8,
                        marginTop: 5,
                        marginEnd: 15,
                      }}
                    />
                  )}
                </TouchableOpacity>
              </TouchableOpacity>

              {pData?.customizable == 'true' ? (
                variantData.length >= 1 ? (
                  <>
                    <Text
                      style={{
                        color: COLORS.black,
                        fontSize: 18,
                        fontFamily: 'Segoe UI',
                        marginTop: 15,
                        marginStart: 20,
                      }}>
                      Options
                    </Text>

                    <RadioButtons
                      selectedOption={selectedOption}
                      onSelect={onSelect}
                      options={variantData}
                      var_count={0}
                      onPlus={onAddModalPlus}
                      onMinus={onAddModalMinus}
                      mainData={pData}
                      itemIndex={0}
                    />
                  </>
                ) : (
                  // <View
                  //   style={{
                  //     marginTop: 15,
                  //   }}>
                  //   <ShimmerPlaceHolder
                  //     LinearGradient={LinearGradient}
                  //     height={15}
                  //     width={Dimensions.get('window').width * 0.5}
                  //     style={{
                  //       borderRadius: 5,
                  //       marginStart: 15,
                  //     }}
                  //   />
                  //   <ShimmerPlaceHolder
                  //     LinearGradient={LinearGradient}
                  //     height={15}
                  //     width={Dimensions.get('window').width * 0.93}
                  //     style={{
                  //       borderRadius: 5,
                  //       marginStart: 15,
                  //       marginTop: 5,
                  //     }}
                  //   />
                  //   <ShimmerPlaceHolder
                  //     LinearGradient={LinearGradient}
                  //     height={15}
                  //     width={Dimensions.get('window').width * 0.93}
                  //     style={{
                  //       marginTop: 5,
                  //       borderRadius: 5,
                  //       marginStart: 15,
                  //     }}
                  //   />

                  //   <ShimmerPlaceHolder
                  //     LinearGradient={LinearGradient}
                  //     height={15}
                  //     width={Dimensions.get('window').width * 0.5}
                  //     style={{
                  //       marginTop: 10,
                  //       borderRadius: 5,
                  //       marginStart: 15,
                  //     }}
                  //   />
                  //   <ShimmerPlaceHolder
                  //     LinearGradient={LinearGradient}
                  //     height={15}
                  //     width={Dimensions.get('window').width * 0.93}
                  //     style={{
                  //       borderRadius: 5,
                  //       marginStart: 15,
                  //       marginTop: 5,
                  //     }}
                  //   />
                  //   <ShimmerPlaceHolder
                  //     LinearGradient={LinearGradient}
                  //     height={15}
                  //     width={Dimensions.get('window').width * 0.93}
                  //     style={{
                  //       marginTop: 5,
                  //       borderRadius: 5,
                  //       marginStart: 15,
                  //     }}
                  //   />
                  // </View>
                  <View
                    style={{
                      marginTop: 15,
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                    }}>
                    <ActivityIndicator color={COLORS.primary} size={'large'} />
                  </View>
                )
              ) : null}
              {pData?.customizable == 'true' ? (
                addonData.length >= 1 ? (
                  <>
                    <Text
                      style={{
                        color: COLORS.black,
                        fontSize: 18,
                        fontFamily: 'Segoe UI',
                        marginTop: 15,
                        marginStart: 20,
                      }}>
                      Addons
                    </Text>
                    <FlatList
                      data={addonData}
                      renderItem={({item, index}) => {
                        return (
                          <View style={[{paddingLeft: 24, paddingRight: 6}]}>
                            <View style={[style.rowView, {marginTop: 15}]}>
                              <View style={{flex: 1, paddingRight: 10}}>
                                <Text style={[style.sizeText]}>
                                  {item?.addon}
                                </Text>
                              </View>

                              <TouchableOpacity
                                onPress={() => {
                                  addItemAddon(
                                    pData?.addons,
                                    item?.addon,
                                    pData,
                                  );
                                }}
                                style={{
                                  flexDirection: 'row',
                                }}>
                                <Text style={[style.sizeText, {marginEnd: 10}]}>
                                  ₹ {item?.price}
                                </Text>

                                <Image
                                  source={
                                    item?.added
                                      ? icons.checked
                                      : icons.unchecked
                                  }
                                  style={style.checkbox}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        );
                      }}
                    />

                    <View
                      style={{
                        padding: 10,
                      }}></View>
                  </>
                ) : null
              ) : null}
            </ScrollView>
            <View
              style={{
                backgroundColor: COLORS.lightGray,
                paddingTop: 10,
                borderTopColor: COLORS.grey,

                borderTopWidth: 0.5,
              }}>
              <TouchableOpacity
                onPress={() => {
                  if (cartVendorId == pData?.vendor_id) {
                    newPlus(pData?.product_id + '');
                    setPData({});
                    setShowAdd(false);
                    setAddonData([]);
                    setVariantData([]);
                    setSelectedOption(null);
                    // setTotalAddonPrice(0);
                    // setTotalProductPrice(0);
                  } else if (cartArrayCount == '') {
                    newPlus(pData?.product_id + '');
                    setPData({});
                    setShowAdd(false);
                    setAddonData([]);
                    setVariantData([]);
                    setSelectedOption(null);

                    // setTotalAddonPrice(0);
                    // setTotalProductPrice(0);
                  } else {
                    setItemExistData(pData);
                    setPData({});
                    setShowAdd(false);
                    setShowItemExist(true);
                    setAddonData([]);
                    setVariantData([]);
                    setSelectedOption(null);

                    // setTotalAddonPrice(0);
                    // setTotalProductPrice(0);
                  }
                }}
                activeOpacity={0.8}
                style={{
                  height: 50,
                  paddingHorizontal: 25,
                  backgroundColor: COLORS.primary,
                  marginTop: 1,
                  marginBottom: 10,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                }}>
                {totalProductPrice + totalAddonPrice == 0 ? (
                  <ActivityIndicator size={'small'} color={COLORS.white} />
                ) : (
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: 18,
                      fontFamily: 'Segoe UI Bold',
                    }}>
                    Add Item ₹ {totalProductPrice + totalAddonPrice}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const updateFavUnFav = idx => {
    let a = restHomePageDataFoody.map((item, index) => {
      let temp = Object.assign({}, item);
      if (temp?.product_id == idx) {
        console.log('fav unfav >>>>>>>>>>>>>>>>>>>>', JSON.stringify(temp));
        if (temp.is_like) {
          temp.is_like = false;
          let body = {user_id: userId, product_id: parseInt(temp?.product_id)};
          ApiCall('post', body, API_END_POINTS.productRemoveFavorite, {
            Authorization: `Bearer ${apiToken}`,
          }).then(response => {
            console.log(
              'repoasanfa  fav sfd ap repoisn -> ',
              JSON.stringify(response?.data),
            );
            if (response?.data?.status) {
            }
          });
          let b = {
            ...pData,
            is_like: false,
          };
          setPData(b);
        } else {
          let body = {user_id: userId, product_id: parseInt(temp?.product_id)};

          ApiCall('post', body, API_END_POINTS.productAddFavorite, {
            Authorization: `Bearer ${apiToken}`,
          }).then(response => {
            console.log(
              'repoasanfa  fav sfd ap repoisn -> ',
              JSON.stringify(response?.data),
            );
            if (response?.data?.status) {
            }
          });
          temp.is_like = true;

          let b = {
            ...pData,
            is_like: true,
          };
          setPData(b);
        }
      }
      return temp;
    });

    setRestHomePageDataFoody(a);
  };

  const updateListFavUnFav = idx => {
    // if (item?.is_like) {
    //   ApiCall('post', body, API_END_POINTS.restaurantRemoveFavorite, {});
    // } else {
    //   ApiCall('post', body, API_END_POINTS.restaurantAddFavorite, {});
    // }
    let a = restaurantAllData.map((item, index) => {
      let temp = Object.assign({}, item);
      if (temp?.id == idx) {
        if (temp.is_like) {
          // console.log('aaaaaaaaaaaaaaaaaaaaaaaa 111 -> ', idx + ' ' + index);
          temp.is_like = false;
          let body = {user_id: userId, vendor_id: temp?.id + ''};
          console.log(
            'aaaaaaaaaaaaaaaaaaaaaaaa 111 -> ',
            idx + ' ' + JSON.stringify(body),
          );

          ApiCall('post', body, API_END_POINTS.restaurantRemoveFavorite, {
            Authorization: `Bearer ${apiToken}`,
          }).then(response => {
            if (response?.data?.status) {
              // ShowMessage(response?.data?.message);
              console.log('restaurantRemoveFavorite ->>. ', response?.data);
            }
          });
        } else {
          // console.log('aaaaaaaaaaaaaaaaaaaaaaaa 222 -> ', idx + ' ' + index);
          let body = {user_id: userId, vendor_id: temp?.id + ''};
          console.log(
            'aaaaaaaaaaaaaaaaaaaaaaaa 111 -> ',
            idx + ' ' + JSON.stringify(body),
          );

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
    setAllRestaurantData(a);
  };
  const renderFeaturedDishOne = ({item, index}) => {
    // console.log('itemm 0< 111111111111111 ', JSON.stringify(item));
    let chilli = [];

    for (let i = 0; i < parseInt(item?.products[0]?.chili_level); i++) {
      chilli.push(
        <View key={i}>
          <Image
            source={icons.chilli_level}
            style={{
              width: 10,
              height: 10,
            }}
          />
        </View>,
      );
    }

    return (
      <TouchableOpacity
        onPress={() => {
          if (item?.products[0]?.customizable == 'true') {
            setShowAdd(true);
            // closeAddModal();
            // setShowAdd(true);
            // console.log('pdata -> ', JSON.stringify(item));
            setNewCartIndex(index);
            setPData(item?.products[0]);
            callVariantAddonApi(item?.products[0]?.product_id);
          } else {
            setShowAdd(true);
            // closeAddModal();

            // setShowAdd(true);

            // console.log('pdata -> ', JSON.stringify(item));
            setNewCartIndex(index);
            setPData(item?.products[0]);
          }
          // let optionAvail = false;
          // if (item?.options && item?.options?.length > 0) {
          //   item?.options?.forEach(it => {
          //     if (parseInt(it?.cart_variant_qty) > 0) {
          //       onSelect(it);
          //       optionAvail = true;
          //       return;
          //     } else {
          //       if (!optionAvail) {
          //         optionAvail = false;
          //         onSelect(item?.options[0]);
          //       }
          //     }
          //   });
          // }
          // let ap = 0;
          // if (item?.addons && item?.addons?.length > 0) {
          //   item?.addons?.forEach(it => {
          //     if (parseInt(it?.cart_addon_qty) > 0) {
          //       ap = ap + parseInt(it?.price);
          //     }
          //   });
          // }
          // setTotalAddonPrice(ap);
        }}
        activeOpacity={0.8}
        // delayPressIn={0}
        style={{
          width: 190,
          marginTop: 10,
          backgroundColor: COLORS.white,
          elevation: 10,
          borderRadius: 10,
          marginBottom: 15,
          marginStart: index == 0 ? SIZES.padding + 5 : 10,
          marginEnd: 2,
          // marginEnd:
          //   index == restHomeBlogData?.length - 1 ? SIZES.padding + 2 : 0,
        }}>
        <Image
          source={{uri: item?.products[0]?.image}}
          style={{
            height: 140,
            borderRadius: 5,
            width: 180,
            margin: 5,
            alignSelf: 'center',
          }}
        />
        <TouchableOpacity
          onPress={() => {
            // updateFavUnFav(index);
            console.log('updateFavUnFav');
            updateFavUnFav(item?.products[0]?.product_id);
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
            source={
              item?.products[0]?.is_like ? icons.favorite : icons.unfavorite
            }
            style={{
              width: 30,
              height: 30,
            }}
          />
        </TouchableOpacity>

        <Text
          style={{
            marginHorizontal: 5,
            fontFamily: 'Segoe UI Bold',
            fontSize: 14,
            color: COLORS.black,
            marginTop: 8,
            alignSelf: 'center',
            height: 40,
            // backgroundColor: COLORS.red,
          }}
          numberOfLines={2}>
          {item?.products[0]?.product_name}
          {chilli}
        </Text>
        <Text
          style={{
            marginHorizontal: 5,
            fontFamily: 'Segoe UI',
            fontSize: 12,
            color: COLORS.grey,
            marginVertical: 5,
            textAlign: 'center',
            height: 35,
            // backgroundColor: '#ff45',
          }}
          numberOfLines={2}
          ellipsizeMode="tail">
          {item?.products[0]?.dis}
        </Text>
        <Text
          style={{
            marginHorizontal: 5,
            fontFamily: 'Segoe UI',
            fontSize: 14,
            color: COLORS.grey,
            marginVertical: 2,
            alignSelf: 'center',
            // height: 40,
          }}
          numberOfLines={2}>
          {item?.products[0]?.restaurantName}
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
            defaultRating={parseInt(item?.product_rating)}
            size={10}
          />
          {item?.product_rating == '0' ? null : (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  marginHorizontal: 3,
                  fontFamily: 'Segoe UI Bold',
                  fontSize: 14,
                  color: COLORS.black,
                  alignSelf: 'center',
                  marginVertical: 2,
                }}>
                {item?.products[0]?.product_rating}
              </Text>
              <Text
                style={{
                  fontFamily: 'Segoe UI',
                  fontSize: 10,
                  color: '#0638ff',
                  alignSelf: 'center',
                  marginVertical: 2,
                }}>
                ({item?.products[0]?.product_rating}) Reviews
              </Text>
            </View>
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            paddingBottom: 10,
            // backgroundColor: 'red',
            marginTop: 10,
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            bottom: item?.customizable == 'true' ? 0 : 5,
          }}>
          <View
            style={{
              alignItems: 'center',
            }}>
            {item?.products[0]?.customizable == 'true' ? (
              <Text
                style={{
                  fontFamily: 'Segoe UI',
                  fontSize: 10,
                  color: '#0638ff',
                  alignSelf: 'center',
                  marginStart: item?.qty > 1 ? 8 : 0,
                  marginBottom: 2,
                }}>
                Customizable
              </Text>
            ) : (
              <Text
                style={{
                  fontFamily: 'Segoe UI',
                  fontSize: 10,
                  color: '#0638ff',
                  alignSelf: 'center',
                  marginStart: item?.qty > 1 ? 8 : 0,
                  marginBottom: 2,
                }}></Text>
            )}

            {parseInt(item?.products[0]?.cart_qty) >= 1 ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginStart: 10,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: COLORS.primary,
                  width: 85,
                  alignItems: 'center',
                  paddingVertical: 3,
                }}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                  }}
                  onPress={() => {
                    newMinusOut(item?.products[0]?.product_id);
                  }}>
                  {/* <View
                    style={[
                      {
                        paddingTop: 3,
                        paddingBottom: 3,
                        paddingEnd: 3,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: COLORS.primary,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginStart: -1,
                      },
                    ]}> */}
                  {/* <Image
                    source={icons.minus}
                    style={{
                      width: 20,
                      height: 20,
                      marginStart: 3,
                    }}
                  /> */}
                  <FontAwesome
                    name="minus"
                    color={COLORS.primary}
                    size={18}
                    style={{
                      marginStart: 5,
                    }}
                  />

                  {/* </View> */}
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 16,
                    color: COLORS.primary,
                    paddingHorizontal: 5,
                    fontFamily: 'Segoe UI Bold',
                  }}>
                  {parseInt(item?.products[0]?.cart_qty)}
                </Text>
                <TouchableOpacity
                  style={{
                    // paddingStart: 2,
                    flexDirection: 'row',
                    // paddingEnd: 3,
                  }}
                  onPress={() => {
                    newPlusOut(item?.products[0]?.product_id);
                  }}>
                  {/* <View
                    style={[
                      {
                        paddingTop: 3,
                        paddingBottom: 3,
                        paddingStart: 3,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: COLORS.primary,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginEnd: -1,
                      },
                    ]}> */}
                  {/* <Image
                    source={icons.plus}
                    style={{
                      width: 20,
                      height: 20,
                      marginEnd: 3,
                    }}
                  /> */}
                  <FontAwesome
                    name="plus"
                    color={COLORS.primary}
                    size={18}
                    style={{
                      marginEnd: 5,
                    }}
                  />
                  {/* </View> */}
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={{
                  marginHorizontal: 10,
                  paddingVertical: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderColor: COLORS.primary,
                  borderWidth: 1,
                  borderRadius: 5,
                  width: 85,
                }}
                onPress={() => {
                  if (item?.customizable == 'true') {
                    setShowAdd(true);
                    // closeAddModal();
                    // setShowAdd(true);
                    // console.log('pdata -> ', JSON.stringify(item));
                    setNewCartIndex(index);
                    setPData(item?.products[0]);
                    callVariantAddonApi(item?.products[0]?.product_id);
                  } else {
                    setShowAdd(true);
                    // closeAddModal();

                    // setShowAdd(true);

                    // console.log('pdata -> ', JSON.stringify(item));
                    setNewCartIndex(index);
                    setPData(item?.products[0]);
                  }
                  /******** kal  */
                  // if (item?.customizable == 'true') {
                  //   closeAddModal();
                  //   setNewCartIndex(index);
                  //   setPData(item);
                  //   callVariantAddonApi(item?.product_id);
                  // } else {
                  //   closeAddModal();
                  //   setNewCartIndex(index);
                  //   setPData(item);
                  // }
                  /******* purana */
                  // closeAddModal();
                  // setNewCartIndex(index);
                  // console.log('pdata -> ', JSON.stringify(item));
                  // setPData(item);
                  // if (item?.options && item?.options?.length > 0) {
                  //   item?.options?.forEach(it => {
                  //     if (parseInt(it?.cart_variant_qty) > 0) {
                  //       onSelect(it);
                  //     } else {
                  //       onSelect(item?.options[0]);
                  //     }
                  //   });
                  // }
                  // let ap = 0;
                  // if (item?.addons && item?.addons?.length > 0) {
                  //   item?.addons?.forEach(it => {
                  //     if (parseInt(it?.cart_addon_qty) > 0) {
                  //       ap = ap + parseInt(it?.price);
                  //     }
                  //   });
                  // }
                  // setTotalAddonPrice(ap);
                }}>
                <Text
                  style={{
                    fontFamily: 'Segoe UI Bold',
                    fontSize: 16,
                    color: COLORS.primary,
                    paddingHorizontal: 10,
                  }}>
                  Add
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <Text
            style={{
              fontFamily: 'Segoe UI Bold',
              fontSize: 18,
              marginTop: item?.customizable == 'true' ? 15 : 10,
              marginEnd: 10,
              color: COLORS.black,
            }}>
            ₹{item?.products[0]?.product_price}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFeaturedDish = ({item, index}) => {
    // console.log('itemm 0< ', JSON.stringify(item));
    let chilli = [];

    for (let i = 0; i < parseInt(item?.chili_level); i++) {
      chilli.push(
        <View key={i}>
          <Image
            source={icons.chilli_level}
            style={{
              width: 10,
              height: 10,
            }}
          />
        </View>,
      );
    }

    return (
      <TouchableOpacity
        onPress={() => {
          if (item?.customizable == 'true') {
            setShowAdd(true);
            // closeAddModal();
            // setShowAdd(true);
            // console.log('pdata -> ', JSON.stringify(item));
            setNewCartIndex(index);
            setPData(item);
            callVariantAddonApi(item?.product_id);
          } else {
            setShowAdd(true);
            // closeAddModal();

            // setShowAdd(true);

            // console.log('pdata -> ', JSON.stringify(item));
            setNewCartIndex(index);
            setPData(item);
          }
          // let optionAvail = false;
          // if (item?.options && item?.options?.length > 0) {
          //   item?.options?.forEach(it => {
          //     if (parseInt(it?.cart_variant_qty) > 0) {
          //       onSelect(it);
          //       optionAvail = true;
          //       return;
          //     } else {
          //       if (!optionAvail) {
          //         optionAvail = false;
          //         onSelect(item?.options[0]);
          //       }
          //     }
          //   });
          // }
          // let ap = 0;
          // if (item?.addons && item?.addons?.length > 0) {
          //   item?.addons?.forEach(it => {
          //     if (parseInt(it?.cart_addon_qty) > 0) {
          //       ap = ap + parseInt(it?.price);
          //     }
          //   });
          // }
          // setTotalAddonPrice(ap);
        }}
        activeOpacity={0.8}
        // delayPressIn={0}
        style={{
          width: 190,
          marginTop: 10,
          backgroundColor: COLORS.white,
          elevation: 10,
          borderRadius: 10,
          marginBottom: 15,
          marginStart: index == 0 ? SIZES.padding + 5 : 10,
          marginEnd: 2,
          // marginEnd:
          //   index == restHomeBlogData?.length - 1 ? SIZES.padding + 2 : 0,
        }}>
        <Image
          source={{uri: item.image}}
          style={{
            height: 140,
            borderRadius: 5,
            width: 180,
            margin: 5,
            alignSelf: 'center',
          }}
        />
        <TouchableOpacity
          onPress={() => {
            // updateFavUnFav(index);
            console.log('updateFavUnFav');
            updateFavUnFav(item?.product_id);
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
            }}
          />
        </TouchableOpacity>

        <Text
          style={{
            marginHorizontal: 5,
            fontFamily: 'Segoe UI Bold',
            fontSize: 14,
            color: COLORS.black,
            marginTop: 8,
            alignSelf: 'center',
            height: 40,
          }}
          numberOfLines={2}>
          {item?.product_name}
          {chilli}
        </Text>
        <Text
          style={{
            marginHorizontal: 5,
            fontFamily: 'Segoe UI',
            fontSize: 12,
            color: COLORS.grey,
            marginVertical: 5,
            height: 35,
            textAlign: 'center',
          }}
          numberOfLines={2}
          ellipsizeMode="tail">
          {item?.dis}
        </Text>
        <Text
          style={{
            marginHorizontal: 5,
            fontFamily: 'Segoe UI',
            fontSize: 14,
            color: COLORS.grey,
            marginVertical: 2,
            alignSelf: 'center',
            // height: 40,
          }}
          numberOfLines={2}>
          {item?.restaurantName}
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
            defaultRating={parseInt(item?.product_rating)}
            size={10}
          />
          {item?.product_rating == '0' ? null : (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  marginHorizontal: 3,
                  fontFamily: 'Segoe UI Bold',
                  fontSize: 14,
                  color: COLORS.black,
                  alignSelf: 'center',
                  marginVertical: 2,
                }}>
                {item.product_rating}
              </Text>
              <Text
                style={{
                  fontFamily: 'Segoe UI',
                  fontSize: 10,
                  color: '#0638ff',
                  alignSelf: 'center',
                  marginVertical: 2,
                }}>
                ({item.product_rating}) Reviews
              </Text>
            </View>
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            paddingBottom: 10,
            // marginTop: item?.customizable == 'true' ? 15 : 15,
            justifyContent: 'space-between',
            marginTop: 10,
            alignItems: 'center',
            position: 'relative',
            bottom: item?.customizable == 'true' ? 0 : 5,
          }}>
          <View
            style={{
              alignItems: 'center',
            }}>
            {item?.customizable == 'true' ? (
              <Text
                style={{
                  fontFamily: 'Segoe UI',
                  fontSize: 10,
                  color: '#0638ff',
                  alignSelf: 'center',
                  marginStart: item?.qty > 1 ? 8 : 0,
                  marginBottom: 2,
                }}>
                Customizable
              </Text>
            ) : (
              <Text
                style={{
                  fontFamily: 'Segoe UI',
                  fontSize: 10,
                  color: '#0638ff',
                  alignSelf: 'center',
                  marginStart: item?.qty > 1 ? 8 : 0,
                  marginBottom: 2,
                }}></Text>
            )}

            {parseInt(item?.cart_qty) >= 1 ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginStart: 10,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: COLORS.primary,
                  width: 85,
                  alignItems: 'center',
                  paddingVertical: 3,
                }}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                  }}
                  onPress={() => {
                    newMinusOut(item?.product_id);
                  }}>
                  {/* <View
                    style={[
                      {
                        paddingTop: 3,
                        paddingBottom: 3,
                        paddingEnd: 3,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: COLORS.primary,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginStart: -1,
                      },
                    ]}> */}
                  {/* <Image
                    source={icons.minus}
                    style={{
                      width: 20,
                      height: 20,
                      marginStart: 3,
                    }}
                  /> */}
                  <FontAwesome
                    name="minus"
                    color={COLORS.primary}
                    size={18}
                    style={{
                      marginStart: 5,
                    }}
                  />

                  {/* </View> */}
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 16,
                    color: COLORS.primary,
                    paddingHorizontal: 5,
                    fontFamily: 'Segoe UI Bold',
                  }}>
                  {parseInt(item?.cart_qty)}
                </Text>
                <TouchableOpacity
                  style={{
                    // paddingStart: 2,
                    flexDirection: 'row',
                    // paddingEnd: 3,
                  }}
                  onPress={() => {
                    newPlusOut(item?.product_id);
                  }}>
                  {/* <View
                    style={[
                      {
                        paddingTop: 3,
                        paddingBottom: 3,
                        paddingStart: 3,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: COLORS.primary,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginEnd: -1,
                      },
                    ]}> */}
                  {/* <Image
                    source={icons.plus}
                    style={{
                      width: 20,
                      height: 20,
                      marginEnd: 3,
                    }}
                  /> */}
                  <FontAwesome
                    name="plus"
                    color={COLORS.primary}
                    size={18}
                    style={{
                      marginEnd: 5,
                    }}
                  />
                  {/* </View> */}
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={{
                  marginHorizontal: 10,
                  paddingVertical: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderColor: COLORS.primary,
                  borderWidth: 1,
                  borderRadius: 5,
                  width: 85,
                }}
                onPress={() => {
                  if (item?.customizable == 'true') {
                    setShowAdd(true);
                    // closeAddModal();
                    // setShowAdd(true);
                    // console.log('pdata -> ', JSON.stringify(item));
                    setNewCartIndex(index);
                    setPData(item);
                    callVariantAddonApi(item?.product_id);
                  } else {
                    setShowAdd(true);
                    // closeAddModal();

                    // setShowAdd(true);

                    // console.log('pdata -> ', JSON.stringify(item));
                    setNewCartIndex(index);
                    setPData(item);
                  }
                  /******** kal  */
                  // if (item?.customizable == 'true') {
                  //   closeAddModal();
                  //   setNewCartIndex(index);
                  //   setPData(item);
                  //   callVariantAddonApi(item?.product_id);
                  // } else {
                  //   closeAddModal();
                  //   setNewCartIndex(index);
                  //   setPData(item);
                  // }
                  /******* purana */
                  // closeAddModal();
                  // setNewCartIndex(index);
                  // console.log('pdata -> ', JSON.stringify(item));
                  // setPData(item);
                  // if (item?.options && item?.options?.length > 0) {
                  //   item?.options?.forEach(it => {
                  //     if (parseInt(it?.cart_variant_qty) > 0) {
                  //       onSelect(it);
                  //     } else {
                  //       onSelect(item?.options[0]);
                  //     }
                  //   });
                  // }
                  // let ap = 0;
                  // if (item?.addons && item?.addons?.length > 0) {
                  //   item?.addons?.forEach(it => {
                  //     if (parseInt(it?.cart_addon_qty) > 0) {
                  //       ap = ap + parseInt(it?.price);
                  //     }
                  //   });
                  // }
                  // setTotalAddonPrice(ap);
                }}>
                <Text
                  style={{
                    fontFamily: 'Segoe UI Bold',
                    fontSize: 16,
                    color: COLORS.primary,
                    paddingHorizontal: 10,
                  }}>
                  Add
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <Text
            style={{
              fontFamily: 'Segoe UI Bold',
              fontSize: 18,
              marginTop: item?.customizable == 'true' ? 10 : 0,
              marginEnd: 10,
              color: COLORS.black,
            }}>
            ₹{item?.product_price}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDynamicRestBlogPromotion = ({item, index}) => {
    return item?.blog?.vendors?.length != 0 &&
      item?.blog?.vendors != undefined ? (
      <>
        {item?.blog?.vendors?.length > 0 ? (
          <FoodyFeaturedRest
            // smallText={item?.blog?.blog_type == '1' ? 'Featured' : 'Sponsored'}
            smallText={'Sponsored'}
            heading={item?.blog?.name + ''}
            loading={item?.blog?.vendors?.length <= 0}
            items={item?.blog?.vendors}
          />
        ) : null}
      </>
    ) : item?.blog?.products?.length != 0 &&
      item?.blog?.products != undefined ? (
      <>
        {/* {item?.blog?.products[0].length <= 0 ? null : ( */}
        {item?.blog?.products.length <= 0 ? null : (
          <>
            <Text
              style={[
                styles.smallText,
                {
                  marginTop: 12,
                },
              ]}>
              {item?.blog?.blog_type == '1' ? 'Featured' : 'Sponsored'}
            </Text>
            <Text style={styles.moodText}>{item?.blog?.name}</Text>
          </>
        )}
        <FlatList
          style={
            {
              // backgroundColor: 'red',
              // paddingEnd: 15,
              // marginEnd: 15,
            }
          }
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          // data={item?.blog?.products[0]}
          extraData={item?.blog?.products}
          data={item?.blog?.products}
          renderItem={renderFeaturedDishOne}
        />
      </>
    ) : null;
  };

  const renderDynamicBlogPromotion = ({item, index}) => {
    // console.log('renderDynamicBlogPromotion  => ', JSON.stringify(item));
    if (index > 0) {
      // setLoadNextData(false);
    }
    return item?.blog?.vendors?.length != 0 &&
      item?.blog?.vendors != undefined ? (
      <>
        {item?.blog?.vendors?.length > 0 ? (
          <FoodyFeaturedRest
            // smallText={item?.blog?.blog_type == '1' ? 'Featured' : 'Sponsored'}
            smallText={'Sponsored'}
            heading={item?.blog?.name + ''}
            loading={item?.blog?.vendors?.length <= 0}
            items={item?.blog?.vendors}
          />
        ) : null}
      </>
    ) : item?.blog?.products?.length != 0 &&
      item?.blog?.products != undefined ? (
      <>
        {/* {item?.blog?.products[0].length <= 0 ? null : ( */}
        {item?.blog?.products?.length <= 0 ? null : (
          <>
            <Text
              style={[
                styles.smallText,
                {
                  marginTop: 12,
                },
              ]}>
              {item?.blog?.blog_type == '1' ? 'Featured' : 'Sponsored'}
            </Text>
            <Text style={styles.moodText}>{item?.blog?.name}</Text>
          </>
        )}
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          // data={item?.blog?.products[0]}
          extraData={item?.blog?.products}
          data={item?.blog?.products}
          renderItem={renderFeaturedDishOne}
        />
      </>
    ) : null;
  };

  const [refreshing, setRefreshing] = useState(false);

  const [variantData, setVariantData] = useState([]);
  const [addonData, setAddonData] = useState([]);

  const [presentInCart, setPresentInCart] = useState(false);

  const callVariantAddonApi = id => {
    console.log('call varaitn  adon apo  ------------------------- called ');
    let body = {
      product_id: id + '',
    };

    ApiCall('post', body, API_END_POINTS.restaurantProductCustomizableData, {
      Authorization: `Bearer ${apiToken}`,
    })
      .then(response => {
        console.log(
          'call varaitn  adon apo  -------------------------',
          response?.data?.response,
        );
        if (response?.data?.status) {
          console.log(JSON.stringify(response?.data?.response));
          console.log('\n');
          console.log('\n');
          console.log('\n');
          console.log('\n');
          console.log('\n');

          console.log('\n');
          console.log('\n');
          console.log('\n');
          console.log('\n');
          console.log('\n');
          setAddonData(response.data?.response?.addons);
          setVariantData(response.data?.response?.options);
          let optionAvail = false;
          let optionIndex = 0;

          if (
            response.data?.response?.options &&
            response.data?.response?.options?.length > 0
          ) {
            response.data?.response?.options?.forEach((it, index) => {
              if (it?.added) {
                optionAvail = true;
                optionIndex = index;
              } else {
              }
            });
          }
          if (optionAvail) {
            console.log('option avail if condition - > ', optionAvail);
            setPresentInCart(true);
            onSelect(response.data?.response?.options[optionIndex]);
          } else {
            console.log('option avail else condition - > ', optionAvail);
            onSelect(response.data?.response?.options[0]);
            setPresentInCart(false);
          }
          let ap = 0;
          if (
            response.data?.response?.addons &&
            response.data?.response?.addons?.length > 0
          ) {
            response.data?.response?.addons?.forEach(it => {
              if (it.added) {
                ap = ap + parseInt(it?.price);
              }
            });
          }
          setTotalAddonPrice(ap);
        } else {
          setVariantData([]);
          setAddonData([]);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {});
  };

  const onRefresh = () => {
    setRefreshing(true);
    setRestHomeBlogData([]);
    setRestHomePageData([]);
    setRestHomePageDataFoody([]);
    setBlogPromotionData([]);
    setCuisinesData([]);
    setCategoryData([]);
    setAllRestaurantData([]);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
    getCuisines(apiToken);
    getCategories(apiToken);
    getRestHomePage(apiToken);
    getRestHomePageBlog(apiToken);
  };

  const [blogPromotionData, setBlogPromotionData] = useState([]);

  const getBlogPromotion = () => {
    setLoadNextData(true);
    let body = {
      lat: userLatitude,
      lng: userLongitude,
      vendor_type: 1,
    };
    console.log(
      'daa userLatitude1 userLatitude1 -> ',
      userLatitude + ' ' + userLongitude,
    );
    ApiCall('post', body, API_END_POINTS.getBlogPromotion, {
      Authorization: `Bearer ${apiToken}`,
    })
      .then(response => {
        if (response?.data?.status) {
          if (blogPromotionData.length == 0) {
            setBlogPromotionData(response?.data?.response);
          }
        } else {
          setBlogPromotionData([]);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {
        // setTimeout(() => {
        // setLoadNextData(false);
        // }, 1500);
      });
  };

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 40;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const [loadNextData, setLoadNextData] = useState(false);

  const [restCount, setRestCount] = useState(10);

  return (
    <ScrollView
      style={style.mainContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[COLORS.primary]}
        />
      }
      onScroll={async ({nativeEvent}) => {
        if (isCloseToBottom(nativeEvent)) {
          getBlogPromotion();
          // console.log('\n\n');
          // console.log('\n\n');
          // console.log('\n\n');
          // console.log('Called on scroll');
          // console.log('\n\n');
          // console.log('\n\n');
          // console.log('\n\n');
          if (callOnce == false) {
            await getAllVendorRatingReview(apiToken);
          }
          // await getAllVendorRatingReview(apiToken);
        }
      }}
      scrollEventThrottle={100}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      {/* <TouchableOpacity
        onPress={() => {
          console.log('search api ', '');
        }}
        style={{
          height: 35,
          width: '95%',
          borderColor: '#707070',
          borderWidth: 1,
          borderRadius: 5,
          alignItems: 'center',
          alignSelf: 'center',
          marginBottom: 10,
          marginTop: 15,
          flexDirection: 'row',
        }}
        activeOpacity={0.8}>
        <Text
          style={{
            flex: 1,
            color: COLORS.darkGray,
            paddingStart: 10,
            fontFamily: 'Segoe UI',
          }}
          numberOfLines={1}>
          Search by Restaurant or Dish...
        </Text>
        <View
          style={{
            marginStart: 8,
            backgroundColor: 'rgba(112, 112, 112, 255)',
            height: 18,
            width: 1,
            marginEnd: 7,
          }}
        />
        <Image
          source={icons.search}
          style={[
            {
              width: 20,
              height: 20,
              resizeMode: 'center',
              marginEnd: 10,
            },
          ]}
        />
      </TouchableOpacity> */}
      {notAvailLocation ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 100,
          }}>
          <Image
            source={icons.unhappy}
            style={{
              width: 200,
              height: 200,
            }}
          />
          <Text
            style={{
              fontFamily: 'Segoe UI',
              color: COLORS.darkGray,
              marginHorizontal: 30,
              textAlign: 'center',
            }}>
            Sorry, online food ordering is not available at your location yet.
            We'll be there soon - hang tight!
          </Text>
          <View
            style={{
              alignItems: 'center',
              alignSelf: 'center',
              paddingVertical: 100,
              opacity: 0.5,
            }}>
            <Image style={style.logo} source={images.app_logo} />

            <Text style={style.copyRightText}>
              © 2022, ChefLab All Rights Reserved.
            </Text>
          </View>
        </View>
      ) : (
        <>
          {banner?.length <= 0 ? (
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              style={{
                alignSelf: 'center',
                marginTop: 20,
                borderRadius: 10,
              }}
              width={Dimensions.get('window').width - 20}
              height={200}></ShimmerPlaceHolder>
          ) : (
            <View style={style.sliderMainContainer}>
              <SwiperFlatList
                autoplay
                autoplayDelay={3}
                autoplayLoop
                showPagination
                data={banner}
                paginationStyleItem={style.paginationStyleItem}
                paginationDefaultColor={'#e4e4e4'}
                paginationActiveColor={'#707070'}
                renderItem={({item}) => (
                  <View
                    style={{
                      width: SIZES.width,
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                    }}>
                    <ImageBackground
                      source={{
                        uri: item.image,
                      }}
                      style={[style.sliderImage]}></ImageBackground>
                    <View style={style.sliderInnerContainer}>
                      <Text style={style.innerText} numberOfLines={1}>
                        {/* Welcome to ChefLab */}
                      </Text>
                    </View>
                  </View>
                )}
              />
            </View>
          )}
          {cuisinesData.length <= 0 ? (
            <View
              style={{
                marginTop: 25,
                paddingBottom: 20,
              }}>
              <WhatsMindTitleSkeleton />
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <WhatsMindSkeleton />
              </View>
            </View>
          ) : (
            <View>
              <Text style={[style.moodText, {marginTop: 20}]}>
                {/* Browse by Cuisines */}
                Food of your choice
              </Text>
              <View
                style={{
                  flexGrow: 1,
                }}>
                <FlatList
                  data={cuisinesData}
                  horizontal
                  style={{
                    marginTop: 10,
                  }}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item, index}) => {
                    return (
                      <WhatsMind
                        id={item?.id}
                        marginStart={index == 0 ? SIZES.padding : 10}
                        marginEnd={
                          index == cuisinesData?.length - 1
                            ? SIZES.padding + 2
                            : 0
                        }
                        image={item.image}
                        title={item.name}
                        fromRestaurant={true}
                        fromCuisine={true}
                      />
                    );
                  }}
                />
              </View>
            </View>
          )}
          {categoryData.length <= 0 ? (
            <View
              style={{
                marginTop: 25,
                paddingBottom: 20,
              }}>
              <WhatsMindTitleSkeleton />
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <WhatsMindSkeleton />
              </View>
            </View>
          ) : (
            <View
              style={{
                height: 150,
                // backgroundColor: '#ff4',
              }}>
              <Text style={[style.moodText, {marginTop: 20}]}>
                {/* What's in your mind ? */}
                Choose your Craving
              </Text>

              <View
                style={{
                  flexGrow: 1,
                }}>
                <FlatList
                  data={categoryData}
                  horizontal
                  style={{
                    marginTop: 10,
                  }}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item, index}) => {
                    return (
                      <WhatsMind
                        id={item?.id}
                        marginStart={index == 0 ? SIZES.padding : 10}
                        marginEnd={
                          index == categoryData?.length - 1
                            ? SIZES.padding + 2
                            : 0
                        }
                        image={item.image}
                        title={item.name}
                        fromCuisine={false}
                        fromRestaurant={true}
                      />
                    );
                  }}
                />
              </View>
            </View>
          )}
          {/* <FoodyFeaturedRest
            smallText={'Sponsored'}
            heading={`Featured Restaurant`}
            loading={restHomePageData.length <= 0}
            items={restHomePageData?.vendors}
          />
          <View>
            {restHomePageDataFoody.length > 0 ? (
              <>
                <Text
                  style={[
                    styles.smallText,
                    {
                      marginTop: 15,
                    },
                  ]}>
                  Sponsored
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                  }}>
                  <Text style={styles.moodText}>Featured Dishes</Text>
                </View>
              </>
            ) : null}
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={restHomePageDataFoody}
              // extraData={restHomePageDataFoody}
              renderItem={renderFeaturedDish}
            />
          </View> */}
          <FlatList
            // horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={restHomeBlogData || restHomePageData?.blogs}
            extraData={restHomeBlogData || restHomePageData?.blogs}
            renderItem={renderDynamicRestBlogPromotion}
          />
          <View
            style={{
              marginTop: 10,
            }}></View>
          <FoodyFeaturedRest
            smallText={'Top Rated'}
            heading={`Foody's Favorite`}
            loading={restHomePageData?.length <= 0}
            items={restHomePageData?.vendors}
          />

          <View>
            {restHomePageDataFoody.length > 0 ? (
              <>
                <Text
                  style={[
                    styles.smallText,
                    {
                      marginTop: 25,
                    },
                  ]}>
                  Top Rated
                </Text>
                <Text style={styles.moodText}>Top Dishes </Text>
              </>
            ) : null}
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              extraData={restHomePageDataFoody}
              data={restHomePageDataFoody}
              // extraData={restHomePageDataFoody}
              renderItem={renderFeaturedDish}
            />
          </View>
          <View
            style={{
              marginTop: 15,
            }}></View>

          <FlatList
            // horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={blogPromotionData}
            extraData={blogPromotionData}
            renderItem={renderDynamicBlogPromotion}
          />

          {restaurantAllData?.length > 0 ? (
            <>
              <Text
                style={[
                  styles.smallText,
                  {
                    marginTop: 12,
                  },
                ]}></Text>
              <Text style={styles.moodText}>Restaurants to explore</Text>
            </>
          ) : null}

          {/* <FlatList
        extraData={restaurantAllData}
        data={restaurantAllData}
        // removeClippedSubviews={true}
        initialNumToRender={10}
        renderItem={({item, index}) => {
          return (
            <ListCardView
              items={item}
              index={index}
              onFavPress={() => {
                updateListFavUnFav(item?.id);
              }}
            />
          );
        }}
      /> */}
          {restaurantAllData.map((item, index) => {
            if (index > 0) {
              // setLoadNextData(false);
            }
            return (
              <ListCardView
                items={item}
                index={index}
                onFavPress={() => {
                  updateListFavUnFav(item?.id);
                }}
              />
            );
          })}

          {loadNextData ? (
            <ActivityIndicator
              color={COLORS.primary}
              size={'large'}
              style={{
                alignSelf: 'center',
                marginVertical: 10,
              }}
            />
          ) : null}
          {noMoreData ? (
            <Text
              style={{
                fontSize: 16,
                color: COLORS.grey,
                textAlign: 'center',
                marginVertical: 10,
                fontFamily: 'Segoe UI',
              }}>
              No more restaurants to explore
            </Text>
          ) : null}

          <View
            style={{
              alignItems: 'center',
              alignSelf: 'center',
              paddingVertical: 20,
              opacity: 0.5,
            }}>
            <Image style={style.logo} source={images.app_logo} />

            <Text style={style.copyRightText}>
              © 2022, ChefLab All Rights Reserved.
            </Text>
          </View>
          {renderAddModal()}
          {renderItemExist()}
        </>
      )}
    </ScrollView>
  );
};

export default Restaurant;

const styles = StyleSheet.create({
  fav: {
    right: 10,
    top: 10,
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: '#f5f5f5',
    elevation: 10,
  },
  bookingDay: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    marginVertical: 5,
    marginEnd: 5,
    marginStart: 15,
    color: COLORS.white,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Segoe UI Bold',
  },
  guestNum: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    marginVertical: 5,
    marginEnd: 10,
    marginStart: 15,
    color: COLORS.white,
    fontFamily: 'Segoe UI',
    fontSize: 16,
  },
  circle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ACACAC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkedCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.primary,
  },
  containerContent: {
    marginTop: 0,
  },
  containerHeader: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 0,
    height: 50,
  },
  headerContent: {},
  Modal: {
    backgroundColor: COLORS.grey,

    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,

    flex: 1,
  },
  moodText: {
    fontFamily: 'Segoe UI Bold',
    fontSize: 18,
    color: 'rgba(0, 0, 0, 255)',
    marginStart: 15,
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
  distance: {
    color: COLORS.grey,
    marginTop: 2,
    fontFamily: 'Segoe UI',
    fontSize: 12,
    marginStart: 10,
  },
  distance_logo: {
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
    fontFamily: 'Segoe UI Bold',
    fontSize: 10,
    marginStart: 5,
  },
});
