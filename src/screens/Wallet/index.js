import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, icons} from '../../constants';
import {vertScale} from '../../constants/themes';
import ApiCall from '../../network/ApiCall';
import {API_END_POINTS} from '../../network/ApiEndpoints';
import ToolbarWithIcon from '../../utils/ToolbarWithIcon';
import style from './style';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {ShowMessage} from '../../utils/Utility';
import Loader from '../../utils/Loader';
import RazorpayCheckout from 'react-native-razorpay';
import moment from 'moment/moment';

const Wallet = ({navigation}) => {
  const step1 = () => {
    var options = {
      // order_id: 'order_K9P8XNwtT3je4j',
      description: 'Wallet recharge',
      image: 'https://i.imgur.com/3g7nmJC.png',
      currency: 'INR',
      key: 'rzp_test_LAyG6lrl5x3XE0', //test key
      amount: amount * 100,
      name: profileData?.name,
      prefill: {
        email: profileData?.email,
        contact: mobile,
        name: profileData?.name,
      },
      theme: {color: 'blue'},
    };
    step2(options);
  };
  const step2 = info => {
    console.log('JSON payload => ', JSON.stringify(info));
    try {
      RazorpayCheckout.open(info)
        .then(data => {
          // handle success
          //get payment https://api.razorpay.com/v1/payments/pay_K9PLXeAyQHBGWh //by payment ID
          console.log(`Success: ${JSON.stringify(data)}`);
          //Success: {"razorpay_payment_id":"pay_K9PLXeAyQHBGWh"}

          // alert(`Success: ${data?.razorpay_payment_id}`);
          Alert.alert(
            'Recharge Success',
            '₹' + amount + ' has been successfully credited in your wallet.',
            [
              // {
              //   text: 'Cancel',
              //   onPress: () => console.log('Cancel Pressed'),
              //   style: 'cancel',
              // },
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
          );

          rechargeNow(data?.razorpay_payment_id);
        })
        .catch(error => {
          // handle failure
          console.log(`Error: code ->
         ${JSON.stringify(error.code)} |||||||||||||
         desc->  ${JSON.stringify(error.description)}`);
          alert(`Error: code ->
         ${JSON.stringify(error.code)} |||||||||||||
         desc->  ${JSON.stringify(error.description)}`);
        });
    } catch (error) {
      console.log('JSON payload => ', JSON.stringify(error));
    }
  };

  const [amount, setAmount] = useState('');

  const [apiToken, setApiToken] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);

  const [moreData, setMoreData] = useState(false);

  const [data, setData] = useState({});
  const [profileData, setProfileData] = useState({});
  const [transactionData, setTransactionData] = useState([]);

  const isFocused = useIsFocused();

  const getRestDetailsPage = (value, _id) => {
    setLoading(true);
    let body = {
      user_id: _id,
    };
    // console.log('daa -> ', JSON.stringify(body) + value);
    ApiCall('post', null, API_END_POINTS.getUserInfo, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        if (response?.data?.status) {
          // console.log('rieor ->? ', JSON.stringify(response?.data?.response));
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

  const renderItem = ({item}) => {
    // console.log('renderItem => ' + JSON.stringify(item));
    return (
      <TouchableOpacity
        onPress={() => {
          setShowItem(item);
          setShowRecharge(!showRecharge);
        }}
        style={{
          flexDirection: 'row',
          // justifyContent: 'space-between',
          justifyContent: 'space-around',
        }}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Segoe UI',
            // color: COLORS.black,
            color: '#0638ff',
            textDecorationColor: '#0638ff',
            textDecorationLine: 'underline',
            marginTop: 15,
            // marginStart: 15,
          }}
          numberOfLines={1}>
          {item?.type == 1 ? 'Recharge' : 'Cashback'}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Segoe UI',
            color: COLORS.black,
            marginTop: 15,
            marginStart: -15,
          }}
          numberOfLines={1}>
          {new Date().getDate()}/{new Date().getMonth() + 1}/
          {new Date().getFullYear()}
          {/* {new Date(item?.transaction_id + '').getDate()} */}
        </Text>

        {/* <Text
          style={{
            fontSize: 14,
            fontFamily: 'Segoe UI',
            color: COLORS.black,
            marginTop: 15,
            // marginStart: 15,
          }}
          numberOfLines={1}>
         {makeid(6)}#{item?.transaction_id}
        </Text> */}
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Segoe UI',
            color: COLORS.black,
            marginTop: 15,
            marginEnd: 15,
          }}
          numberOfLines={1}>
          + ₹{item?.amount}
        </Text>
      </TouchableOpacity>
    );
  };

  const getWalletAmount = (tok, uId) => {
    setLoading(true);
    let body = {
      user_id: uId,
    };

    ApiCall('post', body, API_END_POINTS.getUserWallets, {
      Authorization: `Bearer ${tok}`,
    })
      .then(response => {
        // console.log(response.data.response[0]);

        if (response?.data?.status) {
          setData(response.data.response[0]);
        } else {
          setData({});
        }
      })
      .catch(error => {
        setLoading(false);

        console.log('Catch error => ' + error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [referEarn, setReferEarn] = useState('');
  const [referEarnCode, setReferEarnCode] = useState('');

  const callReferNEarnApi = (tok, uId) => {
    setLoading(true);
    let body = {
      user_id: uId,
    };
    ApiCall('post', body, API_END_POINTS.referEarn, {
      Authorization: `Bearer ${tok}`,
    })
      .then(response => {
        // console.log(JSON.stringify(response.data));

        if (response?.data?.status) {
          setReferEarn(response?.data?.respons[0]?.referralCode);
          setReferEarnCode(response?.data?.reff_message);
        } else {
          setReferEarn({});
        }
      })
      .catch(error => {
        setLoading(false);

        console.log('Catch error => ' + error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getWalletTransaction = (tok, uId) => {
    setLoading(true);
    let body = {
      user_id: uId,
    };

    ApiCall('post', body, API_END_POINTS.userAllTransaction, {
      Authorization: `Bearer ${tok}`,
    })
      .then(response => {
        // console.log('userAllTransaction => ' + JSON.stringify(response.data));

        if (response?.data?.status) {
          setTransactionData(response.data.response);
        } else {
          setTransactionData([]);
        }
      })
      .catch(error => {
        setLoading(false);

        console.log('Catch error => ' + error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getInfoFromStorage();
  }, []);

  useEffect(() => {
    getInfoFromStorage();
  }, [isFocused]);

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
            setUserId(value);
            getWalletAmount(t, value);
            getWalletTransaction(t, value);
            callReferNEarnApi(t, value);
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
    } catch (error) {}
  };

  const [mobile, setMobile] = useState('');

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'ChefLab App',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  function makeid(length) {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  // console.log(makeid(5));

  const [showRecharge, setShowRecharge] = useState(false);
  const [showItem, setShowItem] = useState({});

  const renderModal = () => {
    return (
      <Modal
        transparent={true}
        animationType={'none'}
        visible={showRecharge}
        onRequestClose={() => {
          console.log('close modal');
          setShowRecharge(false);
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
            onPress={() => setShowRecharge(false)}
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
              // backgroundColor: COLORS.cartCountBgColor,
            }}></TouchableOpacity>
          <View style={style.additemView}>
            <ScrollView
              style={[
                style.middleView,
                {
                  paddingTop: 10,
                  paddingHorizontal: 10,
                },
              ]}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Text
                  style={[
                    style.addressText,
                    {marginBottom: 10, marginTop: 5, marginStart: 15},
                  ]}>
                  Details
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
                    setShowRecharge(false);
                  }}
                />
              </View>
              <View
                style={{
                  marginHorizontal: 15,
                  marginTop: 20,
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
                      fontFamily: 'Segoe UI',
                    }}>
                    Type:
                  </Text>

                  <Text
                    style={{
                      color: COLORS.black,
                      marginStart: 10,
                      fontSize: 16,
                      fontFamily: 'Segoe UI Bold',
                    }}>
                    {showItem?.type == 1 ? 'Recharge' : 'Cashback'}
                    {/* {'Refund'} */}
                  </Text>
                </View>

                {showItem?.type == 1 ? null : (
                  <View
                    style={{
                      marginTop: 15,
                    }}
                  />
                )}

                <View
                  style={{
                    marginTop: 15,
                  }}
                />
                {showItem?.type == 1 ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: COLORS.black,
                        fontSize: 16,
                        fontFamily: 'Segoe UI',
                      }}>
                      Transaction ID:
                    </Text>

                    <Text
                      style={{
                        color: COLORS.black,
                        marginStart: 10,
                        fontSize: 16,
                        fontFamily: 'Segoe UI Bold',
                      }}>
                      #{showItem?.transaction_id}
                    </Text>
                  </View>
                ) : // <View
                //   style={{
                //     flexDirection: 'row',
                //     alignItems: 'center',
                //   }}>
                //   <Text
                //     style={{
                //       color: COLORS.black,
                //       fontSize: 16,
                //       fontFamily: 'Segoe UI',
                //     }}>
                //     Referer Name
                //   </Text>

                //   <Text
                //     style={{
                //       color: COLORS.black,
                //       marginStart: 10,
                //       fontSize: 16,
                //       fontFamily: 'Segoe UI Bold',
                //     }}>
                //     Jay Prakash
                //   </Text>
                // </View>
                null}
                {showItem?.type == 1 ? (
                  <>
                    <View
                      style={{
                        marginTop: 15,
                      }}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: COLORS.black,
                          fontSize: 16,
                          fontFamily: 'Segoe UI',
                        }}>
                        Amount:
                      </Text>

                      <Text
                        style={{
                          color: COLORS.black,
                          marginStart: 10,
                          fontSize: 16,
                          fontFamily: 'Segoe UI Bold',
                        }}>
                        ₹ {showItem?.amount}
                      </Text>
                    </View>
                  </>
                ) : null}

                <View
                  style={{
                    marginTop: 15,
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: 16,
                      fontFamily: 'Segoe UI',
                    }}>
                    Date & time:
                  </Text>

                  <Text
                    style={{
                      color: COLORS.black,
                      marginStart: 10,
                      fontSize: 16,
                      fontFamily: 'Segoe UI Bold',
                    }}>
                    {moment(showItem?.created_at).format('DD-MM-YYYY hh:mm a')}
                  </Text>
                </View>

                {/* <View
                  style={{
                    marginTop: 15,
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: 16,
                      fontFamily: 'Segoe UI',
                    }}>
                    Order ID:
                  </Text>

                  <Text
                    style={{
                      color: COLORS.black,
                      marginStart: 10,
                      fontSize: 16,
                      fontFamily: 'Segoe UI Bold',
                    }}>
                    #125155
                  </Text>
                </View>

                <View
                  style={{
                    marginTop: 15,
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: 16,
                      fontFamily: 'Segoe UI',
                    }}>
                    Order date & time:
                  </Text>

                  <Text
                    style={{
                      color: COLORS.black,
                      marginStart: 10,
                      fontSize: 16,
                      fontFamily: 'Segoe UI Bold',
                    }}>
                    6/11/2022 2:45 PM
                  </Text>
                </View>

                <View
                  style={{
                    marginTop: 15,
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: 16,
                      fontFamily: 'Segoe UI',
                    }}>
                    Transaction ID:
                  </Text>

                  <Text
                    style={{
                      color: COLORS.black,
                      marginStart: 10,
                      fontSize: 16,
                      fontFamily: 'Segoe UI Bold',
                    }}>
                    #{showItem?.transaction_id}
                  </Text>
                </View>
                <View
                  style={{
                    marginTop: 15,
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: 16,
                      fontFamily: 'Segoe UI',
                    }}>
                    Date:
                  </Text>

                  <Text
                    style={{
                      color: COLORS.black,
                      marginStart: 10,
                      fontSize: 16,
                      fontFamily: 'Segoe UI Bold',
                    }}>
                    {new Date().getDate()}/{new Date().getMonth() + 1}/
                    {new Date().getFullYear()}
                  </Text>
                </View>
                <View
                  style={{
                    marginTop: 15,
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: 16,
                      fontFamily: 'Segoe UI',
                    }}>
                    Amount:
                  </Text>

                  <Text
                    style={{
                      color: COLORS.black,
                      marginStart: 10,
                      fontSize: 16,
                      fontFamily: 'Segoe UI Bold',
                    }}>
                    ₹ {showItem?.amount}
                  </Text>
                </View> */}
              </View>

              <TouchableOpacity
                onPress={() => {
                  setShowRecharge(false);
                }}
                activeOpacity={0.8}
                style={{
                  // width: 100,
                  // height: 35,
                  backgroundColor: COLORS.primary,
                  paddingHorizontal: 15,
                  paddingVertical: 5,
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginVertical: 15,
                  borderRadius: 10,
                  flexDirection: 'row',
                }}>
                <Text
                  style={[
                    style.addressText,
                    {marginHorizontal: 15, color: COLORS.white},
                  ]}>
                  Close
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const [showAddModal, setShowAddModal] = useState(false);

  const onSelect = (item, index) => {
    if (selectedOption && selectedOption.id === item.id) {
      setSelectedOption(null);
    } else {
      setSelectedOption(item);
      setAmount(item?.id);
    }
  };

  const RadioButtonsData = [
    {
      name: '₹ 100',
      id: '100',
    },
    {
      name: '₹ 200',
      id: '200',
    },
    {
      name: '₹ 500',
      id: '500',
    },
    {
      name: '₹ 1000',
      id: '1000',
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
                    borderWidth:
                      selectedOption && selectedOption?.id === item?.id ? 2 : 1,
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

                      padding: 8,
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

  const [selectedOption, setSelectedOption] = React.useState(null);

  const rechargeNow = paymentID => {
    setLoading(true);
    let b = {
      user_id: userId + '',
      amount: '' + amount,
      type: '1',
      transaction_id: paymentID + '',
    };
    console.log(JSON.stringify(b) + ' ' + apiToken);

    ApiCall('post', b, API_END_POINTS.rechargeWallets, {
      Authorization: `Bearer ${apiToken}`,
    })
      .then(response => {
        ShowMessage(response?.data?.message);
        setShowAddModal(false);
        getWalletAmount(apiToken, userId);
        getWalletTransaction(apiToken, userId);
      })
      .catch(error => {
        setLoading(true);
        setShowAddModal(false);
      })
      .finally(() => {
        setLoading(true);
        setShowAddModal(false);
      });
  };

  const renderAddAmount = () => {
    return (
      <Modal
        transparent={true}
        animationType={'none'}
        visible={showAddModal}
        onRequestClose={() => {
          console.log('close modal');
          setShowAddModal(false);
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
            onPress={() => setShowAddModal(false)}
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
              // backgroundColor: COLORS.cartCountBgColor,
            }}></TouchableOpacity>
          <View style={style.additemView}>
            <ScrollView
              style={[
                style.middleView,
                {
                  paddingTop: 10,
                  paddingHorizontal: 10,
                },
              ]}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Text
                  style={[
                    style.addressText,
                    {marginBottom: 10, marginTop: 5, marginStart: 15},
                  ]}>
                  Recharge Wallet
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
                    setShowAddModal(false);
                  }}
                />
              </View>

              <Text
                style={[
                  {
                    marginBottom: 10,
                    marginTop: 10,
                    marginStart: 15,
                    fontSize: 16,
                    fontFamily: 'Segoe UI',
                    textAlign: 'center',
                    // marginVertical: 10,
                    color: COLORS.black,
                  },
                ]}>
                Pick one of them or enter manually
              </Text>
              <RadioButtons
                onSelect={onSelect}
                selectedOption={selectedOption}
                options={RadioButtonsData}
              />
              <Text
                style={[
                  {
                    fontSize: 14,
                    fontFamily: 'Segoe UI',
                    textAlign: 'center',
                    color: COLORS.black,
                    borderRadius: 50,
                    borderWidth: 1,
                    alignSelf: 'center',
                    padding: 5,
                    marginVertical: 10,
                  },
                ]}>
                OR
              </Text>
              <View
                style={
                  {
                    // margin: 10,
                  }
                }>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder={'Enter amount to recharge wallet'}
                  style={{
                    margin: 10,
                    padding: 10,
                    borderBottomWidth: 1,
                    borderColor: COLORS.grey,
                    fontSize: 16,
                    color: COLORS.black,
                  }}
                  value={amount}
                  keyboardType="number-pad"
                  onChangeText={v => {
                    setAmount(v);
                  }}
                />
              </View>

              <TouchableOpacity
                onPress={() => {
                  if (amount) {
                    step1();
                  } else {
                    ShowMessage('Please select / enter amount');
                  }
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
                  Recharge Now
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  padding: 5,
                  backgroundColor: COLORS.white,
                }}></View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setData([]);
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
    getWalletAmount(apiToken, userId);
    getWalletTransaction(apiToken, userId);
  };

  return (
    <SafeAreaView style={style.mainContainer}>
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
          Wallet
        </Text>
      </View>

      <Loader loading={loading} />

      <ScrollView
        // style={style.mainContainer}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
        showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#007b08', '#03fc13']}
          style={{
            paddingHorizontal: 10,
            marginVertical: 15,
            paddingVertical: 15,
            margin: 10,
            borderRadius: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}>
          <View
            style={{
              marginStart: 10,
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Segoe UI Bold',
                color: COLORS.white,
              }}
              numberOfLines={1}>
              Total Balance
            </Text>
            {data?.wallet_amount == null ? (
              <Text
                style={{
                  fontSize: 25,
                  fontFamily: 'Segoe UI Bold',
                  color: COLORS.white,
                }}
                numberOfLines={1}>
                ₹ 0{' '}
              </Text>
            ) : (
              <Text
                style={{
                  fontSize: 25,
                  fontFamily: 'Segoe UI Bold',
                  color: COLORS.white,
                }}
                numberOfLines={1}>
                ₹ {data?.wallet_amount}
              </Text>
            )}
          </View>
          <View
            style={{
              backgroundColor: COLORS.white,
              marginHorizontal: 10,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 20,
            }}>
            <Text
              onPress={() => {
                // navigation.navigate('RechargeWallet', {
                //   userId: userId,
                //   apiToken,
                // });

                setShowAddModal(true);
              }}
              style={{
                fontSize: 15,
                fontFamily: 'Segoe UI',
                color: COLORS.black,
              }}
              numberOfLines={1}>
              Recharge
            </Text>
          </View>
        </LinearGradient>

        <Text
          style={{
            fontSize: 18,
            fontFamily: 'Segoe UI Bold',
            color: COLORS.grey,
            marginTop: 15,
            marginStart: 15,
          }}
          numberOfLines={1}>
          Recent Transactions
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginTop: 15,
            width: '100%',
            // marginHorizontal: 15,
            // backgroundColor: '#fdf444',
          }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Segoe UI',
              color: COLORS.black,
              // marginTop: 15,
              // marginStart: 15,
              // alignSelf: 'center',
              // textAlign: 'center',
              // textAlignVertical: 'center',
              // backgroundColor: COLORS.buttonBgColor,
              // flexGrow: 1,
              // marginEnd: 'auto',
              // marginStart: 'auto',
            }}
            numberOfLines={1}>
            Type
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Segoe UI',
              color: COLORS.black,
              // marginTop: 15,
              marginStart: 15,
              // backgroundColor: COLORS.greenButtonBgColor,
              // flexGrow: 1,
              // marginEnd: 'auto',
              // marginStart: 'auto',
            }}
            numberOfLines={1}>
            Date
          </Text>

          {/* <Text
            style={{
              fontSize: 14,
              fontFamily: 'Segoe UI',
              color: COLORS.black,
              // marginTop: 15,
              marginStart: 15,
              // backgroundColor: COLORS.cartCountBgColor,
              // flexGrow: 1,
              // marginEnd: 'auto',
              // marginStart: 'auto',
            }}
            numberOfLines={1}>
            Transaction ID
          </Text> */}
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Segoe UI',
              color: COLORS.black,
              // marginTop: 15,
              // marginEnd: 15,
              // backgroundColor: COLORS.chefCardColor,
              // flexGrow: 1,
              // marginEnd: 'auto',
              // marginStart: 'auto',
            }}
            numberOfLines={1}>
            Amount
          </Text>
        </View>
        {/* <View
          style={{
            height: moreData ? 450 : 150,
          }}> */}

        <FlatList
          nestedScrollEnabled={true}
          data={transactionData}
          extraData={transactionData}
          renderItem={renderItem}
          style={{
            // backgroundColor: COLORS.cartCountBgColor,
            height: moreData ? 300 : 0,
          }}
          ListEmptyComponent={() => {
            return (
              <View>
                <Text
                  style={{
                    color: COLORS.black,
                    fontFamily: 'Segoe UI Bold',
                    alignSelf: 'center',
                    margin: 15,
                  }}>
                  No recent transactions found
                </Text>
              </View>
            );
          }}
        />

        {transactionData?.length > 8 ? (
          <TouchableOpacity
            onPress={() => {
              setMoreData(!moreData);
            }}
            activeOpacity={0.8}
            style={{
              flexDirection: 'row',
              borderColor: COLORS.darkGray,
              alignItems: 'center',
              alignSelf: 'center',
              borderRadius: 10,
              borderWidth: 1,
              paddingVertical: 5,
              marginBottom: 10,
              paddingHorizontal: 15,
            }}>
            <Text
              style={{
                fontSize: 12,
                color: COLORS.darkGray,
                fontFamily: 'Segoe UI',
                // marginStart: horizScale(20),
                // marginTop: 5,
                // paddingEnd: 5,
              }}>
              View all transactions
            </Text>
            <Image
              source={icons.back_arrow}
              style={{
                width: 10,
                marginStart: vertScale(5),
                height: 10,
                resizeMode: 'center',
                transform: [{rotate: moreData ? '90deg' : '270deg'}],
                tintColor: COLORS.darkGray,
                // tintColor: '#0638ff',
              }}
            />
          </TouchableOpacity>
        ) : null}
        {/* </View> */}

        <Text
          style={{
            fontSize: 18,
            fontFamily: 'Segoe UI',
            color: COLORS.black,
            marginTop: 15,
            marginStart: 15,
          }}
          numberOfLines={1}>
          Refer and Earn
        </Text>

        <TouchableOpacity
          onPress={() => {
            onShare();
          }}
          activeOpacity={0.8}
          style={{
            borderColor: COLORS.primary,
            padding: 10,
            margin: 10,
            flexDirection: 'row',
            borderRadius: 10,
            borderWidth: 1,
          }}>
          <Image
            source={{
              uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRB3fE46w2z84GAxJqYS20GLAmVcF149pLIog&usqp=CAU',
            }}
            style={{
              width: 100,
              height: 100,
            }}
          />
          <View
            style={{
              flex: 1,
            }}>
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'Segoe UI',
                color: COLORS.black,
                marginEnd: 15,
                marginStart: 15,
              }}>
              Click here to share this app with your friends and family.
            </Text>
            {/* <Image
              source={icons.referral}
              style={{
                width: 200,
                height: 50,
                resizeMode: 'center',
                marginStart: 15,
              }}
            /> */}
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Segoe UI Bold',
                color: COLORS.primary,
                marginEnd: 15,
                marginStart: 15,
                marginTop: 10,
              }}>
              {referEarn}
              {/* {referEarnCode?.referralCode} */}
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'Segoe UI Bold',
                color: COLORS.black,
                // marginEnd: 10,
                marginTop: 10,
                marginStart: 15,
              }}>
              {referEarnCode}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {renderAddAmount()}
      {renderModal()}
    </SafeAreaView>
  );
};

export default Wallet;

const styles = StyleSheet.create({});
