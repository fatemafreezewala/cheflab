
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import {useIsFocused} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import LinearGradient from 'react-native-linear-gradient';
import Ripple from 'react-native-material-ripple';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useDispatch, useSelector} from 'react-redux';
import CheckBox from 'react-native-check-box';
import {
  Animations,
  COLORS,
  icons,
  images,
  SIZES,
  STRINGS,
} from '../../constants/index';
import ApiCall from '../../network/ApiCall';
import {API_END_POINTS} from '../../network/ApiEndpoints';
import CustomEditText from '../../utils/EditText/CustomEditText';
import {ShowMessage} from '../../utils/Utility';
import style from './style';
import {FlatListSlider} from 'react-native-flatlist-slider';
import CustomHomeSlider from '../../components/CustomHomeSlider'
var pkg = require('../../../package.json');
console.log(pkg.version);
let apiKey = 'AIzaSyACdj2YDqnKhGzGVJPkIYPNhqJPH9_5nVU';

import {
  updateCartCount,
  userLatitude,
  userLongitude,
} from '../../redux/actions';

const Home = ({route, navigation}) => {
  const image = [
    {
      image:
        'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8OXx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60',
      desc: 'Silent Waters in the mountains in midst of Himalayas',
    },
    {
      image:
        'https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTV8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
      desc: 'Red fort in India New Delhi is a magnificient masterpeiece of humans',
    },
    {
      image:
        'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8Nnx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60',
      desc: 'Red fort in India New Delhi is a magnificient masterpeiece of humans',
    },
  ];

  // const user_id = useSelector(state => state);
  // ShowConsole('redux user id -> ', JSON.stringify(user_id));
  const [showLiveOrder, setShowLiveOrder] = useState(false);

  const dispatch = useDispatch();

  const [changeOne, setChangeOne] = useState(false);
  const [changeTwo, setChangeTwo] = useState(false);
  const [changeThree, setChangeThree] = useState(false);

  const [apiToken, setApiToken] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    checkUpdateVersion();
    getInfoFromStorage();
    // dispatch(removeItemCart([]));
    if (isFocused) {
      getInfoFromStorage();
    }
  }, []);

  useEffect(() => {
    getUserCartCountFocus();
  }, [navigation]);

  // const state = useSelector(state => state);
  // ShowConsole('redux user id -> ', JSON.stringify(state));
  useEffect(() => {
    getInfoFromStorage();
    getUserCartCountFocus();
    getAsyncAddress();
  }, [isFocused]);

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
            getHomeBanner(t, value);
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

            // console.log(
            //   'userAddress',
            //   JSON.parse(value)?.lat + ' *** ' + JSON.parse(value)?.long,
            // );
            dispatch(userLatitude(JSON.parse(value)?.lat));
            dispatch(userLongitude(JSON.parse(value)?.long));
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
    setAddressLoading(true);
    let body = {
      user_id: uid,
    };
    ApiCall('post', body, API_END_POINTS.getUserDeliveryAddress, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        // console.log('daa -> ', JSON.stringify(response?.data));
        if (response?.data?.status) {
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

  const getUserSavedAddressOne = async () => {
    let t = '';
    let uid = '';
    await AsyncStorage.getItem('token', (err, value) => {
      if (err) {
      } else {
        if (value !== '' && value !== null) {
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
        } else {
          setUserId('');
        }
      }
    });

    let body = {
      user_id: uid,
    };
    // console.log('daa -> ', JSON.stringify(body) + value);
    ApiCall('post', body, API_END_POINTS.getUserDeliveryAddress, {
      Authorization: `Bearer ${t}`,
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
      .finally(() => {});
  };
  const [confirmObject, setConfirmObject] = useState({
    // address_type: '1',
    // reach: 'near water tank',
    // house_no: 'meera ki bawdi',
  });

  // console.log(
  //   'setConfirmObject confirmObject ->',
  //   JSON.stringify(confirmObject),
  // );

  const [cartCount, setCartCount] = useState('');

  const getUserCartCount = (t, value) => {
    let body = {
      user_id: value,
      // cart_id: '53',
    };
    ApiCall('post', body, API_END_POINTS.get_cart_count, {
      Authorization: `Bearer ${t}`,
    })
      .then(response => {
        // console.log(
        //   'total_product_in_cart - > ' +
        //     JSON.stringify(response?.data?.response?.cart),
        // );
        if (response?.data?.status) {
          // setCartCount(response?.data?.response?.cart?.total_product_in_cart);
          setCartCount(response?.data?.response?.cart?.products_count + '');

          AsyncStorage.setItem(
            'cart_id',
            response?.data?.response?.cart?.id + '',
          );

          dispatch(
            updateCartCount(
              // response?.data?.response?.cart?.total_product_in_cart,
              response?.data?.response?.cart?.products_count,
            ),
          );
        } else {
          setCartCount('');
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {});
  };

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
        // console.log(
        //   JSON.stringify(response.data) +
        //     ' <<<<<<<<<<<<<<<<<<dsadsads>>>>>>>>>>>>>>>>>>',
        // );
        if (response?.data?.status) {
          // setCartCount(response?.data?.response?.cart?.total_product_in_cart);
          setCartCount(response?.data?.response?.cart?.products_count);
          dispatch(
            updateCartCount(
              // response?.data?.response?.cart?.total_product_in_cart,
              response?.data?.response?.cart?.products_count,
            ),
          );
        } else {
          setCartCount('');
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {});
  };

  const [banner, setBanner] = useState([]);

  const getHomeBanner = (t, value) => {
    setBannerLoading(true);
    let body = {
      for: 'cheflab',
    };
    // console.log(
    //   'ERROR IN banner getHomeBanner api repose -> ',
    //   JSON.stringify(t),
    // );

    ApiCall('post', body, API_END_POINTS.getHomeBanner, {
      Authorization: `Bearer ${t}`,
    })
      .then(response => {
        if (response?.data?.status) {
          setBanner(response?.data?.response);
        } else {
          setBanner([]);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', JSON.stringify(error));
      })
      .finally(() => {
        setBannerLoading(false);
      });
  };

  const getAsyncAddress = async () => {
    try {
      await AsyncStorage.getItem('userAddress', (err, value) => {
        if (err) {
        } else {
          if (value !== '' && value !== null) {
            setConfirmObject(JSON.parse(value));
            setDummyAddress(JSON.parse(value));
            dispatch(userLatitude(JSON.parse(value)?.lat));
            dispatch(userLongitude(JSON.parse(value)?.long));
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

  useEffect(() => {
    let {intentFromMap} = route.params;
    setShowAddChangeModal(intentFromMap || false);
    getUserSavedAddressOne();
  }, []);

  const [primary, setPrimary] = React.useState(false);

  const userLatitude1 = useSelector(state => state?.state?.userLatitude);
  const userLongitude1 = useSelector(state => state?.state?.userLongitude);
  // console.log(
  //   'navigation - > ',
  //   JSON.stringify(userLatitude1) + ',' + JSON.stringify(userLongitude1),
  // );

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
      setShowAddModal(false);

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
        lat: userLatitude1,
        long: userLongitude1,
        is_primary: primary ? 1 : 0,
      };
      console.log(
        'daa userLatitude1 userLatitude1 -> ',
        JSON.stringify(selectedOption),
      );
      ApiCall('post', body, API_END_POINTS.saveUserDeliveryAddress, {
        Authorization: `Bearer ${apiToken}`,
      })
        .then(response => {
          // console.log('daa -> ', JSON.stringify(response?.data));
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

  /***
   * map part start
   */

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  // const [mapRegion, setMapRegion] = useState([76.0534, 22.9676]);
  const [location, setLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });
  const [loading, setLoading] = useState(false);
  const [bannerLoading, setBannerLoading] = useState(false);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        getOneTimeLocation();
        subscribeLocationLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message:
                'ChefLab needs to Access your location for easy delivery of your products/foods.',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getOneTimeLocation();
            // subscribeLocationLocation();
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };
    requestLocationPermission();

    if (Platform.OS === 'android') {
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000,
      })
        .then(data => {
          // The user has accepted to enable the location services
          // data can be :
          //  - "already-enabled" if the location services has been already enabled
          //  - "enabled" if user has clicked on OK button in the popup
        })
        .catch(err => {
          // The user has not accepted to enable the location services or something went wrong during the process
          // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
          // codes :
          //  - ERR00 : The user has clicked on Cancel button in the popup
          //  - ERR01 : If the Settings change are unavailable
          //  - ERR02 : If the popup has failed to open
          //  - ERR03 : Internal error
        });
    }
  }, []);

  const [currentAddress, setCurrentAddress] = useState('');
  const [city, setCity] = useState('');
  const [count, setCount] = useState(0);

  const getOneTimeLocation = () => {
    setLoading(true);
    // console.log(
    //   'currentLongitude -> ' +
    //     'currentLongitude' +
    //     ' ' +
    //     'currentLatitude => ' +
    //     'currentLongitude 1111',
    // );
    Geolocation.getCurrentPosition(
      position => {
        const currentLongitude = JSON.stringify(position.coords.longitude);
        // console.log(
        //   'currentLongitude -> ' +
        //     'currentLongitude' +
        //     ' ' +
        //     'currentLatitude => ' +
        //     currentLongitude,
        // );
        const currentLatitude = JSON.stringify(position.coords.latitude);
        let truncLat = parseFloat(currentLatitude).toFixed(5);
        let truncLon = parseFloat(currentLongitude).toFixed(5);

        // console.log(
        //   'currentLongitude -> ' +
        //     currentLongitude +
        //     ' ' +
        //     'currentLatitude => ' +
        //     currentLatitude,
        // );
        let coords = position.coords;
        setLocation(coords);
        // animate(position.coords.latitude, position.coords.longitude);

        setLatitude(currentLatitude);
        setLongitude(currentLongitude);

        dispatch(userLatitude(currentLatitude));
        dispatch(userLongitude(currentLongitude));

        // dispatch(userLatitude(22.72418));
        // dispatch(userLongitude(75.887257));

        // if (count < 2) {
        fetch(
          'https://maps.googleapis.com/maps/api/geocode/json?address=' +
            truncLat +
            ',' +
            truncLon +
            '&key=' +
            apiKey,
        )
          .then(response => response.json())
          .then(responseJson => {
            // console.log(
            //   'RECEIVED ADDRESS FROM API -> ',
            //   JSON.stringify(responseJson),
            // );

            if (responseJson.status === 'OK') {
              if (responseJson.results.length > 8) {
                // console.log(' greater then if 8');
                setCount(count + 1);
                // setCurrentAddress(responseJson.results[0].formatted_address);
                setCurrentAddress(
                  responseJson.results[0].address_components[1]?.long_name,
                );
                if (responseJson.results[5].address_components.length > 4) {
                  // console.log(' greater then if 4');
                  // let str = `${responseJson.results[5].address_components[1].long_name}, ${responseJson.results[5].address_components[3].long_name}, ${responseJson.results[5].address_components[4].long_name}`;
                  let str = `${responseJson.results[5].address_components[1].long_name}`;
                  setCity(str);
                } else {
                  console.log(' greater then else 5');
                  // let str = `${responseJson.results[5].address_components[1].long_name}, ${responseJson.results[5].address_components[2].long_name}, ${responseJson.results[5].address_components[3].long_name}`;
                  let str = `${responseJson.results[5].address_components[1].long_name}`;
                  setCity(str);
                }
              }

              if (responseJson.results.length == 6) {
                console.log('equal to 6');
                setCount(count + 1);
                // setCurrentAddress(responseJson.results[0].formatted_address);
                setCurrentAddress(
                  responseJson.results[0].address_components[1]?.long_name,
                );
                // let str = `${responseJson.results[1].address_components[0].long_name}, ${responseJson.results[1].address_components[2].long_name}, ${responseJson.results[1].address_components[3].long_name}`;
                let str = `${responseJson.results[1].address_components[0].long_name}`;
                setCity(str);
              }

              if (responseJson.results.length == 7) {
                console.log('equal to 7');
                setCount(count + 1);
                // setCurrentAddress(responseJson.results[0].formatted_address);
                setCurrentAddress(
                  responseJson.results[0].address_components[1]?.long_name,
                );
                // let str = `${responseJson.results[1].address_components[0].long_name}, ${responseJson.results[1].address_components[2].long_name}, ${responseJson.results[1].address_components[3].long_name}`;
                let str = `${responseJson.results[1].address_components[0].long_name}`;
                setCity(str);
              }
              if (responseJson.results.length == 8) {
                console.log(' greater then else 8');
                setCount(count + 1);
                // setCurrentAddress(responseJson.results[0].formatted_address);
                setCurrentAddress(
                  responseJson.results[0].address_components[1]?.long_name,
                );
                let str = `${responseJson.results[5].address_components[0].long_name}`;
                setCity(str);
              }
            }
          })
          .catch(err => {
            console.log('ADDRESS GEOCODE ERROR!! => ' + err);
          });
        // }
      },
      error => {
        console.log('google.maps. error -<> ', JSON.stringify(error));
      },
      {
        // enableHighAccuracy: true,
        timeout: 30000,
        // maximumAge: 1000,
      },
    );
    setLoading(false);
  };

  const subscribeLocationLocation = () => {
    watchID = Geolocation.watchPosition(
      position => {
        console.log(position);
        const currentLongitude = JSON.stringify(position.coords.longitude);
        const currentLatitude = JSON.stringify(position.coords.latitude);

        let coords = position.coords;
        let truncLat = parseFloat(currentLatitude).toFixed(5);
        let truncLon = parseFloat(currentLongitude).toFixed(5);
        console.log('COORDS -> ', JSON.stringify(coords));
        setLocation(coords);
      },
      error => {
        // setLocationStatus(error.message);
      },
      {
        // enableHighAccuracy: true,
        // maximumAge: 1000,
        timeout: 30000,
      },
    );
  };

  /***
   * map part end
   */

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

  let cartItemCount = useSelector(state => state.state.cartArray);
  // console.log(' cartItemCount  =>> ', cartItemCount.length);

  const [addressBottomShow, setAddressBottomShow] = useState(false);
  const closeAddModal = () => {
    setAddressBottomShow(!addressBottomShow);
  };
  const locationRef = useRef();

  const renderAddressSearchModal = () => {
    return (
      <Modal
        visible={addressBottomShow}
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
          {/* <TouchableOpacity
            activeOpacity={1}
            onPress={() => closeAddModal()}
            style={{flex: 1}}></TouchableOpacity> */}
          <View
            style={[
              {
                height: SIZES.height,
              },
            ]}>
            <ScrollView style={style.middleView}>
              <View
                style={{
                  flexDirection: 'row',
                  height: 56,
                  alignItems: 'center',
                  paddingLeft: 25,
                  paddingRight: 25,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    closeAddModal();
                  }}>
                  <Image
                    source={icons.cancel}
                    style={{
                      width: 20,
                      height: 20,
                    }}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    color: COLORS.black,
                    fontSize: 18,
                    fontFamily: 'Segoe UI',
                    // marginBottom: 5,
                    // marginTop: 10,
                    marginEnd: 8,
                    marginStart: 20,
                    // flex: 1,
                  }}>
                  Select delivery location
                </Text>
              </View>

              <GooglePlacesAutocomplete
                placeholder="Search"
                listViewDisplayed={false}
                fetchDetails={true}
                styles={{
                  textInputContainer: {
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderTopWidth: 0,
                    borderBottomWidth: 0,
                    width: '90%',
                  },
                  container: {
                    margin: 10,
                  },
                  textInput: {
                    marginLeft: 0,
                    marginRight: 0,
                    height: 40,
                    color: '#5d5d5d',
                    fontSize: 14,
                    borderWidth: 1,
                    borderColor: '#778899',
                  },
                  description: {
                    fontWeight: 'bold',
                    borderTopWidth: 0,
                    borderBottomWidth: 0,
                    opacity: 0.9,
                  },
                }}
                // styles={{
                //   container: {
                //     margin: 10,
                //   },
                // }}
                query={{
                  key: apiKey,
                  language: 'en',
                  components: 'country:ind',
                }}
                onFail={e => {
                  console.log(
                    'ERROR IN GOOGLE AUTO COMPLETE ',
                    JSON.stringify(e),
                  );
                }}
                keepResultsAfterBlur={true}
                keyboardShouldPersistTaps={'handled'}
                ref={locationRef}
                onPress={(data, details = null) => {
                  // console.log(
                  //   'data -> and details -> ',
                  //   JSON.stringify(data) + ' <<>> ' + JSON.stringify(details),
                  // );
                  setLocation(data.description);
                }}
                minLength={3} // minimum length of text to search
                enablePoweredByContainer={false}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const [showChefModal, setShowChefModal] = useState(false);
  const [showDiningModal, setShowDiningModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [forceUpdate, setForceUpdate] = useState('0');
  const [softUpdate, setSoftUpdate] = useState('0');
  const [currentVersion, setCurrentVersion] = useState('0');

  const [savedAddress, setSavedAddress] = useState('');

  const checkUpdateVersion = async () => {
    let val = '';
    await AsyncStorage.getItem('CHECK_VERSION', (err, value) => {
      if (err) {
      } else {
        if (value !== '' && value !== null) {
          val = value;
        } else {
        }
      }
    });
    if (val !== '' && val === 'true') {
      let body = {
        version: pkg.version + '',
        // version: '1.2',
      };
      ApiCall('post', body, API_END_POINTS.get_update_version)
        .then(response => {
          if (response.data.status) {
            setForceUpdate(response.data?.data?.force_update);
            setCurrentVersion(response.data?.data?.current_version);
            setSoftUpdate(response.data?.data?.user_app_soft_update);

            if (response.data?.data?.user_app_soft_update === '1') {
              setShowUpdateModal(true);
            } else if (response.data?.data?.force_update === '1') {
              setShowUpdateModal(true);
            }
          } else {
          }
        })
        .catch(error => {})
        .finally(() => {
          AsyncStorage.setItem('CHECK_VERSION', 'false');
        });
    }
  };

  return (
    <SafeAreaView style={style.mainContainer}>
      <ScrollView
        style={style.mainContainer}
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
        <Modal
          transparent={true}
          animationType={'slide'}
          visible={showUpdateModal}
          onRequestClose={() => {
            console.log('close modal');
            if (forceUpdate == '1') {
              // setShowUpdateModal(false);
            } else {
              setShowUpdateModal(false);
            }
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
                if (forceUpdate == '1') {
                  // setShowUpdateModal(false);
                } else {
                  setShowUpdateModal(false);
                }
              }}
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}></TouchableOpacity>
            <View style={style.additemView}>
              <View style={style.middleView}>
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
                      {marginStart: 20, fontSize: 18},
                    ]}>
                    App update available - {currentVersion}
                  </Text>
                  <FontAwesome
                    name="close"
                    size={20}
                    color={COLORS.black}
                    style={{
                      marginEnd: 25,
                    }}
                    onPress={() => {
                      if (forceUpdate == '1') {
                        // setShowUpdateModal(false);
                      } else {
                        setShowUpdateModal(false);
                      }
                    }}
                  />
                </View>
                <Text
                  style={{
                    marginVertical: 10,
                    marginHorizontal: 25,
                    fontFamily: 'Segoe UI',
                    fontSize: 16,
                    color: COLORS.black,
                  }}>
                  App update available, please update the app to use the latest
                  version.
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                paddingVertical: 10,
                backgroundColor: COLORS.lightGray,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  // alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {softUpdate == '1' ? (
                  <TouchableOpacity
                    onPress={() => {
                      setShowUpdateModal(false);
                    }}
                    activeOpacity={0.8}
                    style={{
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: COLORS.primary,
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginVertical: 5,
                      width: '40%',
                      height: 45,
                      marginHorizontal: 10,
                    }}>
                    <Text
                      style={[
                        {
                          color: COLORS.black,
                          fontSize: 18,
                          fontFamily: 'Segoe UI Bold',
                          textAlign: 'center',
                        },
                      ]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                ) : null}

                <TouchableOpacity
                  onPress={() => {
                    if (forceUpdate == '0') {
                    } else {
                      ShowMessage('User will be able to update the app');
                    }
                  }}
                  activeOpacity={0.8}
                  style={{
                    backgroundColor: COLORS.primary,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginVertical: 5,
                    marginHorizontal: 10,
                    borderRadius: 10,
                    width: softUpdate == '1' ? '40%' : '60%',
                    height: 45,
                  }}>
                  <Text
                    style={[
                      {
                        color: COLORS.white,
                        fontSize: 18,
                        fontFamily: 'Segoe UI Bold',
                        textAlign: 'center',
                      },
                    ]}>
                    Update
                  </Text>
                </TouchableOpacity>
              </View>
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
            <View style={style.additemView}>
              <View style={style.middleView}>
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

                {/* {data.length <= 0 ? ( */}
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
                              marginTop: 20,
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
                    lat: latitude,
                    long: longitude,
                  });
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
                    backgroundColor: dummyAddress
                      ? COLORS.primary
                      : COLORS.white,
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
                        color: dummyAddress ? COLORS.white : COLORS.primary,
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
          visible={showChefModal}
          onRequestClose={() => {
            console.log('close modal');
            setShowChefModal(false);
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
              onPress={() => setShowChefModal(false)}
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}></TouchableOpacity>
            <View style={style.additemView}>
              <View style={style.middleView}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 15,
                  }}>
                  <Text style={[style.addressText, {marginStart: 20}]}>
                    Chef
                  </Text>
                  <FontAwesome
                    name="close"
                    size={20}
                    color={COLORS.black}
                    style={{
                      marginEnd: 25,
                    }}
                    onPress={() => {
                      setShowChefModal(false);
                    }}
                  />
                </View>
                <Text
                  style={{
                    marginVertical: 10,
                    marginHorizontal: 25,
                    fontFamily: 'Segoe UI Bold',
                    fontSize: 16,
                    color: COLORS.black,
                  }}>
                  Love cooking for Others ?{'\n'}
                  {'\n'}
                  Then we are looking for you.
                  {'\n'}
                  {'\n'}
                  Register your 5 speciality Dishes with us and we will share it
                  with the world.
                </Text>
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
                  setShowChefModal(false);
                  Linking.openURL('https://cheflab.in/partner-as-chef/');
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
                  marginHorizontal: 20,
                }}>
                <Text
                  style={[
                    {
                      color: COLORS.white,
                      fontSize: 18,
                      fontFamily: 'Segoe UI Bold',
                      textAlign: 'center',
                    },
                  ]}>
                  {/* <FontAwesome size={20} color={COLORS.white} name="plus" /> */}
                  Register Now
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          transparent={true}
          animationType={'slide'}
          visible={showDiningModal}
          onRequestClose={() => {
            console.log('close modal');
            setShowDiningModal(false);
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
              onPress={() => setShowDiningModal(false)}
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}></TouchableOpacity>
            <View style={style.additemView}>
              <View style={style.middleView}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 15,
                  }}>
                  <Text style={[style.addressText, {marginStart: 20}]}>
                    Dining
                  </Text>
                  <FontAwesome
                    name="close"
                    size={20}
                    color={COLORS.black}
                    style={{
                      marginEnd: 25,
                    }}
                    onPress={() => {
                      setShowDiningModal(false);
                    }}
                  />
                </View>
                <Text
                  style={{
                    marginVertical: 10,
                    marginHorizontal: 25,
                    fontFamily: 'Segoe UI Bold',
                    fontSize: 16,
                    color: COLORS.black,
                  }}>
                  Coming Soon...
                  {'\n'}
                  {'\n'}
                  Now you can offer discounts to your customers on their DineIn
                  bills with Cheflab.
                </Text>
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
                  setShowDiningModal(false);
                  Linking.openURL('https://cheflab.in/dinning/');
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
                  marginHorizontal: 20,
                }}>
                <Text
                  style={[
                    {
                      color: COLORS.white,
                      fontSize: 18,
                      fontFamily: 'Segoe UI Bold',
                      textAlign: 'center',
                    },
                  ]}>
                  {/* <FontAwesome size={20} color={COLORS.white} name="plus" /> */}
                  Register Now
                </Text>
              </TouchableOpacity>
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
                      setShowAddChangeModal(false);
                      setShowAddModal(false);
                      navigation.navigate('Maps', {
                        lat: latitude,
                        long: longitude,
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

        <View style={style.header}>
          <Image
            source={icons.location}
            resizeMode="contain"
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
              // closeAddModal();
              setData([]);
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
                    : currentAddress}
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
                  : city}
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
                  // tintColor: '#ff0000',
                  tintColor: COLORS.primary,
                },
              ]}
            />
            {cartCount > 0 ? (
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
                  {cartCount}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>
        <View
          style={{
            // elevation: 10,
            backgroundColor: COLORS.white,
            paddingBottom: 10,
            // margin: 10,
          }}>
          {bannerLoading ? (
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              style={{
                alignSelf: 'center',
                marginTop: 20,
                borderRadius: 10,
              }}
              width={Dimensions.get('window').width - 20}
              height={200}></ShimmerPlaceHolder>
          ) : banner.length == 0 ? null : (
            <View style={style.sliderMainContainer}>
              <FlatListSlider 
            data={banner} 
            imageKey={'image'}
            loop={true}
            autoscroll={false}
            component={<CustomHomeSlider />}

            />
              {/* <SwiperFlatList
                autoplay={true}
                autoplayDelay={3}
                autoplayLoop={true}
                showPagination
                data={banner}
                // autoplayLoopKeepAnimation={true}
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
                       
                      </Text>
                    </View>
                  </View>
                )}
              /> */}
            </View>
          )}

          <Text
            onPress={() => {
              console.log('called with 1');
              console.log('called with 2');
            }}
            style={style.moodText}>
            What's your mood ?
          </Text>

          <TouchableOpacity
            activeOpacity={1.0}
            style={[
              {
                borderWidth: 1,
                borderColor: '#ff0000',
                width: '93%',
                height: 80,
                borderRadius: 10,
                alignSelf: 'center',
                marginTop: 15,
                justifyContent: 'space-between',
              },
            ]}>
            <Ripple
              rippleColor="#fccfcf"
              onPress={() => {
                // navigation.navigate('MainTopNav', {
                //   screen: 'Chef',
                //   currentAddress: currentAddress,
                //   city: city,
                // });
                setShowChefModal(true);
              }}
              style={{
                flex: 1,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',

                height: 80,
                marginHorizontal: 2,
              }}>
              <Text
                style={[
                  style.moodInnerText,
                  {
                    color: COLORS.black,

                    fontSize: 20,
                  },
                ]}>
                Chef
              </Text>
              <Image
                source={icons.chef1}
                style={[
                  style.moodInnerImage,
                  {
                    // tintColor: changeOne ? COLORS.white : COLORS.black,
                    width: 90,
                    marginEnd: 10,
                    height: 90,
                  },
                ]}
              />
            </Ripple>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1.0}
            style={[
              {
                borderWidth: 1,
                borderColor: '#ff0000',
                width: '93%',
                height: 80,
                borderRadius: 10,
                alignSelf: 'center',
                marginTop: 15,
                justifyContent: 'space-between',
              },
            ]}>
            <Ripple
              rippleColor="#fccfcf"
              onPress={() => {
                navigation.navigate('MainTopNav', {
                  screen: 'Restaurant',
                  currentAddress: currentAddress,
                  city: city,
                });
                // navigation.navigate('Restaurant');
              }}
              style={{
                flex: 1,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',

                height: 80,
                marginHorizontal: 2,
              }}>
              <Text
                style={[
                  style.moodInnerText,
                  {
                    color: COLORS.black,

                    fontSize: 20,
                  },
                ]}>
                Restaurant
              </Text>
              <Image
                source={icons.restaurant3}
                style={[
                  style.moodInnerImage,
                  {
                    // tintColor: changeOne ? COLORS.white : COLORS.black,
                    width: 90,
                    marginEnd: 10,
                    height: 90,
                  },
                ]}
              />
            </Ripple>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1.0}
            style={[
              {
                borderWidth: 1,
                borderColor: '#ff0000',
                width: '93%',
                height: 80,
                borderRadius: 10,
                alignSelf: 'center',
                marginTop: 15,
                justifyContent: 'space-between',
              },
            ]}>
            <Ripple
              rippleColor="#fccfcf"
              onPress={() => {
                // navigation.navigate('MainTopNav', {
                //   screen: 'Dining',
                //   currentAddress: currentAddress,
                //   city: city,
                // });
                setShowDiningModal(true);
              }}
              style={{
                flex: 1,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',

                height: 80,
                marginHorizontal: 2,
              }}>
              <Text
                style={[
                  style.moodInnerText,
                  {
                    color: COLORS.black,

                    fontSize: 20,
                  },
                ]}>
                Dining
              </Text>
              <Image
                source={icons.dining2}
                style={[
                  style.moodInnerImage,
                  {
                    // tintColor: changeOne ? COLORS.white : COLORS.black,
                    width: 90,
                    marginEnd: 10,
                    height: 90,
                  },
                ]}
              />
            </Ripple>
          </TouchableOpacity>
        </View>

        {showLiveOrder ? (
          <View style={style.liveOrderOuter}>
            <TouchableOpacity
              onPress={() => {
                setShowLiveOrder(false);
              }}>
              <Image
                source={icons.cancel}
                style={[
                  {
                    width: 25,
                    height: 25,
                    resizeMode: 'center',
                    marginBottom: 5,
                  },
                ]}
              />
            </TouchableOpacity>
            <View style={style.liveOrderInner}>
              <Text style={style.orderStatus}>Live Order Status</Text>

              <Text style={style.orderName}>Chef Ankur Bajaj</Text>

              <Text style={style.status}>Out for delivery</Text>

              <Text style={style.willText}>Will be reached in</Text>

              <View style={style.countContainer}>
                <LottieView
                  source={Animations.countdown}
                  style={{
                    height: 25,
                    width: 25,
                  }}
                  autoPlay={true}
                  loop={true}
                />
                <Text style={style.mins}>ETA: 35 mins</Text>
              </View>
            </View>
          </View>
        ) : null}

        <View
          style={{
            alignItems: 'center',
            alignSelf: 'center',
            paddingVertical: 30,
            opacity: 0.5,
          }}>
          <Image style={style.logo} source={images.app_logo} />

          <Text style={style.copyRightText}>
            © 2022, ChefLab.All Rights Reserved
          </Text>
        </View>
      </ScrollView>
      {renderAddressSearchModal()}
    </SafeAreaView>
  );
};

export default Home;

/**
 * 
              navigation.navigate('MainTopNav', {screen: 'Restaurant'});
              navigation.navigate('MainTopNav', {screen: 'Dining'});

 * 
 */
