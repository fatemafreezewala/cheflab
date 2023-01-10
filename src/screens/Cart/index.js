import {
  Alert,
  Dimensions,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import CustomLoader from '../../utils/CustomLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import React, {useEffect, useState} from 'react';
import {FlatList, TextInput} from 'react-native';
import CheckBox from 'react-native-check-box';
import RazorpayCheckout from 'react-native-razorpay';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Animations, COLORS, icons, STRINGS} from '../../constants';
import {horizScale, SIZES, vertScale} from '../../constants/themes';
import ApiCall from '../../network/ApiCall';
import {API_END_POINTS} from '../../network/ApiEndpoints';
import CustomEditText from '../../utils/EditText/CustomEditText';
import ToolbarWithIcon from '../../utils/ToolbarWithIcon';
import {ShowConsole, ShowMessage} from '../../utils/Utility';
import style from './style';
import CartCardView, {CartSkeleton} from './utils/CartCardView';
import DeliveryInstruction from './utils/DeliveryInstruction';

import {useDispatch, useSelector} from 'react-redux';
import {
  addItemToCart,
  removeItemCart,
  updateCartCount,
} from '../../redux/actions/index';

const Cart = ({navigation}) => {
  const step1 = () => {
    let a = useWalletAmount
      ? parseInt(mainData?.wallet_amount) == 0
        ? Math.round(totalPayablePrice)
        : parseInt(mainData?.wallet_amount) >= parseInt(totalPayablePrice)
        ? 0
        : parseInt(mainData?.wallet_amount) < parseInt(totalPayablePrice) &&
          parseInt(mainData?.wallet_amount) > 0
        ? Math.round(totalPayablePrice) - parseInt(mainData?.wallet_amount)
        : Math.round(totalPayablePrice)
      : parseInt(itemTotal) +
        (parseInt(itemTotal) * parseInt(taxesPrice)) / 100 +
        parseInt(platformFee) -
        parseInt(promoCodePrice) +
        parseInt(deliveryChargePrice);
    var options = {
      // order_id: 'order_K9P8XNwtT3je4j',
      description: 'Order food',
      image: 'https://i.imgur.com/3g7nmJC.png',
      currency: 'INR',
      key: 'rzp_test_LAyG6lrl5x3XE0', //test key
      // amount: totalPayablePrice * 100,
      amount: a * 100,
      name: 'test',
      prefill: {
        email: 'email@test.com',
        contact: '1234567891',
        name: 'testName',
      },
      theme: {color: 'blue'},
    };
    console.log('oprtion -> ', JSON.stringify(options));

    step2(options);
  };
  const step2 = info => {
    setCustomLoading(true);
    console.log('JSON payload => ', JSON.stringify(info));
    try {
      RazorpayCheckout.open(info)
        .then(async data => {
          await createOrder(JSON.stringify(data));
        })
        .catch(error => {
          setCustomLoading(false);
          Alert.alert('Payment Failed', error?.error?.description + '', [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ]);
        });
    } catch (error) {
      setCustomLoading(false);

      console.log('JSON payload => ', JSON.stringify(error));
    }
  };

  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [showNoCart, setShowNoCart] = useState(false);
  const [sendCutlery, setSendCutlery] = useState(false);
  const [cartDetailsData, setCartDetailsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCustomLoading, setCustomLoading] = useState(false);
  const [addloading, setaddLoading] = useState(false);
  const [apiToken, setApiToken] = useState('');
  const [writeMessage, setWriteMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [useWalletAmount, setUseWalletAmount] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [showTaxInfoModal, setShowTaxInfoModal] = useState(false);

  // const [userId, setUserId] = useState('');

  const [couponData, setCouponData] = useState([]);

  const [deliveryInstructions, setDeliveryInstructions] = useState([
    {
      icon: icons.avoid_bell,
      title: 'Avoid ringing bell',
      selected: false,
    },
    {
      icon: icons.leave_at_door,
      title: 'Leave at door',
      selected: false,
    },
    {
      icon: icons.direction,
      title: 'Directions to reach',
      selected: false,
    },
    {
      icon: icons.avoid_calling,
      title: 'Avoid calling',
      selected: false,
    },
    // {
    //   icon: icons.leave_at_security,
    //   title: 'Leave with security',
    //   selected: false,
    // },
  ]);

  let cartItemCount = useSelector(state => state.state.cartArray);
  // ShowConsole(
  //   ' cart data  =->>>>>>>>>>>>>>>>>>>>>>' + JSON.stringify(cartItemCount),
  // );
  const [cartArr, setCartArr] = useState([]);
  useEffect(() => {
    setCartArr(cartItemCount);
  }, []);

  const [itemTotal, setItemTotal] = useState(0);
  const [promoCodePrice, setPromoCodePrice] = useState(0);
  const [platformFee, setPlatformFee] = useState(0);
  const [taxesPrice, setTaxesPrice] = useState(0);
  const [deliveryChargePrice, setDeliveryChargePrice] = useState(0);
  const [totalAmountPrice, setTotalAmountPrice] = useState(0);
  const [totalPayablePrice, setTotalPayablePrice] = useState(0);
  const [walletAmountPrice, setWalletAmountPrice] = useState(0);

  const [vendorCouponData, setVendorCouponData] = useState([]);

  const finalItem = async () => {
    let a = await cartDetailsData.map((item, index) => {
      console.log('final item =?/ ', JSON.stringify(item));

      const variant = item.variants?.reduce(function (acc, cur) {
        if (cur?.added) {
          var o = {
            variant_id: cur?.variant_id + '',
            variant_qty: item?.product_qty || item?.qty,
          };

          acc.push(o);
        }
        return acc;
      }, []);

      const addons = item.addons?.reduce(function (acc, cur) {
        if (cur?.added) {
          var o = {
            addon_id: cur?.id + '',
            addon_qty: cur?.qty + '',
          };

          acc.push(o);
        }
        return acc;
      }, []);
      return {
        product_id: item?.product_id,
        userId: userId,
        product_qty: item?.product_qty || item?.qty,
        product_name: item?.product_name,
        product_image: item?.product_image,
        cuisines: 'South Indian',
        category: 1,
        menu_id: 1,
        dis: item?.dis,
        type: item?.type,
        product_price: item?.product_price + '',
        customizable: item?.customizable,
        cancel_reason: null,
        product_for: item?.product_for,
        status: '1',
        product_approve: '1',
        product_rating: item?.product_rating,
        variants: variant,
        addons: addons,
      };
    });
    console.log('final item =?/ ', JSON.stringify(a));

    // setReceivedItem(a);
    return a;
  };

  const [profileData, setProfileData] = useState({});

  const getUserInfo = (value, _id) => {
    let body = {
      user_id: _id,
    };
    console.log('daa -> ', JSON.stringify(body) + value);
    ApiCall('post', null, API_END_POINTS.getUserInfo, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        if (response?.data?.status) {
          console.log('profile data -> ', JSON.stringify(response?.data));
          setProfileData(response?.data?.response);
        } else {
          setProfileData({});
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createOrder = async transaction_id => {
    setCustomLoading(true);
    let b = await finalItem();
    console.log('receivedItem ==>>>>>>>>>>', JSON.stringify(b));
    console.log('confirm address ==>>>>>>>>>>', JSON.stringify(confirmObject));
    let body = {
      user_id: userId,
      vendor_id: restVendorId,
      customer_name: profileData?.name,
      delivery_address: confirmObject?.house_no,
      reach: confirmObject?.reach,
      mobile_number: confirmObject?.contact_no,
      total_amount: totalPayablePrice + '', //sum of all amounts
      gross_amount: itemTotal + '', //after tax deduction
      net_amount: totalPayablePrice + '', //after discount deduction
      discount_amount: '0',
      coupon_id: '1',
      payment_type: 'Online',
      payment_status: 'pending',
      transaction_id: transaction_id,
      payment_string: transaction_id,
      city: 'Indore',

      send_cutlery: sendCutlery ? 1 : 0,

      avoid_ring_bell: deliveryInstructions[0].selected == true ? 1 : 0,
      leave_at_door: deliveryInstructions[1].selected == true ? 1 : 0,
      direction_to_reach: deliveryInstructions[2].selected == true ? 1 : 0,
      avoid_calling: deliveryInstructions[3].selected == true ? 1 : 0,
      direction_instruction: deliveryInstructNew || '',

      pincode: '456002',
      // lat: '24.4637223',
      // long: '74.8866346',
      lat: confirmObject?.lat + '',
      long: confirmObject?.long + '',
      // lat: 22.72418,
      // lng: 75.887257,
      platform_charges: platformFee,
      tex: (parseInt(itemTotal) * parseInt(taxesPrice)) / 100,
      wallet_apply: useWalletAmount ? '1' : '0',
      products: b,
    };

    console.log(
      'FINAL ITEM IN ORDER API 111111111111 -> ',
      JSON.stringify(body),
    );

    ApiCall('post', body, API_END_POINTS.createOrder, {
      Authorization: `Bearer ${apiToken}`,
    })
      .then(response => {
        console.log(
          'removeItemFromCart order cart api respo se z=>? ',
          response?.data,
        );
        if (response?.data?.status) {
          removeItemFromCart();

          setTimeout(() => {
            setCustomLoading(false);

            navigation.replace('OrderPlaced', {
              item: {
                order_id: response?.data?.response?.order_id,
              },
            });
          }, 1500);
        } else {
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {
        setCustomLoading(false);
      });
  };

  const getVendorPromo = (value, id) => {
    let body = {
      // vendor_id: '1',
      vendor_id: id + '',
    };
    console.log('removeItemFromCart =>? ', JSON.stringify(body));
    // ApiCall('post', body, API_END_POINTS.restaurantVendorCoupon, {
    ApiCall('post', body, API_END_POINTS.getVendorPromoCode, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        if (response?.data?.status) {
          setVendorCouponData([
            ...response?.data?.response?.vendor,
            ...response?.data?.response?.admin,
          ]);
        } else {
          setVendorCouponData([]);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      });
  };

  const [couponDetails, setCouponDetails] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const getVendorPromoDetails = (value, id) => {
    setaddLoading(true);
    let body = {
      id: id,
    };
    ApiCall('post', body, API_END_POINTS.getVendorPromoCodeDetails, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        console.log('removeItemFromCart dsadfsaadas=>? ', response?.data);
        if (response?.data?.status) {
          setCouponDetails(response?.data?.response);
          setShowAddCouponDetailsModal(true);
        } else {
          Platform.OS == 'android'
            ? ToastAndroid.showWithGravity(
                'Unable to fetch coupon details',
                ToastAndroid.BOTTOM,
                ToastAndroid.SHORT,
              )
            : alert('Unable to fetch coupon details');
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {
        setaddLoading(false);
      });
  };

  useEffect(() => {
    setTimeout(() => {
      setShowCouponSuccessModal(false);
    }, 2000);
  }, [showCouponSuccessModal, addloading]);

  const [showCouponSuccessModal, setShowCouponSuccessModal] = useState(false);
  const [couponName, setCouponName] = useState('');
  const applyCouponCode = (value, item) => {
    setaddLoading(true);
    let body = {
      code: value + '',
    };
    console.log(
      'removeItemFromCart  getVendorPromoCodeApply  =>? ',
      JSON.stringify(body),
    );
    ApiCall('post', body, API_END_POINTS.getVendorPromoCodeApply, {
      Authorization: `Bearer ${apiToken}`,
    })
      .then(response => {
        console.log(
          'removeItemFromCart  getVendorPromoCodeApply  =>? ',
          JSON.stringify(response?.data),
        );
        if (response?.data?.status) {
          setShowAddCouponModal(false);

          if (
            parseInt(response?.data?.response?.minimum_order_amount) > itemTotal
          ) {
            Platform.OS == 'android'
              ? ToastAndroid.showWithGravity(
                  'Minimum order amount : ₹' +
                    response?.data?.response?.minimum_order_amount,
                  ToastAndroid.BOTTOM,
                  ToastAndroid.SHORT,
                )
              : alert('Please try again');
          } else {
            /** {"message": "Data Get Successfully", "response": {"code": "COUPON234R", "coupon_valid_x_user": "100",
             * "description": "this is coupon", "discount": "20", "discount_type": "1", "from": "2022-09-24", "id": 1,
             * "maxim_dis_amount": "100", "minimum_order_amount": "300", "name": "20 % off", "promo_redeem_count": "1",
             * "promocode_use": "1", "to": "2022-09-30"}, "status": true} */
            if (response?.data?.response?.discount_type == '1') {
              let a =
                (itemTotal * parseInt(response?.data?.response?.discount)) /
                100;
              let b = 0;
              if (a > response?.data?.response?.maxim_dis_amount) {
                setPromoCodePrice(100);
                b =
                  itemTotal -
                  parseInt(response?.data?.response?.maxim_dis_amount);
                setCouponName(value);
                onSelectCoupon(item);
                setShowCouponSuccessModal(true);
                // Platform.OS == 'android'
                //   ? ToastAndroid.showWithGravity(
                //       'Promo code applied successfully',
                //       ToastAndroid.BOTTOM,
                //       ToastAndroid.SHORT,
                //     )
                //   : alert('Please try again');
              } else {
                setPromoCodePrice(a);
                b = itemTotal - a;
                setCouponName(value);
                onSelectCoupon(item);
                setShowCouponSuccessModal(true);

                // Platform.OS == 'android'
                //   ? ToastAndroid.showWithGravity(
                //       'Promo code applied successfully',
                //       ToastAndroid.BOTTOM,
                //       ToastAndroid.SHORT,
                //     )
                //   : alert('Please try again');
              }
            } else if (response?.data?.response?.discount_type == '0') {
              /**{"id":4,"vendor_id":"1","image":null,"name":"Test Amount Coupon","code":"AMOUNT@30",
               * "discount_type":"0","discount":"150","maxim_dis_amount":"20","minimum_order_amount":"100",
               * "promo_redeem_count":"9","promocode_use":"1","coupon_type":null,"create_by":"vendor",
               * "product_id":null,"show_in":"1","coupon_valid_x_user":"100","from":"2022-10-01",
               * "to":"2022-10-12",
               * "description":"This is amount testing coupon","status":"1",
               * "created_at":"2022-10-01 14:07:26","updated_at":"2022-10-01 14:07:26"} */
              let a = itemTotal;
              let b = 0;

              if (a > response?.data?.response?.maxim_dis_amount) {
                setPromoCodePrice(
                  parseInt(response?.data?.response?.maxim_dis_amount),
                );
                b =
                  itemTotal -
                  parseInt(response?.data?.response?.maxim_dis_amount);
                setCouponName(value);
                onSelectCoupon(item);

                setShowCouponSuccessModal(true);

                // Platform.OS == 'android'
                //   ? ToastAndroid.showWithGravity(
                //       'Promo code applied successfully',
                //       ToastAndroid.BOTTOM,
                //       ToastAndroid.SHORT,
                //     )
                //   : alert('Please try again');
              } else {
                b = itemTotal - parseInt(response?.data?.response?.discount);
                setCouponName(value);
                onSelectCoupon(item);

                setShowCouponSuccessModal(true);

                // Platform.OS == 'android'
                //   ? ToastAndroid.showWithGravity(
                //       'Promo code applied successfully',
                //       ToastAndroid.BOTTOM,
                //       ToastAndroid.SHORT,
                //     )
                //   : alert('Please try again');
              }
            }
          }
        } else {
          Platform.OS == 'android'
            ? ToastAndroid.showWithGravity(
                'Please try again',
                ToastAndroid.BOTTOM,
                ToastAndroid.SHORT,
              )
            : alert('Please try again');
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {
        setaddLoading(false);
      });
  };

  useEffect(() => {
    let t = 0;
    // cartDetailsData.forEach(item => {
    //   t = parseInt(item?.product_price) + parseInt(t);
    // });
    cartDetailsData.forEach(item => {
      t =
        parseInt(item?.product_price) * parseInt(item?.product_qty) +
        parseInt(t);
    });
    // setItemTotal(t);
    let a = (parseInt(taxesPrice) * parseInt(t)) / 100 + parseInt(platformFee);
    let lastAmount =
      // t - promoCodePrice + parseInt(taxesPrice) + deliveryChargePrice;
      t - promoCodePrice + a + deliveryChargePrice;
    setTotalAmountPrice(lastAmount);
    let finalAmount = lastAmount;
    // - walletAmountPrice;
    setTotalPayablePrice(finalAmount);
  }, [cartDetailsData, walletAmountPrice, promoCodePrice, taxesPrice]);

  const [deliveryOpt, setDeliveryOpt] = useState(null);

  const onDeliveryOptSelect = (item, index) => {
    if (deliveryOpt && deliveryOpt.title === item.title) {
      setDeliveryOpt(null);
    } else {
      if (index == 1) {
        deliveryInstructions.splice(index, 1, {
          ...item,
          selected: !item.selected,
        });
      } else if (index == 4) {
        deliveryInstructions.splice(index, 1, {
          ...item,
          selected: !item.selected,
        });
      }
      setDeliveryOpt(item);
    }
  };
  /**DELIVERY INSTRUCTION START */
  const onDeliveryInstructionClick = idx => {
    let a = deliveryInstructions.map((item, index) => {
      let temp = Object.assign({}, item);

      if (idx == index) {
        temp.selected = !temp.selected;

        if (item?.title === deliveryInstructions[2].title) {
          if (temp.selected) {
            setShowDirection(true);
          } else {
            setDeliveryInstruct('');
            setDeliveryInstructNew('');
          }
        }
        // if (index == 1 && temp.selected) {
        //   temp.selected = temp.selected;
        // } else if (index == 4 && temp.selected) {
        //   temp.selected = temp.selected;
        // }
      }
      return temp;
    });

    setDeliveryInstructions(a);
  };
  /**DELIVERY INSTRUCTION END */

  useEffect(() => {
    let t = 0;

    // ShowConsole('cart item count -> ', JSON.stringify(cartItemCount));
    // setCartDetailsData(cartItemCount);
    cartItemCount.forEach(item => {
      t = parseInt(item?.product_price) * parseInt(item?.qty) + parseInt(t);
    });
    // setItemTotal(t);
    let lastAmount =
      t -
      promoCodePrice +
      parseInt(taxesPrice) +
      parseInt(platformFee) +
      deliveryChargePrice;
    setTotalAmountPrice(lastAmount);
    let finalAmount = lastAmount;
    // - walletAmountPrice;
    setTotalPayablePrice(finalAmount);
    setLoading(true);
    getInfoFromStorage();
    getAsyncAddress();
    setLoading(false);
  }, []);

  const [userId, setUserId] = useState('');

  const getInfoFromStorage = async () => {
    let t = 0;
    try {
      await AsyncStorage.getItem('token', (err, value) => {
        if (err) {
        } else {
          if (value !== '' && value !== null) {
            t = value;
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
            getRestDetailsPage(t, value);
            getUserSavedAddress(t, value);
            getUserInfo(t, value);
          } else {
            setUserId('');
          }
        }
      });
      await AsyncStorage.getItem('userAddress', (err, value) => {
        if (err) {
        } else {
          if (value !== '' && value !== null) {
            setConfirmObject(JSON.parse(value));
            // console.log('userAddress', value);
          } else {
            setConfirmObject(null);
          }
        }
      });
    } catch (error) {}
  };

  const [restName, setRestName] = useState('');
  const [restClosed, setRestClosed] = useState('');
  const [restVendorId, setRestVendorId] = useState('');
  const [addressLoading, setAddressLoading] = useState(false);

  const [data, setData] = useState([]);
  const getUserSavedAddress = (value, id) => {
    setAddressLoading(true);

    let body = {
      user_id: id,
    };
    // console.log('daa -> ', JSON.stringify(body) + value);
    ApiCall('post', body, API_END_POINTS.getUserDeliveryAddress, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        if (response?.data?.status) {
          // console.log(
          //   'profile data get saved address getUserDeliveryAddress  ========-> ',
          //   JSON.stringify(response?.data),
          // );
          if (response?.data?.response?.length >= 1) {
            setData(response?.data?.response);
          }
        } else {
          setData([]);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {
        setAddressLoading(false);
      });
  };

  const [cartId, setCartId] = useState('');

  const [mainData, setMainData] = useState({});

  const getRestDetailsPage = (value, _id) => {
    setLoading(true);
    let body;
    if (confirmObject == null) {
      body = {
        user_id: _id,
        lat: userLatitude,
        lng: userLongitude,
      };
    } else {
      body = {
        user_id: _id,
        lat: confirmObject?.lat,
        lng: confirmObject.long,
      };
    }

    // let body = {
    //   user_id: '4',
    //   cart_id: '81',
    // };

    console.log('data body >>>>>>>>>> -> ', JSON.stringify(body));
    ApiCall('post', body, API_END_POINTS.viewCart, {
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
        console.log(
          'getRestDetailsPage response view cart api response = -> ',
          JSON.stringify(response?.data),
        );
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
          // let o = [];
          // let ad = [];

          // if (response?.data?.response?.cart.length >= 1) {
          //   o = response?.data?.response?.cart?.map(item => {
          //     console.log(
          //       'getRestDetailsPage response = -> ',
          //       JSON.stringify(item?.product_id),
          //     );
          //     if (item?.variants != null) {
          //       let p = item.variants?.map((_i, _index) => {
          //         return {
          //           ..._i,
          //           selected: false,
          //         };
          //       });
          //       if (item.addons != null) {
          //         ad = item.addons?.map((_i, _index) => {
          //           return {
          //             ..._i,
          //             selected: false,
          //           };
          //         });
          //       }
          //       return {
          //         ...item,
          //         // cuisines: [],
          //         // product_variants: p || [],
          //         // addons: ad || [],
          //         // // product_variants: [],
          //         // // addons: [],
          //         // price: item?.product_price,
          //         // quantity: 1,
          //       };
          //     }
          //   });
          // }

          console.log(
            // JSON.stringify(response?.data?.response?.cart) +
            ' <<<>>> ' +
              JSON.stringify(response?.data?.response?.cart) +
              '\n\n' +
              ' <<<>>>>>>>>>>>>>>>> ',
          );

          setCartId(response?.data?.response?.cart_id);
          setItemTotal(response?.data?.response?.cart_sub_toatl_amount);
          setCartDetailsData(response?.data?.response?.cart);
          // let a = response?.data?.response?.cart.map(item => {
          //   return {
          //     ...item,
          //     original_price: item?.product_price,
          //   };
          // });

          console.log(
            // JSON.stringify(response?.data?.response?.cart) +
            ' <<<>>> ' +
              JSON.stringify(response?.data?.response?.vendor?.isClosed),
          );

          // // setCartDetailsData(response?.data?.response?.cart);
          // setCartDetailsData(a);
          setMainData(response?.data?.response);
          // setTaxesPrice(response?.data?.response?.vendor?.tax);
          setTaxesPrice(response?.data?.response?.tax);
          setRestName(response?.data?.response?.vendor?.name);
          setRestClosed(parseInt(response?.data?.response?.vendor?.isClosed));
          setRestVendorId(response?.data?.response?.vendor?.vendor_id);
          getVendorPromo(value, response?.data?.response?.vendor?.vendor_id);

          setWalletAmountPrice(
            parseFloat(response?.data?.response?.wallet_amount),
          );
          setPlatformFee(response?.data?.response?.platform_charges || 0);
          setDeliveryChargePrice(
            response?.data?.response?.delivery_charge || 0,
          );
          // setShow(o.length <= 0);
          setShow(response?.data?.response?.cart?.length == 0);
        } else {
          if (response?.data?.error == 'Technical Error Vendor Not Found') {
            setVendorNotAvail(true);
          }
          setCartDetailsData([]);
          setShow(true);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // const getRestDetailsPageOne = (value, _id) => {
  //   // setLoading(true);
  //   let body = {
  //     user_id: _id,
  //   };

  //   // let body = {
  //   //   user_id: '4',
  //   //   cart_id: '81',
  //   // };

  //   // console.log('daa -> ', JSON.stringify(body) + value);
  //   ApiCall('post', body, API_END_POINTS.viewCart, {
  //     Authorization: `Bearer ${value}`,
  //   })
  //     .then(response => {
  //       console.log(
  //         'getRestDetailsPage response = -> ',
  //         JSON.stringify(response?.data),
  //       );
  //       if (response?.data?.status) {
  //         // let o = [];
  //         // let ad = [];

  //         // if (response?.data?.response?.cart.length >= 1) {
  //         //   o = response?.data?.response?.cart?.map(item => {
  //         //     console.log(
  //         //       'getRestDetailsPage response = -> ',
  //         //       JSON.stringify(item?.product_id),
  //         //     );
  //         //     if (item?.variants != null) {
  //         //       let p = item.variants?.map((_i, _index) => {
  //         //         return {
  //         //           ..._i,
  //         //           selected: false,
  //         //         };
  //         //       });
  //         //       if (item.addons != null) {
  //         //         ad = item.addons?.map((_i, _index) => {
  //         //           return {
  //         //             ..._i,
  //         //             selected: false,
  //         //           };
  //         //         });
  //         //       }
  //         //       return {
  //         //         ...item,
  //         //         // cuisines: [],
  //         //         // product_variants: p || [],
  //         //         // addons: ad || [],
  //         //         // // product_variants: [],
  //         //         // // addons: [],
  //         //         // price: item?.product_price,
  //         //         // quantity: 1,
  //         //       };
  //         //     }
  //         //   });
  //         // }

  //         // console.log(
  //         //   // JSON.stringify(response?.data?.response?.cart) +
  //         //   ' <<<>>> ' +
  //         //     JSON.stringify(response?.data?.response?.cart[0]) +
  //         //     '\n\n' +
  //         //     ' <<<>>>>>>>>>>>>>>>> ' +
  //         //     JSON.stringify(o),
  //         // );

  //         setCartId(response?.data?.response?.cart_id);

  //         setCartDetailsData(response?.data?.response?.cart);
  //         // let a = response?.data?.response?.cart.map(item => {
  //         //   return {
  //         //     ...item,
  //         //     original_price: item?.product_price,
  //         //   };
  //         // });

  //         // console.log(
  //         //   // JSON.stringify(response?.data?.response?.cart) +
  //         //   ' <<<>>> ' +
  //         //     JSON.stringify(response?.data?.response?.platform_charges),
  //         // );

  //         // // setCartDetailsData(response?.data?.response?.cart);
  //         // setCartDetailsData(a);
  //         setMainData(response?.data?.response);
  //         setTaxesPrice(response?.data?.response?.vendor?.tax);
  //         setRestName(response?.data?.response?.vendor?.name);
  //         setRestVendorId(response?.data?.response?.vendor?.vendor_id);
  //         setWalletAmountPrice(
  //           parseFloat(response?.data?.response?.wallet_amount),
  //         );
  //         setPlatformFee(response?.data?.response?.platform_charges || 0);
  //         // setShow(o.length <= 0);
  //       } else {
  //         setCartDetailsData([]);
  //         setShow(true);
  //       }
  //     })
  //     .catch(error => {
  //       console.log('ERROR IN getCuisines API -> ', error);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };

  /** CUSTOMIZE MODAL START */
  const [pData, setPData] = useState({});
  const [itemCount, setItemCount] = useState(1);
  const [totalMoney, setTotalMoney] = useState(0);
  const [optionAddonData, setOptionAddonData] = useState({});
  const [showAdd, setShowAdd] = useState(false);

  // TO OPEN/CLOSE MODAL
  const closeAddModal = () => {
    setShowAdd(!showAdd);
  };

  const closeCouponModal = () => {
    setShowAddCouponModal(!showAddCouponModal);
  };
  const closeTaxInfoModal = () => {
    setShowTaxInfoModal(!showTaxInfoModal);
  };
  // TO SELECT OPTIONS/ADDONS FROM CUSTOMIZE PRODUCTS
  const selectOptionAddon = (arr, id, mainData) => {
    let mData = arr;
    let t = 0;
    // let a = arr.map(item => {
    //   var temp = Object.assign({}, item);
    //   // console.log('temp --->>> ', JSON.stringify(temp));
    //   if (temp.variant_name === id) {
    //     temp.selected = !temp.selected;

    //     if (temp.selected) {
    //       t = parseInt(totalMoney) + parseInt(temp.variant_price) + 0.0;
    //     } else {
    //       t = parseInt(totalMoney) - parseInt(temp.variant_price) + 0.0;
    //     }
    //     console.log('temp --->>> ', JSON.stringify(t));
    //     // pData?.variant_price = t
    //   }
    //   setTotalMoney(t);
    //   console.log('temp inLast--->>> ', JSON.stringify(temp));

    //   return temp;
    // });

    // console.log('temp inLast--->>> ', JSON.stringify(optionAddonData));

    let o = [];
    let ad = [];

    if (mData.length >= 1) {
      o = mData.map(item => {
        var temp = Object.assign({}, item);
        if (temp.variant_name == id) {
          temp.selected = !temp.selected;
          if (temp.selected) {
            t = parseInt(totalMoney) + parseInt(temp.variant_price) + 0.0;
          } else {
            t = parseInt(totalMoney) - parseInt(temp.variant_price) + 0.0;
          }
          // console.log('temp inLast--->>> ', JSON.stringify(temp));
        }

        return temp;
      });
    }
    // console.log('temp inLast--->>> ', JSON.stringify(o));
    let r = {
      ...pData,
      variants: o || [],
      addons: ad || [],
    };
    setTotalMoney(t);
    setPData(r);
  };

  const addItemAddon = (arr, id, mainData) => {
    // let _tempItem = itemCount + 1;
    // setItemCount(_tempItem);
    let t = 0;
    let b = 0;

    let a = arr.map(item => {
      var temp = Object.assign({}, item);
      console.log('temp --->>> ', JSON.stringify(temp));
      if (temp.addon === id) {
        temp.selected = !temp.selected;

        if (temp.selected) {
          t = parseInt(totalMoney) + parseInt(temp.price) + 0.0;
          b = parseInt(temp.price) + parseInt(addonPrice);
        } else {
          t = parseInt(totalMoney) - parseInt(temp.price) + 0.0;
          b = parseInt(addonPrice) - parseInt(temp.price);
        }
        // console.log('temp --->>> ', JSON.stringify(t));
        // pData?.variant_price = t
      }
      setTotalMoney(t);
      setAddonPrice(b);
      return temp;
    });

    setPData({...pData, addons: a});
  };
  const renderCouponSuccessModal = () => {
    return (
      <Modal
        visible={showCouponSuccessModal}
        animationType="slide"
        transparent={true}
        statusBarTranslucent
        onRequestClose={() => setShowCouponSuccessModal(false)}
        style={{flexGrow: 1}}>
        <View
          style={{
            backgroundColor: '#00000090',
            flexGrow: 1,
            // alignSelf: 'center',
            justifyContent: 'center',
          }}>
          <LottieView
            source={Animations.cong}
            // source={Animations.process_failed}
            style={{
              // height: Dimensions.get('screen').height,
              width: Dimensions.get('screen').width,
              // alignSelf: 'center',
              position: 'absolute',
              top: 0,
            }}
            autoPlay={true}
            loop={true}
          />
          <View style={style.additemView}>
            <View
              style={[
                style.addItemHeader,
                {
                  elevation: 10,
                  backgroundColor: COLORS.white,
                  marginHorizontal: 15,
                  borderRadius: 10,

                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 10,
                  paddingBottom: 10,
                },
              ]}>
              <View
                style={[
                  style.rowView,
                  {
                    justifyContent: 'space-between',
                  },
                ]}>
                <View style={{flex: 1}}>
                  <LottieView
                    source={Animations.suc}
                    // source={Animations.process_failed}
                    style={{
                      height: 120,
                      width: 120,
                      alignSelf: 'center',
                    }}
                    autoPlay={true}
                    loop={false}
                  />
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontSize: 14,
                      color: COLORS.black,
                      fontFamily: 'Segoe UI Bold',
                      marginTop: -15,
                    }}>
                    {couponName} applied
                  </Text>
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontSize: 20,
                      color: COLORS.black,
                      fontFamily: 'Segoe UI Bold',
                      marginTop: 10,
                      marginBottom: 10,
                    }}>
                    You saved ₹{promoCodePrice}
                  </Text>
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontSize: 14,
                      color: COLORS.black,
                      fontFamily: 'Segoe UI Bold',
                      marginTop: 5,
                      marginBottom: 10,
                    }}>
                    with this coupon code
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <LottieView
            source={Animations.cong}
            // source={Animations.process_failed}
            style={{
              // height: Dimensions.get('screen').height,
              width: Dimensions.get('screen').width,
              // alignSelf: 'center',
              position: 'absolute',
              bottom: 0,
            }}
            autoPlay={true}
            loop={true}
          />
        </View>
      </Modal>
    );
  };

  const [showDirection, setShowDirection] = useState(false);

  const renderDirectionToReachModal = () => {
    return (
      <Modal
        visible={showDirection}
        animationType="slide"
        transparent={true}
        statusBarTranslucent
        onRequestClose={() => setShowDirection(false)}
        style={{flexGrow: 1}}>
        <View
          style={{
            backgroundColor: '#00000090',
            flexGrow: 1,
            justifyContent: 'flex-end',
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setShowDirection(false)}
            style={{flex: 1}}></TouchableOpacity>
          <View
            style={[
              {
                height: SIZES.height * 0.6,
              },
            ]}>
            <ScrollView
              style={[
                {
                  paddingTop: 10,
                  paddingHorizontal: 10,
                  backgroundColor: '#FFF',
                  borderTopRightRadius: 15,
                  borderTopLeftRadius: 15,
                },
              ]}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Text
                  style={[
                    {
                      marginBottom: 10,
                      marginTop: 5,
                      marginStart: 15,
                      fontSize: 18,
                      fontFamily: 'Segoe UI Bold',
                      textAlign: 'center',
                      // marginVertical: 10,
                      color: COLORS.black,
                    },
                  ]}>
                  Add delivery instructions
                </Text>
                <FontAwesome
                  name="close"
                  size={20}
                  color={COLORS.black}
                  style={{
                    position: 'absolute',
                    top: 5,
                    right: 10,
                  }}
                  onPress={() => {
                    setShowDirection(false);
                  }}
                />
              </View>

              <View
                style={{
                  marginTop: 10,
                }}></View>
              <CustomEditText
                borderRadius={5}
                star={<Text></Text>}
                borderColor={COLORS.grey}
                borderWidth={1}
                backgroundColor={COLORS.grey}
                label={<Text>Instructions</Text>}
                iconPosition="right"
                placeholder={'Enter instructions'}
                keyBoardType="default"
                value={deliveryInstruct}
                onChangeText={value => {
                  setDeliveryInstruct(value);
                }}
                error={''}
              />
              <TouchableOpacity
                onPress={() => {
                  if (deliveryInstruct) {
                    setDeliveryInstructNew(deliveryInstruct);
                    setShowDirection(false);
                  } else {
                    ShowMessage('Please enter instructions');
                  }
                }}
                activeOpacity={0.8}
                style={{
                  backgroundColor: COLORS.primary,
                  // flex: 1,
                  paddingHorizontal: 60,
                  paddingVertical: 5,
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginVertical: 15,
                  borderRadius: 10,
                  flexDirection: 'row',
                  height: 45,
                  marginHorizontal: 10,
                  // width: '50%',
                }}>
                {/* <FontAwesome size={20} color={COLORS.white} name="plus" /> */}
                <Text
                  style={[
                    {
                      color: COLORS.white,
                      fontSize: 18,
                      fontFamily: 'Segoe UI Bold',
                      textAlign: 'center',
                    },
                  ]}>
                  Add
                </Text>
              </TouchableOpacity>
              <Text
                style={[
                  {
                    color: COLORS.grey,
                    fontSize: 12,
                    fontFamily: 'Segoe UI',
                    marginHorizontal: 10,
                    marginTop: 25,
                  },
                ]}>
                Add delivery instructions so that our delivery boy will follow
                the instructions and delivery your food safely.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderCouponModal = () => {
    return (
      <Modal
        visible={showAddCouponModal}
        animationType="slide"
        transparent={true}
        statusBarTranslucent
        onRequestClose={() => closeCouponModal()}
        style={{flexGrow: 1}}>
        <View
          style={{
            backgroundColor: '#00000090',
            flexGrow: 1,
            justifyContent: 'flex-end',
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => closeCouponModal()}
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
                  },
                ]}>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: 18,
                      fontFamily: 'Segoe UI Bold',
                    }}>
                    Promo Code / Coupons
                  </Text>
                </View>
                <TouchableOpacity onPress={() => closeCouponModal()}>
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
              <FlatList data={vendorCouponData} renderItem={renderCouponItem} />
              <View
                style={{
                  paddingBottom: 20,
                }}></View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderTaxInfoModal = () => {
    return (
      <Modal
        visible={showTaxInfoModal}
        animationType="slide"
        transparent={true}
        statusBarTranslucent
        onRequestClose={() => closeTaxInfoModal()}
        style={{flexGrow: 1}}>
        <View
          style={{
            backgroundColor: '#00000090',
            flexGrow: 1,
            justifyContent: 'flex-end',
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => closeTaxInfoModal()}
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
                  },
                ]}>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: 18,
                      fontFamily: 'Segoe UI Bold',
                    }}>
                    Tax Information
                  </Text>
                </View>
                <TouchableOpacity onPress={() => closeTaxInfoModal()}>
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
                {
                  borderTopRightRadius: 0,
                  borderTopLeftRadius: 0,
                },
              ]}>
              <Text
                style={{
                  fontSize: 13,
                  color: COLORS.black,
                  fontFamily: 'Segoe UI',
                  marginHorizontal: 20,
                  marginTop: horizScale(5),
                }}>
                ChefLab has no role to play in taxes and charges being levied
                upon by the govt. and restaurants
              </Text>

              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginHorizontal: 20,
                  marginVertical: 10,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: COLORS.black,
                    fontFamily: 'Segoe UI',
                    marginTop: horizScale(5),
                    marginStart: horizScale(5),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  Tax
                </Text>

                <Text
                  style={{
                    fontSize: 16,
                    color: COLORS.black,

                    fontFamily: 'Segoe UI Bold',
                    marginTop: horizScale(5),
                    marginStart: horizScale(10),
                  }}>
                  {/* ₹ {taxesPrice} */}₹{' '}
                  {(parseInt(itemTotal) * parseInt(taxesPrice)) / 100}
                </Text>
              </View>

              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginHorizontal: 20,
                  marginVertical: 10,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: COLORS.black,
                    fontFamily: 'Segoe UI',
                    marginTop: horizScale(5),
                    marginStart: horizScale(5),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  Platform fee
                </Text>

                <Text
                  style={{
                    fontSize: 16,
                    color: COLORS.black,

                    fontFamily: 'Segoe UI Bold',
                    marginTop: horizScale(5),
                    marginStart: horizScale(10),
                  }}>
                  ₹ {platformFee}
                </Text>
              </View>

              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginHorizontal: 20,
                  marginVertical: 10,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: COLORS.black,
                    fontFamily: 'Segoe UI',
                    marginTop: horizScale(5),
                    marginStart: horizScale(5),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  Total
                </Text>

                <Text
                  style={{
                    fontSize: 16,
                    color: COLORS.black,

                    fontFamily: 'Segoe UI Bold',
                    marginTop: horizScale(5),
                    marginStart: horizScale(10),
                  }}>
                  {/* ₹ {parseInt(taxesPrice) + parseInt(platformFee)} */}₹{' '}
                  {(parseInt(itemTotal) * parseInt(taxesPrice)) / 100 +
                    parseInt(platformFee)}
                </Text>
              </View>
              {/* <Text
                onPress={() => {
                  closeTaxInfoModal();
                }}
                style={{
                  fontSize: 16,
                  color: COLORS.primary,
                  fontFamily: 'Segoe UI Bold',
                  marginBottom: horizScale(10),
                  marginTop: horizScale(5),
                  justifyContent: 'center',
                  alignSelf: 'center',
                  alignItems: 'center',
                }}>
                OK
              </Text> */}

              <TouchableOpacity
                onPress={() => {
                  closeTaxInfoModal();
                }}
                activeOpacity={0.8}
                style={{
                  paddingHorizontal: 35,
                  backgroundColor: COLORS.primary,
                  alignItems: 'center',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  paddingVertical: 10,
                  borderRadius: 10,
                  marginVertical: 10,
                  // width: '90%',
                  elevation: 15,
                  shadowColor: '#ff4000',
                }}>
                <Text
                  style={{
                    fontFamily: 'Segoe UI Bold',
                    fontSize: 18,
                    color: COLORS.white,
                  }}>
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const [vendorNotAvail, setVendorNotAvail] = useState(false);

  const renderVendorNotAvailableModal = () => {
    return (
      <Modal
        visible={vendorNotAvail}
        animationType="slide"
        transparent={true}
        statusBarTranslucent
        onRequestClose={() => setVendorNotAvail(false)}
        style={{flexGrow: 1}}>
        <View
          style={{
            backgroundColor: '#00000090',
            flexGrow: 1,
            justifyContent: 'flex-end',
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setVendorNotAvail(false)}
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
                  },
                ]}>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: 18,
                      fontFamily: 'Segoe UI Bold',
                    }}>
                    Restaurant not available
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setVendorNotAvail(false)}>
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
                {
                  borderTopRightRadius: 0,
                  borderTopLeftRadius: 0,
                },
              ]}>
              <Text
                style={{
                  fontSize: 13,
                  color: COLORS.black,
                  fontFamily: 'Segoe UI',
                  marginHorizontal: 20,

                  marginVertical: 15,
                }}>
                Sorry for the inconvenience, Restaurant is not available to
                continue your orders.
              </Text>

              <TouchableOpacity
                onPress={() => {
                  setVendorNotAvail(false);
                  navigation.goBack();
                }}
                activeOpacity={0.8}
                style={{
                  paddingHorizontal: 35,
                  backgroundColor: COLORS.primary,
                  alignItems: 'center',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  paddingVertical: 10,
                  borderRadius: 10,
                  marginVertical: 10,
                  // width: '90%',
                  elevation: 15,
                  shadowColor: '#ff4000',
                }}>
                <Text
                  style={{
                    fontFamily: 'Segoe UI Bold',
                    fontSize: 18,
                    color: COLORS.white,
                  }}>
                  Go to Home
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  /*** update main cartDetailsData [] after adding item start */
  const [count, setCount] = useState(0);
  const [onRemove, setOnRemove] = useState([]);
  const removeItemFromArray = ix => {
    ShowConsole('index -> ' + ix);
    let c = [...cartDetailsData];
    let d = c.splice(ix, 1);
    setCount(0);
    console.log('user id ccccccccc -> ', JSON.stringify(c));
    // ShowConsole('removeItemFromArray --> ' + JSON.stringify(cartDetailsData));
    setOnRemove(c);
    // setCartDetailsData(c);
    // updateCartOnMinus(c);
    setCount(1);
  };
  const [vendorId, setVendorId] = useState('');
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

  const updateCart = async i => {
    // console.log(
    //   'add to cart rec item-  updateCart updateCart   > ',
    //   JSON.stringify(i),
    // );

    let body = {
      cart_id: cartId,
      user_id: userId,
      vendor_id: parseInt(restVendorId),
      products: [
        {
          product_id: parseInt(i.product_id),
          product_qty: i?.product_qty,
        },
      ],
    };

    if (i.variants) {
      // const itemss = i.options?.find(x => x.variant_qty > 1);
      const itemss = i.variants?.reduce(function (acc, cur) {
        if (parseInt(cur?.qty) > 0) {
          var o = {
            variant_id: cur?.variant_id + '',
            // variant_qty: cur?.qty + '',
            variant_qty: i?.product_qty + '',
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
        if (parseInt(cur?.qty) > 0) {
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

  const updateCartTwo = async (i, varId) => {
    // console.log(
    //   'add to cart rec item-  updateCart updateCart   > ',
    //   JSON.stringify(i),
    // );

    let body = {
      cart_id: cartId,
      user_id: userId,
      vendor_id: parseInt(restVendorId),
      products: [
        {
          product_id: parseInt(i.product_id),
          product_qty: i?.product_qty,
        },
      ],
    };

    if (i.variants) {
      // const itemss = i.options?.find(x => x.variant_qty > 1);
      const itemss = i.variants?.reduce(function (acc, cur) {
        if (parseInt(varId) == cur.variant_id) {
          console.log(
            'temp.variants itemmmmmmmmmmmmmmmmmmm cur=> ' + JSON.stringify(cur),
          );
          var o = {
            variant_id: cur?.variant_id + '',
            variant_qty: '0',
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
        if (parseInt(cur?.qty) > 0) {
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
  const [cartVendorId, setCartVendorId] = useState('');

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
          setItemTotal(response?.data?.response?.cart?.total);
          dispatch(
            updateCartCount(
              // response?.data?.response?.cart?.total_product_in_cart,
              response?.data?.response?.cart?.products_count,
            ),
          );

          setCartId(response?.data?.response?.cart?.id);
        } else {
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {});
  };

  const updateCartOnMinus = async c => {
    await removeItemFromCart();

    const a = c.map((item, index) => {
      let temp = Object.assign({}, item);
      let addon = [];
      let varian = [];
      if (temp.variants) {
        varian = temp.variants?.map(it => {
          ShowConsole('updateCartOnMinus inside===>>>' + JSON.stringify(temp));

          return {
            ...it,
            variant_id: index + 1 + '',
            variant_qty: '1',
          };
        });
      }
      if (temp.addons) {
        addon = temp.addons?.map(it => {
          ShowConsole('updateCartOnMinus inside===>>>' + JSON.stringify(temp));

          return {
            ...it,
            addon_id: it.id + '',
            addon_qty: '1',
          };
        });
      }

      return {
        product_id: item?.product_id,
        product_qty: item?.product_qty,
        variants: varian,
        addons: addon,
      };
    });

    ShowConsole('updateCartOnMinus outside ===>>>' + JSON.stringify(a));

    let body = {
      user_id: userId,
      vendor_id: vendorId + '' || 4 + '',
      products: a,
    };
    ApiCall('post', body, API_END_POINTS.productAddToCart, {
      Authorization: `Bearer ${apiToken}`,
    })
      .then(response => {
        if (response?.data?.status) {
          ShowConsole(
            'updateCartOnMinus ===>>>' + JSON.stringify(response?.data),
          );
          if (c.length <= 1) {
            setShowNoCart(true);
          }
          // ShowMessage(response?.data?.message);
        } else {
          ShowMessage(response?.data?.error);
        }
      })
      .catch(error => {
        console.log('ERROR IN ADD TO CART API =-> ', error);
      })
      .finally(() => {});
  };

  useEffect(() => {
    setCartDetailsData(onRemove);
    // if(onRemove.length == 0){
    //   setShow(true)
    // }
  }, [onRemove]);

  /*** update main cartDetailsData [] after adding item end */

  /**add to cart start */
  const addToCart = (mainCartArr, optionAddonArr) => {
    let t = 0;
    let a = [];
    a = mainCartArr?.map((item, index) => {
      var tp = Object.assign({}, item);
      optionAddonArr?.product_variants?.forEach(_i => {
        var temp = Object.assign({}, _i);
        if (tp?.id == temp?.product_id + '') {
          if (temp?.selected) {
            if (index == itemIndex) {
              tp.product_price = totalMoney + '';
            }
          } else {
            tp.product_price = totalMoney + '';
          }
        }
      });
      return tp;
    });
    // console.log('tp tp tp tp tp -> ', JSON.stringify(a));
    setCartDetailsData(a);
    closeAddModal();
  };

  const [deliveryInstruct, setDeliveryInstruct] = useState('');
  const [deliveryInstructNew, setDeliveryInstructNew] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [houseNumberError, setHouseNumberError] = useState(false);
  const [reachAddress, setReachAddress] = useState('');
  const [reachAddressError, setReachAddressError] = useState(false);
  const [reachAddressContact, setReachAddressContact] = useState('');
  const [reachAddressContactError, setReachAddressContactError] =
    useState(false);

  const [primary, setPrimary] = React.useState(false);

  const RadioButtons = ({options, selectedOption, onSelect}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
        }}>
        {options.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={() => {
                onSelect(item, index);
              }}
              key={item.id}
              style={{
                alignSelf: 'flex-start',
                margin: 10,
              }}>
              <View
                style={[
                  {borderRadius: 10, paddingHorizontal: 5},
                  {
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor:
                      selectedOption && selectedOption?.id === item?.id
                        ? COLORS.primary
                        : COLORS.grey,
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                  },
                ]}>
                <Text
                  style={[
                    style.sizeText,
                    {
                      color:
                        selectedOption && selectedOption?.id === item?.id
                          ? COLORS.primary
                          : COLORS.grey,

                      fontFamily:
                        selectedOption && selectedOption?.id === item?.id
                          ? 'Segoe UI Bold'
                          : 'Segoe UI',
                    },
                  ]}>
                  {item?.name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  // const [selectedOption, setSelectedOption] = React.useState(null);

  // const onSelect = (item, index) => {
  //   if (selectedOption && selectedOption.id === item.id) {
  //     setSelectedOption(null);
  //   } else {
  //     setSelectedOption(item);
  //   }
  // };

  const [selectedOptionAddress, setSelectedOptionAddress] =
    React.useState(null);

  const onSelectAddress = (item, index) => {
    if (confirmObject && confirmObject.id === item.id) {
      setConfirmObject(null);
    } else {
      setConfirmObject(item);
    }
  };

  const onSelectCoupon = item => {
    setConfirmCoupon(item);
  };

  const [selectedOption, setSelectedOption] = React.useState(null);
  const [showRound, setShowRound] = useState(false);
  const [optionPrice, setOptionPrice] = useState(0);

  // const onSelect = (item, index) => {
  //   let t = 0;
  //   console.log('onSelect -=> ', JSON.stringify(item));
  //   if (selectedOption && selectedOption.variant_name === item.variant_name) {
  //     setSelectedOption(null);
  //     // t = parseInt(totalMoney) - parseInt(item.variant_price) + 0.0;
  //     t = parseInt(pData?.product_price) + 0.0;
  //     setShowRound(true);
  //     // setOptionPrice(0);
  //   } else {
  //     setSelectedOption(item);
  //     t =
  //       // parseInt(itemClick?.product_price) +
  //       parseInt(item?.variant_price) + 0.0;
  //     setShowRound(true);
  //     setOptionPrice(parseInt(item?.variant_price));
  //   }
  //   setTotalMoney(t);
  // };

  const onSelect = item => {
    let t = 0;
    if (selectedOption && selectedOption.variant_name === item.variant_name) {
      t = totalMoney;
      setTotalMoney(t);
    } else {
      setSelectedOption(item);
      t = parseInt(item?.variant_price) + 0.0;
      setOptionListCount(1);
      setTotalMoney(t + parseInt(addonPrice));
    }
  };
  const [optionListCount, setOptionListCount] = useState(1);
  const [addonPrice, setAddonPrice] = useState(0);

  const onAddModalPlus = (action, index, arr) => {
    let t = 0;

    let a = arr?.map((item, i) => {
      let temp = Object.assign({}, item);
      if (index == temp.id) {
        if (action == 'more') {
          setOptionListCount(optionListCount + 1);
          t = totalMoney + parseInt(temp?.variant_price);
        }
      }
      return temp;
    });
    setTotalMoney(t);
    setPData({
      ...pData,
      options: a,
    });
  };

  const onAddModalMinus = (action, index, arr) => {
    let t = 0;
    let a = arr?.map((item, i) => {
      let temp = Object.assign({}, item);

      if (index == temp.id + '') {
        if (action == 'less') {
          if (optionListCount == 1) {
            t = totalMoney;
            setTotalMoney(t);
          } else if (optionListCount > 1) {
            // ShowConsole('iremdsmdsa - >?>>> ' + JSON.stringify(arr));
            setOptionListCount(optionListCount - 1);
            // temp.variant_qty = currentQty - 1;
            t = totalMoney - parseInt(temp?.variant_price);
            // setTotalMoney(t + parseInt(addonPrice));
            setTotalMoney(t);
          }
          // else {
          //   if (temp.qty == 1) {
          //     t = parseInt(temp?.variant_price);
          //   }
          // }
        }
      }

      return temp;
    });

    setPData({
      ...pData,
      options: a,
    });
  };

  const RadioButtonsData = [
    {
      name: 'Home',
      id: '1',
    },
    {
      name: 'Work',
      id: '2',
    },
    {
      name: 'Others',
      id: '3',
    },
  ];

  const RadioButtonss = ({options, selectedOption, onSelect}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
        }}>
        {options.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={() => {
                onSelect(item, index);
              }}
              key={item.id}
              style={{
                alignSelf: 'flex-start',
                margin: 10,
              }}>
              <View
                style={[
                  {borderRadius: 10, paddingHorizontal: 5},
                  {
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor:
                      selectedOption && selectedOption?.id === item?.id
                        ? COLORS.primary
                        : COLORS.grey,
                  },
                ]}>
                <Text
                  style={[
                    styles.sizeText,
                    {
                      color:
                        selectedOption && selectedOption?.id === item?.id
                          ? COLORS.primary
                          : COLORS.grey,

                      fontFamily:
                        selectedOption && selectedOption?.id === item?.id
                          ? 'Segoe UI Bold'
                          : 'Segoe UI',
                    },
                  ]}>
                  {item?.name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  const RadioButtonsss = ({options, selectedOption, onSelect}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
        }}>
        {options.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={() => {
                onSelect(item, index);
              }}
              key={item.id}
              style={{
                alignSelf: 'flex-start',
                margin: 10,
              }}>
              <View
                style={[
                  {borderRadius: 10, paddingHorizontal: 5},
                  {
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor:
                      selectedOption && selectedOption?.id === item?.id
                        ? COLORS.primary
                        : COLORS.grey,
                  },
                ]}>
                <Text
                  style={[
                    style.sizeText,
                    {
                      color:
                        selectedOption && selectedOption?.id === item?.id
                          ? COLORS.primary
                          : COLORS.grey,

                      fontFamily:
                        selectedOption && selectedOption?.id === item?.id
                          ? 'Segoe UI Bold'
                          : 'Segoe UI',
                    },
                  ]}>
                  {item?.name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const RadioButtonsAddress = ({item, selectedOption, onSelect}) => {
    console.log('dsadsadsa', JSON.stringify(item));
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.content,
          {
            padding: 10,
          },
        ]}
        onPress={() => {
          //   navigation.navigate('DishInformation', {item});
        }}>
        <View
          style={{
            flexDirection: 'column',
            marginStart: 5,
            flex: 1,
          }}>
          <Text
            style={{
              color: COLORS.primary,
              marginTop: 3,
              fontFamily: 'Segoe UI Bold',
              fontSize: 14,
            }}>
            {item?.address_type == '1'
              ? 'Home'
              : item?.address_type == '2'
              ? 'Work'
              : item.address_type == '3'
              ? 'Others'
              : null}
          </Text>
          <Text
            style={{
              color: COLORS.black,
              fontSize: 16,
              fontFamily: 'Segoe UI Bold',
              marginTop: 5,
            }}>
            {item?.house_no}
            {/* {'\n'} */}
          </Text>

          <Text
            style={{
              color: COLORS.grey,
              marginTop: 5,
              fontFamily: 'Segoe UI',
              fontSize: 14,
            }}>
            Nearest landmark: {item?.reach}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  const [showAddChangeModal, setShowAddChangeModal] = useState(false);
  // const renderItem = ({item, index}) => {
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
  //         //   navigation.navigate('DishInformation', {item});
  //       }}>
  //       <View
  //         style={{
  //           flexDirection: 'column',
  //           marginStart: 5,
  //           flex: 1,
  //         }}>
  //         <Text
  //           style={{
  //             color: COLORS.primary,
  //             marginTop: 3,
  //             fontFamily: 'Segoe UI Bold',
  //             fontSize: 14,
  //           }}>
  //           {item?.address_type == '1'
  //             ? 'Home'
  //             : item?.address_type == '2'
  //             ? 'Work'
  //             : item.address_type == 3
  //             ? 'Others'
  //             : null}
  //         </Text>
  //         <Text
  //           style={{
  //             color: COLORS.black,
  //             fontSize: 16,
  //             fontFamily: 'Segoe UI Bold',
  //             marginTop: 5,
  //           }}>
  //           {item.house_no}
  //           {/* {'\n'} */}
  //         </Text>

  //         <Text
  //           style={{
  //             color: COLORS.grey,
  //             marginTop: 5,
  //             fontFamily: 'Segoe UI',
  //             fontSize: 14,
  //           }}>
  //           Nearest landmark: {item?.reach}
  //         </Text>
  //       </View>
  //     </TouchableOpacity>
  //   );
  // };

  const [confirmObject, setConfirmObject] = useState(null);
  // const [confirmObject, setConfirmObject] = useState({
  //   address_type: '1',
  //   reach: 'near water tank',
  //   house_no: 'meera ki bawdi',
  // });
  const getAsyncAddress = async () => {
    try {
      await AsyncStorage.getItem('userAddress', (err, value) => {
        if (err) {
        } else {
          if (value !== '' && value !== null) {
            setConfirmObject(JSON.parse(value));
            // console.log('userAddress', value);
          } else {
            setConfirmObject(null);
          }
        }
      });
    } catch (error) {}
  };

  const [confirmCoupon, setConfirmCoupon] = useState(null);

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.content,
          {
            padding: 10,
          },
        ]}
        onPress={() => {
          onSelectAddress(item, index);
        }}>
        <View
          style={{
            flexDirection: 'column',
            marginStart: 5,
            flex: 1,
          }}>
          <Text
            style={{
              color: COLORS.primary,
              marginTop: 3,
              fontFamily: 'Segoe UI Bold',
              fontSize: 14,
            }}>
            {item?.address_type == '1'
              ? 'Home'
              : item?.address_type == '2'
              ? 'Work'
              : item.address_type == 3
              ? 'Others'
              : null}
          </Text>
          <Text
            style={{
              color: COLORS.black,
              fontSize: 16,
              fontFamily: 'Segoe UI Bold',
              marginTop: 5,
            }}>
            {item?.house_no}
            {/* {'\n'} */}
          </Text>

          <Text
            style={{
              color: COLORS.grey,
              marginTop: 5,
              fontFamily: 'Segoe UI',
              fontSize: 14,
            }}>
            Nearest landmark: {item?.reach}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.circle}
          onPress={() => {
            onSelectAddress(item, index);
          }} // we set our value state to key
        >
          {confirmObject && confirmObject?.house_no === item.house_no && (
            <View style={styles.checkedCircle} />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const [showAddCouponDetailsModal, setShowAddCouponDetailsModal] =
    useState(false);

  const updateCouponArray = (i, index) => {
    let _a = vendorCouponData?.map(item => {
      let temp = Object.assign({}, item);
      if (i?.id == temp.id) {
        temp.expanded = !temp.expanded;
      } else {
        temp.expanded = false;
      }
      return temp;
    });
    setVendorCouponData(_a);
  };

  const renderCouponItem = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          {
            paddingLeft: 10,
            borderRadius: 10,
            margin: 10,
            elevation: 10,
            paddingRight: 10,
            backgroundColor: '#fff',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            justifyContent: 'space-between',
          },
        ]}
        onPress={() => {
          // setaddLoading(true);
          // onSelectCoupon(item, index);
          // setShowAddCouponModal(false);
          // getVendorPromoDetails(apiToken, item.id + '');
          // setaddLoading(false);
          updateCouponArray(item, index);
        }}>
        <View
          style={{
            marginStart: 5,
          }}>
          <Text
            style={{
              color: COLORS.primary,
              fontFamily: 'Segoe UI Bold',
              fontSize: 18,
            }}>
            {item?.code}
          </Text>
          <Text
            style={{
              color: COLORS.black,
              fontSize: 14,
              fontFamily: 'Segoe UI Bold',
              marginTop: 5,
              marginEnd: 15,
              maxWidth: SIZES.width - 100,
            }}>
            {item?.name}
          </Text>
          {item.expanded ? (
            <>
              {item?.discount_type == '1' ? (
                <Text
                  style={{
                    fontSize: 13,
                    color: COLORS.black,
                    fontFamily: 'Segoe UI',
                    maxWidth: SIZES.width - 100,
                    marginTop: horizScale(5),
                  }}>
                  Discount: {item?.discount}%
                </Text>
              ) : (
                <Text
                  style={{
                    fontSize: 13,
                    color: COLORS.black,
                    fontFamily: 'Segoe UI',
                    maxWidth: SIZES.width - 100,
                    marginTop: horizScale(5),
                  }}>
                  Discount: ₹{item?.discount}
                </Text>
              )}

              <Text
                style={{
                  fontSize: 13,
                  color: COLORS.black,
                  fontFamily: 'Segoe UI',
                  maxWidth: SIZES.width - 100,
                  marginTop: horizScale(5),
                }}>
                Valid upto: {item?.to}
              </Text>

              <Text
                style={{
                  fontSize: 13,
                  color: COLORS.black,
                  fontFamily: 'Segoe UI',
                  maxWidth: SIZES.width - 100,
                  marginTop: horizScale(5),
                }}>
                Min. order value: ₹{item?.minimum_order_amount}
              </Text>

              <Text
                style={{
                  fontSize: 13,
                  color: COLORS.black,
                  fontFamily: 'Segoe UI',
                  maxWidth: SIZES.width - 100,
                  marginTop: horizScale(5),
                }}>
                Max. Discount Amount: ₹{item?.maxim_dis_amount}
              </Text>

              <Text
                style={{
                  fontSize: 13,
                  color: COLORS.black,
                  fontFamily: 'Segoe UI',
                  maxWidth: SIZES.width - 100,

                  marginTop: horizScale(5),
                }}>
                {item?.description}
              </Text>
            </>
          ) : null}
        </View>
        <TouchableOpacity
          // style={styles.circle}
          style={{
            backgroundColor:
              confirmCoupon && confirmCoupon?.name === item.name
                ? COLORS.primary
                : COLORS.white,
            borderWidth: 1,
            borderRadius: 5,
            borderColor: COLORS.primary,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            applyCouponCode(item?.code, item);
          }} // we set our value state to key
        >
          {/* {confirmCoupon && confirmCoupon?.name === item.name && (
            <View style={styles.checkedCircle} />
          )} */}
          <Text
            style={{
              color:
                confirmCoupon && confirmCoupon?.name === item.name
                  ? COLORS.white
                  : COLORS.primary,
              fontSize: 14,
              fontFamily: 'Segoe UI',
              padding: 5,
            }}>
            {confirmCoupon && confirmCoupon?.name === item.name
              ? 'Applied'
              : 'Apply'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };
  const userLatitude = useSelector(state => state?.state?.userLatitude);
  const userLongitude = useSelector(state => state?.state?.userLongitude);

  const addUserAddress = () => {
    if (houseNumber == '') {
      setHouseNumberError(true);
    } else if (reachAddress == '') {
      setReachAddressError(true);
    } else if (reachAddressContact == '') {
      Platform.OS == 'android'
        ? ToastAndroid.showWithGravity(
            'Please enter contact number',
            ToastAndroid.BOTTOM,
            ToastAndroid.SHORT,
          )
        : alert('Please enter contact number');
    } else if (reachAddressContact.length < 10) {
      Platform.OS == 'android'
        ? ToastAndroid.showWithGravity(
            'Please enter valid contact number',
            ToastAndroid.BOTTOM,
            ToastAndroid.SHORT,
          )
        : alert('Please enter valid contact number');
    } else if (selectedOption == null) {
      Platform.OS == 'android'
        ? ToastAndroid.showWithGravity(
            'Please select address type',
            ToastAndroid.BOTTOM,
            ToastAndroid.SHORT,
          )
        : alert('Please select address type');
    } else {
      setaddLoading(true);
      let body = {
        user_id: userId,
        house_no: houseNumber + '',
        reach: reachAddress + '',
        contact_no: reachAddressContact,
        address_type: selectedOption?.id,
        // lat: 24.4637223,
        // long: 74.8866346,
        // lat: 22.72418,
        // long: 75.887257,
        lat: userLatitude,
        long: userLongitude,
        is_primary: primary ? 1 : 0,
      };
      // console.log('daa -> ', JSON.stringify(selectedOption));
      ApiCall('post', body, API_END_POINTS.saveUserDeliveryAddress, {
        Authorization: `Bearer ${apiToken}`,
      })
        .then(response => {
          console.log('daa -> ', JSON.stringify(response?.data));
          if (response?.data?.status) {
            getUserSavedAddress(apiToken, userId);
          }
        })
        .catch(error => {
          console.log('ERROR IN getCuisines API -> ', error);
        })
        .finally(() => {
          setaddLoading(false);
          setShowAddModal(false);
          setReachAddressContact('');
          setHouseNumber('');
          setReachAddress('');
          setSelectedOption(null);
          setPrimary(false);
        });
    }
  };

  const onPlus = i => {
    let product_price = 0;
    // ShowConsole(JSON.stringify(cartDetailsData));
    let a = cartDetailsData.map((item, index) => {
      let temp = Object.assign({}, item);
      let t = temp.product_price;
      if (i == item?.product_id) {
        if (promoCodePrice > 0) {
          setPromoCodePrice(0);
          setConfirmCoupon(null);
        }
        temp.product_qty = parseInt(temp.product_qty) + 1;
        temp?.variants?.map((it, index) => {
          if (it?.added) {
            product_price =
              parseInt(temp.product_qty) * parseInt(it.variant_price);
            console.log(
              'user id product_price -> ',
              JSON.stringify(product_price),
            );
          }
        });

        // if (temp.quantity < 10) {
        // for (let index = 0; index < temp.product_qty; index++) {
        // product_price = parseInt(product_price);
        // + parseInt(product_price);
        // }
        temp.product_price = product_price;
        updateCart(temp);
        // getRestDetailsPageOne(apiToken, userId);

        // }
        console.log('user id -> ', JSON.stringify(temp));
      }
      return temp;
    });

    setCartDetailsData(a);
  };

  // const onPlus = (productId, variantId) => {
  //   let a = cartDetailsData.map((item, index) => {
  //     console.log(
  //       'variant qty productId => ',
  //       productId + ' == ' + item?.product_id + ' == ' + variantId,
  //     );

  //     let temp = Object.assign({}, item);
  //     if (parseInt(productId) == parseInt(item?.product_id)) {
  //       if (promoCodePrice > 0) {
  //         setPromoCodePrice(0);
  //         setConfirmCoupon(null);
  //       }
  //       console.log('variant qty options => ', JSON.stringify(temp));
  //       temp?.variants?.map(opt => {
  //         console.log(
  //           'variant qty matched => ',
  //           opt?.variant_id + ' == ' + variantId,
  //         );
  //         if (parseInt(opt?.variant_id) == parseInt(variantId)) {
  //           opt.qty = parseInt(opt.qty) + 1;
  //           temp.product_qty = opt.qty;
  //           console.log('variant qty => ', opt.qty);
  //         }
  //       });
  //     }
  //     updateCart(temp);
  //     return temp;
  //   });

  //   setCartDetailsData(a);
  // };

  // const onMinus = (productId, variantId) => {
  //   let a = cartDetailsData.map((item, index) => {
  //     console.log(
  //       'variant qty productId => ',
  //       productId + ' == ' + item?.product_id + ' == ' + variantId,
  //     );

  //     let temp = Object.assign({}, item);
  //     if (parseInt(productId) == parseInt(item?.product_id)) {
  //       if (promoCodePrice > 0) {
  //         setPromoCodePrice(0);
  //         setConfirmCoupon(null);
  //       }
  //       console.log('variant qty options => ', JSON.stringify(temp));
  //       temp?.variants?.map((opt, optIndex) => {
  //         console.log(
  //           'variant qty matched => ',
  //           opt?.variant_id + ' == ' + variantId,
  //         );
  //         if (parseInt(opt?.variant_id) == parseInt(variantId)) {
  //           if (parseInt(opt.qty) > 1) {
  //             opt.qty = parseInt(opt.qty) - 1;
  //             temp.product_qty = opt.qty;
  //           } else {
  //             if (temp.variants?.length <= 1) {
  //               temp?.variants?.splice(optIndex, 1);
  //               opt.qty = 0;

  //               updateCartTwo(temp, variantId);
  //               // temp.product_qty = opt.qty;
  //             } else {
  //               opt.qty = 0;
  //               temp.product_qty = opt.qty;
  //               updateCart(temp);
  //               setShow(true);
  //             }
  //           }
  //           console.log('variant qty => ', opt.qty);
  //         }
  //       });
  //     }
  //     return temp;
  //   });

  //   setCartDetailsData(a);
  // };

  const onMinus = i => {
    // console.log('tp tp tp tp tp -> ', JSON.stringify(i));

    let product_price = 0;
    // console.log('on minus');
    let a = cartDetailsData.map((item, index) => {
      let temp = Object.assign({}, item);

      if (i == item?.product_id) {
        if (promoCodePrice > 0) {
          setPromoCodePrice(0);
          setConfirmCoupon(null);
        }
        if (parseInt(temp.product_qty) > 1) {
          temp.product_qty = parseInt(temp.product_qty) - 1;
          product_price =
            parseInt(temp.product_price) - parseInt(temp.product_price);
          // temp.product_price = product_price;
          updateCart(temp);
          // getRestDetailsPageOne(apiToken, userId);
        } else {
          temp.product_qty = 0;
          updateCart(temp);
          setShow(true);
          // getRestDetailsPageOne(apiToken, userId);

          // console.log('on minus index =>', index);
          // ShowConsole('on minus index -> ', cartDetailsData?.indexOf(item));
          removeItemFromArray(index);
        }
      }
      return temp;
    });

    setCartDetailsData(a);
  };

  const addToCartRedux = cartItem => {
    dispatch(addItemToCart(cartItem));
    updateAsyncStorage();
  };

  const removeFromCartRedux = cartItem => {
    dispatch(removeItemCart(cartItem));
    updateAsyncStorage();
  };

  const updateAsyncStorage = () => {
    // AsyncStorage.setItem('cartArray', JSON.stringify(cartItemArr));
  };

  const [itemIndex, setItemIndex] = useState(0);

  return (
    <SafeAreaView style={style.mainContainer}>
      <CustomLoader loading={showCustomLoading} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: COLORS.white,
          elevation: 10,
        }}>
        <ToolbarWithIcon showShare={false} />
        <View>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Segoe UI Bold',
              color: COLORS.black,
              // flexGrow: 1,
              maxWidth: Dimensions.get('window').width / 2 + 15,
            }}>
            Your Cart
            {/* {show ? 'Chef Ankur Bajaj' : 'Your Cart'} */}
          </Text>
          {/* {cartItemCount[0]?.restaurantName ? (
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Segoe UI',
                color: COLORS.primary,
                // flexGrow: 1,
                maxWidth: Dimensions.get('window').width / 2 + 15,
              }}
              numberOfLines={1}>
              {cartItemCount[0]?.restaurantName || ''}
            {show ? 'Chef Ankur Bajaj' : 'Your Cart'} 
            </Text>
          ) : null} */}

          {cartDetailsData?.length > 0 ? (
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Segoe UI',
                color: COLORS.primary,
                // flexGrow: 1,
                maxWidth: Dimensions.get('window').width / 2 + 15,
              }}
              numberOfLines={1}>
              {restName}
            </Text>
          ) : null}
        </View>
      </View>
      <ScrollView
        // style={style.mainContainer}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}>
        {/* <Loader loading={addloading} /> */}
        {/* <Modal
          transparent={true}
          animationType={'none'}
          visible={showAddModal}
          onRequestClose={() => {
            console.log('close modal');
            setShowAddModal(false);
          }}>
          <View style={styles.modalBackground}>
            <View style={styles.activityIndicatorWrapper}>
              <Text style={[styles.addressText, {marginVertical: 10}]}>
                Add delivery address
              </Text>
              <View
                style={{
                  marginTop: 10,
                }}></View>
              <CustomEditText
                borderRadius={5}
                star={<Text style={{color: COLORS.red}}>*</Text>}
                borderColor={COLORS.grey}
                borderWidth={1}
                backgroundColor={COLORS.grey}
                label={STRINGS.full_address}
                iconPosition="right"
                placeholder={STRINGS.full_address_hint}
                keyBoardType="default"
                value={houseNumber}
                onChangeText={value => {
                  setHouseNumber(value);
                  setHouseNumberError(false);
                }}
                error={
                  houseNumberError ? <Text>{STRINGS.fieldRequired}</Text> : ''
                }
              />
              <CustomEditText
                borderRadius={5}
                star={<Text style={{color: COLORS.red}}>*</Text>}
                borderColor={COLORS.grey}
                borderWidth={1}
                backgroundColor={COLORS.grey}
                label={'Nearest Landmark'}
                iconPosition="right"
                placeholder={'Enter nearest landmark '}
                value={reachAddress}
                keyBoardType="default"
                onChangeText={value => {
                  setReachAddress(value);
                  setReachAddressError(false);
                }}
                error={
                  reachAddressError ? <Text>{STRINGS.fieldRequired}</Text> : ''
                }
              />
              <CustomEditText
                borderRadius={5}
                star={<Text style={{color: COLORS.red}}>*</Text>}
                borderColor={COLORS.grey}
                borderWidth={1}
                backgroundColor={COLORS.grey}
                label={STRINGS.contact}
                iconPosition="right"
                placeholder={STRINGS.contact_hint}
                value={reachAddressContact}
                keyBoardType="number-pad"
                maxLength={10}
                onChangeText={value => {
                  setReachAddressContact(value);
                  setReachAddressContactError(false);
                }}
                error={
                  reachAddressContactError ? (
                    <Text>{STRINGS.fieldRequired}</Text>
                  ) : (
                    ''
                  )
                }
              />
              <Text
                style={[
                  {
                    fontSize: 16,
                    fontFamily: 'Segoe UI Bold',
                    marginStart: 7,
                    marginTop: 10,
                    color: COLORS.black,
                  },
                ]}>
                Select address type
              </Text>
             

              <RadioButtonsss
                onSelect={onSelect}
                selectedOption={selectedOption}
                options={RadioButtonsData}
              />

              <TouchableOpacity
                onPress={() => {
                  addUserAddress();
                }}
                activeOpacity={0.8}
                style={{
                  // width: 100,
                  // height: 35,
                  backgroundColor: COLORS.primary,
                  paddingHorizontal: 25,
                  paddingVertical: 10,
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginVertical: 15,
                  borderRadius: 10,
                  flexDirection: 'row',
                }}>
                <FontAwesome size={20} color={COLORS.white} name="plus" />
                <Text
                  style={[
                    styles.addressText,
                    {marginHorizontal: 15, color: COLORS.white},
                  ]}>
                  Add
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal> */}

        <Modal
          transparent={true}
          animationType={'none'}
          visible={showAddModal}
          onRequestClose={() => {
            console.log('close modal');
            setHouseNumber('');
            setReachAddress('');
            setShowAddModal(false);
            setReachAddressContact('');
            setSelectedOption(null);
          }}
          style={{flexGrow: 1}}>
          <View
            style={{
              backgroundColor: '#00000090',
              flexGrow: 1,
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                setSelectedOption(null);
                setHouseNumber('');
                setShowAddModal(false);
                setReachAddress('');
                setReachAddressContact('');
              }}
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'center',
                // backgroundColor: COLORS.cartCountBgColor,
              }}></TouchableOpacity>
            <View
              style={{
                maxHeight: SIZES.height * 0.7,
              }}>
              <ScrollView
                style={[
                  {
                    paddingTop: 10,
                    paddingHorizontal: 10,
                    backgroundColor: '#FFF',
                    borderTopRightRadius: 15,
                    borderTopLeftRadius: 15,
                  },
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={[
                      {
                        marginBottom: 10,
                        marginTop: 5,
                        marginStart: 15,
                        fontSize: 20,
                        fontFamily: 'Segoe UI Bold',
                        textAlign: 'center',
                        // marginVertical: 10,
                        color: COLORS.black,
                      },
                    ]}>
                    {!showAddModal ? 'Update address' : 'Add delivery address'}
                  </Text>
                  <FontAwesome
                    name="close"
                    size={20}
                    color={COLORS.black}
                    style={{
                      position: 'absolute',
                      top: 5,
                      right: 10,
                    }}
                    onPress={() => {
                      setSelectedOption(null);
                      setShowAddModal(false);
                      setHouseNumber('');
                      setReachAddress('');
                      setReachAddressContact('');
                    }}
                  />
                </View>

                <View
                  style={{
                    marginTop: 10,
                  }}></View>
                <CustomEditText
                  borderRadius={5}
                  star={<Text style={{color: COLORS.red}}>*</Text>}
                  borderColor={COLORS.grey}
                  borderWidth={1}
                  backgroundColor={COLORS.grey}
                  label={STRINGS.full_address}
                  iconPosition="right"
                  placeholder={STRINGS.full_address_hint}
                  keyBoardType="default"
                  value={houseNumber}
                  onChangeText={value => {
                    setHouseNumber(value);
                    setHouseNumberError(false);
                  }}
                  error={
                    houseNumberError ? <Text>{STRINGS.fieldRequired}</Text> : ''
                  }
                />
                <CustomEditText
                  borderRadius={5}
                  star={<Text style={{color: COLORS.red}}>*</Text>}
                  borderColor={COLORS.grey}
                  borderWidth={1}
                  backgroundColor={COLORS.grey}
                  label={'Nearest Landmark'}
                  iconPosition="right"
                  placeholder={'Enter nearest landmark '}
                  value={reachAddress}
                  keyBoardType="default"
                  onChangeText={value => {
                    setReachAddress(value);
                    setReachAddressError(false);
                  }}
                  error={
                    reachAddressError ? (
                      <Text>{STRINGS.fieldRequired}</Text>
                    ) : (
                      ''
                    )
                  }
                />
                <CustomEditText
                  borderRadius={5}
                  star={<Text style={{color: COLORS.red}}>*</Text>}
                  borderColor={COLORS.grey}
                  borderWidth={1}
                  backgroundColor={COLORS.grey}
                  label={STRINGS.contact}
                  iconPosition="right"
                  placeholder={STRINGS.contact_hint}
                  value={reachAddressContact}
                  keyBoardType="number-pad"
                  maxLength={10}
                  onChangeText={value => {
                    setReachAddressContact(value);
                    setReachAddressContactError(false);
                  }}
                  error={
                    reachAddressContactError ? (
                      <Text>{STRINGS.fieldRequired}</Text>
                    ) : (
                      ''
                    )
                  }
                />
                <Text
                  style={[
                    {
                      fontSize: 16,
                      fontFamily: 'Segoe UI Bold',
                      marginStart: 7,
                      marginTop: 10,
                      color: COLORS.black,
                    },
                  ]}>
                  Select address type
                </Text>
                <RadioButtons
                  onSelect={onSelect}
                  selectedOption={selectedOption}
                  options={RadioButtonsData}
                />

                <CheckBox
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                  }}
                  onClick={() => {
                    setPrimary(!primary);
                  }}
                  isChecked={primary}
                  checkBoxColor={COLORS.primary}
                  checkedCheckBoxColor={COLORS.primary}
                  uncheckedCheckBoxColor={COLORS.primary}
                  rightTextStyle={{
                    fontSize: 16,
                    color: COLORS.black,
                  }}
                  rightText={'Set as primary'}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setShowAddModal(false);
                      // navigation.navigate('Maps');
                      navigation.navigate('Maps', {
                        lat: userLatitude,
                        long: userLongitude,
                      });
                    }}
                    style={{
                      alignSelf: 'center',
                      alignItems: 'center',
                      paddingVertical: 10,
                      paddingHorizontal: 15,
                      borderRadius: 10,
                      margin: 10,
                      borderWidth: 1,
                      borderColor: COLORS.primary,
                      // backgroundColor: COLORS.primary,
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: COLORS.black,
                        fontFamily: 'Segoe UI Bold',
                      }}>
                      Go to map
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      // if (showAddModal) {
                      addUserAddress();
                      // } else if (showEditModal) {
                      // }
                    }}
                    style={{
                      alignSelf: 'center',
                      alignItems: 'center',
                      paddingVertical: 10,
                      paddingHorizontal: 30,
                      borderRadius: 10,
                      margin: 10,
                      backgroundColor: COLORS.primary,
                    }}>
                    <Text
                      style={{
                        fontSize: 18,
                        color: COLORS.white,
                        fontFamily: 'Segoe UI Bold',
                      }}>
                      Add
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    padding: 5,
                    backgroundColor: COLORS.white,
                  }}></View>
              </ScrollView>
            </View>
          </View>
        </Modal>
        <Modal
          transparent={true}
          animationType={'none'}
          visible={showAddChangeModal}
          onRequestClose={() => {
            console.log('close modal');
            setShowAddChangeModal(false);
          }}
          style={{flexGrow: 1}}>
          <View
            style={{
              backgroundColor: '#00000090',
              flexGrow: 1,
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setShowAddChangeModal(false)}
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'center',
                // backgroundColor: COLORS.cartCountBgColor,
              }}></TouchableOpacity>
            <View
              style={{
                maxHeight: SIZES.height * 0.7,
              }}>
              <View
                style={{
                  backgroundColor: COLORS.lightGray,
                  borderTopRightRadius: 15,
                  borderTopLeftRadius: 15,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 15,
                  }}>
                  <Text
                    style={[
                      style.addressText,
                      {
                        marginBottom: 10,
                        marginTop: 5,
                        marginStart: 15,

                        fontSize: 20,
                        fontFamily: 'Segoe UI Bold',
                        textAlign: 'center',
                        // marginVertical: 10,
                        color: COLORS.black,
                      },
                    ]}>
                    Select delivery address
                  </Text>
                  <FontAwesome
                    name="close"
                    size={20}
                    color={COLORS.black}
                    style={{
                      marginEnd: 30,
                    }}
                    onPress={() => {
                      setShowAddChangeModal(false);
                    }}
                  />
                </View>
                {addressLoading ? (
                  <ActivityIndicator
                    size={'large'}
                    color={COLORS.primary}
                    style={{
                      margin: 40,
                    }}
                  />
                ) : (
                  <FlatList
                    extraData={data}
                    data={data}
                    style={{
                      marginBottom: 65,
                    }}
                    // data={[1, 2, 2, 4, 5, 6, 7, 8, 9, 10]}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => {
                      return (
                        <Text
                          style={[
                            style.addressText,
                            {
                              marginBottom: 10,
                              marginTop: 5,
                              marginStart: 15,
                              fontSize: 14,
                              fontFamily: 'Segoe UI',

                              fontSize: 20,
                              fontFamily: 'Segoe UI Bold',
                              textAlign: 'center',
                              // marginVertical: 10,
                              color: COLORS.black,
                            },
                          ]}>
                          No delivery address found
                        </Text>
                      );
                    }}
                  />
                )}
                {/* <ScrollView
                style={{
                  flex: 1,
                }}>
                <RadioButtonsAddress
                  options={data}
                  onSelect={onSelectAddress}
                  selectedOption={selectedOption}
                />
              </ScrollView> */}
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                paddingVertical: 10,
                backgroundColor: COLORS.lightGray,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setShowAddChangeModal(false);
                  // setShowAddModal(true);
                  navigation.navigate('Maps', {
                    lat: userLatitude,
                    long: userLongitude,
                  });
                  // navigation.navigate('Maps');
                  // setShowAddChangeModal(false);
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
                  height: 45,
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
                  + Add address
                </Text>
              </TouchableOpacity>
              {data?.length > 0 ? (
                <TouchableOpacity
                  onPress={() => {
                    if (confirmObject != null) {
                      setShowAddChangeModal(false);
                      getRestDetailsPage(apiToken, userId);
                    } else {
                      Platform.OS == 'android'
                        ? ToastAndroid.showWithGravity(
                            'Please select delivery address',
                            ToastAndroid.SHORT,
                            ToastAndroid.BOTTOM,
                          )
                        : alert('Please select delivery address');
                    }
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
                    height: 45,
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
                    Confirm
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </Modal>
        {/* 
        <Modal
          transparent={true}
          animationType={'none'}
          visible={vendorCouponData.length > 0 && showAddCouponModal}
          onRequestClose={() => {
            console.log('close modal');
            setShowAddCouponModal(false);
          }}
          style={{
            flexGrow: 1,
          }}>
          <View style={styles.modalBackground}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                setShowAddCouponModal(false);
              }}
              style={{flex: 1}}></TouchableOpacity>
            <View
              style={[
                styles.activityIndicatorWrapper,
                {
                  height: 300,
                  maxHeight: Dimensions.get('screen').height * 0.6,
                },
              ]}>
              <Text style={[styles.addressText, {marginVertical: 10}]}>
                Promo Code / Coupons
              </Text>
              <FlatList data={vendorCouponData} renderItem={renderCouponItem} />
            </View>
          </View>
        </Modal> */}

        <Modal
          transparent={true}
          animationType={'none'}
          visible={showAddCouponDetailsModal}
          onRequestClose={() => {
            console.log('close modal');
            setShowAddCouponDetailsModal(false);
          }}>
          <View style={styles.modalBackground}>
            <View
              style={[
                styles.activityIndicatorWrapper,
                {
                  height: Dimensions.get('screen').height * 0.3,
                },
              ]}>
              <Text style={[styles.addressText, {marginVertical: 10}]}>
                Coupon details
              </Text>

              <Text
                style={{
                  fontSize: 20,
                  color: COLORS.primary,
                  fontFamily: 'Segoe UI Bold',
                  marginTop: horizScale(5),
                  marginStart: 20,
                }}>
                {couponDetails?.code}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: COLORS.black,
                  fontFamily: 'Segoe UI',
                  marginTop: horizScale(5),
                  marginStart: 20,
                }}>
                {couponDetails?.name}
              </Text>

              <Text
                style={{
                  fontSize: 13,
                  color: COLORS.black,
                  fontFamily: 'Segoe UI',
                  marginTop: horizScale(5),
                  marginStart: 20,
                }}>
                Min. order value: ₹ {couponDetails?.minimum_order_amount}
              </Text>

              <Text
                style={{
                  fontSize: 13,
                  color: COLORS.black,
                  fontFamily: 'Segoe UI',
                  marginTop: horizScale(5),
                  marginStart: 20,
                }}>
                {couponDetails?.description}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  applyCouponCode(couponDetails?.code);
                }}
                activeOpacity={0.8}
                style={{
                  // width: 100,
                  // height: 35,
                  backgroundColor: COLORS.primary,
                  paddingHorizontal: 25,
                  paddingVertical: 5,
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginVertical: 10,
                  borderRadius: 10,
                  flexDirection: 'row',
                }}>
                {/* <FontAwesome size={20} color={COLORS.white} name="plus" /> */}
                <Text
                  style={[
                    styles.addressText,
                    {marginHorizontal: 15, color: COLORS.white},
                  ]}>
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {loading ? (
          <CartSkeleton />
        ) : cartDetailsData?.length > 0 ? (
          <View>
            <Text
              style={{
                fontSize: horizScale(20),
                fontFamily: 'Segoe UI Bold',
                color: COLORS.black,

                marginTop: horizScale(15),
                marginStart: horizScale(15),
              }}
              numberOfLines={1}>
              Your Order
            </Text>

            <FlatList
              style={
                {
                  // paddingBottom: 5,
                }
              }
              data={cartDetailsData}
              extraData={cartDetailsData}
              renderItem={({item, index}) => {
                // console.log('item in cart > ', JSON.stringify(item));
                return (
                  <CartCardView
                    item={item}
                    onCustomizeClick={() => {
                      // setPData(item);
                      // setTotalMoney(item?.product_price);
                      // setItemIndex(index);
                      // if (item?.options) {
                      //   onSelect(item.options[0], 0);
                      //   closeAddModal();
                      // }
                      // console.log('ppppppppppppp ', JSON.stringify(item));
                    }}
                    onMinus={i => {
                      // removeFromCartRedux(item);
                      setPromoCodePrice(0);
                      // setConfirmCoupon(null);
                      onMinus(i);
                    }}
                    onPlus={i => {
                      // addToCartRedux(item);
                      setPromoCodePrice(0);
                      // setConfirmCoupon(null);
                      onPlus(i);
                    }}
                  />
                );
              }}
            />
            <TouchableOpacity
              onPress={() => {
                // console.log
                navigation.navigate('RestaurantDetails', {
                  bookTable: false,
                  item: mainData?.vendor,
                });
              }}
              style={{
                backgroundColor: COLORS.white,
                elevation: 10,
                padding: 10,
                borderRadius: 10,
                marginHorizontal: 10,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#0638ff',
                  fontFamily: 'Segoe UI',
                  marginStart: horizScale(10),
                }}>
                + Add more items
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setWriteMessage(!writeMessage);
              }}
              activeOpacity={0.8}
              style={{
                backgroundColor: COLORS.white,
                elevation: 10,
                // padding: 10,
                borderRadius: 10,
                marginTop: 10,
                marginHorizontal: 10,
              }}>
              <TextInput
                style={{
                  fontSize: 16,
                  color: COLORS.black,
                  fontFamily: 'Segoe UI',
                  marginStart: horizScale(10),
                }}
                placeholder="Any message for Chef ?"
                placeholderTextColor={COLORS.grey}
              />
              {/* <TouchableOpacity
                  onPress={() => {
                    setWriteMessage(!writeMessage);
                  }}
                  style={{
                    marginEnd: 10,
                  }}></TouchableOpacity> */}

              {/* {writeMessage ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5,
                  }}>
                  <TextInput
                    style={{
                      fontSize: horizScale(17),
                      fontFamily: 'Segoe UI',
                      // backgroundColor: '#064',
                      flex: 1,
                      // marginEnd: 10,
                    }}
                    onChangeText={v => {
                      if (message.length < 50) {
                        setMessage(v);
                      }
                    }}
                    multiline={true}
                    placeholder={'Type your message...'}
                  />
                </View>
              ) : null} */}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setSendCutlery(!sendCutlery);
              }}
              activeOpacity={0.8}
              style={{
                backgroundColor: COLORS.white,
                elevation: 10,
                padding: 10,
                borderRadius: 10,
                marginTop: 10,
                marginHorizontal: 10,
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.darkGray,
                  fontFamily: 'Segoe UI',
                  marginStart: horizScale(10),
                }}>
                Send Cutlery
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setSendCutlery(!sendCutlery);
                }}
                style={{
                  marginEnd: 10,
                }}>
                <Image
                  source={sendCutlery ? icons.checked : icons.unchecked}
                  style={{
                    width: 15,
                    height: 15,
                    resizeMode: 'center',
                  }}
                />
              </TouchableOpacity>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                getVendorPromo(apiToken, restVendorId);
                closeCouponModal();
              }}
              style={{
                backgroundColor: COLORS.white,
                elevation: 10,
                padding: 10,
                borderRadius: 10,
                marginTop: 10,
                marginHorizontal: 10,
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  alignSelf: 'flex-start',
                  flexDirection: 'row',
                }}>
                <Image
                  source={icons.discount}
                  style={{
                    width: 20,
                    height: 20,
                    resizeMode: 'center',
                    marginStart: horizScale(0),
                  }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    color: '#0638ff',
                    fontFamily: 'Segoe UI',
                    marginStart: horizScale(10),
                    textDecorationLine: 'underline',
                  }}>
                  {confirmCoupon
                    ? confirmCoupon?.code + ' code applied'
                    : 'Select Promo Code'}
                </Text>
              </View>

              <Image
                source={icons.back_arrow}
                style={{
                  width: 15,
                  height: 15,
                  marginTop: vertScale(2),
                  marginEnd: 10,
                  resizeMode: 'center',
                  transform: [
                    {
                      rotate: '180deg',
                    },
                  ],
                }}
              />
            </TouchableOpacity>

            <View
              style={{
                backgroundColor: COLORS.white,
                elevation: 10,
                padding: 10,
                borderRadius: 10,
                marginTop: 10,
                marginHorizontal: 10,
                justifyContent: 'space-between',
                // flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontSize: 15,
                  color: COLORS.grey,
                  fontFamily: 'Segoe UI',
                  marginBottom: horizScale(5),
                  marginStart: horizScale(5),
                  // textDecorationLine: 'underline',
                }}>
                Delivery Instructions
              </Text>

              <FlatList
                data={deliveryInstructions}
                style={{
                  paddingVertical: 5,
                }}
                showsHorizontalScrollIndicator={false}
                horizontal
                renderItem={({item, index}) => {
                  return (
                    <DeliveryInstruction
                      item={item}
                      onClick={() => {
                        // if (index == 1 || index == 4) {
                        //   onDeliveryOptSelect(item, index);
                        // } else {
                        onDeliveryInstructionClick(index);
                        // }
                      }}
                    />
                  );
                }}
              />

              {deliveryInstructNew ? (
                <Text
                  style={{
                    fontSize: 15,
                    color: COLORS.grey,
                    fontFamily: 'Segoe UI',
                    marginTop: horizScale(5),
                    marginStart: horizScale(5),
                    // textDecorationLine: 'underline',
                  }}>
                  {deliveryInstructNew}
                </Text>
              ) : null}
            </View>

            <TouchableOpacity
              onPress={() => {}}
              activeOpacity={0.8}
              style={{
                backgroundColor: COLORS.white,
                elevation: 10,
                padding: 10,
                borderRadius: 10,
                marginTop: 10,
                marginHorizontal: 10,
              }}>
              <Text
                style={{
                  fontSize: 15,
                  color: COLORS.grey,
                  fontFamily: 'Segoe UI',
                  marginBottom: horizScale(5),
                  marginStart: horizScale(5),
                  // textDecorationLine: 'underline',
                }}>
                Tips :
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: COLORS.black,
                  fontFamily: 'Segoe UI Bold',
                  marginStart: horizScale(8),
                  // alignSelf: 'center',
                }}>
                We don't accept tips, we are truly yours 😍
              </Text>
            </TouchableOpacity>

            {mainData?.wallet_amount > 0 ? (
              <View
                style={{
                  backgroundColor: COLORS.white,
                  elevation: 10,
                  padding: 10,
                  borderRadius: 10,
                  marginTop: 10,
                  marginHorizontal: 10,
                  justifyContent: 'space-between',
                  // flexDirection: 'row',
                }}>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: COLORS.darkGray,
                      fontFamily: 'Segoe UI Bold',
                      marginStart: horizScale(10),
                    }}>
                    Wallet Amount
                  </Text>
                  <View
                    style={{
                      alignSelf: 'flex-end',
                      flexDirection: 'row',
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        color: COLORS.darkGray,
                        fontFamily: 'Segoe UI Bold',
                        marginEnd: horizScale(10),
                        marginStart: horizScale(10),
                      }}>
                      {/* ₹ {mainData?.wallet_amount} */}
                      {/* {useWalletAmount
                        ? parseInt(mainData?.wallet_amount) >=
                          parseInt(totalPayablePrice)
                        : (
                          mainData?.wallet_amount,
                          Math.round(mainData?.wallet_amount),
                          parseInt(mainData?.wallet_amount) -
                            parseInt(totalPayablePrice))} */}
                      ₹{' '}
                      {useWalletAmount
                        ? parseInt(mainData?.wallet_amount) >=
                          parseInt(totalAmountPrice)
                          ? parseInt(mainData?.wallet_amount) -
                            parseInt(totalAmountPrice)
                          : parseInt(mainData?.wallet_amount) <
                              parseInt(totalAmountPrice) &&
                            parseInt(mainData.wallet_amount) > 0
                          ? 0
                          : null
                        : mainData?.wallet_amount}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setUseWalletAmount(!useWalletAmount);
                        setWalletAmountPrice(useWalletAmount ? 100 : 0);
                      }}
                      style={{
                        marginEnd: 10,
                      }}>
                      <Image
                        source={
                          useWalletAmount ? icons.checked : icons.unchecked
                        }
                        style={{
                          width: 15,
                          height: 15,
                          resizeMode: 'center',
                          // tintColor: useWalletAmount
                          //   ? COLORS.primary
                          //   : COLORS.transparent,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <Text
                  style={{
                    fontSize: 12,
                    color: COLORS.darkGray,
                    marginTop: horizScale(10),
                    marginStart: horizScale(10),
                    fontFamily: 'Segoe UI',
                  }}>
                  If you want to use your wallet amount in this order, please
                  tick the box.
                </Text>
              </View>
            ) : null}
            <View
              style={{
                backgroundColor: COLORS.white,
                elevation: 10,
                padding: 10,
                borderRadius: 10,
                marginTop: 10,
                marginHorizontal: 10,
                justifyContent: 'space-between',
                // flexDirection: 'row',
              }}>
              <View
                style={{
                  justifyContent: 'space-between',
                  marginVertical: 2,
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: COLORS.darkGray,
                    fontFamily: 'Segoe UI',
                    marginTop: horizScale(5),
                    marginStart: horizScale(5),
                  }}>
                  Item Total
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: COLORS.darkGray,
                    fontFamily: 'Segoe UI',
                    marginTop: horizScale(5),
                    marginStart: horizScale(10),
                  }}>
                  ₹ {itemTotal}
                </Text>
              </View>

              {promoCodePrice > 0 ? (
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    marginVertical: 2,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: COLORS.darkGray,
                        fontFamily: 'Segoe UI',
                        marginTop: horizScale(5),
                        marginStart: horizScale(5),
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      Promo Code Applied
                    </Text>
                    <Text
                      onPress={() => {
                        let t = totalPayablePrice + promoCodePrice;
                        setTotalPayablePrice(t);
                        setPromoCodePrice(0);
                        setConfirmCoupon(null);
                      }}
                      style={{
                        fontSize: 10,
                        color: COLORS.red,
                        fontFamily: 'Segoe UI',
                        marginTop: horizScale(5),
                        marginStart: horizScale(5),
                      }}>
                      Remove
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      color: COLORS.darkGray,
                      fontFamily: 'Segoe UI',
                      marginTop: horizScale(5),
                      marginStart: horizScale(10),
                    }}>
                    - ₹ {promoCodePrice}
                  </Text>
                </View>
              ) : null}

              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginVertical: 2,
                }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    closeTaxInfoModal();
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: COLORS.darkGray,
                      fontFamily: 'Segoe UI',
                      marginTop: horizScale(5),
                      marginStart: horizScale(5),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    Taxes and Fee
                  </Text>
                  <Image
                    source={{
                      uri: 'https://img.icons8.com/ios/2x/info.png',
                    }}
                    style={{
                      width: 15,
                      height: 15,
                      resizeMode: 'center',
                      marginStart: 5,
                      marginTop: 5,
                      tintColor: COLORS.darkGray,
                    }}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 14,
                    color: COLORS.darkGray,
                    fontFamily: 'Segoe UI',
                    marginTop: horizScale(5),
                    marginStart: horizScale(10),
                  }}>
                  ₹{' '}
                  {(parseInt(itemTotal) * parseInt(taxesPrice)) / 100 +
                    parseInt(platformFee)}
                  {/* ₹ {taxesPrice} */}
                </Text>
              </View>

              <View
                style={{
                  justifyContent: 'space-between',
                  marginVertical: 2,
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: COLORS.darkGray,
                    fontFamily: 'Segoe UI',
                    marginTop: horizScale(5),
                    marginStart: horizScale(5),
                  }}>
                  Delivery charges
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: COLORS.darkGray,
                    fontFamily: 'Segoe UI',
                    marginTop: horizScale(5),
                    marginStart: horizScale(10),
                  }}>
                  ₹ {deliveryChargePrice}
                </Text>
              </View>

              <View
                style={{
                  justifyContent: 'space-between',
                  marginVertical: 2,
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#0638ff',
                    fontFamily: 'Segoe UI',
                    marginTop: horizScale(5),
                    marginStart: horizScale(5),
                  }}>
                  Total Amount
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#0638ff',

                    fontFamily: 'Segoe UI',
                    marginTop: horizScale(5),
                    marginStart: horizScale(10),
                  }}>
                  {/* ₹ {Math.round(totalAmountPrice)} */}₹{' '}
                  {/* {Math.round(totalAmountPrice)} */}
                  {parseInt(itemTotal) +
                    (parseInt(itemTotal) * parseInt(taxesPrice)) / 100 +
                    parseInt(platformFee) -
                    parseInt(promoCodePrice) +
                    parseInt(deliveryChargePrice)}
                </Text>
              </View>

              {useWalletAmount ? (
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    marginVertical: 2,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: COLORS.darkGray,
                        fontFamily: 'Segoe UI',
                        marginTop: horizScale(5),
                        marginStart: horizScale(5),
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      Wallet amount used
                    </Text>
                    <Text
                      onPress={() => {
                        setUseWalletAmount(!useWalletAmount);
                        if (useWalletAmount) {
                          setWalletAmountPrice(0);
                        } else {
                          setWalletAmountPrice(100);
                        }
                      }}
                      style={{
                        fontSize: 10,
                        color: COLORS.red,
                        fontFamily: 'Segoe UI',
                        marginTop: horizScale(5),
                        marginStart: horizScale(5),
                      }}>
                      Remove
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      color: COLORS.darkGray,
                      fontFamily: 'Segoe UI',
                      marginTop: horizScale(5),
                      marginStart: horizScale(10),
                    }}>
                    {/* - ₹ {walletAmountPrice} */}- ₹{' '}
                    {/* {Math.round(totalAmountPrice)} */}
                    {useWalletAmount
                      ? parseInt(mainData?.wallet_amount) >
                        parseInt(totalAmountPrice)
                        ? Math.round(totalAmountPrice)
                        : parseInt(mainData?.wallet_amount) <
                            parseInt(totalAmountPrice) &&
                          parseInt(mainData?.wallet_amount) > 0
                        ? parseInt(mainData?.wallet_amount)
                        : null
                      : null}
                  </Text>
                </View>
              ) : null}
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <View style={styles.cutter}></View>
                <View style={styles.cutter}></View>
                <View style={styles.cutter}></View>
                <View style={styles.cutter}></View>
                <View style={styles.cutter}></View>
                <View style={styles.cutter}></View>
                <View style={styles.cutter}></View>
                <View style={styles.cutter}></View>
                <View style={styles.cutter}></View>
                <View style={styles.cutter}></View>
                <View style={styles.cutter}></View>
                <View style={styles.cutter}></View>
                <View style={styles.cutter}></View>
                <View style={styles.cutter}></View>
                <View style={styles.cutter}></View>
                <View style={styles.cutter}></View>
                <View style={styles.cutter}></View>
                <View style={styles.cutter}></View>
                <View style={styles.cutter}></View>
                <View style={styles.cutter}></View>
                <View style={styles.cutter}></View>
                <View style={styles.cutter}></View>
              </View>
              <View
                style={{
                  justifyContent: 'space-between',
                  marginVertical: 2,
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    color: COLORS.darkGray,
                    fontFamily: 'Segoe UI Bold',
                    marginTop: horizScale(5),
                    marginStart: horizScale(5),
                  }}>
                  To Pay
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    color: COLORS.darkGray,
                    fontFamily: 'Segoe UI Bold',
                    marginTop: horizScale(5),
                    marginStart: horizScale(10),
                  }}>
                  ₹{' '}
                  {useWalletAmount
                    ? parseInt(mainData?.wallet_amount) == 0
                      ? Math.round(totalPayablePrice)
                      : parseInt(mainData?.wallet_amount) >=
                        parseInt(totalPayablePrice)
                      ? 0
                      : parseInt(mainData?.wallet_amount) <
                          parseInt(totalPayablePrice) &&
                        parseInt(mainData?.wallet_amount) > 0
                      ? Math.round(totalPayablePrice) -
                        parseInt(mainData?.wallet_amount)
                      : Math.round(totalPayablePrice)
                    : parseInt(itemTotal) +
                      (parseInt(itemTotal) * parseInt(taxesPrice)) / 100 +
                      parseInt(platformFee) -
                      parseInt(promoCodePrice) +
                      parseInt(deliveryChargePrice)}
                  {/* ₹ {  parseInt(mainData?.wallet_amount)  Math.round(totalPayablePrice)} */}
                  {/* ₹ {Math.round(totalPayablePrice)} */}
                </Text>
              </View>
            </View>

            <View
              style={{
                backgroundColor: COLORS.white,
                elevation: 10,
                padding: 10,
                borderRadius: 10,
                marginTop: 10,
                marginHorizontal: 10,
                justifyContent: 'space-between',
                // flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: COLORS.darkGray,
                  fontFamily: 'Segoe UI Bold',
                  marginTop: horizScale(5),
                  marginStart: horizScale(5),
                }}>
                Cancellation Policy
              </Text>

              <Text
                style={{
                  fontSize: 12,
                  color: COLORS.darkGray,
                  fontFamily: 'Segoe UI',
                  marginBottom: horizScale(10),
                  marginTop: horizScale(10),
                  marginEnd: horizScale(5),
                  marginStart: horizScale(5),
                }}>
                If you cancel within 30 second of placing your order, 100%
                amount will be refunded. No refund for cancellation made after
                30 seconds.
              </Text>
              <Text
                onPress={() => {
                  navigation.navigate('CancellationPolicy');
                }}
                style={{
                  fontSize: 14,
                  color: '#0638ff',
                  fontFamily: 'Segoe UI',
                  marginTop: horizScale(5),
                  marginStart: horizScale(5),
                  textDecorationLine: 'underline',
                }}>
                View Refund & Cancellation Policy
              </Text>
            </View>

            <View
              style={{
                backgroundColor: COLORS.white,
                elevation: 10,
                padding: 10,
                borderRadius: 10,
                marginTop: 10,
                marginHorizontal: 10,
                justifyContent: 'space-between',
                // flexDirection: 'row',
              }}>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginVertical: 2,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={icons.location}
                    style={{
                      width: 25,
                      height: 25,
                      resizeMode: 'center',
                      marginStart: 5,
                      marginTop: 5,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      color: COLORS.darkGray,
                      fontFamily: 'Segoe UI Bold',
                      marginTop: horizScale(5),
                      marginStart: horizScale(5),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    Delivery Address
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setData([]);
                    getUserSavedAddress(apiToken, userId);
                    setShowAddChangeModal(true);
                  }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#0638ff',
                      fontFamily: 'Segoe UI',
                      marginTop: horizScale(5),
                      marginStart: horizScale(10),
                    }}>
                    Select / Change Address
                  </Text>
                </TouchableOpacity>
              </View>
              {confirmObject == null ? null : (
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      color: COLORS.black,
                      fontFamily: 'Segoe UI Bold',
                      marginTop: horizScale(5),
                      marginStart: horizScale(37),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    {confirmObject?.address_type == '1'
                      ? 'Home'
                      : confirmObject?.address_type == '2'
                      ? 'Work'
                      : confirmObject?.address_type == 3
                      ? 'Others'
                      : null}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: COLORS.black,
                      fontFamily: 'Segoe UI',
                      marginTop: horizScale(5),
                      marginStart: horizScale(37),
                    }}>
                    {confirmObject?.house_no}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: COLORS.darkGray,
                      fontFamily: 'Segoe UI',
                      marginTop: horizScale(5),
                      marginStart: horizScale(37),
                    }}>
                    Nearest Landmark: {confirmObject?.reach}
                  </Text>
                </View>
              )}
            </View>
            {/* {parseInt(restClosed) == 0 ? null : ( */}
            <TouchableOpacity
              onPress={async () => {
                if (confirmObject != null) {
                  // navigation.navigate('Payment', {
                  //   item: cartDetailsData,
                  //   totalPayablePrice: totalPayablePrice,
                  //   confirmObject: confirmObject,
                  //   walletAmountUsed: useWalletAmount,
                  // });
                  if (parseInt(restClosed) == 1) {
                    ShowMessage('Restaurant is Closed');
                  } else {
                    let a = useWalletAmount
                      ? parseInt(mainData?.wallet_amount) == 0
                        ? Math.round(totalPayablePrice)
                        : parseInt(mainData?.wallet_amount) >=
                          parseInt(totalPayablePrice)
                        ? 0
                        : parseInt(mainData?.wallet_amount) <
                            parseInt(totalPayablePrice) &&
                          parseInt(mainData?.wallet_amount) > 0
                        ? Math.round(totalPayablePrice) -
                          parseInt(mainData?.wallet_amount)
                        : Math.round(totalPayablePrice)
                      : parseInt(itemTotal) +
                        (parseInt(itemTotal) * parseInt(taxesPrice)) / 100 +
                        parseInt(platformFee) -
                        parseInt(promoCodePrice) +
                        parseInt(deliveryChargePrice);
                    if (a == 0) {
                      await createOrder('id');
                    } else {
                      step1();
                    }
                  }
                } else {
                  Platform.OS == 'android'
                    ? ToastAndroid.showWithGravity(
                        'Please select delivery address',
                        ToastAndroid.SHORT,
                        ToastAndroid.BOTTOM,
                      )
                    : alert('Please select delivery address');
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
                marginVertical: 25,
                width: '90%',
              }}>
              <Text
                style={{
                  fontFamily: 'Segoe UI Bold',
                  fontSize: 22,
                  color: COLORS.white,
                }}>
                {parseInt(restClosed) == 1
                  ? 'Restaurant is Closed'
                  : 'Proceed to Pay'}
              </Text>
            </TouchableOpacity>
            {/* )} */}
          </View>
        ) : show ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: 22,
                fontFamily: 'Segoe UI',
                color: COLORS.grey,
              }}
              numberOfLines={1}>
              Empty Stomach - Empty Cart
            </Text>
            <Text
              style={{
                fontSize: 25,
                fontFamily: 'Segoe UI Bold',
                color: COLORS.grey,
              }}
              numberOfLines={1}>
              Not Fair
            </Text>
            <Image
              source={icons.not_fair}
              style={{
                width: 40,
                height: 40,
                resizeMode: 'center',
                marginTop: 15,
              }}
            />
          </View>
        ) : null}

        {show ? (
          <TouchableOpacity
            onPress={() => {
              // setShow(!show);
              navigation.replace('MainTopNav', {screen: 'Restaurant'});
              // navigation.goBack();
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
              marginVertical: 25,
              width: '90%',
              elevation: 15,
              shadowColor: '#ff4000',
            }}>
            <Text
              style={{
                fontFamily: 'Segoe UI Bold',
                fontSize: 22,
                color: COLORS.white,
              }}>
              Let's Get Something
            </Text>
          </TouchableOpacity>
        ) : null}
        {/* {cartDetailsData?.length == 0 ? (
          <TouchableOpacity
            onPress={() => {
              // setShow(!show);
              navigation.replace('MainTopNav', {screen: 'Restaurant'});
              // navigation.goBack();
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
              marginVertical: 25,
              elevation: 15,
              width: '90%',
              shadowColor: '#ff4000',
            }}>
            <Text
              style={{
                fontFamily: 'Segoe UI Bold',
                fontSize: 22,
                color: COLORS.white,
              }}>
              Let's Get Something
            </Text>
          </TouchableOpacity>
        ) : null} */}
      </ScrollView>
      {/* {renderAddModal()} */}
      {renderCouponModal()}
      {renderTaxInfoModal()}
      {renderDirectionToReachModal()}
      {renderCouponSuccessModal()}
      {renderVendorNotAvailableModal()}
    </SafeAreaView>
  );
};

