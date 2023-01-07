import AsyncStorage from '@react-native-async-storage/async-storage';
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
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {COLORS, icons} from '../../../constants';
import ApiCall from '../../../network/ApiCall';
import {API_END_POINTS} from '../../../network/ApiEndpoints';
import RadioButtons from '../../../utils/AddItemRadioButton';
import ToolbarWithIcon from '../../../utils/ToolbarWithIcon';
import {ShowMessage} from '../../../utils/Utility';
import style from '../style';
import {Rating, AirbnbRating} from 'react-native-elements';

const RestDishInformation = ({navigation, route}) => {
  const [receivedItem, setReceivedItem] = useState({});
  const [receivedVendorId, setReceivedVendorId] = useState({});
  const [receivedCartProduct, setReceivedCartProduct] = useState(null);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    let {item} = route.params;
    let {vendorId} = route.params;
    let {cart} = route.params;

    if (item.is_like == 0) {
      setFavorite(false);
    } else {
      setFavorite(true);
    }

    setReceivedVendorId(vendorId);
    setReceivedItem(item);
    getInfoFromStorage();
    console.log('RestDishInformation -> ', JSON.stringify(item));
  }, []);

  const [selectedOption, setSelectedOption] = React.useState(null);
  const [showRound, setShowRound] = useState(true);
  const [optionPrice, setOptionPrice] = useState(0);

  const onSelect = (item, index) => {
    let t = 0;
    // console.log('onSelect -=> ', JSON.stringify(item));
    if (selectedOption && selectedOption.variant_name === item.variant_name) {
      setSelectedOption(null);
      // t = parseInt(totalMoney) - parseInt(item.variant_price) + 0.0;
      t = parseInt(pData?.product_price) + 0.0;
      setShowRound(true);
      // setOptionPrice(0);
    } else {
      setSelectedOption(item);
      t = parseInt(pData?.product_price) + parseInt(item?.variant_price) + 0.0;
      setShowRound(false);
      setOptionPrice(parseInt(item?.variant_price));
    }
    setTotalMoney(t);
  };

  const closeAddModal = () => {
    setShowAdd(!showAdd);
  };
  const [addItemIndex, setAddItemIndex] = useState('');

  const [showAdd, setShowAdd] = useState(false);
  const [pData, setPData] = useState({});
  const [itemCount, setItemCount] = useState(1);
  const [totalMoney, setTotalMoney] = useState(0);
  const addItem = (arr, id, mainData) => {
    // let _tempItem = itemCount + 1;
    // setItemCount(_tempItem);
    let t = 0;
    let a = arr.map(item => {
      var temp = Object.assign({}, item);
      // console.log('temp --->>> ', JSON.stringify(temp));
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
      addons: optionAddonData[1]?.addons,
    };
    setOptionAddonData(r);
  };

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
    } catch (error) {}
  };

  const addItemAddon = (arr, id, mainData) => {
    let t = 0;
    let a = arr.map(item => {
      var temp = Object.assign({}, item);
      // console.log('temp --->>> ', JSON.stringify(temp));
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
    // console.log(
    //   'temp  optionsoptionsoptions--->>> ',
    //   JSON.stringify(optionAddonData?.options),
    // );

    let r = {
      options: optionAddonData?.options || [],
      addons: a,
    };
    // console.log('temp --->>> ', JSON.stringify(r));

    setOptionAddonData(r);
  };

  const onPlusUpdateCart = async (productId, qty) => {
    // console.log(
    //   'item featured on PlusUpdateCart tem received -> ',
    //   productId + ' ' + qty,
    // );

    // await removeItemFromCart();
    let body = JSON.parse(JSON.stringify(receivedItem));

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
      'onPlusUpdateCart BODY IN LAST SCENE -> ',
      JSON.stringify(body),
    );

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
  };

  const [apiToken, setApiToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [cartProduct, setCartProduct] = useState(null);

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
        // }, 1000);
      });
  };
  const [userId, setUserId] = useState('');

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
  const [vendorId, setVendorId] = useState('');

  const addToCartNotCustomizable = async (i, itemId) => {
    // console.log('add to cart rec item-> ', JSON.stringify(i));
    await removeItemFromCart();
    if (cartProduct != null) {
      let body = JSON.parse(JSON.stringify(cartProduct));

      body?.products?.push({
        product_id: i.product_id + '',
        product_qty: i?.qty <= 0 ? 1 + '' : i?.qty + '',
      });
      setCartProduct(body);

      // console.log(
      //   'cartProductcartProductcartProductcartProductcartProductcartProductcartProductcartProduct  -> ',
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
            // ShowMessage(response?.data?.message);
            setTotalMoney(0);
            onPlus('more', itemId);
            setShowRound(true);
          } else {
          }
        })
        .catch(error => {
          console.log('ERROR IN ADD TO CART API =-> ', error);
        })
        .finally(() => {
          setaddLoading(false);
        });
    } else {
      let body = {
        user_id: userId,
        vendor_id: receivedVendorId + '' || 4 + '',
        products: [
          {
            product_id: i.product_id + '',
            product_qty: i?.qty <= 0 ? 1 + '' : i?.qty + '',
          },
        ],
      };

      setCartProduct(body);

      ApiCall('post', body, API_END_POINTS.productAddToCart, {
        Authorization: `Bearer ${apiToken}`,
      })
        .then(response => {
          // console.log(
          //   'RESPONSE IN ADD TO CART API =-> ',
          //   JSON.stringify(response?.data),
          // );
          if (response?.data?.status) {
            // ShowMessage(response?.data?.message);
            setTotalMoney(0);
            onPlus('more', itemId);
            setShowRound(true);
          } else {
          }
        })
        .catch(error => {
          console.log('ERROR IN ADD TO CART API =-> ', error);
        })
        .finally(() => {
          setaddLoading(false);
        });
    }
  };
  const [addloading, setaddLoading] = useState(false);

  const onPlus = (action, index) => {
    let t = {...receivedItem};
    let a = {
      ...t,
      qty: t.qty + 1,
    };
    setReceivedItem(a);
    if (parseInt(t.qty) > 1) {
      onPlusUpdateCart(t.product_id + '', t?.qty);
    }
  };
  const [sumTotal, setSumTotal] = useState(0);
  const [sumQuantity, setSumQuantity] = useState(0);
  const onMinus = (action, index) => {
    let t = {...receivedItem};
    let a = {
      ...t,
      qty: t.qty > 0 ? t.qty - 1 : t.qty,
    };
    setReceivedItem(a);
  };

  const addToCart = (i, _ind) => {
    console.log('add to cart rec item-> ', JSON.stringify(userId));
    removeItemFromCart();
    let body = {
      user_id: userId,
      vendor_id: receivedVendorId + '' || 4 + '',

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
          // console.log('add to cart rec item temp-> ', JSON.stringify(temp));
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
        vendor_id: receivedVendorId + '' || 4 + '',

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
        vendor_id: receivedVendorId + '' || 4 + '',
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
    console.log(
      'add to cart rece item temp body in last -> ',
      JSON.stringify(body),
    );

    ApiCall('post', body, API_END_POINTS.productAddToCart, {
      Authorization: `Bearer ${apiToken}`,
    })
      .then(response => {
        // console.log(
        //   'RESPONSE IN ADD TO CART API =-> ',
        //   JSON.stringify(response?.data),
        // );
        if (response?.data?.status) {
          // ShowMessage(response?.data?.message);
          if (showAdd) {
            closeAddModal();
          }
          setPData({});
          setSumTotal(parseInt(totalMoney) + parseInt(sumTotal));

          setTotalMoney(0);
          setOptionAddonData([]);
          onPlus('more', addItemIndex);
          setShowRound(true);
        } else {
          ShowMessage(response?.data?.error + '');
          onPlus('more', addItemIndex);
          setSumTotal(parseInt(totalMoney) + parseInt(sumTotal));
          setShowRound(true);
          // closeAddModal();
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

  const [optionAddonData, setOptionAddonData] = useState({});

  // const updateFavUnFav = () => {
  //   // if (item?.is_like) {
  //   //   ApiCall('post', body, API_END_POINTS.restaurantRemoveFavorite, {});
  //   // } else {
  //   //   ApiCall('post', body, API_END_POINTS.restaurantAddFavorite, {});
  //   // }

  //   if (favorite) {
  //     let body = {user_id: userId, vendor_id: receivedItem?.id + ''};
  //     ApiCall('post', body, API_END_POINTS.restaurantRemoveFavorite, {
  //       Authorization: `Bearer ${apiToken}`,
  //     })
  //       .then(response => {
  //         if (response?.data?.status) {
  //           ShowMessage(response?.data?.message);
  //           setFavorite(false);
  //         }
  //       })
  //       .catch(() => {
  //         console.log('ERROR IN API => ');
  //       });
  //   } else {
  //     let body = {user_id: userId, vendor_id: receivedItem?.id + ''};
  //     // console.log(
  //     //   'aaaaaaaaaaaaaaaaaaaaaaaa 111 -> ',
  //     //   idx + ' ' + JSON.stringify(body),
  //     // );

  //     ApiCall('post', body, API_END_POINTS.restaurantAddFavorite, {
  //       Authorization: `Bearer ${apiToken}`,
  //     })
  //       .then(response => {
  //         if (response?.data?.status) {
  //           setFavorite(true);

  //           ShowMessage(response?.data?.message);
  //           console.log('restaurantRemoveFavorite ->>. ', response?.data);
  //         }
  //       })
  //       .catch(() => {
  //         console.log('ERROR IN API => ');
  //       });
  //   }
  // };

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
            style={{flex: 1}}></TouchableOpacity>
          <View style={style.additemView}>
            <View
              style={[
                {
                  elevation: 10,
                  backgroundColor: COLORS.white,
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
                  <Text></Text>
                </View>
                <TouchableOpacity onPress={() => closeAddModal()}>
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
            <ScrollView style={style.middleView}>
              <View
                style={{
                  backgroundColor: '#e7e7e7',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    // justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: 18,
                      fontFamily: 'Segoe UI',
                      marginTop: 10,
                      marginStart: 20,
                    }}>
                    {pData?.product_name}
                  </Text>
                  <Image
                    source={icons.pure_veg}
                    style={{
                      width: 8,
                      height: 8,
                      marginTop: 5,
                      marginStart: 5,
                    }}
                  />
                </View>
                <Text
                  style={{
                    color: COLORS.grey,
                    fontSize: 14,
                    fontFamily: 'Segoe UI',
                    marginTop: 5,
                    marginStart: 20,
                  }}>
                  South Indian
                </Text>
                <Text
                  style={{
                    color: COLORS.darkGray,
                    fontSize: 16,
                    fontFamily: 'Segoe UI',
                    marginTop: 5,
                    marginStart: 20,
                    paddingBottom: 10,
                  }}>
                  ₹ {pData?.product_price}
                </Text>
              </View>

              {optionAddonData?.options?.length >= 1 ? (
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
                  {/* <FlatList
                    data={optionAddonData?.options}
                    renderItem={({item, index}) => {
                      return (
                        <View
                          style={[
                            // style.listView,
                            // style.shadow,
                            {paddingLeft: 24, paddingRight: 6},
                          ]}>
                          <View style={[style.rowView, {marginTop: 15}]}>
                            <View style={{flex: 1, paddingRight: 10}}>
                              <Text style={[style.sizeText]}>
                                {item?.variant_name}
                              </Text>
                            </View>
                            <TouchableOpacity
                              onPress={() => {
                                // setSelected(!selected);
                                addItem(
                                  optionAddonData?.options,
                                  item?.variant_name,
                                  pData,
                                );
                              }}
                              style={{
                                flexDirection: 'row',
                              }}>
                              <Text style={[style.sizeText, {marginEnd: 10}]}>
                                ₹ {item?.variant_price}
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
                  /> */}
                  <RadioButtons
                    selectedOption={selectedOption}
                    onSelect={onSelect}
                    options={optionAddonData?.options}
                  />
                </>
              ) : (
                <View
                  style={{
                    marginTop: 15,
                  }}>
                  <ShimmerPlaceHolder
                    LinearGradient={LinearGradient}
                    height={20}
                    width={Dimensions.get('window').width * 0.5}
                    style={{
                      borderRadius: 5,
                      marginStart: 15,
                    }}
                  />
                  <ShimmerPlaceHolder
                    LinearGradient={LinearGradient}
                    height={15}
                    width={Dimensions.get('window').width * 0.93}
                    style={{
                      borderRadius: 5,
                      marginStart: 15,
                      marginTop: 5,
                    }}
                  />
                  <ShimmerPlaceHolder
                    LinearGradient={LinearGradient}
                    height={15}
                    width={Dimensions.get('window').width * 0.93}
                    style={{
                      marginTop: 5,
                      borderRadius: 5,
                      marginStart: 15,
                    }}
                  />
                </View>
              )}
              {optionAddonData?.addons?.length >= 1 ? (
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
                    data={optionAddonData?.addons}
                    renderItem={({item, index}) => {
                      return (
                        <View
                          style={[
                            // style.listView,
                            // style.shadow,
                            {paddingLeft: 24, paddingRight: 6},
                          ]}>
                          <View style={[style.rowView, {marginTop: 15}]}>
                            <View style={{flex: 1, paddingRight: 10}}>
                              <Text style={[style.sizeText]}>
                                {item?.addon}
                              </Text>
                            </View>

                            <TouchableOpacity
                              onPress={() => {
                                addItemAddon(
                                  optionAddonData?.addons,
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
                </>
              ) : null}

              <TouchableOpacity
                onPress={() => {
                  addToCart(pData);
                }}
                activeOpacity={0.8}
                style={{
                  height: 50,
                  paddingHorizontal: 25,
                  backgroundColor: COLORS.primary,
                  marginTop: 25,
                  marginBottom: 10,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                }}>
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: 22,
                    fontFamily: 'Segoe UI Bold',
                  }}>
                  Add Item ₹ {totalMoney}
                  {/* Add Item ₹ {pData?.product_price} */}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={style.mainContainer}>
      <ScrollView
        style={style.mainContainer}
        contentContainerStyle={{
          flexGrow: 1,
        }}
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
            {receivedItem?.product_name}
          </Text>

          <TouchableOpacity
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
          </TouchableOpacity>
        </View>

        <View
          style={{
            elevation: 10,
            backgroundColor: COLORS.white,
            margin: 10,
            borderRadius: 15,
            width: '95%',
            // height: 350,
          }}>
          <Image
            source={{
              uri: receivedItem?.image,
            }}
            style={{
              width: '95%',
              height: 300,
              margin: 10,
              borderRadius: 10,
            }}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setFavorite(!favorite);
            }}
            style={styles.fav}>
            <Image
              source={favorite ? icons.favorite : icons.unfavorite}
              style={{
                width: 30,
                height: 30,
              }}
            />
          </TouchableOpacity>
        </View>
        <Image
          source={icons.pure_veg}
          style={{
            width: 10,
            height: 10,
            // alignSelf: 'center',
            marginTop: 15,
            position: 'absolute',
            right: 10,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            // justifyContent: 'center',
            margin: 1,
          }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Segoe UI Bold',
              color: COLORS.black,
              //   flexGrow: 1,
              marginTop: 20,
              marginStart: 20,
              marginEnd: 10,
            }}
            // numberOfLines={1}
            ellipsizeMode="tail">
            {receivedItem?.product_name}
            {/* dsjkas hdjk sahdj sahdj ashdj ka shd jk ash jd hs ajd h sa jk */}
          </Text>

          <Image
            source={icons.chilli_level}
            style={{
              width: 22,
              height: 22,
              alignSelf: 'center',
              marginTop: 15,
              marginStart: 0,
            }}
          />
          {/* <Image
            source={icons.chilli_level}
            style={{
              width: 13,
              height: 22,
              alignSelf: 'center',
              marginTop: 15,
            }}
          /> */}
        </View>
        {receivedItem?.categoryName != null ? (
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Segoe UI',
              color: COLORS.grey,
              marginTop: 10,
              marginStart: 20,
              marginEnd: 5,
            }}
            numberOfLines={1}
            ellipsizeMode="tail">
            {receivedItem?.categoryName}
          </Text>
        ) : null}
        {receivedItem?.product_rating != 0 ? (
          <View
            style={{
              alignSelf: 'flex-start',
              alignItems: 'center',
              flexDirection: 'row',
              // marginBottom: 5,
              marginTop: 10,
              marginStart: 20,
              // backgroundColor: COLORS.primary,
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
              defaultRating={parseInt(receivedItem.product_rating)}
              size={10}
            />
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
              {receivedItem.product_rating}
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
              {receivedItem.product_rating}) Reviews
            </Text>
          </View>
        ) : null}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            // backgroundColor: COLORS.primary,
          }}>
          <Text
            style={[
              {
                alignSelf: 'flex-start',
                color: COLORS.black,
                fontFamily: 'Segoe UI Bold',
                fontSize: 18,
                marginTop: 20,
                marginStart: 20,
              },
            ]}
            numberOfLines={1}>
            ₹{receivedItem?.product_price}
          </Text>

          <View
            style={{
              marginEnd: 25,
            }}>
            {receivedItem?.customizable == 'true' ? (
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
            {receivedItem?.qty >= 1 ? (
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
                    onMinus('less', receivedItem?.product_id + '');
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
                  {receivedItem?.qty}
                </Text>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                  }}
                  onPress={() => {
                    onPlus('more', receivedItem?.product_id + '');
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
                activeOpacity={0.8}
                onPress={() => {
                  if (receivedItem?.customizable == 'true') {
                    setShowAdd(true);

                    // console.log(receivedItem?.isClosed, 'is Closed');
                    // console.log('items', JSON.stringify(item));
                    setPData(receivedItem);
                    setTotalMoney(receivedItem?.product_price);
                    setOptionAddonData([]);
                    setAddItemIndex(receivedItem?.product_id + '');
                    getRestProductOptionMenu(receivedItem, receivedItem);
                  } else {
                    addToCartNotCustomizable(
                      receivedItem,
                      receivedItem?.product_id + '',
                    );
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
          </View>
        </View>
        <Text
          style={[
            {
              alignSelf: 'flex-start',
              color: COLORS.black,
              fontFamily: 'Segoe UI',
              fontSize: 16,
              marginTop: 25,
              marginStart: 20,
              textDecorationLine: 'underline',
            },
          ]}
          numberOfLines={1}>
          Description
        </Text>

        <Text
          style={[
            {
              alignSelf: 'flex-start',
              color: COLORS.black,
              fontFamily: 'Segoe UI',
              fontSize: 14,
              marginTop: 15,
              marginEnd: 15,
              marginStart: 20,
            },
          ]}>
          {receivedItem?.product_name}
        </Text>
        {renderAddModal()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default RestDishInformation;

const styles = StyleSheet.create({
  star_logo: {
    width: 12,
    height: 12,

    resizeMode: 'cover',
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
    right: 10,
    top: 10,
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: '#f5f5f5',
    elevation: 10,
  },
});
