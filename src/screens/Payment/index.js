import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS, icons} from '../../constants';
import {horizScale} from '../../constants/themes';
import ApiCall from '../../network/ApiCall';
import {API_END_POINTS} from '../../network/ApiEndpoints';
import {removeItemCart} from '../../redux/actions/index';
import Loader from '../../utils/Loader';
import ToolbarWithIcon from '../../utils/ToolbarWithIcon';
import style from './style';

const Payment = ({navigation, route}) => {
  const [receivedItem, setReceivedItem] = useState([]);
  const [conObject, setconObject] = useState({});
  const [walletAmountUsed, setWalletAmountUsed] = useState({});
  const [totalPrice, setTotalPrice] = useState('');
  const [count, setCount] = useState(0);

  const [userId, setUserId] = useState('');
  const [apiToken, setApiToken] = useState('');

  const userLatitude = useSelector(state => state?.state?.userLatitude);
  const userLongitude = useSelector(state => state?.state?.userLongitude);
  useEffect(() => {
    let {item} = route.params;
    let {totalPayablePrice} = route.params;
    let {confirmObject} = route.params;
    let {walletAmountUsed} = route.params;

    setWalletAmountUsed(walletAmountUsed);
    console.log('payment screen -> ', JSON.stringify(item));
    setTotalPrice(Math.round(totalPayablePrice) + '.00');
    setconObject(confirmObject);
    setCount(item?.length);
    setReceivedItem(item);
    getInfoFromStorage();
  }, []);

  const [cod, setCod] = useState(false);
  const [loading, setLoading] = useState(false);

  const removeItemFromCart = () => {
    setLoading(true);
    let body = {
      user_id: userId + '',
    };
    ApiCall('post', body, API_END_POINTS.removeEmptyCart, {
      Authorization: `Bearer ${apiToken}`,
    })
      .then(response => {
        console.log('removeItemFromCart =>? ', response?.data);
        if (response?.data?.status) {
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

  const [mobile, setMobile] = useState('');

  const [data, setData] = useState({});

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
          } else {
            setUserId('');
          }
        }
      });
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
    } catch (error) {
      console.log('profile data -> ', JSON.stringify(error));
    }
  };

  useEffect(() => {
    getInfoFromStorage();
  }, []);

  const getRestDetailsPage = (value, _id) => {
    setLoading(true);
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
          setData(response?.data?.response);
        } else {
          setData({});
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  /**{"variants":[{"variant_name":"Salt","variant_price":"10.00","variant_qty":1}],"cuisines":
   * [{"name":"South Indian","cuisinesImage":"cuisines-1.jpg"}],"addons":[{"id":1,"addon":"Coke 180ML","price":
   * "45.00"}],"product_id":10,"product_name":"Daal Bati","product_qty":1
   * ,"product_image":"https://web10technologies.com/Chelab_full_project/public/products/1664705917-restaurant-product-927.jpg","category":1,"menu_id":1,"dis":"Dal baati indian traditional food",
   * "type":"veg","product_price":"199.00","customizable":"true","product_for":"3","product_rating":"0"} */

  const finalItem = async () => {
    let a = await receivedItem.map((item, index) => {
      return {
        product_id: item?.product_id,
        userId: userId,
        product_qty: item?.cart_qty || item?.qty,
        product_name: item?.product_name,
        product_image: item?.product_image,
        cuisines: 'South Indian',
        category: 1,
        menu_id: 1,
        dis: 'Dal bati indian traditional food',
        type: 'veg',
        product_price: item?.product_price + '',
        customizable: 'true',
        cancel_reason: null,
        product_for: '3',
        status: '1',
        product_approve: '1',
        product_rating: '0',
      };
    });
    console.log('final item =?/ ', JSON.stringify(a));

    setReceivedItem(a);
    return a;
  };

  const [state, setState] = useState(false);

  const dispatch = useDispatch();

  const createOrder = async () => {
    // setLoading(true);
    let b = await finalItem();
    console.log('receivedItem ==>>>>>>>>>>', JSON.stringify(b));
    let body = {
      user_id: userId,
      vendor_id: '1',
      customer_name: data?.name,
      delivery_address: conObject?.house_no,
      total_amount: totalPrice + '', //sum of all amounts
      gross_amount: totalPrice + '', //after tax deduction
      net_amount: totalPrice + '', //after discount deduction
      discount_amount: '0',
      coupon_id: '1',
      payment_type: 'COD',
      payment_status: 'pending',
      transaction_id: '',
      payment_string: '',
      city: 'Indore',
      pincode: '456002',
      // lat: '24.4637223',
      // long: '74.8866346',
      lat: userLatitude + '',
      long: userLongitude + '',
      // lat: 22.72418,
      // lng: 75.887257,
      wallet_apply: walletAmountUsed ? '1' : '0',
      products: b,
    };

    console.log('FINAL ITEM IN ORDER API -> ', JSON.stringify(body));

    ApiCall('post', body, API_END_POINTS.createOrder, {
      Authorization: `Bearer ${apiToken}`,
    })
      .then(response => {
        console.log(
          'removeItemFromCart order cart api respo se z=>? ',
          response?.data,
        );
        if (response?.data?.status) {
          setState(true);
        } else {
          setState(false);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {
        setLoading(false);
      });
    setLoading(false);
  };

  return (
    <SafeAreaView style={style.mainContainer}>
      <ScrollView
        style={[
          style.mainContainer,
          {
            backgroundColor: '#f5f5f5',
          },
        ]}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}>
        <Loader loading={loading} />
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
            numberOfLines={1}>
            Payment
            {/* Options */}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: COLORS.white,
            marginTop: 20,
            padding: 5,
          }}>
          <Text
            style={{
              fontSize: 18,
              color: COLORS.black,
              fontFamily: 'Segoe UI Bold',
              // marginTop: horizScale(10),
              marginStart: horizScale(15),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            Select Payment Method
          </Text>
          {count >= 0 ? (
            <Text
              style={{
                fontSize: 15,
                color: COLORS.grey,
                fontFamily: 'Segoe UI',
                marginTop: horizScale(10),
                marginStart: horizScale(15),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {count} Items
            </Text>
          ) : null}
          {totalPrice ? (
            <Text
              style={{
                fontSize: 15,
                color: COLORS.greenButtonBgColor,
                fontFamily: 'Segoe UI',
                marginBottom: horizScale(5),
                marginTop: horizScale(10),
                marginStart: horizScale(15),
              }}>
              Grand Total ₹ {totalPrice}
            </Text>
          ) : null}
        </View>
        <Text
          style={{
            fontSize: 18,
            color: COLORS.black,
            fontFamily: 'Segoe UI Bold',
            marginTop: horizScale(15),
            marginStart: horizScale(15),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          Wallets
        </Text>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginVertical: 10,
            // marginHorizontal: 15,
            backgroundColor: COLORS.white,
            alignItems: 'center',
            elevation: 10,
            height: 70,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={{
                uri: 'https://img.icons8.com/color/2x/paytm.png',
              }}
              style={{
                width: 50,
                height: 50,
                marginStart: 15,
              }}
            />
            <Text
              style={{
                fontSize: 16,
                color: COLORS.black,
                fontFamily: 'Segoe UI',
                marginStart: horizScale(12),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              Paytm Wallet
            </Text>
          </View>
          <Image
            source={{
              uri: 'https://img.icons8.com/ios-glyphs/2x/circled.png',
            }}
            style={{
              width: 25,
              height: 25,
              // resizeMode: 'center',
              marginStart: 5,
              marginTop: 5,
              tintColor: COLORS.darkGray,
              marginEnd: 15,
            }}
          />
        </View>
        <Text
          style={{
            fontSize: 18,
            color: COLORS.black,
            fontFamily: 'Segoe UI Bold',
            marginTop: horizScale(15),
            marginStart: horizScale(15),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          UPI
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: 90,
            backgroundColor: COLORS.white,
            elevation: 10,
            width: '100%',
            marginTop: 10,
            justifyContent: 'space-evenly',
          }}>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 10,
            }}>
            <Image
              source={{
                uri: 'data:image/jpeg;base64,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',
              }}
              style={{
                width: 50,
                height: 50,
                // marginStart: 15,
              }}
            />
            <Text
              style={{
                fontSize: 14,
                color: COLORS.black,
                fontFamily: 'Segoe UI',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              Google Pay
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 10,
            }}>
            <Image
              source={{
                uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAjVBMVEVfJZ////9ZF5ycg8D39PpfH6BcIJ5XEZu1n9F2SKxVDJpkK6Lx7PfCsdlRAJhbHJ2GYrXOv+Hr5fP9+/5jLqGBWbLSxeNoM6RtOqdzQ6v08Picf8J8Ua9uPKiNarnFtNrl3e6njsjaz+eVdr7XzOa4pNOvmM3f1uumjcjm3u+/q9fDstlxRKjIudyXeb/FCSTHAAAEc0lEQVR4nO3d63LaOhSGYVlxJSJAAgzlZMIpDYVs9v1f3jbZmaTFWspM4mJp9Xv/dSad8TMhliULWwiEEEIIIYQQQgghhBBCCCHEI1XV9jH8uZS04r4sZ8a4tg/lT6SMnW93i6Io8t75wTIzKmlMeRpl740Gtu2Dai6l7Ww/zLOr+myIpnw6FNe8S9+ZEO2jT/fSmgVRbklglnU4EM1zQJgtTdvH9/XcPiTMJrLtA/x65kdIWMwZjIv2KUTsTRlcw4WJG82BeBcishgWw0QWFzfmIUTcMhgzPiA+6LaPr4HMwHtt+to9g2FR6DJAzGcMhkUhy9oE6r2RYDBmCLkKEHccTqjCzRc0kcdUyokRTWQxlRKqGyBymEpVRHGgiQMOY4ZQjiYWKw5jRkX8ThIXLMYMoSxN3DgeRD0kiUMWJ9RqNtUniSf+xJ9ciB2SuOcwlRIhYlGyGBZDKxv5jMUJNUQcSSZEs6SIj0zONoHFGx5TKREi8phKVekJtXjDYypVJSfUb5HDXamX5IxYvCnuWUylRGDxhsVdqZfknFjZ2HA52wg3Jogs7kq95NTRT4xuKiXtt88lNbF4s9VXP2hbvZ9q9r380/mF2fWPHX+M2xsoHTm0NVt7dxvN+TbCbN3WFNnS60sN97Ml4u2EGX/hXTvXrDcUDts52dxQ2NL13A2FI/bCYztCw16o6WVsJkI15S4UgfuCTIRqGtgvw0IoXBnYL9NkLY34F+K3c2h/XlPlLa5RKbtadt7yf2gPTx2qk180/P2nttNW1xmV1K8Z1/Meb99qIrPyC5e//4947kx1CSH5R6Tu/cKWphIfB2EtCKMLwloQRheEtSCMLghrQRhdENaCMLogrAVhdEFYC8LogrAWhNEFYS0IowvCWhBGFyGk96cnJ3T+LfgHPkLt34F/JI83OaH1b8DPx9Rd6uSE1Ea3ko2Q2ujWoTYxJyeUxLdgyR1NyQnJL2CUxH6Y5IRCEPvcqGdCpSe01AOF7vyXNekJDbGLKysGXmJ6Qkd+Vbt48HxQlZmlJhSWEmbZs7a/PG1HKWnstOO/kI1aGNo1fJ5MtTVGG2N195/9M/0UsIiFMvjEyyzf7Nb9zvp82IR33kYsFKqRTcMxC00j31CIWahWTeyKjlkYeiAUE6ESDfwSoxYKHXwMNAchNdNnJFTzL39OIxcKGX47AgOhsFvuwg9eHcBB+FViAkJh/+UuFHpOPIKGjVA42fn0qJGGsJpnrD778JNUhELZ8Sk0X1ycBokLL2tNen/2Lsbkm87E2nnyQnF5lpQsl/3dcfH6V5n3Nrv13WBqtUtwNZHo8qpAqcT4Urc6BVX/+n/ZjY3wNaWuX9jJTVgPwvSDMP0gTD8I0w/C9IMw/SBMPwjTj3pqHx+hIJ6dxUhI7CpmJHT+BVNGQmKbGCeh6voWxTkJhfO9smQSzUP2mshNH6+BPF6k+56yk2Hx6404Nq+3es9ZMx+8NeMHvKTcW6z+BhFCCCGEEEIIIYQQQgghhBBCCCH01/UfYcNS0Fh2weUAAAAASUVORK5CYII=',
              }}
              style={{
                width: 50,
                height: 50,
                // marginStart: 15,
              }}
            />
            <Text
              style={{
                fontSize: 14,
                color: COLORS.black,
                fontFamily: 'Segoe UI',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              Phonepe
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 10,
            }}>
            <Image
              source={{
                uri: 'https://img.icons8.com/color/2x/paytm.png',
              }}
              style={{
                width: 50,
                height: 50,
                // marginStart: 15,
              }}
            />
            <Text
              style={{
                fontSize: 14,
                color: COLORS.black,
                fontFamily: 'Segoe UI',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              Paytm
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',

            backgroundColor: COLORS.white,
            elevation: 10,
            width: '100%',
            marginTop: 10,
          }}>
          {/* <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={{
                uri: 'https://img.icons8.com/fluency/2x/bhim.png',
              }}
              style={{
                marginVertical: 5,
                marginStart: 15,
                width: 30,
                height: 30,
              }}
            />
            <Text
              style={{
                fontSize: 16,
                color: COLORS.black,
                fontFamily: 'Segoe UI',
                marginStart: horizScale(12),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              Enter your UPI ID
            </Text>
          </View> */}
        </View>
        <Text
          style={{
            fontSize: 18,
            color: COLORS.black,
            fontFamily: 'Segoe UI Bold',
            marginTop: horizScale(15),
            marginStart: horizScale(15),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          Credit &amp; Debit Cards
        </Text>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginVertical: 10,
            // marginHorizontal: 15,
            backgroundColor: COLORS.white,
            alignItems: 'center',
            elevation: 10,
            height: 70,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={{
                uri: 'https://img.icons8.com/ios-filled/2x/bank-card-front-side--v2.gif',
              }}
              style={{
                width: 50,
                height: 50,
                marginStart: 15,
              }}
            />
            <Text
              style={{
                fontSize: 16,
                color: COLORS.black,
                fontFamily: 'Segoe UI',
                marginStart: horizScale(12),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              + Add new card
            </Text>
          </View>
          <Image
            source={icons.back_arrow}
            style={{
              width: 15,
              height: 15,
              resizeMode: 'center',
              marginStart: 5,
              marginTop: 5,
              marginEnd: 15,
              transform: [{rotate: '180deg'}],
            }}
          />
        </View>

        <Text
          style={{
            fontSize: 18,
            color: COLORS.black,
            fontFamily: 'Segoe UI Bold',
            marginTop: horizScale(15),
            marginStart: horizScale(15),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          Cash on Delivery
        </Text>
        <TouchableOpacity
          onPress={() => {
            setCod(!cod);
          }}
          activeOpacity={0.8}
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginVertical: 10,
            // marginHorizontal: 15,
            backgroundColor: COLORS.white,
            alignItems: 'center',
            elevation: 10,
            height: 70,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={{
                uri: 'https://img.icons8.com/cute-clipart/2x/money.png',
              }}
              style={{
                width: 50,
                height: 50,
                marginStart: 15,
              }}
            />
            <Text
              style={{
                fontSize: 16,
                color: COLORS.black,
                fontFamily: 'Segoe UI',
                marginStart: horizScale(12),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              Cash on Delivery
            </Text>
          </View>
          {cod ? (
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/128/463/463574.png',
              }}
              style={{
                width: 25,
                height: 25,
                // resizeMode: 'center',
                marginStart: 5,
                marginTop: 5,
                marginEnd: 15,
              }}
            />
          ) : (
            <Image
              source={{
                uri: 'https://img.icons8.com/ios-glyphs/2x/circled.png',
              }}
              style={{
                width: 25,
                height: 25,
                // resizeMode: 'center',
                marginStart: 5,
                marginTop: 5,
                tintColor: COLORS.darkGray,
                marginEnd: 15,
              }}
            />
          )}
        </TouchableOpacity>
        {cod ? (
          <TouchableOpacity
            onPress={() => {
              // navigation.navigate('OrderPlaced');
              if (cod) {
                createOrder();
                // if (state) {
                removeItemFromCart();
                dispatch(removeItemCart([]));
                // dispatch(addItemToCart([]));

                navigation.navigate('OrderPlaced');
                // } else {
                //   Platform.OS == 'android'
                //     ? ToastAndroid.showWithGravity(
                //         'Vendor not available',
                //         ToastAndroid.SHORT,
                //         ToastAndroid.BOTTOM,
                //       )
                //     : null;
                // }
              } else {
                Platform.OS == 'android'
                  ? ToastAndroid.showWithGravity(
                      'Please select payment method',
                      ToastAndroid.SHORT,
                      ToastAndroid.BOTTOM,
                    )
                  : null;
              }
            }}
            activeOpacity={0.8}
            style={{
              paddingHorizontal: 50,
              backgroundColor: COLORS.greenButtonBgColor,
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
              {cod ? 'Place Order' : 'Pay'}
            </Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Payment;

const styles = StyleSheet.create({
  cutter: {
    height: 2,
    width: 10,
    backgroundColor: COLORS.grey,
    borderRadius: 10,
    marginBottom: 5,
    marginTop: 10,
    marginHorizontal: 3,
  },
});

/**
 * pls review all this api and fix the issue
 *
 * all these api are tested by me with correct params and correct token but still need some fix
 *
 * api doc
 *
 * 1. create order api not working
 * 500 - internal server error and sometime trying to get id on null object
 *
 * 2. saved address api not working
 *
 * 3. remove vendor id field from add to cart api because it is creating problem  because everywhere vendor id is not available
 *
 * 4. make one api for getting cart product of particular vendor or chef
 * For ex. if i go to jaini food and add to cart then if i visit the data will be there (requirement)
 *
 * 5. make add to cart api simple remove product array and change it to object because at a time only one item is going to cart
 * because - array is creating problems managing array everywhere is challenging task  -- i crack the logic today whole day but somewhere it is creating problem
 *
 * 6. add parameter of quantity in every product
 *
 * 7. make some changes in view cart api so I can difference between which addons an options are selected
 * if some is selected make selected true  -- add this param
 * but give all item with selected key false and selected item selected true
 *
 * 8. get-dine-out-slot -- api end point
 * data is not sufficient
 * need
 * 1. time must be correct
 * 2. date format must be correct or send UTC format YYYY-DD-MMTHH:MM:SSZ
 *
 * 9. api for offers of din out restaurant
 *
 * 10. getRestaurantDetailPage -- api end point
 * if any menu has 0 product then don't send to me
 * For ex. if pasta menu has no item -- don't send
 *
 * make some change give all addons and variants/options at the very beginning
 *
 * i don't want to call api again and again -- it increase time and core functionality of add to cart is affected
 * because lack of reference to parent object
 *
 * for ex. -- if i select dal bati with option salad and this salad is coming from api and i saved salad price in
 * variable and in the mean time i select pasta with XL variants then salad price is over riden by XL variants price
 * and now i increase quantity if i add that variable it will give mismatch result
 *
 * because i am unable to handle unwanted number of runtime variable creation
 *
 * 11. pls specify restaurant category like  veg non veg in string
 *
 * 12. pls review my old changes/api doc points i have provided to you
 *
 * 13. pls fix admin issue unable to login in chef api exception
 *
 * 14. unable to add product under chef
 *
 * 15. humble request don't clear data base again and again repetition of data and waste of time  --  not able to
 * identify minor problem which may lead to crash or issue
 *
 * 16. pls confirm me that all points of api side is done from my side
 *
 * 17. from today onwards i will receive your call whether work is complete or not
 */
