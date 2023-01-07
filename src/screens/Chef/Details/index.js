import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {AirbnbRating} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import {addItemToCart, removeItemCart} from '../../../redux/actions/index';

import AntDesign from 'react-native-vector-icons/AntDesign';
import {COLORS, icons} from '../../../constants';
import ApiCall from '../../../network/ApiCall';
import {API_END_POINTS} from '../../../network/ApiEndpoints';
import RadioButtons from '../../../utils/AddItemRadioButton';
import ToolbarWithIcon from '../../../utils/ToolbarWithIcon';
import {ShowConsole, ShowMessage} from '../../../utils/Utility';
import {ChefFoodItemSkeleton} from '../utils/ChefFoodItem';
import style from './style';

const ChefDetails = ({navigation, route}) => {
  const [changeOne, setChangeOne] = useState(true);
  const [changeTwo, setChangeTwo] = useState(false);
  const [offerData, setOfferData] = useState([{}, {}, {}]);

  const [cartVendorId, setCartVendorId] = useState('');

  const [showAdd, setShowAdd] = useState(false);
  const [pData, setPData] = useState({});
  const [optionAddonData, setOptionAddonData] = useState({});
  const [totalMoney, setTotalMoney] = useState(0);
  const [itemExistData, setItemExistData] = useState({});

  const [selected, setSelected] = useState(false);

  const closeAddModal = () => {
    setShowAdd(!showAdd);
  };

  const [cartId, setCartId] = useState(null);

  const updateCart = async i => {
    console.log('add to cart rec item-> ', JSON.stringify(i));

    let body = {
      cart_id: cartId,
      user_id: userId,
      vendor_id: i?.vendor_id + '',
      products: [
        {
          product_id: parseInt(i.product_id),
          product_qty: i.cart_qty,
        },
      ],
    };

    if (i.options) {
      // const itemss = i.options?.find(x => x.variant_qty > 1);
      const itemss = i.options?.reduce(function (acc, cur) {
        if (selectedOption?.id == cur.id) {
          // if (cur.variant_qty > 1) {
          var o = {
            variant_id: cur?.id + '',
            variant_qty: cur.variant_qty + '',
          };
          //   acc.push(o);
          // } else {
          // var o = {variant_id: cur?.id, variant_qty: '1'};
          acc.push(o);
          // }
        }
        return acc;
      }, []);
      if (itemss) {
        // Object.assign(body, {variants: itemss});
        let temp = Object.assign({}, body.products[0]);
        temp.variants = itemss || [];
        console.log(
          'temp.variants itemmmmmmmmmmmmmmmmmmm=> ' + JSON.stringify(temp),
        );
        body.products[0] = temp;
      }
    }

    if (i?.addons) {
      // let ads = i?.addons?.map(item => {
      //   if (item?.selected) {
      //     return {
      //       addon_id: item?.id,
      //       addon_qty: '1',
      //     };
      //   }
      // });

      let ads = i?.addons?.reduce(function (acc, cur) {
        if (cur.selected) {
          var o = {addon_id: cur?.id + '', addon_qty: '1'};
          acc.push(o);
        }
        return acc;
      }, []);

      if (ads) {
        // Object.assign(body, {addons: ads});
        let temp = Object.assign({}, body.products[0]);

        temp.addons = ads || [];

        body.products[0] = temp;
      }
    }

    // cartArray.push(body);
    // cartArray.push(body.products);

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

  const [cartArrayCount, setCartArrayCount] = useState('');

  const newPlus = productId => {
    let a = [...detailsData];
    let b = a.map(item => {
      let temp = Object.assign(item, {});
      if (productId == temp?.product_id) {
        const itemss = pData?.options?.find(x => x.id === selectedOption?.id);
        // console.log('item -> ', JSON.stringify(itemss));
        // temp.cart_qty = itemss?.variant_qty;
        temp.qty = itemss?.variant_qty || 1;
        addToCart(temp);
        getUserCartCount(apiToken, userId);
      }
      return temp;
    });

    setDetailsData(b);
  };

  const [newCartIndex, setNewCartIndex] = useState(0);

  const [cartCount, setCartCount] = useState(0);

  const newItemExistPlus = productId => {
    let a = [...detailsData];
    let b = a.map(item => {
      let temp = Object.assign(item, {});
      if (productId == temp?.product_id) {
        const itemss = pData?.options?.find(x => x.id === selectedOption?.id);
        temp.cart_qty = parseInt(itemss?.variant_qty) || 1;
        addToCart(temp);
        getUserCartCount(apiToken, userId);
      } else {
        temp.cart_qty = 0;
      }
      return temp;
    });
    setDetailsData(b);
  };

  const getUserCartCount = (t, value) => {
    let body = {
      user_id: value,
      // cart_id: '53',
    };
    // console.log('daa -> ', JSON.stringify(body) + value + ' ' + t);
    ApiCall('post', body, API_END_POINTS.get_cart_count, {
      Authorization: `Bearer ${t}`,
    })
      .then(response => {
        if (response?.data?.status) {
          setCartVendorId(response?.data?.response?.cart?.vendor_id);

          if (response?.data?.response?.cart.length >= 1) {
            setCartCount(response?.data?.response?.cart.length);
          } else {
            setCartCount(0);
          }

          // setCartArrayCount(
          //   response?.data?.response?.cart?.total_product_in_cart,
          // );
          setCartArrayCount(response?.data?.response?.cart?.products_count);
          setCartId(response?.data?.response?.cart?.id);
        } else {
          setCartArrayCount('');

          setCartCount(0);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {});
  };

  const [addloading, setaddLoading] = useState(false);
  const cartItemArr = useSelector(state => state?.state?.cartArray);
  const [addonPrice, setAddonPrice] = useState(0);
  const [cartItemIndex, setCartItemIndex] = useState(0);
  const [optionListCount, setOptionListCount] = useState(1);
  const dispatch = useDispatch();

  const [showItemExist, setShowItemExist] = useState(false);

  const addToCartRedux = (cartItem, cnt) => {
    if (cartItemArr?.length == 0) {
      ShowConsole('received index 111111111111 =? ' + cartItem);
      dispatch(addItemToCart({...cartItem, qty: cnt}));
      onPlus('more', cartItem?.product_id);
      setShowAdd(false);
      setAddonPrice(0);
      detailsData[cartItemIndex].qty = optionListCount;
      setDetailsData(detailsData);
    } else {
      // ShowConsole('received index 222222222222222 =? ' + cartItem);

      cartItemArr.forEach(item => {
        if (item?.chef_id + '' == cartItem?.chef_id + '') {
          dispatch(addItemToCart({...cartItem, qty: cnt}));
          setShowAdd(false);
          setAddonPrice(0);
          onPlus('more', cartItem?.product_id);
          setDetailsData(detailsData);
        } else {
          ShowConsole(
            'received index else bloack =? ',
            item?.chef_id + ' | ' + cartItem?.chef_id + '',
          );
          setShowItemExist(true);
          setShowAdd(false);
        }
      });
      updateAsyncStorage();
    }
  };

  const updateAsyncStorage = () => {
    // AsyncStorage.setItem('cartArray', JSON.stringify(cartItemArr));
  };

  const getRestProductOptionMenu = (item, _i) => {
    // console.log('ERROR IN getCuisines API 1-> ', JSON.stringify(item));

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
          addToCart(_i);
        }
      })
      .catch(error => {
        console.log(
          'ERROR IN getCuisines API getRestProductOptionMenu -> ',
          error,
        );
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      });
  };

  const addItem = (arr, id, mainData) => {
    // let _tempItem = itemCount + 1;
    // setItemCount(_tempItem);
    let t = 0;
    let a = arr.map(item => {
      var temp = Object.assign({}, item);
      console.log('temp --->>> ', JSON.stringify(temp));
      if (temp.variant_name === id) {
        temp.selected = !temp.selected;

        if (temp.selected) {
          t = parseInt(totalMoney) + parseInt(temp.variant_price) + 0.0;
        } else {
          t = parseInt(totalMoney) - parseInt(temp.variant_price) + 0.0;
        }
        // console.log('temp --->>> ', JSON.stringify(t));
        // pData?.variant_price = t
      }
      setTotalMoney(t);
      return temp;
    });
    let r = {
      options: a,
      addons: optionAddonData?.addons || [],
    };
    console.log('temp --->>> ', JSON.stringify(r));

    setOptionAddonData(r);
  };

  const addItemAddon = (arr, id, mainData) => {
    // let _tempItem = itemCount + 1;
    // setItemCount(_tempItem);
    let t = 0;
    let a = arr.map(item => {
      var temp = Object.assign({}, item);
      console.log('temp --->>> ', JSON.stringify(temp));
      if (temp.addon === id) {
        temp.selected = !temp.selected;

        if (temp.selected) {
          t = parseInt(totalMoney) + parseInt(temp.price) + 0.0;
        } else {
          t = parseInt(totalMoney) - parseInt(temp.price) + 0.0;
        }
        // console.log('temp --->>> ', JSON.stringify(t));
        // pData?.variant_price = t
      }
      setTotalMoney(t);
      return temp;
    });
    console.log(
      'temp  optionsoptionsoptions--->>> ',
      JSON.stringify(optionAddonData?.options),
    );

    let r = {
      options: optionAddonData?.options || [],
      addons: a,
    };
    console.log('temp --->>> ', JSON.stringify(r));

    setOptionAddonData(r);
  };

  const [loading, setLoading] = useState(false);
  const [apiToken, setApiToken] = useState('');
  const [detailsData, setDetailsData] = useState([]);
  const [cuisinesData, setCuisinesData] = useState([]);
  const isFocused = useIsFocused();

  /**return (
                <ChefFoodItem
                  item={item}
                  onAddFunction={() => {
                    setPData(item);
                    // console.log('items', JSON.stringify(item));
                    setTotalMoney(item?.product_price);
                    setOptionAddonData([]);
                    setAddItemIndex(item?.product_id + '');

                    getRestProductOptionMenu(item, item);
                  }}
                  onPlus={onPlus}
                  onMinus={onMinus}
                  onFavPress={() => {
                    updateFavUnFavProduct(item, index);
                  }}
                />
              ); */

  const newPlusOut = productId => {
    let a = [...detailsData];
    let b = a.map(item => {
      let temp = Object.assign(item, {});
      if (productId == temp?.product_id) {
        // temp.cart_qty = temp.cart_qty + 1;
        temp.qty = temp.qty + 1;
        addToCart(temp);
      }
      return temp;
    });

    // console.log('getRest Details Page response  =-> ', JSON.stringify(b));

    setDetailsData(b);
  };

  const newMinusOut = productId => {
    let a = [...detailsData];
    let b = a.map(item => {
      let temp = Object.assign({}, item);
      if (productId == temp.product_id + '') {
        // console.log(JSON.stringify(temp.qty), ' dasta ');

        // temp.cart_qty = parseInt(temp.cart_qty) - 1;
        temp.qty = parseInt(temp.qty) - 1;
      }
      return temp;
    });

    setDetailsData(b);
  };

  const renderChefFoodItem = ({item, index}) => {
    // ShowConsole('renderChefFoodItem =>>> ', JSON.stringify(item));

    let chilli = [];

    for (let i = 0; i < parseInt(item?.chili_level); i++) {
      // console.log('push method executres ->>>> ', item?.chili_level);
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
          },
        ]}
        onPress={() => {
          if (item?.customizable == 'true') {
            setShowAdd(true);

            setPData(item);
            console.log('item customizable -> ', JSON.stringify(item));

            setNewCartIndex(index);
            if (item?.options && item?.options?.length >= 0) {
              onSelect(item?.options[0]);
              // setTotalMoney(a[0]?.variant_price);
            }
          } else {
            setShowAdd(true);
            setPData(item);
            console.log('item customizable -> ', JSON.stringify(item));
            setNewCartIndex(index);
            if (item?.options && item?.options?.length >= 0) {
              onSelect(item?.options[0]);
              // setTotalMoney(a[0]?.variant_price);
            }
          }
        }}>
        <View>
          <Image
            source={{uri: '' + item?.image}}
            style={{
              height: 115,
              width: 115,
              // margin: 10,
              borderRadius: 10,
            }}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              updateFavUnFavProduct(item, index);
            }}
            style={styles.fav}>
            <Image
              source={item?.is_like != 0 ? icons.favorite : icons.unfavorite}
              style={{
                width: 25,
                height: 25,
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
                marginStart: -2,
              }}
              numberOfLines={2}
              ellipsizeMode="tail">
              {item?.product_name}
            </Text>
            {chilli}
          </View>

          <Text
            style={{
              color: COLORS.grey,
              fontSize: 12,
              fontFamily: 'Segoe UI',
              marginStart: -2,
            }}
            numberOfLines={2}
            ellipsizeMode="tail">
            {item?.dis}
          </Text>

          {/* <Text
            style={{
              color: COLORS.grey,
              marginTop: 5,
              fontFamily: 'Segoe UI',
              fontSize: 14,
            }}>
            North Indian
          </Text> */}
          <Text
            style={{
              color: COLORS.black,
              fontSize: 16,
              fontFamily: 'Segoe UI',
              marginTop: 5,
            }}>
            ₹ {item?.product_price}
          </Text>
          <View
            style={{
              marginTop: 8,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {/* <AntDesign name="staro" color={'gold'} />
            <AntDesign name="staro" color={'gold'} />
            <AntDesign name="staro" color={'gold'} />
            <AntDesign name="staro" color={'gold'} />
            <AntDesign name="staro" color={'gold'} /> */}
            <AirbnbRating
                      isDisabled={true}
                      count={5}
              showRating={false}
              defaultRating={parseInt(item?.product_rating)}
              size={10}
            />
            {item?.product_rating == '0' ? null : (
              <Text style={[styles.distance]} numberOfLines={1}>
                {item?.product_rating}
              </Text>
            )}

            {/* <TouchableOpacity
              onPress={() => {
                if (item?.customizable == 'true') {
                  setShowAdd(true);

                  setPData(item);
                  // setTotalMoney(item?.product_price);
                  setOptionAddonData([]);
                  setAddItemIndex(item?.product_id + '');
                  // getRestProductOptionMenu(item, item);
                  if (item?.options && item?.options?.length >= 0) {
                    onSelect(item?.options[0]);
                    setTotalMoney(item?.options[0]?.variant_price);
                  } else {
                    setTotalMoney(item?.product_price);
                  }
                } else {
                  addToCartNotCustomizable(item, item?.product_id + '');
                }
              }}
              style={{
                position: 'absolute',
                // bottom: 0,
                top: 10,
                right: 5,
                alignSelf: 'flex-end',
              }}>
              {item?.customizable == 'true' ? (
                <TouchableOpacity
                  onPress={() => {
                    if (item?.customizable == 'true') {
                      setShowAdd(true);

                      // console.log(receivedItem?.isClosed, 'is Closed');
                      // console.log('items', JSON.stringify(item));
                      setPData(item);
                      setTotalMoney(item?.product_price);
                      setOptionAddonData([]);
                      setAddItemIndex(item?.product_id + '');
                      // getRestProductOptionMenu(item, item);
                    } else {
                      addToCartNotCustomizable(item, item?.product_id + '');
                    }
                  }}>
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

              {item?.qty >= 1 ? (
                <View
                  style={{
                    paddingVertical: 4,
                    paddingHorizontal: 3,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderRadius: 15,
                    borderWidth: 1,
                    borderColor: COLORS.primary,
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      onMinus('less', item?.product_id + '');
                    }}>
                    <Image
                      source={icons.minus}
                      style={{
                        width: 20,
                        height: 20,
                      }}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 18,
                      color: COLORS.black,
                      paddingHorizontal: 5,
                    }}>
                    {item?.qty}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      onPlus('more', item?.product_id + '');
                    }}>
                    <Image
                      source={icons.plus}
                      style={{
                        width: 20,
                        height: 20,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    if (item?.customizable == 'true') {
                      setShowAdd(true);

                      // console.log(receivedItem?.isClosed, 'is Closed');
                      // console.log('items', JSON.stringify(item));
                      setPData(item);
                      setTotalMoney(item?.product_price);
                      setOptionAddonData([]);
                      setAddItemIndex(item?.product_id + '');
                      // getRestProductOptionMenu(item, item);
                    } else {
                      addToCartNotCustomizable(item, item?.product_id + '');
                    }
                  }}>
                  <Text
                    style={{
                      marginHorizontal: 10,
                      fontFamily: 'Segoe UI Bold',
                      fontSize: 16,
                      // marginTop: 0,
                      paddingVertical: 5,
                      paddingHorizontal: 20,
                      alignSelf: 'center',
                      // marginVertical: 2,
                      color: COLORS.primary,
                      borderColor: COLORS.primary,
                      borderWidth: 1,
                      borderRadius: 15,
                    }}>
                    Add
                  </Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity> */}
          </View>
        </View>

        <View
          style={{
            // flexDirection: 'row',
            paddingBottom: 10,
            // marginTop: item?.customizable == 'true' ? 15 : 15,
            justifyContent: 'space-between',
            alignItems: 'center',
            alignSelf: 'flex-end',
            // position: 'relative',
            // bottom: item?.customizable == 'true' ? 0 : 5,
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
                  // position: 'relative',
                  alignSelf: 'center',
                  marginStart: item?.qty > 1 ? 8 : 0,
                  marginBottom: 2,
                }}>
                Customizable
              </Text>
            ) : null}

            {parseInt(item?.qty) >= 1 ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginStart: 10,
                  borderRadius: 15,
                  borderWidth: 1,
                  borderColor: COLORS.primary,
                  width: 85,
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                  }}
                  onPress={() => {
                    onMinus('less', item.product_id, item);
                  }}>
                  <View
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
                  </View>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 16,
                    color: COLORS.black,
                    paddingHorizontal: 5,
                  }}>
                  {item?.qty}
                  {/* {item?.cart_qty} */}
                  {/* {count} */}
                </Text>
                <TouchableOpacity
                  style={{
                    // paddingStart: 2,
                    flexDirection: 'row',
                    // paddingEnd: 3,
                  }}
                  onPress={() => {
                    onPlus('more', item.product_id);
                    // addToCartRedux(item, item?.qty);
                  }}>
                  <View
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
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={{
                  marginHorizontal: 10,
                  paddingVertical: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  // backgroundColor: COLORS.primary,
                  borderColor: COLORS.primary,
                  borderWidth: 1,
                  borderRadius: 20,
                  width: 85,
                }}
                onPress={() => {
                  if (item?.customizable == 'true') {
                    setShowAdd(true);

                    setPData(item);
                    console.log('item customizable -> ', JSON.stringify(item));

                    setNewCartIndex(index);
                    if (item?.options && item?.options?.length >= 0) {
                      onSelect(item?.options[0]);
                      // setTotalMoney(a[0]?.variant_price);
                    }
                  } else {
                    if (cartVendorId == pData?.vendor_id) {
                      // newPlus(pData?.product_id + '');
                      newPlusOut(item.product_id);

                      setPData({});
                      setShowAdd(false);
                    } else if (cartArrayCount == '') {
                      // newPlus(pData?.product_id + '');
                      newPlusOut(item.product_id);

                      setPData({});
                      setShowAdd(false);
                    } else {
                      setItemExistData(pData);
                      setPData({});
                      setShowAdd(false);
                      setShowItemExist(true);
                    }
                  }
                }}>
                <Text
                  style={{
                    fontFamily: 'Segoe UI Bold',
                    fontSize: 16,
                    color: COLORS.primary,
                    // backgroundColor: COLORS.primary,

                    paddingHorizontal: 10,
                  }}>
                  Add
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {item?.type == 'non_veg' ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {}}
            style={
              {
                // marginStart: 'auto',
              }
            }>
            <Image
              source={icons.non_pure_veg}
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
            style={
              {
                // marginStart: 'auto',
              }
            }>
            <Image
              source={icons.pure_veg}
              style={{
                width: 10,
                height: 10,
              }}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const [sumTotal, setSumTotal] = useState(0);
  const [sumQuantity, setSumQuantity] = useState(0);
  const [addItemIndex, setAddItemIndex] = useState('');
  const [showRound, setShowRound] = useState(true);

  const [receivedItem, setReceivedItem] = useState({});

  useEffect(() => {
    let {item} = route.params;
    setReceivedItem(item);
    // console.log('route ->>', route);
    setVendorId(item?.chef_id);
    setFavorite(item?.is_like);
    console.log('chefDetaeils -?/ ', JSON.stringify(item));
    getInfoFromStorage(item?.chef_id);
    if (isFocused) {
      getInfoFromStorage(item?.chef_id);
    }
  }, []);
  const [vendorId, setVendorId] = useState('');

  const [showCustomizeModal, setShowCustomizeModal] = useState(true);

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
  const addToCart = async i => {
    // await removeItemFromCart();
    console.log('add to cart rece item-> ', JSON.stringify(i));
    let body = {
      user_id: userId,
      vendor_id: vendorId + '',
      products: [
        {
          product_id: i.product_id + '',
          product_qty: '1',
        },
      ],
    };

    if (optionAddonData?.options?.length >= 1) {
      let temp = Object.assign({}, body.products[0]);

      optionAddonData?.options?.map(item => {
        temp.variants = temp.variants || [];
        if (item?.selected) {
          let t = Object.assign({}, item);
          // console.log('add to cart rece item temp-> ', JSON.stringify(temp));
          temp.variants.push({
            variant_id: t?.id + '',
            variant_qty: '1',
          });
          // return {...item};
        }
      });
      body.products = [temp];
    } else {
      body = {
        user_id: userId,
        vendor_id: vendorId + '',
        products: [
          {
            product_id: i.product_id + '',
            product_qty: '1',
            // addons: [],
            // variants: [],
          },
        ],
      };
    }
    // console.log(
    //   'add to cart rece item bbbbbbbbbbbbbbbbbbbbbbb-> ',
    //   JSON.stringify(body),
    // );

    if (optionAddonData?.addons?.length >= 1) {
      let temp = Object.assign({}, body.products[0]);
      // console.log(
      //   'add to cart rece item addons addons-> ',
      //   JSON.stringify(temp),
      // );
      optionAddonData?.addons?.map(item => {
        temp.addons = temp.addons || [];
        // console.log('add to cart rece item-> ', JSON.stringify(item?.selected));
        if (item?.selected) {
          let t = Object.assign({}, item);
          // console.log(
          //   'add to cart rece item temp hello -> ',
          //   JSON.stringify(temp),
          // );

          temp.addons.push({
            addon_id: t?.id + '',
            addon_qty: '1',
          });
          // return {...item};
        }
      });
      // console.log(
      //   'add to cart rece item temp second last -> ',
      //   JSON.stringify(temp),
      // );
      body.products = [temp];
    } else {
      body = {
        user_id: userId,
        vendor_id: vendorId + '',
        products: [
          {
            product_id: i.product_id + '',
            product_qty: '1',
            // addons: [],
            // variants: [],
          },
        ],
      };
    }
    // console.log(
    //   'add to cart rece item temp body in last -> ',
    //   JSON.stringify(body),
    // );

    ApiCall('post', body, API_END_POINTS.productAddToCart, {
      Authorization: `Bearer ${apiToken}`,
    })
      .then(response => {
        // console.log(
        //   'RESPONSE IN ADD TO CART API =-> ',
        //   JSON.stringify(response?.data),
        // );
        if (response?.data?.status) {
          setCartId(response?.data?.response?.cart_id);

          // ShowMessage(response?.data?.message);
          // // if (i.customizable) {
          // if (showAdd) {
          //   closeAddModal();
          // }
          // // }
          // setPData({});
          // setSumTotal(parseInt(totalMoney) + parseInt(sumTotal));

          // setTotalMoney(0);
          // setOptionAddonData([]);
          // onPlus('more', addItemIndex);
        } else {
          ShowMessage(response?.data?.error + '');
          onPlus('more', addItemIndex);
          setSumTotal(parseInt(totalMoney) + parseInt(sumTotal));

          setShowAdd(false);
          setPData({});
          setTotalMoney(0);
          setOptionAddonData([]);
        }
      })
      .catch(error => {
        console.log('ERROR IN ADD TO CART API =-> ', error);
      });
  };

  // const onPlus = (action, index) => {
  //   let q1 = 0;
  //   let q = 0;
  //   let p = 0;
  //   let b = [];

  //   b = detailsData?.map((_item, _i) => {
  //     let temp = Object.assign({}, _item);
  //     let currentQty = temp.qty;
  //     if (index == temp?.product_id + '') {
  //       if (action == 'more') {
  //         temp.qty = currentQty + 1;
  //         p = parseInt(temp?.product_price); // parseInt(temp?.qty);
  //         q1 = temp.qty;
  //         if (parseInt(q1) > 1) {
  //           onPlusUpdateCart(temp?.product_id, q1);
  //         }
  //       }
  //     }
  //     q = temp?.qty + q;
  //     return temp;
  //   });

  //   // console.log('item featured dishes on plus pppppppppppppppppppppp-> ', p);
  //   setSumQuantity(parseInt(q));
  //   if (optionPrice > 0) {
  //     setSumTotal(parseInt(p) + parseInt(sumTotal) + parseInt(optionPrice));
  //   } else {
  //     setSumTotal(parseInt(p) + parseInt(sumTotal));
  //   }
  //   // setSumTotal(parseInt(p));
  //   setDetailsData(b);
  // };

  const onPlus = (action, index) => {
    let arr = [...detailsData];
    let a = arr?.map((item, i) => {
      let temp = Object.assign({}, item);
      // let currentQty = temp.cart_qty;
      let currentQty = temp.qty;
      if (index == temp.product_id) {
        // if (action == 'more') {
        // temp.cart_qty = currentQty + 1;
        temp.qty = currentQty + 1;
        // }
      }
      return temp;
    });
    // console.log('daa onPlus onPlus onPlus-> ', JSON.stringify(a));

    // setDetailsData([]);
    setDetailsData([...a]);
  };

  const removeFromCartRedux = cartItem => {
    dispatch(removeItemCart(cartItem));
    updateAsyncStorage();
  };

  const onMinus = (action, index, itemss) => {
    let a = detailsData?.map((item, i) => {
      let temp = Object.assign({}, item);

      // let currentQty = temp.cart_qty;
      let currentQty = temp.qty;

      if (index == temp.product_id + '') {
        if (action == 'less') {
          temp.qty = currentQty - 1;
          // temp.cart_qty = currentQty - 1;
          removeFromCartRedux(itemss);
          if (parseInt(temp?.qty) == 0) {
            removeFromCartRedux(itemss);
          }
        }
      }
      return temp;
    });

    setDetailsData(a);
  };

  // const onPlusUpdateCart = async (productId, qty) => {
  //   // console.log(
  //   //   'item featured on PlusUpdateCart tem received -> ',
  //   //   productId + ' ' + qty,
  //   // );

  //   await removeItemFromCart();
  //   let body = JSON.parse(JSON.stringify(cartProduct));

  //   let b = body?.products?.map((_item, _i) => {
  //     let temp = Object.assign({}, _item);
  //     if (productId == temp?.product_id + '') {
  //       temp.product_qty = qty + '';
  //     }
  //     return temp;
  //   });

  //   body = {
  //     ...body,
  //     products: b,
  //   };

  //   // console.log(
  //   //   'onPlusUpdateCart BODY IN LAST SCENE -> ',
  //   //   JSON.stringify(body),
  //   // );

  //   ApiCall('post', body, API_END_POINTS.productAddToCart, {
  //     Authorization: `Bearer ${apiToken}`,
  //   })
  //     .then(response => {
  //       // console.log(
  //       //   'RESPONSE IN ADD TO CART API =-> ',
  //       //   JSON.stringify(response?.data),
  //       // );
  //       if (response?.data?.status) {
  //       } else {
  //       }
  //     })
  //     .catch(error => {
  //       console.log('ERROR IN ADD TO CART API =-> ', error);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };
  const [cartProduct, setCartProduct] = useState(null);

  const onMinusUpdateCart = async productId => {
    await removeItemFromCart();
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
      ApiCall('post', body, API_END_POINTS.productAddToCart, {
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

  // const onMinus = (action, index) => {
  //   let q = 0;
  //   let p = 0;
  //   let b = [];

  //   b = detailsData?.map((_item, _i) => {
  //     let temp = Object.assign({}, _item);
  //     let currentQty = temp.qty;

  //     if (index == temp?.product_id + '') {
  //       if (action == 'less') {
  //         temp.qty = currentQty - 1;
  //         p = parseInt(sumTotal) - parseInt(temp?.product_price); // * parseInt(temp?.qty);
  //         if (parseInt(temp?.qty) == 0) {
  //           onMinusUpdateCart(temp?.product_id);
  //         }
  //       }
  //     }
  //     q = temp?.qty + q;

  //     return temp;
  //   });

  //   console.log('item featured dishes on plus -> ', JSON.stringify(q) + p);
  //   setSumQuantity(parseInt(q));
  //   if (q == 0) {
  //     setSumTotal(0);
  //     setOptionPrice(0);
  //     setCartProduct(null);
  //   } else {
  //     // setSumTotal(parseInt(p) - parseInt(optionPrice));
  //     setSumTotal(parseInt(p));
  //   }
  //   // setSumTotal(parseInt(p) - parseInt(sumTotal) - parseInt(optionPrice));
  //   setDetailsData(b);
  // };
  const [optionPrice, setOptionPrice] = useState(0);

  const updateFavUnFavProduct = (_item, idx) => {
    let a = detailsData.map((item, index) => {
      let temp = Object.assign({}, item);
      console.log(
        'aaaaaaaaaaaaaaaaaaaaaaaa 111 -> temp?.product_id == _item?.product_id',
        temp?.product_id == item?.product_id,
      );
      // let b = t?.products?.map((_i, _key) => {
      // let temp = Object.assign({}, _i);
      if (temp?.product_id == _item?.product_id) {
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
          temp.is_like = 1;
        }
      }
      return temp;
    });

    setDetailsData(a);
  };

  const [userId, setUserId] = useState('');
  const [favorite, setFavorite] = useState(false);

  const updateFavUnFav = () => {
    // if (item?.is_like) {
    //   ApiCall('post', body, API_END_POINTS.restaurantRemoveFavorite, {});
    // } else {
    //   ApiCall('post', body, API_END_POINTS.restaurantAddFavorite, {});
    // }

    if (favorite) {
      // console.log('aaaaaaaaaaaaaaaaaaaaaaaa 111 -> ', idx + ' ' + index);
      let body = {user_id: userId, vendor_id: receivedItem?.chef_id + ''};
      ApiCall('post', body, API_END_POINTS.restaurantRemoveFavorite, {
        Authorization: `Bearer ${apiToken}`,
      })
        .then(response => {
          console.log('restaurantRemoveFavorite ->>. ', response?.data);
          if (response?.data?.status) {
            // ShowMessage(response?.data?.message);
            setFavorite(false);
          }
        })
        .catch(() => {
          console.log('ERROR IN API => ');
        });
    } else {
      // console.log('aaaaaaaaaaaaaaaaaaaaaaaa 222 -> ', idx + ' ' + index);
      let body = {user_id: userId, vendor_id: receivedItem?.chef_id + ''};
      // console.log(
      //   'aaaaaaaaaaaaaaaaaaaaaaaa 111 -> ',
      //   idx + ' ' + JSON.stringify(body),
      // );

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

  const getInfoFromStorage = async id => {
    try {
      let t = '';
      await AsyncStorage.getItem('token', (err, value) => {
        if (err) {
        } else {
          if (value !== '' && value !== null) {
            setApiToken(value);
            getRestDetailsPage(value, id);
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
          } else {
            setUserId('');
          }
        }
      });
    } catch (error) {}
  };

  const getRestDetailsPage = (value, id) => {
    // console.log('id poassed -=--> ', id);
    let body = {
      vendor_id: id + '',
      // vendor_id: '4',
    };
    ApiCall('post', body, API_END_POINTS.getChefDetailPage, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        if (response?.data?.status) {
          let addons = [];
          let o = [];
          // let t = response?.data?.response?.map(item => {
          //   let tem = Object.assign({}, item);
          //   tem.qty = 0;
          //   return tem;
          // });

          let t = response?.data?.response?.map(item => {
            let temp = Object.assign({}, item);

            if (temp?.options && temp?.options?.length >= 1) {
              o = temp?.options?.map(o => {
                return {
                  ...o,
                  variant_qty: 1,
                };
              });
            }

            if (temp?.addons && temp?.addons?.length >= 1) {
              addons = temp?.addons?.map(o => {
                return {
                  ...o,
                  addon_qty: 1,
                  selected: false,
                };
              });
            }

            return {
              ...item,
              options: o,
              addons: addons,
              qty: 0,
            };
          });

          // console.log('getRest Details Page response  =-> ', JSON.stringify(t));

          setDetailsData(t);
        } else {
          setDetailsData([]);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      });
  };

  const [selectedOption, setSelectedOption] = React.useState(null);

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
            onPress={() => {
              setShowItemExist(false);
            }}
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
                  <Text style={style.addHeaderText}>Item in cart</Text>
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
                Wait, you have some products of other chef. Do you want to
                continue ?
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

  const onSelect = (item, index) => {
    let t = 0;
    // console.log('onSelect -=> ', JSON.stringify(item));
    if (selectedOption && selectedOption.variant_name === item.variant_name) {
      setSelectedOption(null);
      // t = parseInt(totalMoney) - parseInt(item.variant_price) + 0.0;
      t = parseInt(pData?.product_price) + 0.0;
      setShowRound(true);
    } else {
      setSelectedOption(item);
      t = parseInt(pData?.product_price) + parseInt(item?.variant_price) + 0.0;
      setShowRound(false);
      setOptionPrice(parseInt(item?.variant_price));
    }
    setTotalMoney(t);
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
                    // updateFavUnFav(newCartIndex);
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
                      isDisabled={true}
                      count={5}
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
                  ) : (
                    <Image
                      source={icons.non_pure_veg}
                      style={{
                        width: 8,
                        height: 8,
                        marginTop: 5,
                        marginEnd: 15,
                        // marginStart: 5,
                      }}
                    />
                  )}
                </TouchableOpacity>
              </TouchableOpacity>

              {
                pData?.options?.length >= 1 ? (
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
                      options={pData?.options}
                      var_count={optionListCount}
                      onPlus={onAddModalPlus}
                      onMinus={onAddModalMinus}
                      mainData={pData}
                      itemIndex={cartItemIndex}
                    />
                  </>
                ) : (
                  <View
                    style={{
                      paddingBottom: 50,
                    }}></View>
                )
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
              }
              {pData?.addons?.length >= 1 ? (
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
                    data={pData?.addons}
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
                                addItemAddon(pData?.addons, item?.addon, pData);
                              }}
                              style={{
                                flexDirection: 'row',
                              }}>
                              <Text style={[style.sizeText, {marginEnd: 10}]}>
                                ₹ {item?.price}
                              </Text>

                              <Image
                                source={
                                  item?.selected
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
              ) : null}
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
                // onPress={() => {
                //   // addToCartRedux(pData, optionListCount);
                //   // console.log('item - : ', JSON.stringify(pData));
                //   newPlus(pData?.product_id + '');
                //   setPData({});
                //   // setTotalMoney(0);
                //   setShowAdd(false);
                // }}
                onPress={() => {
                  console.log(
                    'address - > ' + cartVendorId + ' ' + pData?.vendor_id,
                  );
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
                  // setTotalMoney(0);
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
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: 18,
                    fontFamily: 'Segoe UI Bold',
                  }}>
                  Add Item ₹ {pData?.product_price}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={style.mainContainer}>
      <ScrollView
        style={style.mainContainer}
        showsVerticalScrollIndicator={false}>
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
            numberOfLines={1}
            ellipsizeMode="tail">
            {/* {toolBarTitle} */}
            {receivedItem?.name}
          </Text>

          {/* <TouchableOpacity
            style={{
              width: 22,
              height: 22,
              alignSelf: 'center',
              marginHorizontal: 15,
              position: 'absolute',
              right: 5,
            }}
            onPress={() => {
              navigation.navigate('Cart');
            }}>
            <Image
              source={icons.cart}
              style={{
                width: 22,
                height: 22,
                alignSelf: 'center',
                marginHorizontal: 15,
                tintColor: COLORS.primary,
              }}
            />
          </TouchableOpacity> */}
        </View>

        <View activeOpacity={0.9} style={style.resCard}>
          <View>
            <View
              style={{
                height: 105,
                width: 104.5,
                borderRadius: 100,
                marginVertical: 10,
                borderWidth: 2,
                borderColor: '#db2728',
                //   paddingStart: 5,
                justifyContent: 'center',
                backgroundColor: COLORS.white,
              }}>
              <Image
                source={{
                  uri: receivedItem?.image,
                }}
                style={{
                  height: 100,
                  width: 100,
                  borderRadius: 100,
                }}
              />
            </View>
            {receivedItem?.vendor_food_type == '1' ? (
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
            style={{
              marginTop: 8,
              alignItems: 'flex-start',
              flex: 1,
            }}>
            <Text
              style={[
                style.text,
                {
                  color: COLORS.black,
                  fontFamily: 'Segoe UI Bold',
                  fontSize: 18,
                },
              ]}
              numberOfLines={1}>
              {receivedItem?.name}
            </Text>

            <Text style={[style.tagline]} numberOfLines={1}>
              Age - {receivedItem?.Age} yrs Cooking Exp -{' '}
              {receivedItem?.experience} Yrs
            </Text>
            <Text style={[style.tagline]} numberOfLines={1}>
              {receivedItem?.cuisines_name?.toString() ||
                receivedItem?.categories?.toString()}
              {/* {receivedItem?.categories?.toString()} */}
            </Text>
            <View style={style.resStarView}>
              {/* <Image source={icons.star} style={style.distance_logo} /> */}
              {/* <AntDesign name="staro" color={'gold'} />
              <AntDesign name="staro" color={'gold'} />
              <AntDesign name="staro" color={'gold'} />
              <AntDesign name="staro" color={'gold'} />
              <AntDesign name="staro" color={'gold'} /> */}

              <AirbnbRating
                      isDisabled={true}
                      count={5}
                showRating={false}
                defaultRating={parseInt(receivedItem?.vendor_ratings)}
                size={10}
              />
              {receivedItem?.vendor_ratings == 0 ? null : (
                <>
                  <Text style={[style.distance]} numberOfLines={1}>
                    {receivedItem?.vendor_ratings}
                  </Text>
                  <Text
                    style={{
                      marginHorizontal: 5,
                      fontFamily: 'Segoe UI',
                      fontSize: 12,
                      color: '#0638ff',
                      alignSelf: 'center',
                      marginVertical: 2,
                    }}>
                    ({receivedItem?.review_count} reviews)
                  </Text>
                </>
              )}
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                updateFavUnFav();
              }}
              style={style.fav}>
              <Image
                source={favorite ? icons.favorite : icons.unfavorite}
                style={{
                  width: 25,
                  height: 25,
                  // tintColor: '#ff0000',
                }}
              />
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginStart: 15,
                marginTop: 5,
              }}>
              <Image
                source={icons.scooter}
                style={[
                  style.distance_logo,
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
                    marginStart: 5,
                  },
                ]}
                numberOfLines={1}>
                {receivedItem?.distance} KM
              </Text>
            </View>
            <Text
              style={{
                fontFamily: 'Segoe UI',
                fontSize: 14,
                color: COLORS.grey,
                marginStart: 15,
              }}>
              Order Served - {receivedItem?.order_served}
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: COLORS.black,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
            marginTop: -10,
            paddingVertical: 3,
            borderRadius: 15,
            // top: 5,
          }}>
          <Text
            style={{
              fontFamily: 'Segoe UI',
              fontSize: 14,
              color: COLORS.white,
            }}>
            Speciality - {receivedItem?.food_specility}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            navigation.navigate('Profile', {item: receivedItem});
          }}
          style={{
            // width: '43%',
            height: 40,
            // backgroundColor: COLORS.primary,
            borderRadius: 10,
            // marginTop: 20,
            marginEnd: 20,
            marginHorizontal: 15,
            alignItems: 'center',
            alignSelf: 'flex-end',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: '#0638ff',
              fontSize: 12,
              fontFamily: 'Segoe UI',
              textDecorationLine: 'underline',
            }}>
            View Full Profile
          </Text>
        </TouchableOpacity>

        <View>
          <Text style={[style.moodText]}>Must Try!</Text>
        </View>
        {detailsData.length == 0 ? (
          <ChefFoodItemSkeleton />
        ) : (
          <FlatList
            style={{
              marginTop: 10,
            }}
            extraData={detailsData}
            data={detailsData}
            showsHorizontalScrollIndicator={false}
            renderItem={renderChefFoodItem}
          />
        )}
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 20,
            marginTop: 40,
            backgroundColor: '#e7e7e7',
            // padding: 10,
            justifyContent: 'space-between',
          }}>
          <View>
            <Text
              style={{
                marginStart: 15,
                marginTop: 15,
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
                // paddingBottom: 10,
              }}>
              {receivedItem?.fssai_lic_no}
            </Text>
          </View>
          <Image
            source={{
              uri: 'https://seeklogo.com/images/F/fssai-logo-C7400699BD-seeklogo.com.png',
            }}
            style={{
              width: 80,
              height: 80,
              resizeMode: 'center',
              marginEnd: 15,
            }}
          />
        </View>
      </ScrollView>

      {sumQuantity > 0 ? (
        <View
          style={{
            padding: 10,
            backgroundColor: COLORS.primary,
            position: 'relative',
            bottom: 0,
            left: 0,
            right: 0,
            flexDirection: 'row',
            // flex: 1,
            justifyContent: 'space-between',
          }}>
          <View>
            <Text
              style={{
                fontFamily: 'Segoe UI Bold',
                color: COLORS.white,
              }}>
              {sumQuantity} ITEM
            </Text>

            <Text
              style={{
                marginTop: 5,

                fontFamily: 'Segoe UI Bold',
                color: COLORS.white,
              }}>
              ₹ {sumTotal} plus taxes
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
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
      ) : null}
      {renderAddModal()}
      {renderItemExist()}
    </SafeAreaView>
  );
};

export default ChefDetails;

const styles = StyleSheet.create({
  distance: {
    color: COLORS.grey,
    marginTop: 2,
    fontFamily: 'Segoe UI',
    fontSize: 12,
    marginStart: 10,
    // paddingBottom: 15,
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
chef products not coming in  chef-home api
add description to all products each and every api
add chilli level  to all products of chef
add fssai license number to all products and vendor/chef each and every api in chef section
chef full size image
chef profile image 
chef cuisines missing  add to each and every api of chef 
chef categories missing add to each and every api of chef 
*/
