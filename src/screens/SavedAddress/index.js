import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {COLORS, SIZES, STRINGS} from '../../constants';
import ApiCall from '../../network/ApiCall';
import {API_END_POINTS} from '../../network/ApiEndpoints';
import CustomEditText from '../../utils/EditText/CustomEditText';
import Loader from '../../utils/Loader';
import ToolbarWithIcon from '../../utils/ToolbarWithIcon';
import style from './style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ShowMessage} from '../../utils/Utility';
import CheckBox from 'react-native-check-box';
import {useSelector} from 'react-redux';

/**
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
      interval: 10000,
      fastInterval: 5000,
    })
      .then((data) => {
        // The user has accepted to enable the location services
        // data can be :
        //  - "already-enabled" if the location services has been already enabled
        //  - "enabled" if user has clicked on OK button in the popup
      })
      .catch((err) => {
        // The user has not accepted to enable the location services or something went wrong during the process
        // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
        // codes :
        //  - ERR00 : The user has clicked on Cancel button in the popup
        //  - ERR01 : If the Settings change are unavailable
        //  - ERR02 : If the popup has failed to open
        //  - ERR03 : Internal error
      });
 */

const SavedAddress = ({navigation, route}) => {
  const [userId, setUserId] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddChangeModal, setShowAddChangeModal] = useState(false);
  const [data, setData] = useState([]);

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
            getUserSavedAddress(t, value);
          } else {
            setUserId('');
          }
        }
      });
    } catch (error) {
      console.log('profile data -> ', JSON.stringify(error));
    }
  };

  useEffect(() => {
    getInfoFromStorage();
    getAsyncAddress();
  }, []);

  const getUserSavedAddress = (t, value) => {
    setLoading(true);
    const body = {
      user_id: value,
    };
    console.log('daa -> ', JSON.stringify(body) + value);
    ApiCall('post', body, API_END_POINTS.getUserDeliveryAddress, {
      Authorization: `Bearer ${t}`,
    })
      .then(response => {
        if (response?.data?.status) {
          // console.log('profile data -> ', JSON.stringify(response?.data));
          if (response?.data?.status) {
            setData(response?.data?.response);
            if (response?.data?.response?.length == 0) {
              AsyncStorage.setItem('userAddress', '');
            }
          }
        } else {
          setData([]);
          if (response?.data?.response?.length == 0) {
            AsyncStorage.setItem('userAddress', '');
          }
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [showEditModal, setShowEditModal] = useState(false);

  const renderEditModal = () => {
    return (
      <Modal
        transparent={true}
        animationType={'none'}
        visible={showEditModal}
        onRequestClose={() => {
          console.log('close modal');
          setShowEditModal(false);
          setSelectedItem('');
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
              setShowEditModal(false);
              setSelectedOption(null);
              setShowEditModal(false);
              setSelectedItem('');
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
                    setShowEditModal(false);
                    setSelectedOption(null);

                    setShowAddModal(false);

                    setShowEditModal(false);
                    setSelectedItem('');
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
                rightText={'Set as primary'}
                rightTextStyle={{
                  fontSize: 16,
                  color: COLORS.black,
                }}
              />

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    // setShowAddChangeModal(false);
                    setShowAddModal(false);
                    setShowEditModal(false);
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
                    if (showAddModal) {
                      addUserAddress();
                    } else if (showEditModal) {
                      updateUserAddress();
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
                    {!showAddModal ? 'Update' : 'Add'}
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
    );
  };

  const [selectedItem, setSelectedItem] = useState({});

  const renderItem = ({item, index}) => {
    // console.log('item -> ', JSON.stringify(item));
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
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
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
            <View
              style={{
                flexDirection: 'row',
              }}>
              <AntDesign
                name="edit"
                size={20}
                onPress={() => {
                  setShowEditModal(true);
                  setSelectedItem(item);
                  setAddressId(item?.id);
                  setHouseNumber(item.house_no);
                  setReachAddress(item?.reach);
                  setReachAddressContact(item?.contact_no);
                  {
                    item?.address_type == '1'
                      ? setSelectedOption(RadioButtonsData[0])
                      : item?.address_type == '2'
                      ? setSelectedOption(RadioButtonsData[1])
                      : item.address_type == '3'
                      ? setSelectedOption(RadioButtonsData[2])
                      : null;
                  }
                }}
                color={COLORS.primary}
              />
              <View
                style={{
                  marginHorizontal: 10,
                }}
              />
              <AntDesign
                name="delete"
                size={20}
                onPress={() => {
                  addressDelete(item);
                }}
                color={COLORS.primary}
              />
            </View>
          </View>
          <Text
            style={{
              color: COLORS.black,
              fontSize: 16,
              fontFamily: 'Segoe UI Bold',
              marginTop: 5,
            }}>
            {item.house_no}
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
          <Text
            style={{
              color: COLORS.grey,
              marginTop: 5,
              fontFamily: 'Segoe UI',
              fontSize: 14,
            }}>
            Alternate Mobile: {item?.contact_no}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const [selectedOption, setSelectedOption] = React.useState(null);

  const [primary, setPrimary] = React.useState(false);

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
  const [confirmObject, setConfirmObject] = useState({});

  const getAsyncAddress = async () => {
    try {
      await AsyncStorage.getItem('userAddress', (err, value) => {
        if (err) {
        } else {
          if (value !== '' && value !== null) {
            setConfirmObject(JSON.parse(value));
            console.log(
              'userAddress',
              JSON.parse(value)?.lat + ' ***   ' + JSON.parse(value)?.long,
            );
          } else {
            setConfirmObject(null);
          }
        }
      });
    } catch (error) {}
  };

  const [addressId, setAddressId] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [houseNumberError, setHouseNumberError] = useState(false);
  const [reachAddress, setReachAddress] = useState('');
  const [reachAddressError, setReachAddressError] = useState(false);
  const [reachAddressContact, setReachAddressContact] = useState('');
  const [reachAddressContactError, setReachAddressContactError] =
    useState(false);

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
      setLoading(true);
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
      console.log('daa -> ', JSON.stringify(body));
      ApiCall('post', body, API_END_POINTS.saveUserDeliveryAddress, {
        Authorization: `Bearer ${apiToken}`,
      })
        .then(response => {
          console.log('daa -> ', JSON.stringify(response?.data));
          if (response?.data?.status) {
            setShowAddModal(false);
            setShowEditModal(false);
            ShowMessage('' + response?.data?.message);
            getUserSavedAddress(apiToken, userId);
          }
        })
        .catch(error => {
          console.log('ERROR IN getCuisines API -> ', error);
        })
        .finally(() => {
          setLoading(false);
          setShowAddModal(false);
          setReachAddressContact('');
          setHouseNumber('');
          setReachAddress('');
          setSelectedOption(null);
        });
    }
  };

  const addressDelete = item => {
    console.log('delete', confirmObject?.house_no + ' *** ' + item?.house_no);
    if (confirmObject?.house_no == item?.house_no) {
      AsyncStorage.setItem('userAddress', '');
    }
    /*
 {"id":104,"user_id":"3","house_no":"hh","reach":"nb","contact_no":"9956588888","address_type":"1","primary_key":"1","lat":"22.955747729663","long":"76.032806765288","deleted_at":null,"created_at":"2022-12-29T10:43:58.000000Z","updated_at":"2022-12-29T10:43:58.000000Z"}
    */
    setLoading(true);
    let body = {
      user_id: userId,
      id: item?.id,
    };
    console.log('daa -> ', JSON.stringify(selectedOption));
    ApiCall('post', body, API_END_POINTS.deleteUserAddress, {
      Authorization: `Bearer ${apiToken}`,
    })
      .then(response => {
        console.log('daa -> ', JSON.stringify(response?.data));
        if (response?.data?.status) {
          ShowMessage('' + response?.data?.message);
          getUserSavedAddress(apiToken, userId);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const updateUserAddress = () => {
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
      setLoading(true);
      let body = {
        id: addressId,
        user_id: userId,
        house_no: houseNumber + '',
        reach: reachAddress + '',
        contact_no: reachAddressContact,
        address_type: selectedOption?.id,
        // lat: 24.4637223,
        // long: 74.8866346,
        lat: userLatitude,
        long: userLongitude,
        is_primary: primary ? '1' : '0',
      };
      console.log('daa -> ', JSON.stringify(body));
      ApiCall('post', body, API_END_POINTS.updateUserDeliveryAddress, {
        Authorization: `Bearer ${apiToken}`,
      })
        .then(response => {
          console.log('daa -> ', JSON.stringify(response?.data));
          if (response?.data?.status) {
            setShowAddModal(false);
            setShowEditModal(false);
            ShowMessage('' + response?.data?.message);
            getUserSavedAddress(apiToken, userId);
          }
        })
        .catch(error => {
          console.log('ERROR IN getCuisines API -> ', error);
        })
        .finally(() => {
          setLoading(false);
          setShowAddModal(false);
          setReachAddressContact('');
          setHouseNumber('');
          setReachAddress('');
          setSelectedOption(null);
          setPrimary(false);
        });
    }
  };

  return (
    <SafeAreaView
      style={[
        style.mainContainer,
        {
          flexGrow: 1,
        },
      ]}>
      <Loader loading={loading} />
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
                  styles.addressText,
                  {marginHorizontal: 15, color: COLORS.white},
                ]}>
                Add
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}

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
            // maxWidth: Dimensions.get('window').width / 2 + 15,
          }}
          numberOfLines={1}>
          Your Saved Addresses
        </Text>
        <TouchableOpacity
          style={{
            marginEnd: 15,
          }}
          onPress={() => {
            navigation.navigate('Maps', {
              lat: userLatitude,
              long: userLongitude,
            });
          }}>
          <FontAwesome size={25} color={COLORS.primary} name="plus" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        style={{
          flex: 1,
          flexGrow: 1,
        }}
        ListEmptyComponent={() => {
          return loading ? null : (
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Segoe UI Bold',
                textAlign: 'center',
                marginTop: 30,
                color: COLORS.black,
              }}>
              No saved addresses found
            </Text>
          );
        }}
      />

      {renderEditModal()}
    </SafeAreaView>
  );
};

export default SavedAddress;

const styles = StyleSheet.create({
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
    borderRadius: 10,
    margin: 10,
    elevation: 10,
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
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    // height: 100,
    width: Dimensions.get('screen').width * 0.9,
    padding: 10,
    borderRadius: 10,
    display: 'flex',
    // alignItems: 'center',
    justifyContent: 'space-around',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
  addressText: {
    fontSize: 20,
    fontFamily: 'Segoe UI Bold',
    textAlign: 'center',
    // marginVertical: 10,
    color: COLORS.black,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  sizeText: {
    fontFamily: 'Segoe UI',
    fontSize: 15,
    padding: 5,
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
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
