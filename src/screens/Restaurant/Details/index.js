import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  LayoutAnimation,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {Rating, AirbnbRating} from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS, icons, images, SIZES} from '../../../constants';
import {horizScale} from '../../../constants/themes';
import ApiCall from '../../../network/ApiCall';
import {API_END_POINTS} from '../../../network/ApiEndpoints';
import {releaseVendorId} from '../../../redux/actions';
import RadioButtons from '../../../utils/AddItemRadioButton';
import Loader from '../../../utils/Loader';
import {
  ShowConsole,
  ShowMessage,
  validateMobileNumber,
} from '../../../utils/Utility';
import {ExpandableComponentSkeleton} from '../utils/ExpandableComponent';
import style from './style';

const RestaurantDetails = ({navigation, route}) => {
  // setTimeout(() => this.flatListRef.scrollToIndex({ index: 4 }), 3000);
  const flatListRef = useRef();

  const dispatch = useDispatch();
  // const arr = useSelector(state => state.state);
  // ShowConsole('arr -> ', JSON.stringify(arr));

  const [bookNowLoading, setBookNowLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [shimmerLoading, setShimmerLoading] = useState(false);

  const [addloading, setaddLoading] = useState(false);
  const [apiToken, setApiToken] = useState('');
  const [browseMenuData, setBrowseMenuData] = useState([]);
  const [optionAddonData, setOptionAddonData] = useState({});
  const [detailsData, setDetailsData] = useState([]);
  const [cuisinesData, setCuisinesData] = useState([]);
  const isFocused = useIsFocused();

  const [newCartIndex, setNewCartIndex] = useState(0);
  const [newCartIndexName, setNewCartIndexName] = useState('');
  const [newCartItemID, setNewCartItemID] = useState('');

  const [receivedItem, setReceivedItem] = useState({});
  const [favorite, setFavorite] = useState(false);

  const [showBarLoader, setShowBarLoader] = useState(false);

  const [bookTable, setBookTable] = useState(false);

  const [menuIndex, setMenuIndex] = useState(0);
  const menuIndexRef = useRef();

  // useEffect(() => {
  // console.log('hello world -> ', menuIndex);
  // menuIndexRef?.current?.scrollToIndex({
  //   menuIndex,
  //   animated: true,
  // });
  // }, [menuIndex]);

  // let vendorID =

  // const addToCart = async i => {
  //   console.log('add to cart rec item-> ', JSON.stringify(i));
  //   console.log(
  //     'add to cart rec item->  selectedOption > ',
  //     JSON.stringify(selectedOption),
  //   );

  //   let body = {
  //     user_id: userId,
  //     vendor_id: i?.vendor_id + '',
  //     products: [
  //       {
  //         product_id: parseInt(i.product_id),
  //         product_qty:
  //           parseInt(selectedOption?.cart_variant_qty) != 0
  //             ? selectedOption?.cart_variant_qty + ''
  //             : '1',
  //       },
  //     ],
  //   };
  //   console.log('i?.customizable >>>>>>> > ', i?.customizable);
  //   if (i?.customizable == 'true') {
  //     if (i.options) {
  //       const itemss = i.options?.reduce(function (acc, cur) {
  //         if (selectedOption?.id == cur.id) {
  //           var o = {
  //             variant_id: cur?.id + '',
  //             variant_qty: cur.cart_variant_qty + '',
  //           };
  //           let temp = Object.assign({}, body.products[0]);
  //           // temp.product_qty = cur.cart_variant_qty + '';
  //           if (parseInt(cur.cart_variant_qty) == 0) {
  //             body.products[0].product_qty = '1';
  //           } else {
  //             body.products[0].product_qty = cur.cart_variant_qty + '' || '1';
  //           }
  //           acc.push(o);
  //         }
  //         return acc;
  //       }, []);
  //       if (itemss) {
  //         let temp = Object.assign({}, body.products[0]);
  //         temp.variants = itemss || [];
  //         console.log(
  //           'temp.variants itemmmmmmmmmmmmmmmmmmm => ' + JSON.stringify(temp),
  //         );
  //         body.products[0] = temp;
  //       }
  //     }

  //     if (i?.addons) {
  //       let ads = i?.addons?.reduce(function (acc, cur) {
  //         if (parseInt(cur.cart_addon_qty) >= 1) {
  //           var o = {addon_id: cur?.id + '', addon_qty: '1'};
  //           acc.push(o);
  //         }
  //         return acc;
  //       }, []);

  //       if (ads) {
  //         // Object.assign(body, {addons: ads});
  //         let temp = Object.assign({}, body.products[0]);

  //         temp.addons = ads || [];

  //         body.products[0] = temp;
  //       }
  //     }
  //   }

  //   console.log(
  //     'add to cart rece item temp inb lasrt body else statement  --> ',
  //     JSON.stringify(body),
  //   );

  //   ApiCall('post', body, API_END_POINTS.productAddToCart, {
  //     Authorization: `Bearer ${apiToken}`,
  //   })
  //     .then(response => {
  //       console.log(
  //         'add to caret api resoinse p --> ',
  //         JSON.stringify(response?.data),
  //       );
  //       if (response?.data?.status) {
  //         ShowMessage(response?.data?.message);
  //         setCartId(response?.data?.response?.cart_id);
  //         AsyncStorage.setItem(
  //           'cart_id',
  //           JSON.stringify(response?.data?.response?.cart_id),
  //         );
  //         // setCartId(response?.data?.response?.cart_id);
  //         getUserCartCount(apiToken, userId);
  //         // checkCartAndDataArray(restHomePageDataFoody, cartData);
  //       } else {
  //         ShowMessage(response?.data?.error + '');
  //       }
  //     })
  //     .catch(error => {
  //       console.log('ERROR IN ADD TO CART API =-> ', error);
  //     });
  //   setLoading(false);
  // };

  const [variantData, setVariantData] = useState([]);
  const [addonData, setAddonData] = useState([]);

  const callVariantAddonApi = id => {
    let body = {
      product_id: id + '',
    };

    ApiCall('post', body, API_END_POINTS.restaurantProductCustomizableData, {
      Authorization: `Bearer ${apiToken}`,
    })
      .then(response => {
        if (response?.data?.status) {
          console.log(JSON.stringify(response?.data?.response));
          console.log('\n');
          console.log('\n');
          console.log('\n');
          console.log('\n');
          console.log('\n');
          console.log(
            'call varaitn  adon apo  -------------------------',
            response?.data?.response,
          );
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
            setPresentInCart(false);

            onSelect(response.data?.response?.options[0]);
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
        console.log(
          'add to caret api resoinse p  updateCart r--> ',
          JSON.stringify(response?.data),
        );
        if (response?.data?.status) {
          // ShowMessage(response?.data?.message);

          getUserCartCount(apiToken, userId);
        } else {
          ShowMessage(response?.data?.error + '');
        }
      })
      .catch(error => {
        console.log('ERROR IN ADD TO CART API =-> ', error);
      });
  };

  // const updateCart = async i => {
  //   console.log('add to cart rec item-> ', JSON.stringify(i));

  //   let body = {
  //     cart_id: cartId,
  //     user_id: userId,
  //     vendor_id: i?.vendor_id + '',
  //     products: [
  //       {
  //         product_id: parseInt(i.product_id),
  //         product_qty: i.cart_qty,
  //       },
  //     ],
  //   };

  //   if (i.options) {
  //     // const itemss = i.options?.find(x => x.variant_qty > 1);
  //     const itemss = i.options?.reduce(function (acc, cur) {
  //       if (selectedOption?.id == cur.id) {
  //         // if (cur.variant_qty > 1) {
  //         var o = {
  //           variant_id: cur?.id + '',
  //           variant_qty: cur.variant_qty + '',
  //         };
  //         //   acc.push(o);
  //         // } else {
  //         // var o = {variant_id: cur?.id, variant_qty: '1'};
  //         acc.push(o);
  //         // }
  //       }
  //       return acc;
  //     }, []);
  //     if (itemss) {
  //       // Object.assign(body, {variants: itemss});
  //       let temp = Object.assign({}, body.products[0]);
  //       temp.variants = itemss || [];
  //       console.log(
  //         'temp.variants itemmmmmmmmmmmmmmmmmmm=> ' + JSON.stringify(temp),
  //       );
  //       body.products[0] = temp;
  //     }
  //   }

  //   if (i?.addons) {
  //     // let ads = i?.addons?.map(item => {
  //     //   if (item?.selected) {
  //     //     return {
  //     //       addon_id: item?.id,
  //     //       addon_qty: '1',
  //     //     };
  //     //   }
  //     // });

  //     let ads = i?.addons?.reduce(function (acc, cur) {
  //       if (cur.selected) {
  //         var o = {addon_id: cur?.id + '', addon_qty: '1'};
  //         acc.push(o);
  //       }
  //       return acc;
  //     }, []);

  //     if (ads) {
  //       // Object.assign(body, {addons: ads});
  //       let temp = Object.assign({}, body.products[0]);

  //       temp.addons = ads || [];

  //       body.products[0] = temp;
  //     }
  //   }

  //   // cartArray.push(body);
  //   // cartArray.push(body.products);

  //   console.log(
  //     'final add to cart array  update cart api last body = > ',
  //     JSON.stringify(body),
  //   );

  //   ApiCall('post', body, API_END_POINTS.updateCart, {
  //     Authorization: `Bearer ${apiToken}`,
  //   })
  //     .then(response => {
  //       console.log(
  //         'add to caret api resoinse p  updateCart r--> ',
  //         JSON.stringify(response?.data),
  //       );
  //       if (response?.data?.status) {
  //         ShowMessage(response?.data?.message);

  //         getUserCartCount(apiToken, userId);
  //       } else {
  //         ShowMessage(response?.data?.error + '');
  //       }
  //     })
  //     .catch(error => {
  //       console.log('ERROR IN ADD TO CART API =-> ', error);
  //     });
  // };

  const newPlus = productId => {
    let a = [...detailsData];
    let d = a[newCartIndex]?.products;

    let c = [];
    // let b = a.map(item => {
    c = d.map(p => {
      let temp = Object.assign(p, {});
      if (productId == temp?.product_id) {
        const itemss = pData?.options?.find(x => x.id === selectedOption?.id);
        // console.log('item -> ', JSON.stringify(itemss));
        temp.cart_qty = parseInt(itemss?.variant_qty) || 1;
        addToCart(temp);
        onUpdateGetRestDetailsPage(apiToken, venId);
        // setSumTotal(sumTotal + parseInt(temp?.product_price));
        setSumTotal(parseInt(temp?.product_price));
        getUserCartCount(apiToken, userId);
      }
      return temp;
      // });
    });
    // console.log('cccccccccccccccccccc- ? ', JSON.stringify(newCartIndex));
    detailsData[newCartIndex].products = c;

    setDetailsData(detailsData);
  };

  const newMinusOut = productId => {
    let a = [...detailsData];
    let d = a[newCartIndex]?.products;

    let c = [];
    // let b = a.map(item => {
    c = d.map(p => {
      let temp = Object.assign(p, {});
      if (productId == temp?.product_id) {
        // console.log(JSON.stringify(temp.qty), ' dasta ');

        temp.cart_qty = parseInt(temp.cart_qty) - 1;
        // checkArray();
        // setSumTotal(sumTotal - parseInt(temp?.product_price));

        updateCart(temp);
        onUpdateGetRestDetailsPage(apiToken, venId);
      }
      return temp;
      // });
    });
    // console.log('cccccccccccccccccccc- ? ', JSON.stringify(newCartIndex));
    detailsData[newCartIndex].products = c;

    setDetailsData(detailsData);
  };

  const newPlusOut = productId => {
    let a = [...detailsData];
    let d = a[newCartIndex]?.products;

    let c = [];
    // let b = a.map(item => {
    c = d.map(p => {
      let temp = Object.assign(p, {});
      if (productId == temp?.product_id) {
        // console.log(JSON.stringify(temp.qty), ' dasta ');

        // temp.qty = parseInt(temp.qty) + 1;
        temp.cart_qty = parseInt(temp.cart_qty) + 1;
        // checkArray();
        // setSumTotal(sumTotal + parseInt(temp?.product_price));
        setSumTotal(parseInt(temp?.product_price));

        updateCart(temp);
        onUpdateGetRestDetailsPage(apiToken, venId);
      }
      return temp;
      // });
    });
    // console.log('cccccccccccccccccccc- ? ', JSON.stringify(newCartIndex));
    detailsData[newCartIndex].products = c;

    setDetailsData(detailsData);
  };

  const [cartArrayCount, setCartArrayCount] = useState('');
  const [cartArrayPrice, setCartArrayPrice] = useState('');

  const [cartVendorId, setCartVendorId] = useState('');
  const [cartVendorName, setCartVendorName] = useState('');

  const [cartId, setCartId] = useState(null);

  const getUserCartCount = async (t, value) => {
    let uid = '';
    await AsyncStorage.getItem('userId', (err, value) => {
      if (err) {
      } else {
        if (value !== '' && value !== null) {
          uid = value;
        } else {
          uid = '';
        }
      }
    });
    let body = {
      user_id: uid + '',
    };

    ApiCall('post', body, API_END_POINTS.get_cart_count, {
      Authorization: `Bearer ${t}`,
    })
      .then(response => {
        if (response?.data?.status) {
          setCartVendorId(response?.data?.response?.cart?.vendor_id + '');
          setCartVendorName(
            response?.data?.response?.cart?.restaurant_name + '' || '',
          );
          // console.log(
          //   'address  dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd  - > ' +
          //     venId +
          //     ' ======= ' +
          //     response?.data?.response?.cart?.vendor_id,
          // );
          // setCartArrayCount(
          //   response?.data?.response?.cart?.total_product_in_cart,
          // );
          setCartArrayCount(response?.data?.response?.cart?.products_count);
          setCartArrayPrice(response?.data?.response?.cart?.total + '');
          setCartId(response?.data?.response?.cart?.id);
        } else {
          setCartArrayCount('');
          setCartArrayPrice('');
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {
        setShowBarLoader(false);
      });
  };

  const [vendorReview, setVendorReview] = useState([]);

  const getVendorReview = async (t, value) => {
    let body = {
      vendor_id: value + '',
      offset: '0',
      limit: '10',
    };

    ApiCall('post', body, API_END_POINTS.getVendorAllReview, {
      Authorization: `Bearer ${t}`,
    })
      .then(response => {
        console.log(JSON.stringify(response), ' <<<<<<<< ');
        if (response?.data?.status) {
          setVendorReview(response?.data?.response);
        } else {
          setVendorReview([]);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {});
  };

  const [itemExistData, setItemExistData] = useState({});

  const newItemExistPlus = productId => {
    console.log('item -> ', JSON.stringify(productId));

    let a = [...detailsData];
    let d = a[newCartIndex]?.products;
    let c = [];
    c = d.map(p => {
      let temp = Object.assign(p, {});
      if (productId == temp?.product_id) {
        temp.cart_qty = parseInt(temp.cart_qty) + 1;

        addToCart(temp);
        onUpdateGetRestDetailsPage(apiToken, venId);
      }
      return temp;
    });
    // console.log('cccccccccccccccccccc- ? ', JSON.stringify(newCartIndex));
    detailsData[newCartIndex].products = c;

    setDetailsData(detailsData);
  };

  useEffect(() => {
    let {id} = route.params;
    // console.log('hello iddddddddddddddddddddddd -> ', JSON.stringify(id));

    getInfoFromStorage(id);
    // getNextSevenDays();
    // if (isFocused) {
    //   getInfoFromStorage(id);
    // }
  }, []);

  useEffect(() => {
    let {id} = route.params;

    getInfoFromStorage(id);
    // getNextSevenDays();
    // if (isFocused) {
    //   getInfoFromStorage(id);
    // }
    var startDate = new Date();
    var aryDates = GetNextDates(startDate, 7);
    // console.log(aryDates);
    setDayNameYear(aryDates);
    // }, [isFocused]);
  }, []);

  const [userId, setUserId] = useState('');

  const [dayNameYear, setDayNameYear] = useState([]);
  const [guestNum, setGuestNum] = useState([
    {
      id: 1,
      selected: false,
    },
    {
      selected: false,
      id: 2,
    },
    {
      id: 3,
      selected: false,
    },
    {
      selected: false,
      id: 4,
    },

    {
      selected: false,
      id: 5,
    },
    {
      selected: false,
      id: 6,
    },
  ]);

  useEffect(() => {
    getInfoFromStorage();
  }, []);

  const [userDetails, setUserDetails] = useState(null);

  const getUserdetailsPage = (value, _id) => {
    setLoading(true);
    // let body = {
    //   user_id: _id,
    // };
    // console.log('daa -> ', JSON.stringify(body) + value);
    ApiCall('post', null, API_END_POINTS.getUserInfo, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        // console.log('profile data -> ', JSON.stringify(response?.data));
        if (response?.data?.status) {
          setUserDetails(response?.data?.response);
          setName(response?.data?.response?.name);
        } else {
          setUserDetails({});
          setName('');
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const selectGuestCount = index => {
    let a = [...guestNum];

    let b = a.map((item, idx) => {
      let temp = Object.assign({}, item);

      // if (index == 0) {
      //   if (temp?.selected) {
      //     temp.selected = false;
      //     setSelectedGuestNumber(index + 1 + '');
      //   } else {
      //     temp.selected = true;
      //     setSelectedGuestNumber('');
      //   }
      // } else
      if (index >= idx) {
        temp.selected = true;
        if (temp?.selected) {
          setSelectedGuestNumber(index + 1 + '');
        } else {
          setSelectedGuestNumber('');
        }
      } else {
        temp.selected = false;
      }
      return temp;
    });
    setGuestNum(b);
  };

  const selectDayCount = index => {
    let a = [...dayNameYear];

    let b = a.map((item, idx) => {
      let temp = Object.assign({}, item);
      if (index == idx) {
        temp.selected = !temp.selected;
        if (temp?.selected) {
          setSelectedDate(temp?.fDate + '');
          setSelectedBookingDate(temp?.fDate + '');
        } else {
          setSelectedBookingDate('');
        }
      } else {
        temp.selected = false;
      }
      return temp;
    });
    setDayNameYear(b);

    // setFlatListTimeSlotArr(timeSlotArr[index].arr);
  };

  const selectTimeSlotCount = index => {
    let a = [...flatListTimeSlotArr];

    let b = a.map((item, idx) => {
      let temp = Object.assign({}, item);
      if (index == idx) {
        temp.selected = !temp.selected;
        if (temp?.selected) {
          setSelectedTimeSlot(temp?.timeSlot);
        } else {
          setSelectedTimeSlot('');
        }
      } else {
        temp.selected = false;
      }
      return temp;
    });

    setFlatListTimeSlotArr(b);
  };
  const [bookingDayArray, setBookingDay] = useState([]);

  const [selectedDate, setSelectedDate] = useState();

  const getNextSevenDays = () => {
    let d = new Date();
    var days = [
      'Today',
      'Tomorrow',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    var yearName = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'July',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    let arr = [];

    for (let index = 0; index < 7; index++) {
      let day = d.getDay() + index;

      let dName = days[day];
      let daysss = d.getDate() + index;

      let year = d.getMonth() + 1;
      let yName = yearName[year - 1];
      let y = d.getFullYear();
      let dateMonth = daysss + ' ' + yName;
      // ShowConsole(daysss + '-' + year + '-' + y);

      arr.push({
        dayName: dName,
        dateYear: dateMonth,
        selected: false,
        fullDate: daysss + '-' + year + '-' + y,
        fDate: dateMonth + ' ' + y,
      });
    }
    setDayNameYear(arr);
    // ShowConsole(JSON.stringify(arr));
  };

  function GetNextDates(startingDate, daysToAddNext) {
    var arrayDates = [];

    for (var i = 0; i <= daysToAddNext; i++) {
      var currentDate = new Date();
      currentDate.setDate(startingDate.getDate() + i);

      arrayDates.push({
        dayName: DayAsString(currentDate.getDay()),
        date:
          currentDate.getDate() + ' ' + MonthAsString(currentDate.getMonth()),
        selected: false,
        fullDate:
          currentDate.getDate() +
          '-' +
          currentDate.getMonth() +
          1 +
          '-' +
          currentDate.getFullYear(),
        fDate:
          currentDate.getDate() + ' ' + MonthAsString(currentDate.getMonth()),
      });
    }

    return arrayDates;
  }

  function MonthAsString(monthIndex) {
    var d = new Date();
    var month = new Array();
    month[0] = 'Jan';
    month[1] = 'Feb';
    month[2] = 'Mar';
    month[3] = 'Apr';
    month[4] = 'May';
    month[5] = 'Jun';
    month[6] = 'Jul';
    month[7] = 'Aug';
    month[8] = 'Sep';
    month[9] = 'Oct';
    month[10] = 'Nov';
    month[11] = 'Dec';

    return month[monthIndex];
  }

  function DayAsString(dayIndex) {
    var weekdays = new Array(7);
    weekdays[0] = 'Sunday';
    weekdays[1] = 'Monday';
    weekdays[2] = 'Tuesday';
    weekdays[3] = 'Wednesday';
    weekdays[4] = 'Thursday';
    weekdays[5] = 'Friday';
    weekdays[6] = 'Saturday';

    return weekdays[dayIndex];
  }

  const renderGuestNum = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          backgroundColor: item?.selected ? COLORS.primary : '#f5e4e6',
          paddingHorizontal: 25,
          paddingVertical: 10,
          marginStart: index == 0 ? SIZES.padding + 5 : 10,
          marginEnd: index == guestNum?.length - 1 ? SIZES.padding + 5 : 10,
          borderRadius: 5,
          marginVertical: 5,
        }}
        onPress={() => {
          selectGuestCount(index);
        }}>
        <Text
          style={[
            // styles.guestNum,
            {
              color: item?.selected ? COLORS.white : COLORS.black,
              fontFamily: item?.selected ? 'Segoe UI Bold' : 'Segoe UI',

              fontSize: 16,
            },
          ]}>
          {item.id}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderDayNameNum = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          backgroundColor: item?.selected ? COLORS.primary : '#f5e4e6',
          paddingHorizontal: 25,
          paddingVertical: 5,
          marginStart: index == 0 ? SIZES.padding + 5 : 10,
          marginEnd: index == guestNum?.length - 1 ? SIZES.padding + 5 : 10,
          borderRadius: 5,
          marginVertical: 5,
        }}
        onPress={() => {
          selectDayCount(index);
        }}>
        <Text
          style={[
            // styles.guestNum,
            {
              color: item?.selected ? COLORS.white : COLORS.grey,
              fontFamily: item?.selected ? 'Segoe UI Bold' : 'Segoe UI',
              textAlign: 'center',
              alignSelf: 'center',
              fontSize: 16,
            },
          ]}>
          {item.dayName}
        </Text>
        <Text
          style={[
            {
              color: item?.selected ? COLORS.white : COLORS.grey,
              fontFamily: item?.selected ? 'Segoe UI Bold' : 'Segoe UI',
              textAlign: 'center',
              fontSize: 16,
              alignSelf: 'center',
            },
          ]}>
          {item.date}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderTimeNum = ({item, index}) => {
    // console.log('item  renderTimeNum renderTimeNum  -> ', JSON.stringify(item));
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          backgroundColor: item?.selected ? COLORS.primary : '#f5e4e6',
          paddingHorizontal: 15,
          paddingVertical: 10,
          marginStart: index == 0 ? SIZES.padding + 5 : 10,
          marginEnd: index == guestNum?.length - 1 ? SIZES.padding + 5 : 10,
          borderRadius: 5,
          marginVertical: 5,
        }}
        onPress={() => {
          selectTimeSlotCount(index);
        }}>
        <Text
          style={[
            // styles.guestNum,
            {
              color: item?.selected ? COLORS.white : COLORS.grey,
              fontFamily: item?.selected ? 'Segoe UI Bold' : 'Segoe UI',

              fontSize: 16,
            },
          ]}>
          {item.time_from} - {item.time_to}
        </Text>
      </TouchableOpacity>
    );
  };

  const [flatListTimeSlotArr, setFlatListTimeSlotArr] = useState([]);

  const [timeSlotArr, setTimeSlotArr] = useState([
    {
      arr: [
        {timeSlot: '10:00 - 11:00 Am'},
        {timeSlot: '11:00 - 12:00 Pm'},
        {timeSlot: '12:00 - 1:00 Pm'},
        {timeSlot: '1:00 - 2:00 Pm'},
        {timeSlot: '2:00 - 3:00 Pm'},
        {timeSlot: '3:00 - 4:00 Pm'},
        {timeSlot: '4:00 - 5:00 Pm'},
        {timeSlot: '5:00 - 6:00 Pm'},
        {timeSlot: '6:00 - 7:00 Pm'},
      ],
    },
    {
      arr: [
        {timeSlot: '11:00 - 12:00 Pm'},
        {timeSlot: '12:00 - 1:00 Pm'},
        {timeSlot: '1:00 - 2:00 Pm'},
        {timeSlot: '2:00 - 3:00 Pm'},
        {timeSlot: '3:00 - 4:00 Pm'},
        {timeSlot: '4:00 - 5:00 Pm'},
        {timeSlot: '5:00 - 6:00 Pm'},
        {timeSlot: '6:00 - 7:00 Pm'},
      ],
    },
    {
      arr: [
        {timeSlot: '10:00 - 11:00 Am'},
        {timeSlot: '11:00 - 12:00 Pm'},
        {timeSlot: '12:00 - 1:00 Pm'},
        {timeSlot: '1:00 - 2:00 Pm'},
        {timeSlot: '2:00 - 3:00 Pm'},
        {timeSlot: '3:00 - 4:00 Pm'},
        {timeSlot: '4:00 - 5:00 Pm'},
        {timeSlot: '5:00 - 6:00 Pm'},
        {timeSlot: '6:00 - 7:00 Pm'},
      ],
    },
    {
      arr: [
        {timeSlot: '11:00 - 12:00 Pm'},
        {timeSlot: '12:00 - 1:00 Pm'},
        {timeSlot: '1:00 - 2:00 Pm'},
        {timeSlot: '2:00 - 3:00 Pm'},
        {timeSlot: '3:00 - 4:00 Pm'},
        {timeSlot: '4:00 - 5:00 Pm'},
        {timeSlot: '5:00 - 6:00 Pm'},
        {timeSlot: '6:00 - 7:00 Pm'},
      ],
    },
    {
      arr: [
        {timeSlot: '10:00 - 11:00 Am'},
        {timeSlot: '11:00 - 12:00 Pm'},
        {timeSlot: '12:00 - 1:00 Pm'},
        {timeSlot: '1:00 - 2:00 Pm'},
        {timeSlot: '2:00 - 3:00 Pm'},
        {timeSlot: '3:00 - 4:00 Pm'},
        {timeSlot: '4:00 - 5:00 Pm'},
        {timeSlot: '5:00 - 6:00 Pm'},
        {timeSlot: '6:00 - 7:00 Pm'},
      ],
    },
    {
      arr: [
        {timeSlot: '11:00 - 12:00 Pm'},
        {timeSlot: '12:00 - 1:00 Pm'},
        {timeSlot: '1:00 - 2:00 Pm'},
        {timeSlot: '2:00 - 3:00 Pm'},
        {timeSlot: '3:00 - 4:00 Pm'},
        {timeSlot: '4:00 - 5:00 Pm'},
        {timeSlot: '5:00 - 6:00 Pm'},
        {timeSlot: '6:00 - 7:00 Pm'},
      ],
    },
    {
      arr: [
        {timeSlot: '10:00 - 11:00 Am'},
        {timeSlot: '11:00 - 12:00 Pm'},
        {timeSlot: '12:00 - 1:00 Pm'},
        {timeSlot: '1:00 - 2:00 Pm'},
        {timeSlot: '2:00 - 3:00 Pm'},
        {timeSlot: '3:00 - 4:00 Pm'},
        {timeSlot: '4:00 - 5:00 Pm'},
        {timeSlot: '5:00 - 6:00 Pm'},
        {timeSlot: '6:00 - 7:00 Pm'},
      ],
    },
  ]);

  const updateFavUnFav = () => {
    if (favorite) {
      let body = {user_id: userId, vendor_id: receivedItem?.id + ''};
      ApiCall('post', body, API_END_POINTS.restaurantRemoveFavorite, {
        Authorization: `Bearer ${apiToken}`,
      })
        .then(response => {
          if (response?.data?.status) {
            // ShowMessage(response?.data?.message);
            setFavorite(false);
          }
        })
        .catch(() => {
          console.log('ERROR IN API => ');
        });
    } else {
      let body = {user_id: userId, vendor_id: receivedItem?.id + ''};

      ApiCall('post', body, API_END_POINTS.restaurantAddFavorite, {
        Authorization: `Bearer ${apiToken}`,
      })
        .then(response => {
          if (response?.data?.status) {
            setFavorite(true);
            // ShowMessage(response?.data?.message);
            console.log('restaurantRemoveFavorite ->>. ', response?.data);
          }
        })
        .catch(() => {
          console.log('ERROR IN API => ');
        });
    }
  };

  const updateDishFavUnFav = id => {
    if (parseInt(pData?.product_id) == parseInt(id)) {
      if (pData?.is_like) {
        let body = {user_id: userId, product_id: parseInt(pData?.product_id)};
        ApiCall('post', body, API_END_POINTS.productRemoveFavorite, {
          Authorization: `Bearer ${apiToken}`,
        })
          .then(response => {
            console.log(
              'restaurantADDFavorite ->>. ',
              JSON.stringify(response?.data),
            );
            if (response?.data?.status) {
            }
          })
          .catch(() => {
            console.log('ERROR IN API => ');
          });
        let b = {
          ...pData,
          is_like: false,
        };
        setPData(b);
        onUpdateGetRestDetailsPage(apiToken, venId);
      } else {
        let body = {user_id: userId, product_id: parseInt(pData?.product_id)};
        ApiCall('post', body, API_END_POINTS.productAddFavorite, {
          Authorization: `Bearer ${apiToken}`,
        })
          .then(response => {
            console.log(
              'restaurantRemoveFavorite ->>. ',
              JSON.stringify(response?.data),
            );
            if (response?.data?.status) {
              // setFavorite(true);
              // ShowMessage(response?.data?.message);
            }
          })
          .catch(() => {
            console.log('ERROR IN API => ');
          });
        let b = {
          ...pData,
          is_like: true,
        };
        setPData(b);
        onUpdateGetRestDetailsPage(apiToken, venId);
      }
    }
  };

  const updateFavUnFavProduct = (_item, idx) => {
    let a = detailsData.map((item, index) => {
      let t = Object.assign({}, item);

      let b = t?.products?.map((_i, _key) => {
        let temp = Object.assign({}, _i);
        if (temp?.product_id == _item?.product_id) {
          // console.log(
          //   'aaaaaaaaaaaaaaaaaaaaaaaa 111 -> temp?.product_id == _item?.product_id',
          //   temp?.product_id == _item?.product_id,
          // );
          if (temp.is_like == 1) {
            // console.log(
            //   'aaaaaaaaaaaaaaaaaaaaaaaa 111 -> ',
            //   idx + ' ' + JSON.stringify(temp),
            // );
            temp.is_like = 0;
            let body = {user_id: userId, product_id: temp?.product_id + ''};
            ApiCall('post', body, API_END_POINTS.productRemoveFavorite, {
              Authorization: `Bearer ${apiToken}`,
            })
              .then(response => {
                console.log(
                  'restaurantRemoveFavorite ->>. ',
                  JSON.stringify(response?.data),
                );
                if (response?.data?.status) {
                  // ShowMessage(response?.data?.message);
                }
              })
              .catch(error => {
                console.log('restaurantRemoveFavorite ->>. ', error);
              });
          } else {
            let body = {user_id: userId, product_id: temp?.product_id + ''};

            ApiCall('post', body, API_END_POINTS.productAddFavorite, {
              Authorization: `Bearer ${apiToken}`,
            })
              .then(response => {
                // console.log(
                //   'restaurantRemoveFavorite ->>. ',
                //   JSON.stringify(response?.data),
                // );
                if (response?.data?.status) {
                  // ShowMessage(response?.data?.message);
                }
              })
              .catch(error => {
                console.log('restaurantRemoveFavorite ->>. ', error);
              });
            temp.is_like = 1;
          }
        }
        return temp;
      });
      return {
        ...t,
        products: b,
      };
    });

    setDetailsData(a);
  };

  const [vendorId, setVendorId] = useState('');

  useEffect(() => {
    let {bookTable} = route.params;
    let {item} = route.params;
    let vId = item?.vendor_id;
    if (item?.id == undefined) {
      dispatch(releaseVendorId(item?.vendor_id));
    } else {
      dispatch(releaseVendorId(item?.id + '' || item?.vendor_id));
    }
    console.log(
      'hello itemmmmmmmmmmmmmmmmmmmmmmmmm-> ',
      JSON.stringify(item.id) + '!----------   ' + item?.vendor_id,
    );

    setReceivedItem(item);
    setFavorite(item?.is_like);

    if (bookTable) {
      setChangeOne(false);
      setChangeTwo(true);
    } else {
      setChangeTwo(false);
      setChangeOne(true);
    }
    // console.log('Book Table =-> ', JSON.stringify(item));
    setVendorId(item?.id + '' || vId);
    getInfoFromStorage(item?.id || vId);

    // if (isFocused) {
    //   getInfoFromStorage(item?.id || vId);
    // }
  }, [navigation, isFocused]);

  const [restSlotData, setRestSlotData] = useState([]);

  // function formatAMPM(date) {
  //   var hours = date.getHours();
  //   var minutes = date.getMinutes();
  //   var ampm = hours >= 12 ? 'pm' : 'am';
  //   hours = hours % 12;
  //   hours = hours ? hours : 12; // the hour '0' should be '12'
  //   minutes = minutes < 10 ? '0' + minutes : minutes;
  //   var strTime = hours + ':' + minutes + ' ' + ampm;
  //   return strTime;
  // }

  const getDineOutRestSlot = (vId, token) => {
    let a = new Date().getDate();
    let b = new Date().getMonth() + 1;
    let c = new Date().getFullYear();

    // const d = moment('2022-10-28 12:09:00').format('hh:mm a');
    // const d = new Date('2022-10-28 12:09:00');
    // console.log(
    //   'ddddddddddddddddddddddddddddddddddddddddd ->>>>>>>>>>>>>>>>>>>> ',
    //   d,
    // );
    // console.log('abc -> ', a + '-' + b + '-' + c);

    let body = {
      // vendor_id: vId,
      vendor_id: '1',
      date: '28-10-2023',
    };
    //
    // console.log('send data in api => ', JSON.stringify(body));

    ApiCall('post', body, API_END_POINTS.getDineOutSlot, {
      Authorization: `Bearer ${token}`,
    })
      .then(response => {
        if (response?.data?.status) {
          // console.log(
          //   'ddddddddddddddddddddddddddddddddddddddddd ->>>>>>>>>>>>>>>>>>>> ',
          //   JSON.stringify(response?.data),
          // );
          const newArray = Object.values(
            response?.data?.response?.days?.booking_time,
          );
          const newArray1 = newArray.map((item, index) => {
            return {
              ...item,
              selected: false,
            };
          });

          let b = newArray.map((item, index) => {
            // console.log("item?.time_from?.split(' ') ===v ?>", formatAMPM(d));
            return {
              time_from: moment(item?.time_from).format('hh:mm A'),
              time_to: moment(item?.time_to).format('hh:mm A'),
            };
          });

          setFlatListTimeSlotArr(b);

          // console.log(
          //   'bbbbbbbbbbbbbbbbbbbbb ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,-> ',
          //   JSON.stringify(b),
          // );

          let a = newArray1[0]?.available_no_guest;

          let g = [];
          for (let i = 1; i <= a; i++) {
            g.push({
              id: i,
              selected: false,
            });
          }
          // console.log('ERROR IN getCuisines API -> ', a);

          setGuestNum(g);
        } else {
          setRestSlotData([]);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API latest error -> ', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  //  1. one to one video call
  //  2. live streaming functionality
  //  3. after live streaming end user will have option to post the live streamed video

  /** {"name":"Khanabadosh","image":"","vendor_ratings":0,"id":684, "lat":22.701593,"long":75.916315,
   * "deal_categories":"94,98,102,125,128,133,134,141,144,157,164,118,193,121", "is_like":0,"distance":138.1,
   * "categories":["Combo","Kebabs","Salads","Khichdi","Chicken","Noodles",
   * "Sandwich","Main course","Starters","Fried rice","Soups","Meal","Curd & Raita","Paneer"]} */
  const filterVeg = (vId, token) => {
    let body = {
      // vendor_id: vId,
      vendor_id: vId,
      food_type: 'veg',
    };
    //
    // console.log('send data in api => ', JSON.stringify(body));
    setShimmerLoading(true);

    ApiCall('post', body, API_END_POINTS.getRestaurantDetailByFoodtype, {
      Authorization: `Bearer ${token}`,
    })
      .then(response => {
        if (response?.data?.status) {
          // console.log('send data in api => ', JSON.stringify(response?.data));

          let a = [];
          let addons = [];
          let o = [];

          let t = response?.data?.response?.map(item => {
            a = item?.products?.map((_i, _in) => {
              let tem = Object.assign({}, _i);
              // console.log('temp ', JSON.stringify(tem));

              tem.qty = 0;

              if (tem?.options && tem?.options?.length >= 1) {
                o = tem?.options?.map(o => {
                  return {
                    ...o,
                    variant_qty: 1,
                  };
                });
              }

              // console.log('responser option ->>> ', JSON.stringify(o));

              if (tem?.addons && tem?.addons?.length >= 1) {
                addons = tem?.addons?.map(o => {
                  return {
                    ...o,
                    addon_qty: 1,
                    selected: false,
                  };
                });
              }
              // console.log('responser addons->>> ', JSON.stringify(addons));

              // return {
              //   ...item,
              //   options: o,
              //   addons: addons,
              //   qty: 0,
              // };

              tem.options = o;
              tem.addons = addons;
              return tem;
            });

            return {
              ...item,
              products: a,
              isExpanded: true,
            };
          });

          console.log(
            'responser option products flter veg api response  ->>> ',
            JSON.stringify(t),
          );
          setDetailsData(t);
        } else {
          setDetailsData([]);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API latest error -> ', error);
      })
      .finally(() => {
        setLoading(false);
        // setShimmerLoading(false);
      });
  };

  const filterNonVeg = (vId, token) => {
    let body = {
      // vendor_id: vId,
      vendor_id: vId,
      food_type: 'non_veg',
    };

    // console.log('send data in api => ', JSON.stringify(body));
    setShimmerLoading(true);
    ApiCall('post', body, API_END_POINTS.getRestaurantDetailByFoodtype, {
      Authorization: `Bearer ${token}`,
    })
      .then(response => {
        if (response?.data?.status) {
          // console.log('send data in api => ', JSON.stringify(response?.data));

          let a = [];
          let addons = [];
          let o = [];

          let t = response?.data?.response?.map(item => {
            a = item?.products?.map((_i, _in) => {
              let tem = Object.assign({}, _i);
              // console.log('temp ', JSON.stringify(tem));

              tem.qty = 0;

              if (tem?.options && tem?.options?.length >= 1) {
                o = tem?.options?.map(o => {
                  return {
                    ...o,
                    variant_qty: 1,
                  };
                });
              }

              // console.log('responser option ->>> ', JSON.stringify(o));

              if (tem?.addons && tem?.addons?.length >= 1) {
                addons = tem?.addons?.map(o => {
                  return {
                    ...o,
                    addon_qty: 1,
                    selected: false,
                  };
                });
              }
              // console.log('responser addons->>> ', JSON.stringify(addons));

              // return {
              //   ...item,
              //   options: o,
              //   addons: addons,
              //   qty: 0,
              // };

              tem.options = o;
              tem.addons = addons;
              return tem;
            });

            return {
              ...item,
              products: a,
              isExpanded: true,
            };
          });

          // console.log('responser option products ->>> ', JSON.stringify(t));
          setDetailsData(t);
        } else {
          setDetailsData([]);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API latest error -> ', error);
      })
      .finally(() => {
        setLoading(false);
        // setShimmerLoading(false);
      });
  };

  const [totalMoney, setTotalMoney] = useState(0);
  const [addItemIndex, setAddItemIndex] = useState('');

  // const addItemAddon = (arr, id, mainData) => {
  //   let t = 0;
  //   let a = arr.map(item => {
  //     var temp = Object.assign({}, item);
  //     console.log('temp --->>> ', JSON.stringify(temp));
  //     if (temp.addon === id) {
  //       temp.selected = !temp.selected;

  //       if (temp.selected) {
  //         t = parseInt(totalMoney) + parseInt(temp.price) + 0.0;
  //         setTotalAddon(t);
  //       } else {
  //         t = parseInt(totalMoney) - parseInt(temp.price) + 0.0;
  //         setTotalAddon(t);
  //       }
  //     }
  //     setTotalMoney(t);
  //     return temp;
  //   });
  //   setItemClick({
  //     ...itemClick,
  //     addons: a,
  //   });

  // };
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');

  const [newName, setNewName] = useState('');
  const [newMobile, setNewMobile] = useState('');

  const [selectedGuestNumber, setSelectedGuestNumber] = useState('');
  const [selectedBookingDate, setSelectedBookingDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  const getInfoFromStorage = async id => {
    let t = '';
    try {
      await AsyncStorage.getItem('mobile', (err, value) => {
        if (err) {
          console.log('profile data -> ', JSON.stringify(err));
        } else {
          if (value !== '' && value !== null) {
            setMobile(value);
          } else {
            setMobile('');
          }
        }
      });

      await AsyncStorage.getItem('name', (err, value) => {
        if (err) {
        } else {
          if (value !== '' && value !== null) {
            setName(value);
          } else {
            setName('');
          }
        }
      });

      await AsyncStorage.getItem('token', (err, value) => {
        if (err) {
        } else {
          if (value !== '' && value !== null) {
            setApiToken(value);
            // getDineOutRestSlot(id, value); ** commented on 23/12/2022

            // getRestDetailsPage(value, id || venId);
            // getVendorPromo(value, id || venId);
            // getRestBrowseMenu(value, id || venId);
            getRestDetailsPage(value, id);
            getVendorPromo(value, id);
            getRestBrowseMenu(value, id);
            t = value;
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
            // getUserdetailsPage(t, value);
          } else {
            setUserId('');
          }
        }
      });
    } catch (error) {}
  };

  const [itemClick, setItemClick] = useState(null);
  const [cartItemIndex, setCartItemIndex] = useState(0);
  const [optionListCount, setOptionListCount] = useState(1);

  const onAddModalMinus = (id, arr, data, idx) => {
    let t = 0;
    let c = 0;

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

    // let e = [];
    // let b = detailsData?.map(item => {
    //   let temp = Object.assign(item, {});
    //   if (temp?.products && temp?.products?.length > 0) {
    //     e = temp?.products?.map((i, index) => {
    //       let tem = Object.assign(i, {});
    //       if (index == newCartIndex) {
    //         if (tem?.product_id == newCartItemID) {
    //           tem.qty = c;
    //         }
    //       }
    //       return tem;
    //     });
    //   }
    //   return {
    //     ...temp,
    //     products: e,
    //   };
    // });

    // setDetailsData(b);
  };

  const [receviedIndex, setReceivedIndex] = useState(0);
  const [isAddonSelected, setIsAddonSelected] = useState(false);

  // const addItemAddon = (arr, id, mainData) => {
  //   let t = 0;
  //   let b = 0;
  //   let a = arr.map(item => {
  //     var temp = Object.assign({}, item);

  //     if (temp.addon === id) {
  //       if (parseInt(temp.cart_addon_qty) == 0) {
  //         temp.cart_addon_qty = 1;

  //         // t = parseInt(totalMoney) + parseInt(temp.price) + 0.0;
  //         b = parseInt(temp.price) + parseInt(addonPrice);
  //       } else {
  //         temp.cart_addon_qty = 0;

  //         // t = parseInt(totalMoney) - parseInt(temp.price) + 0.0;
  //         b = parseInt(addonPrice) - parseInt(temp.price);
  //       }
  //     }
  //     // setTotalMoney(t);

  //     setAddonPrice(b);
  //     return temp;
  //   });

  //   setPData({...pData, addons: a});
  // };

  const [presentInCart, setPresentInCart] = useState(false);

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
  };

  const onAddModalPlus = (id, arr, data, idx) => {
    let t = 0;
    let c = 0;

    let a = variantData?.map((item, i) => {
      let temp = Object.assign({}, item);
      if (parseInt(id) == temp.id) {
        // temp.cart_variant_qty = parseInt(temp?.cart_variant_qty) + 1;
        temp.qty = parseInt(temp.qty) + 1;
        c = temp.qty;
        temp.added = true;

        t = parseInt(totalProductPrice) + parseInt(temp?.variant_price);
      }
      return temp;
    });

    setTotalProductPrice(t);

    setVariantData(a);

    // setPData({
    //   ...pData,
    //   options: a,
    // });

    // detailsData.products[newCartIndex] = {
    //   ...pData,
    //   options: a,
    // };

    // let d = [];
    // let b = detailsData?.map(item => {
    //   let temp = Object.assign(item, {});
    //   if (temp?.products && temp?.products?.length > 0) {
    //     d = temp?.products?.map((i, index) => {
    //       let tem = Object.assign(i, {});

    //       if (index == newCartIndex) {
    //         if (tem?.product_id == newCartItemID) {
    //           tem.qty = c;
    //         }
    //       }
    //       return tem;
    //     });
    //   }
    //   return {
    //     ...temp,
    //     products: d,
    //   };
    // });

    // setDetailsData(b);
  };

  const [newItemIndex, setNewItemIndex] = useState(0);

  const renderExpandableItemTwo = ({item, index}) => {
    if (index > 0) {
      setShimmerLoading(false);
    }

    return item?.products?.length >= 1 ? (
      <View>
        {/*Header of the Expandable List Item*/}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            updateLayout(index);
          }}
          style={styles.header}>
          <Text style={styles.headerText}>{item?.menuName}</Text>
          <Image
            source={icons.forward_arrow}
            style={{
              transform: [
                {
                  rotate: item?.isExpanded ? '-90deg' : '90deg',
                },
              ],
              tintColor: COLORS.black,
              width: 15,
              height: 15,
              resizeMode: 'center',
              // paddingVertical: 10,
            }}
          />
        </TouchableOpacity>

        {/*Content under the header of the Expandable List Item*/}
        {item.isExpanded &&
          item?.products?.map((item, ins) => {
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
              <View>
                <TouchableOpacity
                  activeOpacity={1}
                  key={ins}
                  style={[
                    styles.content,
                    {
                      padding: 10,
                      flexGrow: 1,
                    },
                  ]}
                  onPress={() => {
                    // if (item?.customizable == 'true') {
                    //   setShowAdd(true);

                    //   setPData(item);
                    //   // console.log(
                    //   //   'item customizable -> ',
                    //   //   JSON.stringify(item),
                    //   // );
                    //   setNewCartItemID(item?.product_id);

                    //   setNewCartIndex(index);
                    //   if (item?.options && item?.options?.length >= 0) {
                    //     onSelect(item?.options[0]);
                    //     // setTotalMoney(a[0]?.variant_price);
                    //   }
                    // } else {
                    //   setShowAdd(true);
                    //   setPData(item);
                    //   console.log(
                    //     'item customizable -> ',
                    //     JSON.stringify(item),
                    //   );
                    //   setNewCartItemID(item?.product_id);

                    //   setNewCartIndex(index);
                    //   if (item?.options && item?.options?.length >= 0) {
                    //     onSelect(item?.options[0]);
                    //     // setTotalMoney(a[0]?.variant_price);
                    //   }
                    // }
                    ////////////////////////////////////
                    // if (item?.customizable == 'true') {
                    //   setShowAdd(true);

                    //   console.log(
                    //     'item customizable -> ',
                    //     JSON.stringify(item),
                    //   );
                    //   // console.log('item customizable -> ', JSON.stringify(item?.options));

                    //   setNewCartIndex(index);
                    //   // if (item?.options && item?.options?.length >= 0) {
                    //   //   onSelect(item?.options[0]);
                    //   //   // setTotalMoney(a[0]?.variant_price);
                    //   // }
                    //   let p = [];
                    //   if (item?.options && item?.options?.length >= 0) {
                    //     p = item?.options?.map(it => {
                    //       let temp = Object.assign(it, {});
                    //       if (parseInt(it?.cart_variant_qty) > 0) {
                    //         onSelect(it);
                    //       } else {
                    //         temp.cart_variant_qty = 1;
                    //         onSelect(item?.options[0]);
                    //       }
                    //       return temp;

                    //       //  else {
                    //       //   onSelect(item?.options[0]);
                    //       // }
                    //     });
                    //   }
                    //   let t = 0;
                    //   if (item?.addons && item?.addons?.length >= 0) {
                    //     item?.addons?.map(it => {
                    //       if (parseInt(it?.cart_addon_qty) > 0) {
                    //         t += parseInt(it?.price);
                    //       }
                    //     });
                    //   }
                    //   setAddonPrice(t);
                    //   setPData({
                    //     ...item,
                    //     options: p,
                    //   });
                    //   // setTotalMoney(totalMoney + addonPrice);
                    // } else {
                    //   setShowAdd(true);
                    //   setPData(item);
                    //   setNewCartIndex(index);
                    //   console.log(
                    //     'item customizable -> ',
                    //     JSON.stringify(item?.options),
                    //   );
                    //   if (item?.options && item?.options?.length >= 0) {
                    //     p = item?.options?.map(it => {
                    //       let temp = Object.assign(it, {});
                    //       if (parseInt(it?.cart_variant_qty) > 0) {
                    //         onSelect(it);
                    //       } else {
                    //         temp.cart_variant_qty = 1;
                    //         onSelect(item?.options[0]);
                    //       }
                    //       return temp;

                    //       //  else {
                    //       //   onSelect(item?.options[0]);
                    //       // }
                    //     });
                    //   }
                    // }
                    ////////////////////////////////////

                    // if (item?.customizable == 'true') {
                    //   setShowAdd(true);

                    //   console.log(
                    //     'item customizable -> ',
                    //     JSON.stringify(item),
                    //   );
                    //   // console.log('item customizable -> ', JSON.stringify(item?.options));
                    //   setTotalMoney(parseInt(item?.product_price));
                    //   setNewCartIndex(index);
                    //   // if (item?.options && item?.options?.length >= 0) {
                    //   //   onSelect(item?.options[0]);
                    //   //   // setTotalMoney(a[0]?.variant_price);
                    //   // }
                    //   let p = [];
                    //   if (item?.options && item?.options?.length >= 0) {
                    //     p = item?.options?.map(it => {
                    //       let temp = Object.assign(it, {});
                    //       if (parseInt(it?.cart_variant_qty) > 0) {
                    //         onSelect(it);
                    //       } else {
                    //         temp.cart_variant_qty = 1;
                    //         onSelect(item?.options[0]);
                    //       }
                    //       return temp;

                    //       //  else {
                    //       //   onSelect(item?.options[0]);
                    //       // }
                    //     });
                    //   }
                    //   let t = 0;
                    //   if (item?.addons && item?.addons?.length >= 0) {
                    //     item?.addons?.map(it => {
                    //       if (parseInt(it?.cart_addon_qty) > 0) {
                    //         t += parseInt(it?.price);
                    //       }
                    //     });
                    //   }
                    //   setAddonPrice(t);
                    //   setPData({
                    //     ...item,
                    //     options: p,
                    //   });
                    //   // setTotalMoney(totalMoney + addonPrice);
                    // } else {
                    //   setShowAdd(true);
                    //   setPData(item);
                    //   setNewCartIndex(index);
                    //   setTotalMoney(parseInt(item?.product_price));

                    //   console.log(
                    //     'item customizable -> ',
                    //     JSON.stringify(item?.options),
                    //   );
                    //   if (item?.options && item?.options?.length >= 0) {
                    //     onSelect(item?.options[0]);
                    //     // setTotalMoney(a[0]?.variant_price);
                    //   }
                    // }

                    if (item?.customizable == 'true') {
                      closeAddModal();
                      console.log('pdata -> ', JSON.stringify(item));
                      setNewCartIndex(index);
                      setPData(item);
                      callVariantAddonApi(item?.product_id);
                    } else {
                      closeAddModal();
                      console.log('pdata -> ', JSON.stringify(item));
                      setNewCartIndex(index);
                      setPData(item);
                      setTotalProductPrice(parseInt(item?.product_price));
                    }
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
                        updateFavUnFavProduct(item, index);
                      }}
                      style={styles.fav}>
                      <Image
                        source={
                          item?.is_like == 0 ? icons.unfavorite : icons.favorite
                        }
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
                          marginEnd: 15,
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
                    ) : (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {}}
                        style={styles.fav}>
                        <Image
                          source={icons.non_pure_veg}
                          style={{
                            width: 10,
                            height: 10,
                          }}
                        />
                      </TouchableOpacity>
                    )}
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
                        // marginTop: 8,
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
                      <View>
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
                        {item?.cart_qty >= 1 ? (
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
                              onPress={() => {
                                setNewCartIndex(index);
                                newMinusOut(item?.product_id + '');
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
                                ]}>
                                <Image
                                  source={icons.minus}
                                  style={{
                                    width: 20,
                                    height: 20,
                                    marginStart: 3,
                                  }}
                                />
                              </View> */}
                              <FontAwesome
                                name="minus"
                                color={COLORS.primary}
                                size={18}
                                style={{
                                  marginStart: 5,
                                }}
                              />
                            </TouchableOpacity>

                            <Text
                              style={{
                                fontSize: 18,
                                color: COLORS.primary,
                                fontFamily: 'Segoe UI Bold',
                                paddingHorizontal: 5,
                              }}>
                              {item?.cart_qty}
                            </Text>
                            <TouchableOpacity
                              onPress={() => {
                                setNewCartIndex(index);
                                newPlusOut(item.product_id);
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
                                ]}>
                                <Image
                                  source={icons.plus}
                                  style={{
                                    width: 20,
                                    height: 20,
                                    marginEnd: 3,
                                  }}
                                />
                              </View> */}
                              <FontAwesome
                                name="plus"
                                color={COLORS.primary}
                                size={18}
                                style={{
                                  marginEnd: 5,
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <TouchableOpacity
                            activeOpacity={0.8}
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
                              // if (item?.customizable == 'true') {
                              //   setShowAdd(true);

                              //   console.log(
                              //     'item customizable -> ',
                              //     JSON.stringify(item),
                              //   );
                              //   // console.log('item customizable -> ', JSON.stringify(item?.options));
                              //   setNewCartItemID(item?.product_id);

                              //   setNewCartIndex(index);
                              //   // if (item?.options && item?.options?.length >= 0) {
                              //   //   onSelect(item?.options[0]);
                              //   //   // setTotalMoney(a[0]?.variant_price);
                              //   // }
                              //   let p = [];
                              //   if (
                              //     item?.options &&
                              //     item?.options?.length >= 0
                              //   ) {
                              //     p = item?.options?.map(it => {
                              //       let temp = Object.assign(it, {});
                              //       if (parseInt(it?.cart_variant_qty) > 0) {
                              //         onSelect(it);
                              //       } else {
                              //         temp.cart_variant_qty = 1;
                              //         onSelect(item?.options[0]);
                              //       }
                              //       return temp;

                              //       //  else {
                              //       //   onSelect(item?.options[0]);
                              //       // }
                              //     });
                              //   }
                              //   let t = 0;
                              //   if (item?.addons && item?.addons?.length >= 0) {
                              //     item?.addons?.map(it => {
                              //       if (parseInt(it?.cart_addon_qty) > 0) {
                              //         t += parseInt(it?.price);
                              //       }
                              //     });
                              //   }
                              //   setAddonPrice(t);
                              //   setPData({
                              //     ...item,
                              //     options: p,
                              //   });
                              //   // setTotalMoney(totalMoney + addonPrice);
                              // }

                              // else {
                              //   console.log(
                              //     'Cart Vendor -----------------',
                              //     cartVendorId +
                              //       ' ******    ' +
                              //       item?.vendor_id,
                              //   );
                              //   if (cartVendorId == item?.vendor_id) {
                              //     // newPlus(pData?.product_id + '');
                              //     setNewCartIndex(index);
                              //     newPlus(item.product_id);
                              //     setPData({});
                              //     setShowAdd(false);
                              //   } else if (cartArrayCount == '') {
                              //     // newPlus(pData?.product_id + '');
                              //     setNewCartIndex(index);

                              //     newPlus(item.product_id);
                              //     setPData({});
                              //     setShowAdd(false);
                              //   } else {
                              //     setItemExistData(item);
                              //     setPData({});
                              //     setShowAdd(false);
                              //     setShowItemExist(true);
                              //   }
                              // }

                              if (item?.customizable == 'true') {
                                closeAddModal();
                                console.log('pdata -> ', JSON.stringify(item));
                                setNewCartIndex(index);
                                setPData(item);
                                callVariantAddonApi(item?.product_id);
                              } else {
                                closeAddModal();
                                console.log('pdata -> ', JSON.stringify(item));
                                setNewCartIndex(index);
                                setPData(item);
                                setTotalProductPrice(
                                  parseInt(item?.product_price),
                                );
                              }
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
                    </View>
                  </View>
                </TouchableOpacity>
                <View
                  style={{
                    width: '100%',
                    backgroundColor: COLORS.grey,
                    height: 0.5,
                  }}></View>
              </View>
            );
          })}
      </View>
    ) : null;
  };

  const [selectedOption, setSelectedOption] = React.useState(null);
  const [addonPrice, setAddonPrice] = useState(0);

  // const onSelect = item => {
  //   let t = 0;
  //   if (selectedOption && selectedOption.variant_name === item.variant_name) {
  //     t = totalMoney;
  //     setTotalMoney(t);
  //   } else {
  //     setSelectedOption(item);
  //     t = parseInt(item?.variant_price) + 0.0;
  //     setOptionListCount(1);
  //     setTotalMoney(t + parseInt(addonPrice));
  //   }
  // };

  // const onSelect = item => {
  //   let t = 0;
  //   if (selectedOption && selectedOption.variant_name === item.variant_name) {
  //     t = totalMoney;
  //     setTotalMoney(t);
  //   } else {
  //     setSelectedOption(item);

  //     if (parseInt(item?.cart_variant_qty) > 0) {x
  //       console.log('xxxxxxxxxxxxxxxxxxx', item?.cart_variant_qty);
  //       t = parseInt(item?.variant_price) * parseInt(item.cart_variant_qty);
  //     } else {
  //       console.log('yyyyyyyyyyyyyyyyyyy', item?.cart_variant_qty);

  //       t = parseInt(item?.variant_price) + 0.0;
  //     }

  //     // let p = 0;
  //     // if (pData?.addons && pData?.addons.length > 0) {
  //     //   pData?.addons?.for(item => {
  //     //     if (parseInt(item?.cart_addon_qty) >= 1) {
  //     //       p = p + parseInt(item?.price);
  //     //     }
  //     //   });
  //     // }
  //     // setTotalMoney(t + p);
  //     setTotalMoney(t);
  //   }
  // };

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

  /** primary_variant_name : "Default" */
  const getRestDetailsPage = (value, id) => {
    setLoading(true);
    setShimmerLoading(true);
    let body = {
      vendor_id: id + '',
    };
    ApiCall('post', body, API_END_POINTS.getRestaurantDetailPage, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        console.log('\n');
        console.log('\n');
        console.log('\n');
        console.log('\n');
        console.log('\n');
        console.log('\n');
        console.log('\n');
        console.log('\n');
        console.log('\n');
        // console.log(
        //   'fetchConcurrentData  getRestaurantDetailPage ------- >>> ',
        //   JSON.stringify(response?.data),
        // );
        console.log('\n');
        console.log('\n');
        console.log('\n');
        console.log('\n');
        console.log('\n');
        console.log('\n');
        console.log('\n');
        console.log('\n');
        console.log('\n');
        if (response?.data?.status) {
          let a = [];
          let addons = [];
          let o = [];

          let t = response?.data?.response?.products?.map(item => {
            // a = item?.products?.map((_i, _in) => {
            //   let tem = Object.assign({}, _i);
            //   // console.log('temp ', JSON.stringify(tem));

            //   tem.qty = 0;

            //   if (tem?.options && tem?.options?.length >= 1) {
            //     o = tem?.options?.map(o => {
            //       return {
            //         ...o,
            //         variant_qty: 1,
            //       };
            //     });
            //   }

            //   // console.log('responser option ->>> ', JSON.stringify(o));

            //   if (tem?.addons && tem?.addons?.length >= 1) {
            //     addons = tem?.addons?.map(o => {
            //       return {
            //         ...o,
            //         addon_qty: 1,
            //         selected: false,
            //       };
            //     });
            //   }
            //   if (tem?.cart_qty > 0) {
            //     setSumTotal(
            //       parseInt(sumTotal) +
            //         parseInt(tem?.product_price) * parseInt(tem?.cart_qty),
            //     );
            //   }
            //   // console.log('responser addons->>> ', JSON.stringify(addons));

            //   // return {
            //   //   ...item,
            //   //   options: o,
            //   //   addons: addons,
            //   //   qty: 0,
            //   // };

            //   tem.options = o;
            //   tem.addons = addons;
            //   return tem;
            // });

            return {
              ...item,
              // products: a,
              isExpanded: true,
            };
          });

          // console.log(
          //   'responser option products asddddddddddddddddddddddddddddddddd ->>> ',
          //   JSON.stringify(t),
          // );
          setDetailsData(t);
          // setDetailsData(t);
        } else {
          setDetailsData([]);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {
        // setShimmerLoading(false);
        setLoading(false);
      });
  };

  const onUpdateGetRestDetailsPage = (value, id) => {
    let body = {
      vendor_id: id + '',
    };
    ApiCall('post', body, API_END_POINTS.getRestaurantDetailPage, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        // console.log('\n');
        // console.log('\n');
        // console.log('\n');
        // console.log('\n');
        // console.log('\n');
        // console.log('\n');
        // console.log('\n');
        // console.log('\n');
        // console.log('\n');
        // console.log(
        //   'fetchConcurrentData  getRestaurantDetailPage ------- >>> ',
        //   JSON.stringify(response?.data),
        // );
        // console.log('\n');
        // console.log('\n');
        // console.log('\n');
        // console.log('\n');
        // console.log('\n');
        // console.log('\n');
        // console.log('\n');
        // console.log('\n');
        // console.log('\n');
        if (response?.data?.status) {
          let a = [];
          let addons = [];
          let o = [];

          let t = response?.data?.response?.products?.map(item => {
            // a = item?.products?.map((_i, _in) => {
            //   let tem = Object.assign({}, _i);
            //   // console.log('temp ', JSON.stringify(tem));

            //   tem.qty = 0;

            //   if (tem?.options && tem?.options?.length >= 1) {
            //     o = tem?.options?.map(o => {
            //       return {
            //         ...o,
            //         variant_qty: 1,
            //       };
            //     });
            //   }

            //   // console.log('responser option ->>> ', JSON.stringify(o));

            //   if (tem?.addons && tem?.addons?.length >= 1) {
            //     addons = tem?.addons?.map(o => {
            //       return {
            //         ...o,
            //         addon_qty: 1,
            //         selected: false,
            //       };
            //     });
            //   }
            //   if (tem?.cart_qty > 0) {
            //     setSumTotal(
            //       parseInt(sumTotal) +
            //         parseInt(tem?.product_price) * parseInt(tem?.cart_qty),
            //     );
            //   }
            //   // console.log('responser addons->>> ', JSON.stringify(addons));

            //   // return {
            //   //   ...item,
            //   //   options: o,
            //   //   addons: addons,
            //   //   qty: 0,
            //   // };

            //   tem.options = o;
            //   tem.addons = addons;
            //   return tem;
            // });

            return {
              ...item,
              // products: a,
              isExpanded: true,
            };
          });

          // console.log(
          //   'responser option products asddddddddddddddddddddddddddddddddd ->>> ',
          //   JSON.stringify(t),
          // );
          setDetailsData(t);
          // setDetailsData(t);
        } else {
          setDetailsData([]);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {});
  };

  const [totalAddon, setTotalAddon] = useState(0);

  const getRestBrowseMenu = (value, id) => {
    let body = {
      vendor_id: id + '',
    };
    ApiCall('post', body, API_END_POINTS.restaurantBrowseMenu, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        if (response?.data?.status) {
          setBrowseMenuData(response?.data?.response);
        } else {
          setBrowseMenuData([]);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      });
  };

  const [showRound, setShowRound] = useState(false);
  const [vendorCouponData, setVendorCouponData] = useState([]);

  const getVendorPromo = (value, id) => {
    let body = {
      vendor_id: id + '',
      // vendor_id: '3',
    };
    ApiCall('post', body, API_END_POINTS.getVendorPromoCode, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        if (response?.data?.status) {
          // setVendorCouponData([
          //   ...response?.data?.response?.vendor,
          //   ...response?.data?.response?.admin,
          // ]);
          setVendorCouponData(response?.data?.response?.vendor);
          // let a = [
          //   ...response?.data?.response?.vendor,
          //   ...response?.data?.response?.admin,
          // ];
          // console.log('removeItemFromCart =>? ', JSON.stringify(a));
        } else {
          setVendorCouponData([]);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      });
  };

  const [showItemExist, setShowItemExist] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

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
                    {/* <FontAwesome size={20} color={COLORS.white} name="plus" /> */}
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={async () => {
                    setShowItemExist(false);
                    await removeItemFromCart();
                    getUserCartCount(apiToken, userId);
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
                  {/* <FontAwesome size={20} color={COLORS.white} name="plus" /> */}
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

  const renderVendorReview = ({item, index}) => {
    // console.log('renderVendorReview -> >>> ' + JSON.stringify(item));
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: COLORS.white,
            margin: 10,
            borderRadius: 10,
            padding: 10,
          }}>
          {item.image ? (
            <Image
              source={{
                uri: item.image + '',
              }}
              style={{
                width: 56,
                height: 56,
                borderRadius: 50,
                // borderWidth: 1,
                // borderColor: COLORS.primary,
              }}
            />
          ) : (
            <Image
              source={images.app_logo}
              style={{
                width: 56,
                height: 56,
                borderRadius: 50,
                opacity: 0.5,
                // borderWidth: 1,
                // borderColor: COLORS.primary,
              }}
            />
          )}
          <View
            style={{
              marginStart: 15,
            }}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text
                style={[
                  style.addHeaderText,
                  {
                    color: COLORS.grey,
                    fontFamily: 'Segoe UI',
                    fontSize: 14,
                  },
                ]}>
                {item?.name}
              </Text>
            </View>
            <View
              style={{
                marginVertical: 5,
                alignSelf: 'flex-start',
              }}>
              <AirbnbRating
                count={5}
                isDisabled={true}
                showRating={false}
                defaultRating={parseInt(item?.rating)}
                size={10}
              />
            </View>
            <Text
              style={[
                style.addHeaderText,
                {
                  color: COLORS.black,
                  fontFamily: 'Segoe UI Medium',
                  fontSize: 14,
                },
              ]}>
              {item?.review}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderReviewModal = () => {
    return (
      <Modal
        visible={showReviewModal}
        animationType="slide"
        transparent={true}
        statusBarTranslucent
        onRequestClose={() => setShowReviewModal(false)}
        style={{flexGrow: 1}}>
        <View
          style={{
            backgroundColor: '#00000090',
            flexGrow: 1,
            justifyContent: 'flex-end',
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setShowReviewModal(!showReviewModal)}
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
                  <Text style={style.addHeaderText}>Reviews</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setShowReviewModal(!showReviewModal)}>
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
              <FlatList
                data={vendorReview}
                renderItem={renderVendorReview}
                ListEmptyComponent={() => {
                  return (
                    <Text
                      style={[
                        style.addHeaderText,
                        {
                          color: COLORS.black,
                          fontFamily: 'Segoe UI Bold',
                          fontSize: 14,
                          textAlign: 'center',
                          alignSelf: 'center',
                          marginVertical: 20,
                        },
                      ]}>
                      No reviews found
                    </Text>
                  );
                }}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const [pData, setPData] = useState({});
  let addonList = [];
  let optionsList = [];
  const removeItemFromCart = async () => {
    // setLoading(true);
    let body = {
      user_id: userId + '',
    };
    let a = await ApiCall('post', body, API_END_POINTS.removeEmptyCart, {
      Authorization: `Bearer ${apiToken}`,
    });
    // console.log(
    //   'removeItemFromCart  ssssssssssssssssssssssssssssssssssssss=>? ',
    //   userId + ' ' + apiToken,
    // );
  };

  const getRestProductOptionMenu = (item, _i) => {
    // console.log('ERROR IN getCuisines API 1-> ', JSON.stringify(item));
    setaddLoading(true);
    let body = {
      product_id: item?.product_id,
    };
    ApiCall('post', body, API_END_POINTS.restaurantProductCustomizableData, {
      Authorization: `Bearer ${apiToken}`,
    })
      .then(response => {
        // console.log(
        //   'RESPONSE IN getCuisines API =>>>',
        //   JSON.stringify(response?.data),
        // );
        if (response?.data?.status) {
          // setOptionAddonData(response?.data?.response);
          let o = [];
          let a = [];
          if (response?.data?.response?.options != null) {
            o = response?.data?.response?.options?.map(item => {
              return {
                ...item,
                selected: false,
              };
            });
          }
          if (response?.data?.response?.addons != null) {
            a = response?.data?.response?.addons?.map(item => {
              return {
                ...item,
                selected: false,
                quantity: 1,
              };
            });
          }

          let r = {
            options: o,
            addons: a,
          };

          setOptionAddonData(r);
          closeAddModal();
        } else {
          setOptionAddonData([]);
          setShowCustomizeModal(false);
          // addToCart(_i, addItemIndex);
        }
      })
      .catch(error => {
        console.log(
          'ERROR IN getCuisines API getRestProductOptionMenu -> ',
          error,
        );
      })
      .finally(() => {
        // setTimeout(() => {
        setaddLoading(false);
        // }, 1000);
      });
  };

  const [showCustomizeModal, setShowCustomizeModal] = useState(true);
  const [optionPrice, setOptionPrice] = useState(0);

  // const onPlus = (action, index) => {
  //   let q1 = 0;
  //   let q = 0;
  //   let p = 0;
  //   let b = [];
  //   let a = detailsData?.map((item, i) => {
  //     let t = Object.assign({}, item);
  //     b = item?.products?.map((_item, _i) => {
  //       let temp = Object.assign({}, _item);
  //       let currentQty = temp.qty;
  //       if (index == temp?.product_id + '') {
  //         if (action == 'more') {
  //           temp.qty = currentQty + 1;
  //           p = parseInt(temp?.product_price); // parseInt(temp?.qty);
  //           q1 = temp.qty;
  //           if (parseInt(q1) > 1) {
  //             onPlusUpdateCart(temp?.product_id, q1);
  //           }
  //         }
  //       }
  //       q = temp?.qty + q;
  //       return temp;
  //     });

  //     return {
  //       ...t,
  //       products: b,
  //     };
  //   });

  //   // console.log('item featured dishes on plus pppppppppppppppppppppp-> ', p);
  //   setSumQuantity(parseInt(q));
  //   if (optionPrice > 0) {
  //     setSumTotal(parseInt(p) + parseInt(sumTotal) + parseInt(optionPrice));
  //   } else {
  //     setSumTotal(parseInt(p) + parseInt(sumTotal));
  //   }
  //   // setSumTotal(parseInt(p));
  //   setDetailsData(a);
  // };

  const onPlusUpdateCart = async (productId, qty) => {
    let body = JSON.parse(JSON.stringify(cartProduct));

    let b = body?.products?.map((_item, _i) => {
      let temp = Object.assign({}, _item);
      if (productId == temp?.product_id + '') {
        temp.product_qty = qty + '';
      }
      return temp;
    });

    body = {
      ...body,
      products: b,
    };

    console.log(
      'onPlusUpdateCart BODY IN LAST SCENE  before api hit  -> ',
      JSON.stringify(body),
    );

    ApiCall('post', body, API_END_POINTS.updateProductCart, {
      Authorization: `Bearer ${apiToken}`,
    })
      .then(response => {
        console.log(
          'RESPONSE IN ADD TO CART API =-> ',
          JSON.stringify(response?.data),
        );
        if (response?.data?.status) {
        } else {
        }
      })
      .catch(error => {
        console.log('ERROR IN ADD TO CART API =-> ', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onMinusUpdateCart = async productId => {
    // await removeItemFromCart();
    let body = JSON.parse(JSON.stringify(cartProduct));
    let idx = 0;
    // console.log(
    //   'item featured on PlusUpdateCart tem received -> ',
    //   JSON.stringify(body),
    // );

    body?.products?.forEach((_item, _i) => {
      let temp = Object.assign({}, _item);
      if (productId == temp?.product_id + '') {
        idx = _i;
      }
    });

    body.products?.splice(idx, 1);
    setCartProduct(body);
    // console.log(
    //   'onMinusUpdateCart BODY IN LAST SCENE -> ',
    //   JSON.stringify(body),
    // );
    if (body.products?.length <= 0) {
      await removeItemFromCart();
    } else {
      ApiCall('post', body, API_END_POINTS.updateProductCart, {
        Authorization: `Bearer ${apiToken}`,
      })
        .then(response => {
          console.log(
            'RESPONSE IN ADD TO CART API =-> ',
            JSON.stringify(response?.data),
          );
          if (response?.data?.status) {
          } else {
          }
        })
        .catch(error => {
          console.log('ERROR IN ADD TO CART API =-> ', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const onMinus = (action, index) => {
    let q = 0;
    let p = 0;
    let b = [];
    let a = detailsData?.map((item, i) => {
      let t = Object.assign({}, item);

      b = item?.products?.map((_item, _i) => {
        let temp = Object.assign({}, _item);
        let currentQty = temp.qty;

        if (index == temp?.product_id + '') {
          if (action == 'less') {
            temp.qty = currentQty - 1;
            p = parseInt(sumTotal) - parseInt(temp?.product_price); // * parseInt(temp?.qty);
            if (parseInt(temp?.qty) == 0) {
              onMinusUpdateCart(temp?.product_id);
            }
          }
        }
        q = temp?.qty + q;

        return temp;
      });

      return {
        ...t,
        products: b,
      };
    });
    console.log('item featured dishes on plus -> ', JSON.stringify(q) + p);
    setSumQuantity(parseInt(q));
    if (q == 0) {
      setSumTotal(0);
      setOptionPrice(0);
      setCartProduct(null);
    } else {
      // setSumTotal(parseInt(p) - parseInt(optionPrice));
      setSumTotal(parseInt(p));
    }
    // setSumTotal(parseInt(p) - parseInt(sumTotal) - parseInt(optionPrice));
    setDetailsData(a);
  };

  // useEffect(() => {
  //   let q = 0;
  //   let t = 0;
  //   // let p = 0;
  //   detailsData.forEach((item, index) => {
  //     item?.products?.forEach(_item => {
  //       if (_item.qty && _item.qty >= 1) {
  //         t = parseInt(_item.qty) + t;
  //         q = parseInt(_item?.product_price) * t;
  //       }
  //     });
  //   });
  //   setSumQuantity(t);
  //   setSumTotal(q);
  // }, [detailsData]);

  const [sumTotal, setSumTotal] = useState(0);
  const [sumQuantity, setSumQuantity] = useState(0);
  // let cartItemCount = useSelector(state => state.state.cartArray);

  let venId = useSelector(state => state.state?.vendor_id);

  // console.log(
  //   'add to cart rec item venIdvenIdvenIdvenIdvenIdvenIdvenIdvenId-> ',
  //   JSON.stringify(venId),
  // );

  /**add to cart end */

  const [changeOne, setChangeOne] = useState(true);
  const [changeTwo, setChangeTwo] = useState(false);
  const [offerData, setOfferData] = useState([{}, {}, {}]);
  const [vegSwitches, setVegSwitches] = useState(false);
  const [nonVegSwitches, setNonVegSwitches] = useState(false);

  const [data, setData] = useState([
    {
      isExpanded: true,
      category_name: 'Pizza',
      subcategory: [
        {id: 1, val: 'Sub Cat 1'},
        {id: 3, val: 'Sub Cat 3'},
      ],
    },
    {
      isExpanded: true,
      category_name: 'Burger',
      subcategory: [
        {id: 4, val: 'Sub Cat 4'},
        {id: 5, val: 'Sub Cat 5'},
      ],
    },
    {
      isExpanded: true,
      category_name: 'Pasta',
      subcategory: [
        {id: 7, val: 'Sub Cat 7'},
        {id: 9, val: 'Sub Cat 9'},
      ],
    },
    {
      isExpanded: true,
      category_name: 'Beverages',
      subcategory: [
        {id: 10, val: 'Sub Cat 10'},
        {id: 12, val: 'Sub Cat 2'},
      ],
    },
    {
      isExpanded: true,
      category_name: 'Chinese',
      subcategory: [
        {id: 10, val: 'Sub Cat 10'},
        {id: 12, val: 'Sub Cat 2'},
      ],
    },
  ]);

  const [multiSelect, setMultiSelect] = useState(false);

  const updateLayout = index => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    let array = JSON.parse(JSON.stringify(detailsData));
    // let array = detailsData;

    array[index]['isExpanded'] = !array[index]['isExpanded'];
    ShowConsole(
      'updateLayout index -> ' +
        array[index]['isExpanded'] +
        ' <<>> ' +
        !array[index]['isExpanded'],
    );

    // if (multiSelect) {
    // } else {
    //   array.map((value, placeindex) => {
    //     if (placeindex == index) {
    //       console.log(
    //         'place index -> ',
    //         placeindex + ' ' + array[placeindex]['isExpanded'],
    //       );
    //       array[placeindex]['isExpanded'] = false;
    //     } else {
    //       // array[placeindex]['isExpanded'] = false;
    //     }
    //   });
    // }

    // console.log('Log array -> ', JSON.stringify(array));
    setDetailsData(array);
  };

  const [cartProduct, setCartProduct] = useState(null);

  const [showFilter, setShowFilter] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showChange, setShowChange] = useState(false);

  const [selected, setSelected] = useState(false);

  const [itemCount, setItemCount] = useState(0);

  const [totalProductPrice, setTotalProductPrice] = useState(0);
  const [totalAddonPrice, setTotalAddonPrice] = useState(0);

  const closeFilterModal = () => {
    setShowFilter(!showFilter);
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
  const closeChangeModal = () => {
    setShowChange(!showChange);
  };

  const renderFilterModal = () => {
    return (
      <Modal
        visible={showFilter}
        animationType="slide"
        transparent={true}
        statusBarTranslucent
        onRequestClose={() => closeFilterModal()}
        style={{flexGrow: 1}}>
        <View
          style={{
            backgroundColor: '#00000090',
            flexGrow: 1,
            justifyContent: 'flex-end',
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => closeFilterModal()}
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
                  <Text style={style.addHeaderText}>Browse Menu</Text>
                </View>
                <TouchableOpacity onPress={() => closeFilterModal()}>
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
            <View
              style={[
                style.middleView,
                {borderTopRightRadius: 0, borderTopLeftRadius: 0},
              ]}>
              <View style={{overflow: 'hidden', paddingBottom: 10}}>
                <View
                  style={[
                    {paddingLeft: 24, paddingRight: 7, paddingBottom: 10},
                  ]}>
                  <FlatList
                    data={browseMenuData}
                    renderItem={({item, index}) => {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            flatListRef?.current?.scrollToIndex({
                              animated: true,
                              index: index,
                            });
                            setMenuIndex(index);
                            closeFilterModal();
                          }}
                          style={[
                            style.rowView,
                            {
                              marginTop: 10,
                              marginBottom: 10,
                              // backgroundColor: COLORS.red,
                              // paddingVertical: 5,
                            },
                          ]}>
                          {/* <View style={{flex: 1, paddingRight: 10}}> */}
                          <Text style={[style.sizeText, {flex: 1}]}>
                            {item?.menuName}
                          </Text>
                          {/* </View> */}
                          <Text style={[style.sizeText, {marginEnd: 15}]}>
                            {item?.count}
                          </Text>
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

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
                    updateDishFavUnFav(pData?.product_id);
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
                    // setTotalMoney(0)
                  }}>
                  {/* <Image
                    source={icons.cancel}
                    style={{
                      width: 20,
                      height: 20,
                      marginTop: 10,
                      marginRight: 10,
                      // alignSelf: 'flex-end',
                      // position: 'absolute',
                      // right: 15,
                    }}
                  /> */}
                  {pData?.type == 'veg' ? (
                    <Image
                      source={icons.pure_veg}
                      style={{
                        width: 8,
                        height: 8,
                        marginTop: 5,
                        marginEnd: 15,
                        // marginStart: 5,
                      }}
                    />
                  ) : null}
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
                // pData?.addons?.length >= 1 ? (
                //   <>
                //     <Text
                //       style={{
                //         color: COLORS.black,
                //         fontSize: 18,
                //         fontFamily: 'Segoe UI',
                //         marginTop: 15,
                //         marginStart: 20,
                //       }}>
                //       Addons
                //     </Text>
                //     <FlatList
                //       data={pData?.addons}
                //       renderItem={({item, index}) => {
                //         return (
                //           <View style={[{paddingLeft: 24, paddingRight: 6}]}>
                //             <View style={[style.rowView, {marginTop: 15}]}>
                //               <View style={{flex: 1, paddingRight: 10}}>
                //                 <Text style={[style.sizeText]}>
                //                   {item?.addon}
                //                 </Text>
                //               </View>

                //               <TouchableOpacity
                //                 onPress={() => {
                //                   addItemAddon(
                //                     pData?.addons,
                //                     item?.addon,
                //                     pData,
                //                   );
                //                 }}
                //                 style={{
                //                   flexDirection: 'row',
                //                 }}>
                //                 <Text style={[style.sizeText, {marginEnd: 10}]}>
                //                   ₹ {item?.price}
                //                 </Text>

                //                 <Image
                //                   source={
                //                     item?.added
                //                       ? icons.checked
                //                       : icons.unchecked
                //                   }
                //                   style={style.checkbox}
                //                 />
                //               </TouchableOpacity>
                //             </View>
                //           </View>
                //         );
                //       }}
                //     />
                //   </>
                // ) : null

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

              <View
                style={{
                  padding: 10,
                }}></View>
            </ScrollView>
            <View
              style={{
                // flex: 1,
                backgroundColor: COLORS.lightGray,
                paddingTop: 10,
                borderTopColor: COLORS.grey,
                // borderWidth: 0.5,
                borderTopWidth: 0.5,
              }}>
              <TouchableOpacity
                onPress={() => {
                  console.log(
                    'address - > ' + cartVendorId + ' ' + pData?.vendor_id,
                  );
                  if (!showBarLoader) {
                    setShowBarLoader(true);
                  }
                  if (cartVendorId == pData?.vendor_id) {
                    newPlus(pData?.product_id + '');
                    setPData({});
                    setShowAdd(false);
                  } else if (cartArrayCount == '') {
                    newPlus(pData?.product_id + '');
                    setPData({});
                    setShowAdd(false);
                  } else {
                    setItemExistData(pData);
                    setPData({});
                    setShowAdd(false);
                    setShowItemExist(true);
                  }
                  setTotalMoney(0);
                  setAddonPrice(0);
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
                    {/* Add Item ₹ {totalMoney} */}
                    {/* Add Item ₹ {totalMoney + addonPrice} */}
                    Add Item ₹ {totalProductPrice + totalAddonPrice}
                    {/* Add Item ₹ {pData?.product_price} */}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderChangeModal = () => {
    return (
      <Modal
        transparent={true}
        animationType={'none'}
        visible={showChange}
        onRequestClose={() => {
          closeChangeModal();
        }}>
        <View style={style.modalBackground}>
          <View style={style.activityIndicatorWrapper}>
            <Text
              style={{
                color: COLORS.grey,
                alignSelf: 'center',
                fontSize: 18,
                textAlign: 'center',
                fontFamily: 'Segoe UI Bold',
              }}
              onPress={() => {
                closeChangeModal();
              }}>
              Change Dine Out User Details
            </Text>
            <TouchableOpacity
              onPress={() => closeChangeModal()}
              style={{
                position: 'absolute',
                top: 5,
                right: 0,
              }}>
              <Image
                source={icons.cancel}
                style={{
                  width: 20,
                  height: 20,
                  marginRight: 10,
                }}
              />
            </TouchableOpacity>
            <View
              style={{
                width: '100%',
                marginTop: 10,
              }}>
              <Text
                style={{
                  color: COLORS.grey,
                  alignSelf: 'flex-start',
                  fontSize: 16,
                  fontFamily: 'Segoe UI Bold',
                }}>
                Name
              </Text>

              <TextInput
                style={{
                  color: COLORS.black,
                  fontSize: 16,
                  fontFamily: 'Segoe UI',
                  // flex: 1,
                  width: '95%',
                  height: 45,
                  marginHorizontal: 5,
                }}
                value={newName}
                onChangeText={v => {
                  setNewName(v);
                }}
                placeholder="Name"
              />
              <View
                style={{
                  backgroundColor: COLORS.grey,
                  width: '100%',
                  height: 1,
                }}
              />

              <Text
                style={{
                  color: COLORS.grey,
                  alignSelf: 'flex-start',
                  fontSize: 16,
                  fontFamily: 'Segoe UI Bold',
                  marginTop: 15,
                }}>
                Mobile No.
              </Text>

              <TextInput
                style={{
                  color: COLORS.black,
                  fontSize: 16,
                  fontFamily: 'Segoe UI',

                  width: '95%',
                  height: 45,
                  marginHorizontal: 5,
                }}
                maxLength={10}
                keyboardType="number-pad"
                value={newMobile}
                onChangeText={v => {
                  setNewMobile(v);
                }}
                placeholder="Mobile Number"
              />
              <View
                style={{
                  backgroundColor: COLORS.grey,
                  width: '100%',
                  height: 1,
                }}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  if (newName == '') {
                    ShowMessage('Please enter name');
                  } else if (newMobile == '') {
                    ShowMessage('Please enter mobile number');
                  } else if (!validateMobileNumber(newMobile)) {
                    ShowMessage('Please enter correct mobile number');
                  } else {
                    setName(newName);
                    setMobile(newMobile);
                    setShowChange(false);
                  }
                }}
                style={{
                  paddingHorizontal: 20,
                  backgroundColor: COLORS.primary,
                  alignItems: 'center',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  paddingVertical: 10,
                  borderRadius: 10,
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    fontFamily: 'Segoe UI Bold',
                    fontSize: 22,
                    color: COLORS.white,
                  }}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  let cartItemCount = useSelector(state => state.state.cartArray);

  return (
    <SafeAreaView style={style.mainContainer}>
      <Loader loading={bookNowLoading} />
      <View style={style.mainContainer} showsVerticalScrollIndicator={false}>
        {changeOne ? (
          <>
            {/* {shimmerLoading ? (
              <ExpandableComponentSkeleton />
            ) : ( */}
            <>
              <FlatList
                style={
                  {
                    // marginTop: 20,
                  }
                }
                ListFooterComponent={() => {
                  return (
                    <View
                      style={{
                        // alignItems: 'center',
                        paddingBottom: 120,
                        // backgroundColor: COLORS.restCardColor,
                      }}>
                      {shimmerLoading ? (
                        <ActivityIndicator
                          color={COLORS.primary}
                          size={'large'}
                          style={{
                            alignSelf: 'center',
                            marginVertical: 10,
                          }}
                        />
                      ) : null}
                      <View
                        style={{
                          flexDirection: 'row',
                          // marginTop: 50,
                          // backgroundColor: '#e7e7e7',
                          backgroundColor: COLORS.white,
                          justifyContent: 'space-between',
                          paddingBottom: 5,
                          paddingTop: 30,
                          // paddingBottom: 100,
                        }}>
                        <View>
                          <Text
                            style={{
                              marginStart: 15,
                              marginTop: 10,
                              fontFamily: 'Segoe UI',
                              fontSize: 12,
                              color: COLORS.black,
                              opacity: 0.8,
                            }}>
                            License Number
                          </Text>
                          <Text
                            style={{
                              marginStart: 15,
                              marginTop: 15,
                              fontFamily: 'Segoe UI',
                              fontSize: 12,
                              color: COLORS.black,
                              opacity: 0.8,
                            }}>
                            {receivedItem?.fssai_lic_no}
                          </Text>
                        </View>
                        <Image
                          source={{
                            uri: 'https://seeklogo.com/images/F/fssai-logo-C7400699BD-seeklogo.com.png',
                          }}
                          style={{
                            width: 65,
                            height: 65,
                            resizeMode: 'center',
                            marginEnd: 15,
                          }}
                        />
                      </View>

                      <View
                        style={{
                          alignItems: 'center',
                          alignSelf: 'center',
                          // paddingVertical: 20,
                          opacity: 0.5,
                          // backgroundColor: COLORS.red,
                        }}>
                        <Image style={style.logo} source={images.app_logo} />

                        <Text style={style.copyRightText}>
                          © 2022, ChefLab All Rights Reserved.
                        </Text>
                      </View>
                    </View>
                  );
                }}
                ListHeaderComponent={() => {
                  return (
                    <>
                      <View style={style.sliderMainContainer}>
                        {/* <Loader loading={addloading} /> */}
                        <SwiperFlatList
                          autoplay
                          autoplayDelay={3}
                          autoplayLoop
                          // showPagination
                          // data={[
                          //   'https://images.unsplash.com/photo-1584055482118-3f355578daef?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZCUyMGZvciUyMHBob25lfGVufDB8fDB8fA%3D%3D',
                          //   'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8Zm9vZHxlbnwwfHwwfHw%3D',
                          //   'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vZHxlbnwwfHwwfHw%3D',
                          //   'https://images.unsplash.com/photo-1630659996121-34204da4ce5f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vZCUyMGZvciUyMHBob25lfGVufDB8fDB8fA%3D%3D',
                          // ]}
                          data={
                            receivedItem?.banner_image || [
                              receivedItem?.vendor_image,
                            ]
                          }
                          paginationStyleItem={style.paginationStyleItem}
                          paginationDefaultColor={'#e4e4e4'}
                          paginationActiveColor={'#707070'}
                          renderItem={({item, index}) => (
                            <View
                              style={{
                                width: SIZES.width,
                                justifyContent: 'center',
                              }}>
                              <Image
                                source={{
                                  uri: item,
                                }}
                                style={{
                                  height: 250,
                                  width: '100%',
                                }}
                              />

                              {/* </Ima> */}
                            </View>
                          )}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          // alignItems: 'center',
                          // justifyContent: 'space-between',
                          width: '100%',
                          position: 'absolute',
                          top: 0,
                          // backgroundColor: COLORS.black,
                        }}>
                        <TouchableOpacity
                          style={{
                            width: 40,
                            height: 40,
                            backgroundColor: '#ffffff80',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 50,
                            // left: 15,
                            marginTop: 10,
                            marginStart: 15,
                            // top: 15,
                          }}
                          onPress={() => navigation.goBack()}>
                          <Image source={icons.back} style={style.bkBtn} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => {
                            // console.log('call ');
                            updateFavUnFav();
                          }}
                          style={[
                            style.fav,
                            {
                              // backgroundColor: COLORS.black,
                            },
                          ]}>
                          <Image
                            source={
                              favorite ? icons.favorite : icons.unfavorite
                            }
                            style={{
                              width: 30,
                              height: 30,
                            }}
                          />
                        </TouchableOpacity>
                      </View>

                      <View
                        activeOpacity={0.9}
                        style={[
                          // style.resCard,
                          {
                            // padding: 10,
                            flexDirection: 'row',
                            backgroundColor: COLORS.white,
                            // marginEnd: 10,
                            // marginStart: 15,
                            width: '95%',
                            alignSelf: 'center',
                            elevation: 10,
                            borderRadius: 10,
                            marginTop: 5,
                            marginBottom: 10,
                            position: 'relative',
                            alignItems: 'center',
                            bottom: 20,
                          },
                        ]}>
                        <View
                          style={[
                            style.resImageBg,
                            {
                              margin: 10,
                              alignItems: 'center',
                              // backgroundColor: COLORS.restCardColor,
                            },
                          ]}>
                          <Image
                            source={{
                              uri:
                                receivedItem?.vendor_image ||
                                receivedItem?.image,
                            }}
                            style={style.resImage}
                          />
                          {receivedItem?.vendor_food_type &&
                          receivedItem?.vendor_food_type == '1' ? (
                            <Image
                              source={icons.restpure_veg}
                              style={{
                                height: 15,
                                width: 60,
                                resizeMode: 'center',
                                position: 'absolute',
                                bottom: -6,
                              }}
                            />
                          ) : null}
                        </View>
                        <View
                          style={{
                            flexGrow: 1,
                            // backgroundColor: COLORS.restCardColor,
                            alignItems: 'flex-start',
                            marginEnd: 5,
                          }}>
                          {/* <Text
                            style={[
                              style.text,
                              {
                                marginStart: 0,
                              },
                            ]}
                            numberOfLines={1}>
                            {receivedItem?.name || receivedItem?.restaurantName}{' '}
                            dsads ds d s dsa dfd fds
                          </Text> */}
                          <View
                            style={{
                              flexDirection: 'row',
                              // flex: 1,
                              // maxWidth: SIZES.width / 2.2,
                              width: SIZES.width / 1.4,
                              // backgroundColor: 'red',
                            }}>
                            <Text
                              style={[
                                {
                                  color: COLORS.black,
                                  fontFamily: 'Segoe UI Bold',
                                  fontSize: 16,
                                },
                              ]}
                              numberOfLines={1}>
                              {receivedItem?.name ||
                                receivedItem?.restaurantName}
                              {/* dsadsa d s d sd sa d sad sa d */}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                            }}>
                            <Text
                              style={[
                                style.tagline,
                                {
                                  marginStart: 0,
                                  alignSelf: 'flex-start',
                                  color: COLORS.grey,
                                  marginTop: 5,
                                  fontFamily: 'Segoe UI',
                                  fontSize: horizScale(13),
                                  flex: 1,
                                  flexWrap: 'wrap',
                                  marginEnd: 10,
                                },
                              ]}
                              numberOfLines={1}>
                              {/* {receivedItem?.categories?.toString()} */}
                              {receivedItem?.cuisines?.toString()}
                            </Text>
                          </View>
                          <View
                            style={[
                              style.resStarView,
                              {
                                // flex: 1,
                                marginStart: 0,
                              },
                            ]}>
                            {/* <AntDesign name="staro" color={'gold'} />
                              <AntDesign name="staro" color={'gold'} />
                              <AntDesign name="staro" color={'gold'} />
                              <AntDesign name="staro" color={'gold'} />
                              <AntDesign name="staro" color={'gold'} /> */}
                            <AirbnbRating
                              count={5}
                              isDisabled={true}
                              showRating={false}
                              defaultRating={parseInt(
                                receivedItem?.vendor_ratings,
                              )}
                              size={10}
                            />
                            {receivedItem?.vendor_ratings == '0' ? null : (
                              <Text style={[style.distance]} numberOfLines={1}>
                                {receivedItem?.vendor_ratings}
                              </Text>
                            )}
                            {receivedItem?.review_count == 0 ? null : (
                              <Text
                                style={style.blue_text}
                                onPress={() => {
                                  getVendorReview(apiToken, receivedItem?.id);
                                  setShowReviewModal(true);
                                }}>
                                ({receivedItem?.review_count} reviews)
                              </Text>
                            )}
                          </View>

                          <View
                            style={[
                              style.resStarView,
                              {
                                marginStart: 0,
                              },
                            ]}>
                            <Text
                              style={[
                                style.open_close_status,
                                {
                                  color:
                                    receivedItem?.isClosed == 1
                                      ? '#ff4000'
                                      : '#0638ff',
                                  // fontSize: 14,
                                },
                              ]}>
                              {receivedItem?.isClosed == 1 ? 'Closed' : 'Open'}
                            </Text>
                            {receivedItem?.isClosed == 1 ? null : (
                              <View style={style.round_circle} />
                            )}
                            {/* {receivedItem?.isClosed == 0 ? null : (
                            <Text style={style.close_time}>Closes at 10 PM</Text>
                          )} */}
                            {receivedItem?.isClosed == 1 ? (
                              <Text
                                style={[
                                  style.close_time,
                                  {
                                    marginStart: 15,
                                  },
                                ]}>
                                {/* Opens at {receivedItem?.next_available} */}
                                Opens {receivedItem?.next_available}
                                {/* Closes at{' '}
                              {moment('2022-10-28' + ' ' + receivedItem?.end_time).format(
                                'hh A',
                              )} */}
                              </Text>
                            ) : (
                              <Text
                                style={[
                                  style.close_time,
                                  {
                                    // marginStart: 15,
                                  },
                                ]}>
                                {/* Opens at {receivedItem?.next_available} */}
                                Closes{' '}
                                {moment(
                                  '2022-10-28' + ' ' + receivedItem?.end_time,
                                ).format('hh:mm A')}
                              </Text>
                            )}
                          </View>
                        </View>
                      </View>

                      {receivedItem?.table_service &&
                      receivedItem?.table_service === '1' ? (
                        <View
                          style={[
                            style.resStarView,
                            {
                              marginTop: 5,
                              marginStart: 0,
                            },
                          ]}>
                          <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                              setChangeOne(true);
                              setChangeTwo(false);
                            }}
                            style={{
                              width: '43%',
                              height: 35,
                              backgroundColor: changeOne
                                ? COLORS.primary
                                : '#e7e7e7',
                              borderRadius: 10,
                              marginHorizontal: 10,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <Text
                              style={{
                                color: changeOne
                                  ? COLORS.white
                                  : COLORS.darkGray,

                                fontSize: horizScale(18),
                                fontFamily: 'Segoe UI Bold',
                              }}>
                              Order Food
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                              // setChangeOne(false);
                              // setChangeTwo(true);
                            }}
                            style={{
                              width: '43%',
                              height: 35,
                              backgroundColor: changeTwo
                                ? COLORS.primary
                                : '#e7e7e7',

                              borderRadius: 10,
                              marginHorizontal: 10,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <Text
                              style={{
                                color: changeTwo
                                  ? COLORS.white
                                  : COLORS.darkGray,
                                fontSize: horizScale(18),

                                fontFamily: 'Segoe UI Bold',
                              }}>
                              Book a table
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ) : null}
                      {vendorCouponData.length >= 1 ? (
                        <View>
                          <View>
                            <Text style={[style.moodText]}>Offers</Text>
                          </View>
                          <FlatList
                            data={vendorCouponData}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            renderItem={({item, index}) => {
                              return (
                                <View
                                  style={{
                                    backgroundColor: '#e5edff',
                                    marginStart:
                                      index == 0 ? SIZES.padding + 5 : 10,
                                    marginEnd:
                                      index == vendorCouponData.length - 1
                                        ? SIZES.padding
                                        : 10,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    borderRadius: 10,
                                    paddingHorizontal: 5,
                                    marginTop: 10,
                                    paddingVertical: 5,
                                  }}>
                                  <Image
                                    source={icons.blue_offer}
                                    style={{
                                      width: 30,
                                      height: 30,
                                      margin: 5,
                                    }}
                                  />
                                  <View>
                                    <Text
                                      style={{
                                        color: changeTwo
                                          ? COLORS.white
                                          : COLORS.darkGray,
                                        fontSize: horizScale(15),
                                        fontFamily: 'Segoe UI',
                                        paddingHorizontal: 5,
                                      }}>
                                      {item?.name}
                                    </Text>
                                    <Text
                                      style={{
                                        color: changeTwo
                                          ? COLORS.white
                                          : COLORS.darkGray,
                                        fontSize: horizScale(12),

                                        fontFamily: 'Segoe UI',
                                        paddingHorizontal: 5,
                                      }}>
                                      {item?.code}
                                    </Text>
                                  </View>
                                </View>
                              );
                            }}
                          />
                        </View>
                      ) : null}

                      {receivedItem?.vendor_food_type &&
                      receivedItem?.vendor_food_type != '1' ? (
                        <View
                          style={{
                            flexDirection: 'row',
                            marginTop: 10,
                          }}>
                          <View
                            style={{
                              alignSelf: 'flex-start',
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                              // marginBottom: 15,
                              marginTop: 10,
                              marginStart: 15,
                            }}>
                            <Switch
                              trackColor={{
                                false: COLORS.darkGray,
                                true: COLORS.primary,
                              }}
                              thumbColor={
                                vegSwitches ? COLORS.primary : '#e7e7e7'
                              }
                              ios_backgroundColor="#3e3e3e"
                              onValueChange={toggleWifiSwitch => {
                                setDetailsData([]);
                                setShimmerLoading(true);
                                // console.log(
                                //   'toggleWifiSwitch switch for veg -> ',
                                //   toggleWifiSwitch,
                                // );
                                setVegSwitches(toggleWifiSwitch);
                                // if (nonVegSwitches) {
                                //   setNonVegSwitches(false);
                                // } else {
                                // }
                                if (toggleWifiSwitch) {
                                  if (nonVegSwitches) {
                                    getRestDetailsPage(apiToken, venId);
                                  } else {
                                    filterVeg(receivedItem?.id, apiToken);
                                  }
                                } else {
                                  if (nonVegSwitches) {
                                    filterNonVeg(receivedItem?.id, apiToken);
                                  } else {
                                    getRestDetailsPage(apiToken, venId);
                                  }
                                }
                              }}
                              style={{}}
                              value={vegSwitches}
                            />
                            <Text
                              style={{
                                color: changeTwo
                                  ? COLORS.white
                                  : COLORS.darkGray,
                                fontSize: horizScale(13),

                                fontFamily: 'Segoe UI',
                                paddingHorizontal: 2,
                              }}>
                              Veg
                            </Text>
                          </View>

                          <View
                            style={{
                              alignSelf: 'flex-start',
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                              // marginBottom: 15,
                              marginTop: 10,
                              marginStart: 15,
                            }}>
                            <Switch
                              trackColor={{
                                false: COLORS.darkGray,
                                true: COLORS.primary,
                              }}
                              thumbColor={
                                nonVegSwitches ? COLORS.primary : '#e7e7e7'
                              }
                              ios_backgroundColor="#3e3e3e"
                              onValueChange={toggleWifiSwitch => {
                                setDetailsData([]);
                                setShimmerLoading(true);

                                setNonVegSwitches(toggleWifiSwitch);

                                console.log(
                                  'toggleWifiSwitch switch for Non veg -> ',
                                  toggleWifiSwitch,
                                );

                                if (toggleWifiSwitch) {
                                  if (vegSwitches) {
                                    getRestDetailsPage(apiToken, venId);
                                  } else {
                                    filterNonVeg(receivedItem?.id, apiToken);
                                  }
                                } else {
                                  if (vegSwitches) {
                                    filterVeg(receivedItem?.id, apiToken);
                                  } else {
                                    getRestDetailsPage(apiToken, venId);
                                  }
                                }
                              }}
                              style={{}}
                              value={nonVegSwitches}
                            />
                            <Text
                              style={{
                                color: changeTwo
                                  ? COLORS.white
                                  : COLORS.darkGray,
                                fontSize: horizScale(13),

                                fontFamily: 'Segoe UI',
                                paddingHorizontal: 2,
                              }}>
                              Non-Veg
                            </Text>
                          </View>
                        </View>
                      ) : null}

                      <View
                        style={{
                          padding: 15,
                        }}></View>
                    </>
                  );
                }}
                ref={flatListRef}
                extraData={detailsData}
                data={detailsData}
                initialNumToRender={2}
                maxToRenderPerBatch={3}
                renderItem={renderExpandableItemTwo}
              />
            </>
            {/* )} */}
          </>
        ) : changeTwo ? (
          <View>
            <Text
              style={{
                fontFamily: 'Segoe UI',
                fontSize: 16,
                color: COLORS.grey,
                marginTop: 25,
                marginStart: 15,
              }}>
              No. of Guests
            </Text>

            <View
              style={{
                width: '100%',
                // height: 50,
                // marginStart: 10,
                backgroundColor: '#f5f5f5',
                marginVertical: 10,
              }}>
              <FlatList
                extraData={guestNum}
                data={guestNum}
                renderItem={renderGuestNum}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>
            <Text
              style={{
                fontFamily: 'Segoe UI',
                fontSize: 16,
                color: COLORS.grey,
                marginTop: 20,
                marginStart: 15,
              }}>
              Day of Booking
            </Text>
            <View
              style={{
                width: '100%',
                // height: 50,
                // marginStart: 10,
                backgroundColor: '#f5f5f5',
                marginVertical: 10,
              }}>
              <FlatList
                extraData={dayNameYear}
                data={dayNameYear}
                renderItem={renderDayNameNum}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>

            {selectedDate && (
              <>
                <Text
                  style={{
                    fontFamily: 'Segoe UI',
                    fontSize: 16,
                    color: COLORS.grey,
                    marginTop: 20,
                    marginStart: 15,
                  }}>
                  Time of Booking
                </Text>

                <View
                  style={{
                    width: '100%',
                    backgroundColor: '#f5f5f5',
                    marginVertical: 10,
                  }}>
                  <FlatList
                    extraData={flatListTimeSlotArr}
                    data={flatListTimeSlotArr}
                    renderItem={renderTimeNum}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
              </>
            )}

            <Text
              style={{
                fontFamily: 'Segoe UI',
                fontSize: 16,
                color: COLORS.grey,
                marginTop: 20,
                marginStart: 15,
              }}>
              Your Details
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#f5f5f5',
                marginVertical: 5,
                paddingVertical: 10,
              }}>
              <View>
                <Text
                  style={{
                    fontFamily: 'Segoe UI Bold',
                    fontSize: 18,
                    color: COLORS.grey,
                    marginStart: 15,
                  }}>
                  {name}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Segoe UI Bold',
                    fontSize: 18,
                    color: COLORS.grey,
                    marginStart: 15,
                  }}>
                  {mobile}
                </Text>
              </View>
              <Text
                onPress={() => {
                  closeChangeModal();
                }}
                style={{
                  fontFamily: 'Segoe UI',
                  fontSize: 14,
                  color: '#0638ff',
                  marginEnd: 15,
                  marginStart: 15,
                  textDecorationLine: 'underline',
                }}>
                Change
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                if (selectedGuestNumber == '') {
                  ShowMessage('Please select no. of guest');
                } else if (selectedBookingDate == '') {
                  ShowMessage('Please select booking date');
                } else if (selectedTimeSlot == '') {
                  ShowMessage('Please select time slot');
                } else {
                  setBookNowLoading(true);
                  setTimeout(() => {
                    navigation.navigate('BookingStatus', {
                      fullItem: {
                        name,
                        mobile,
                        selectedGuestNumber,
                        selectedBookingDate,
                        selectedTimeSlot,
                        receivedItem,
                      },
                    });
                    setBookNowLoading(false);
                  }, 1500);
                }
              }}
              activeOpacity={0.8}
              style={{
                paddingHorizontal: 50,
                backgroundColor: COLORS.primary,
                alignItems: 'center',
                alignSelf: 'center',
                justifyContent: 'center',
                paddingVertical: 10,
                borderRadius: 10,
                marginVertical: 10,
              }}>
              <Text
                style={{
                  fontFamily: 'Segoe UI Bold',
                  fontSize: 22,
                  color: COLORS.white,
                }}>
                Book Now
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
      {changeOne ? (
        <>
          <TouchableOpacity
            onPress={() => {
              closeFilterModal();
            }}
            style={[
              style.menuBtn,
              {
                // bottom: sumTotal > 0 ? 65 : 40,
                bottom: 70,
              },
            ]}>
            <Image style={style.leafImage} source={icons.dishicon} />
            {/* <Text style={style.menuText}>Browse Menu</Text> */}
            <Text style={style.menuText}>Menu</Text>
          </TouchableOpacity>
          {/* {venId == cartVendorId ? ( */}
          {showBarLoader ||
          (venId == cartVendorId && parseInt(cartArrayCount) > 0) ? (
            // && parseInt(cartArrayCount) > 0
            <View
              style={{
                padding: 10,
                backgroundColor: COLORS.primary,
                position: 'relative',
                bottom: 0,
                left: 0,
                right: 0,
                justifyContent: 'space-between',
                height: 60,
              }}>
              {!showBarLoader ? (
                <View
                  style={{
                    // backgroundColor: COLORS.red,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <Text
                      style={{
                        fontFamily: 'Segoe UI Bold',
                        color: COLORS.white,
                      }}>
                      {cartArrayCount} item
                    </Text>

                    <Text
                      style={{
                        marginTop: 5,

                        fontFamily: 'Segoe UI Bold',
                        color: COLORS.white,
                      }}>
                      {/* ₹ {sumTotal} plus taxes */}₹ {cartArrayPrice} plus
                      taxes
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      dispatch(releaseVendorId(venId));
                      navigation.navigate('Cart');
                    }}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        marginTop: 5,

                        fontFamily: 'Segoe UI Bold',
                        color: COLORS.white,
                        fontSize: 16,
                      }}>
                      Proceed to checkout
                    </Text>
                    <Image
                      source={icons.back_arrow}
                      style={{
                        width: 20,
                        height: 20,
                        tintColor: '#fff',
                        marginStart: 5,
                        marginTop: 5,
                        resizeMode: 'center',
                        transform: [
                          {
                            rotate: '180deg',
                          },
                        ],
                      }}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <ActivityIndicator color={COLORS.white} size={'large'} />
              )}
            </View>
          ) : null}
        </>
      ) : null}

      {renderFilterModal()}
      {renderAddModal()}
      {renderChangeModal()}
      {renderItemExist()}
      {renderReviewModal()}
    </SafeAreaView>
  );
};

export default RestaurantDetails;

const styles = StyleSheet.create({
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
  star_logo: {
    width: 12,
    height: 12,

    resizeMode: 'cover',
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

  addminusView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  countText: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#F4F2FF',
  },
  container: {
    flex: 1,
  },
  titleText: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: COLORS.lightGray3,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  headerText: {
    fontSize: 16,
    fontFamily: 'Segoe UI Bold',
    color: COLORS.black,
  },
  separator: {
    height: 0.5,
    backgroundColor: '#808080',
    width: '95%',
    marginLeft: 16,
    marginRight: 16,
  },
  text: {
    fontSize: 16,
    color: '#606070',
    padding: 10,
  },
  content: {
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
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
  fav: {
    right: 5,
    top: 5,
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: '#f5f5f5',
  },
});

/**
 * 
 * home - api end point
 * 
 * "vendors": [
            {
                "name": "Delhi Darbar",
                "image": "https://web10technologies.com/Chelab_full_project/public/vendors/logo-A4ihwZeMct6325d0916ec1b.jpeg",
                "vendor_ratings": 0,
                "id": 6,
                "lat": 24.474502000000001089574652723968029022216796875,
                "long": 74.8733030000000070458554546348750591278076171875,
                "distance": 1.100000000000000088817841970012523233890533447265625,
                "is_like": false
            }]

   /// provide as it is response  ===>>>

   getRestaurantByCategory   ---api end point 

    {"name":"v Family Restaurant","image":"","banner_image":[""],"vendor_ratings":0,
    "vendor_food_type":"1","deal_categories":"1,2,3,4","id":3,"fssai_lic_no":"46546446446",
    "table_service":"0","distance":1.2,"isClosed":true,"categories":["Pizza","Burger","Pasta","Chat"],
    "is_like":true,"imageUrl":"https://web10technologies.com/Chelab_full_project/public/vendor-banner/"}

    // missing key
    "lat": 
                "long": 
                "distance":

 */

/**
 * firebase version 14 ver  14.11.1
 */

/*****************
   // return item?.products?.length >= 1 ? (
                    //   <ExpandableComponent
                    //     key={item?.product_name}
                    //     onClickFunction={() => {
                    //       updateLayout(index);
                    //     }}
                    //     onAddFunction={(items, _idx) => {
                    //       if (items?.customizable == 'true') {
                    //         console.log(receivedItem?.isClosed, 'is Closed');
                    //         setPData(items);
                    //         console.log('items', JSON.stringify(items));
                    //         setTotalMoney(items?.product_price);
                    //         setOptionAddonData([]);
                    //         setAddItemIndex(items?.product_id + '');
                    //         getRestProductOptionMenu(item, items);
                    //       } else {
                    //         addToCartNotCustomizable(
                    //           items,
                    //           items?.product_id + '',
                    //         );
                    //       }
                    //     }}
                    //     onPlus={onPlus}
                    //     onMinus={onMinus}
                    //     item={item}
                    //     onFavPress={(_im, _in) => {
                    //       updateFavUnFavProduct(_im, _in);
                    //     }}
                    //   />
                    // ) : null;


api 
1. chef promotion
2. all chef according to the rating review 
3. chef products not coming in chef home api  --- if products are disable enable for testing
4. cart apis acc. to discussed logic or as per your logic  -- keep it dynamic



 */

//                     'lat'            => 'required|numeric',
//                     'lng'            => 'required|numeric',
//                     'vendor_offset'  => 'required|numeric',
//                     'vendor_limit'   => 'required|numeric',
//                     'product_offset' => 'required|numeric',
//                     'product_limit'  => 'required|numeric',9
