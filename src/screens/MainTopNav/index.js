import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useSelector} from 'react-redux';
import {COLORS, icons, SIZES, STRINGS} from '../../constants';
import ApiCall from '../../network/ApiCall';
import {API_END_POINTS} from '../../network/ApiEndpoints';
import CustomEditText from '../../utils/EditText/CustomEditText';
import {ShowMessage} from '../../utils/Utility';
import style from './style';
import TopTabBar from './top_tab_nav';
import {useIsFocused} from '@react-navigation/native';
import CheckBox from 'react-native-check-box';
import Restaurant from '../Restaurant';

// const MainTopNav = props => {
const MainTopNav = ({navigation, route}) => {
  // console.log('ERROR IN getCuisines API -> ', route?.params);
  const [showLiveOrder, setShowLiveOrder] = useState(false);

  const [changeOne, setChangeOne] = useState(false);
  const [changeTwo, setChangeTwo] = useState(false);
  const [changeThree, setChangeThree] = useState(false);

  const [apiToken, setApiToken] = useState('');

  useEffect(() => {
    getInfoFromStorage();
  }, []);

  const [userId, setUserId] = useState('');

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          style.content,
          {
            padding: 10,
          },
        ]}
        onPress={() => {
          //   navigation.navigate('DishInformation', {item});
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
          style={style.circle}
          onPress={() => {
            onSelectAddress(item, index);
          }} // we set our value state to key
        >
          {dummyAddress && dummyAddress?.house_no === item.house_no && (
            <View style={style.checkedCircle} />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    );
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
          } else {
            setApiToken('');
          }
        }
      });
      await AsyncStorage.getItem('userId', (err, value) => {
        if (err) {
        } else {
          if (value !== '' && value !== null) {
            getUserCartCount(t, value);
            getUserSavedAddress(t, value);
            setUserId(value);
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
            setDummyAddress(JSON.parse(value));
            // console.log('userAddress', value);
          } else {
            setConfirmObject(null);
          }
        }
      });
    } catch (error) {}
  };

  const [data, setData] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);

  const getUserSavedAddress = (value, uid) => {
    // console.log('daa -> ', JSON.stringify(body) + value);
    setAddressLoading(true);
    let body = {
      user_id: uid,
    };
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
  const [confirmObject, setConfirmObject] = useState({
    // address_type: '1',
    // reach: 'near water tank',
    // house_no: 'meera ki bawdi',
  });

  const [cartCount, setCartCount] = useState(0);
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
          if (response?.data?.response?.cart.length >= 1) {
            setCartCount(response?.data?.response?.cart.length);
          } else {
            setCartCount(0);
          }
        } else {
          setCartCount(0);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {});
  };
  const getAsyncAddress = async () => {
    try {
      await AsyncStorage.getItem('userAddress', (err, value) => {
        if (err) {
        } else {
          if (value !== '' && value !== null) {
            setConfirmObject(JSON.parse(value));
            setDummyAddress(JSON.parse(value));
            // console.log('userAddress', value);
          } else {
            setConfirmObject(null);
          }
        }
      });
    } catch (error) {}
  };

  const [showAddModal, setShowAddModal] = useState(false);

  const [showAddChangeModal, setShowAddChangeModal] = useState(false);

  const [dummyAddress, setDummyAddress] = useState({});

  const onSelectAddress = (item, index) => {
    // console.log('confirm object =? ', JSON.stringify(item));

    if (dummyAddress && dummyAddress.id === item.id) {
      setDummyAddress(null);
    } else {
      setDummyAddress(item);
      // setConfirmObject(item);
    }
  };

  const [primary, setPrimary] = React.useState(false);

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
            ShowMessage(response?.data?.message);
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

  const isFocused = useIsFocused();

  useEffect(() => {
    getUserCartCountFocus();
  }, [navigation, isFocused]);

  const getUserCartCountFocus = async (t, value) => {
    let tok = '';
    let uid = '';
    await AsyncStorage.getItem('token', (err, value) => {
      if (err) {
      } else {
        if (value !== '' && value !== null) {
          tok = value;
        } else {
        }
      }
    });
    await AsyncStorage.getItem('userId', (err, value) => {
      if (err) {
      } else {
        if (value !== '' && value !== null) {
          uid = value;
        } else {
        }
      }
    });
    let body = {
      user_id: uid,
    };
    ApiCall('post', body, API_END_POINTS.get_cart_count, {
      Authorization: `Bearer ${tok}`,
    })
      .then(response => {
        if (response?.data?.status) {
          // setCartCount(response?.data?.response?.cart?.total_product_in_cart);
          setCartCount(response?.data?.response?.cart?.products_count);
        } else {
          setCartCount('');
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {});
  };

  const [addloading, setaddLoading] = useState(false);
  const [houseNumber, setHouseNumber] = useState('');
  const [houseNumberError, setHouseNumberError] = useState(false);
  const [reachAddress, setReachAddress] = useState('');
  const [reachAddressError, setReachAddressError] = useState(false);
  const [reachAddressContact, setReachAddressContact] = useState('');
  const [reachAddressContactError, setReachAddressContactError] =
    useState(false);

  const [selectedOption, setSelectedOption] = React.useState(null);

  const onSelect = (item, index) => {
    if (selectedOption && selectedOption.id === item.id) {
      setSelectedOption(null);
    } else {
      setSelectedOption(item);
    }
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
  let cartItemCount = useSelector(state => state.state.cartCount);
  // console.log(' cartItemCount  =>> ', cartItemCount.length);
  return (
    <ScrollView
      style={style.mainContainer}
      // contentContainerStyle={style.mainContainer}
      contentContainerStyle={{
        flexGrow: 1,
      }}
      nestedScrollEnabled={true}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />

      {/* <Modal
        transparent={true}
        animationType={'none'}
        visible={showAddChangeModal}
        onRequestClose={() => {
          console.log('close modal');
          setShowAddChangeModal(false);
        }}>
        <View style={style.modalBackground}>
          <View style={style.activityIndicatorWrapper}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text
                style={[
                  style.addressText,
                  {marginBottom: 10, marginTop: 5, marginStart: 15},
                ]}>
                Select delivery address
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
                  setShowAddChangeModal(false);
                }}
              />
            </View>
            <FlatList
              extraData={data}
              data={data}
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
                      },
                    ]}>
                    No delivery address found
                  </Text>
                );
              }}
            />
         
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginVertical: 10,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setShowAddChangeModal(false);
                  setShowAddModal(true);
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
                    // style.addressText,
                    {
                      color: COLORS.primary,
                      fontSize: 16,
                      fontFamily: 'Segoe UI Bold',
                      textAlign: 'center',
                      // marginVertical: 10,
                    },
                  ]}>
                  + Add address
                </Text>
              </TouchableOpacity>
              {data?.length > 0 ? (
                <TouchableOpacity
                  onPress={() => {
                    if (dummyAddress != null) {
                      AsyncStorage.setItem(
                        'userAddress',
                        JSON.stringify(dummyAddress),
                      );
                      setConfirmObject(dummyAddress);
                      setShowAddChangeModal(false);
                      getAsyncAddress();
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
                    Confirm
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
      
      </Modal> */}

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
                <Text style={[style.addressText, {marginStart: 20}]}>
                  Select delivery address
                </Text>
                <FontAwesome
                  name="close"
                  size={20}
                  color={COLORS.black}
                  style={{
                    marginEnd: 25,
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
                    marginBottom: 56,
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
              {/* <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginVertical: 10,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    // setShowAddChangeModal(false);
                    // setShowAddModal(true);
                    navigation.navigate('Maps');
                    setShowAddChangeModal(false);
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
                   <FontAwesome size={20} color={COLORS.white} name="plus" />
                    + Add address
                  </Text>
                </TouchableOpacity>
                {data?.length > 0 ? (
                  <TouchableOpacity
                    onPress={() => {
                      if (dummyAddress != null) {
                        AsyncStorage.setItem(
                          'userAddress',
                          JSON.stringify(dummyAddress),
                        );
                        setConfirmObject(dummyAddress);
                        setShowAddChangeModal(false);
                        getAsyncAddress();
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
                      borderWidth: 1,
                      borderColor: COLORS.primary,
                      marginHorizontal: 10,
                    }}>
                     <FontAwesome size={20} color={COLORS.white} name="plus" /> 
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
              </View> */}
              {/* <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Maps');
                    setShowAddChangeModal(false);
                  }}
                  activeOpacity={0.8}
                  style={{
                    // backgroundColor: COLORS.primary,
                    // flex: 1,
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
                        color: COLORS.primary,
                        fontSize: 16,
                        fontFamily: 'Segoe UI Bold',
                        textAlign: 'center',
                        // marginVertical: 10,
                      },
                    ]}>
                    Pick address from Map
                  </Text>
                </TouchableOpacity> */}
              <View
                style={{
                  padding: 11,
                  backgroundColor: COLORS.lightGray,
                }}></View>
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
                // setShowAddChangeModal(false);
                // setShowAddModal(true);

                // navigation.navigate('Maps');
                // setShowAddChangeModal(false);

                // setShowAddChangeModal(false);
                // setShowAddModal(true);
                setShowAddChangeModal(false);
                navigation.navigate('Maps', {
                  lat: userLatitude,
                  long: userLongitude,
                });
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
                height: 45,
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
                + Add address
              </Text>
            </TouchableOpacity>
            {data?.length > 0 ? (
              <TouchableOpacity
                onPress={() => {
                  if (dummyAddress != null) {
                    AsyncStorage.setItem(
                      'userAddress',
                      JSON.stringify(dummyAddress),
                    );
                    setConfirmObject(dummyAddress);
                    setShowAddChangeModal(false);
                    getAsyncAddress();
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
                  borderWidth: 1,
                  borderColor: COLORS.primary,
                  marginHorizontal: 10,
                  height: 45,
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
              {/* <TouchableOpacity
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
              </TouchableOpacity> */}

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setShowAddChangeModal(false);
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
                    paddingHorizontal: 35,
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
      {/* <Modal
        transparent={true}
        animationType={'none'}
        visible={showAddModal}
        onRequestClose={() => {
          console.log('close modal');
          setShowAddModal(false);
        }}>
        <View style={style.modalBackground}>
          <View style={style.activityIndicatorWrapper}>
            <Text style={[style.addressText, {marginVertical: 10}]}>
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
            <RadioButtons
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
                  style.addressText,
                  {marginHorizontal: 15, color: COLORS.white},
                ]}>
                Add
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}

      <View style={style.header}>
        <Image
          source={icons.location}
          style={[
            style.headerImage,
            {
              marginStart: 15,
            },
          ]}
        />
        <TouchableOpacity
          onPress={() => {
            setShowAddChangeModal(!showAddChangeModal);
            getUserSavedAddress(apiToken, userId);
          }}
          activeOpacity={0.8}
          style={{
            flexGrow: 1,
          }}>
          <View style={style.headerInnerContainer}>
            <View
              style={{
                flexDirection: 'row',
                // flex: 1,
                maxWidth: Dimensions.get('window').width / 1.7 + 0,
              }}>
              <Text style={style.placeText} numberOfLines={1}>
                {confirmObject?.address_type == '1'
                  ? 'Home'
                  : confirmObject?.address_type == '2'
                  ? 'Work'
                  : confirmObject?.address_type == '3'
                  ? 'Others'
                  : route?.params?.currentAddress}
              </Text>
            </View>
            <Image
              source={icons.location_change}
              style={{
                resizeMode: 'center',
                marginStart: 5,
                height: 10,
                width: 10,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              // flex: 1,
              maxWidth: Dimensions.get('window').width / 1.25 + 0,
            }}>
            <Text style={style.locationText} numberOfLines={1}>
              {confirmObject?.address_type == '1'
                ? confirmObject?.house_no
                : confirmObject?.address_type == '2'
                ? confirmObject?.house_no
                : confirmObject?.address_type == '3'
                ? confirmObject?.house_no
                : route?.params?.city}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Cart');
          }}>
          <Image
            source={icons.cart}
            style={[
              style.headerImage,
              {
                marginEnd: 20,
                tintColor: COLORS.primary,
              },
            ]}
          />
          {cartItemCount > 0 ? (
            <View
              style={{
                borderRadius: 25,
                backgroundColor: COLORS.cartCountBgColor,
                position: 'absolute',
                top: -5,
                right: 15,
                paddingHorizontal: 5,
              }}>
              <Text
                style={{
                  color: COLORS.white,
                  fontSize: 12,
                }}>
                {cartItemCount}
              </Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>

      {/* <TouchableOpacity
        onPress={() => {
          // navigation.navigate('Cart');
          if (route?.params?.screen == 'Chef') {
            navigation.navigate('ChefSearch');
          } else if (route?.params?.screen == 'Restaurant') {
            navigation.navigate('Search');
          } else {
          }
        }}
        style={{
          height: 35,
          width: '95%',
          borderColor: '#707070',
          borderWidth: 1,
          borderRadius: 5,
          alignItems: 'center',
          // justifyContent: 'center',
          alignSelf: 'center',
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
          Search...
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

      {/* //////////////////////////9ZF5ycg8D39PpfH6BcIJ5XEZu1n9F2SKxVDJpkK6Lx7PfCsdlRAJhbHJ2GYrXOv */}

      {/* <View style={{marginTop: 0}}> */}
      {/* <Restaurant navigation={navigation} /> */}
      <TopTabBar items={{}} />
      {/* </View> */}
    </ScrollView>
  );
};

export default MainTopNav;

const styles = StyleSheet.create({});