export default Cart;

const styles = StyleSheet.create({
  star_logo: {
    width: 12,
    height: 12,
    resizeMode: 'cover',
  },
  cutter: {
    height: 2,
    width: 10,
    backgroundColor: COLORS.grey,
    borderRadius: 10,
    marginBottom: 5,
    marginTop: 10,
    marginHorizontal: 3,
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: Dimensions.get('screen').height * 0.6,
    width: Dimensions.get('screen').width * 0.9,
    padding: 10,
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'space-around',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
  sizeText: {
    fontFamily: 'Segoe UI',
    fontSize: 15,
    padding: 5,
  },
  addressText: {
    fontSize: 20,
    fontFamily: 'Segoe UI Bold',
    textAlign: 'center',
    // marginVertical: 10,
    color: COLORS.black,
  },
  content: {
    paddingLeft: 10,
    borderRadius: 10,
    margin: 10,
    elevation: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  circle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ACACAC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.primary,
  },
});

/**


{
    "cart_id": "131",
    "user_id": "1",
    "vendor_id": "1",
    "products": [
        {
      "product_id": "2",
      "product_qty": "1"
    },
        {
            "product_id": "3",
            "product_qty": "100",
            "addons": [],
           "variants": [
            {
                "variant_name": "2222",
                "variant_price": "26.00",
                "variant_id": 6678,
                "variant_qty":1,
                "added": false
            }
        ]
        }
    ]
}

api me product price count sahi nhi hai   -- backend
platform fee 
count increase  - frontend
addon not seen  - backend
product price count sahi nhi hai - frontend
browse menu  - frontend
vendor logo missing dish search - frontend
 */
