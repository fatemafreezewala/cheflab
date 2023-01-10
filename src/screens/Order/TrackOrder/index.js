import Geolocation from '@react-native-community/geolocation';
import LottieView from 'lottie-react-native';
import React, {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
  useContext,
} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import {Animations, COLORS, icons} from '../../../constants';
import {horizScale, vertScale} from '../../../constants/themes';
import ToolbarWithIcon from '../../../utils/ToolbarWithIcon';
import style from './style';
import database from '@react-native-firebase/database';

import BottomSheet from 'react-native-simple-bottom-sheet';

import {Extrapolate, interpolateNode, Value} from 'react-native-reanimated';

import LinearGradient from 'react-native-linear-gradient';
import MapView, {AnimatedRegion, Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_END_POINTS} from '../../../network/ApiEndpoints';
import ApiCall from '../../../network/ApiCall';
import moment from 'moment/moment';
import CustomLoader from '../../../utils/CustomLoader';
import AppContext from '../../../AppContext';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const snapPointsFromTop = [150, '50%', windowHeight - 128];

const apiKey = 'AIzaSyAp19nG1uHd60NgoviVZy2MhJccOwWS7yM';

const ASPECT_RATIO = windowWidth / windowHeight;
const LATITUDE_DELTA = 0.9222;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const TrackOrder = ({navigation, route}) => {

  const myContext = useContext(AppContext);
  let data = {};
  try {
    data = JSON.parse(myContext?.notificationData?.data?.data || {});
  } catch (e) {}
  const [item, setitem] = useState({});

  const [count, setCount] = useState(1);

  const [coordinate, setCoordinate] = useState(
    new AnimatedRegion({
      latitude: 0,
      longitude: 0,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }),
  );

  const [heading, setHeading] = useState(0);

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

  const [mapRegion1, setMapRegion1] = useState({
    latitude: 22.95565,
    longitude: 76.03289,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });

  const bottomSheetRef = React.useRef();

  const animatedPosition = React.useRef(new Value(0));
  const opacity = interpolateNode(animatedPosition.current, {
    inputRange: [0, 1],
    outputRange: [0, 0.75],
    extrapolate: Extrapolate.CLAMP,
  });
  const [mobile, setMobile] = useState('');

  const [remainingSeconds, setRemainingSeconds] = useState(30);
  const countDown = () => {
    let interval = setInterval(() => {
      setRemainingSeconds(lastTimerCount => {
        if (lastTimerCount == 0) {
          setShowTimer(false);
        }
        lastTimerCount <= 1 && clearInterval(interval);
        return lastTimerCount - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  };

  const [showTimer, setShowTimer] = useState(false);

  const getRemainSeconds = async item => {
    let t = '';
    await AsyncStorage.getItem('token', (err, value) => {
      if (err) {
      } else {
        if (value !== '' && value !== null) {
          t = value;
        } else {
        }
      }
    });
    let body = {
      order_id: item?.order_id + '',
    };
    console.log(
      'Remaining seconds 000000000000000 - > ' + JSON.stringify(item?.order_id),
    );
    ApiCall('post', body, API_END_POINTS.get_order_time_difference, {
      Authorization: `Bearer ${t}`,
    })
      .then(response => {
        console.log(
          'Remaining seconds 000000000000000 - > ' +
            JSON.stringify(response.data),
        );
        if (response?.data?.status) {
          if (parseInt(response.data.response) > 0) {
            console.log(
              'Remaining seconds  111111111111 -> ' +
                parseInt(response.data.response),
            );
            if (parseInt(response.data.response) > 30) {
              console.log(
                'Remaining seconds if block 22222222222 -> ' +
                  parseInt(response.data.response),
              );
              setShowTimer(true);
              setRemainingSeconds(30);
            } else {
              console.log(
                'Remaining seconds else block 22222222222 -> ' +
                  parseInt(response.data.response),
              );
              setShowTimer(true);
              setRemainingSeconds(30);
            }
            countDown();
          } else {
            setShowTimer(false);
            setRemainingSeconds(0);
          }
        } else {
          setShowTimer(false);
          setRemainingSeconds(0);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', JSON.stringify(error));
      })
      .finally(() => {
        setBannerLoading(false);
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
          } else {
            setApiToken('');
          }
        }
      });
      // await AsyncStorage.getItem('userId', (err, value) => {
      //   if (err) {
      //   } else {
      //     if (value !== '' && value !== null) {
      //       setUserId(value);
      //       console.log(t + '<>>>>>>>>>>>>>>>>><<<<<<<<<' + value);

      //       getRestDetailsPage(t, value);
      //     } else {
      //       setUserId('');
      //     }
      //   }
      // });
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
      // console.log('profile data -> ', JSON.stringify(error));
    }
  };

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
              'This App needs to Access your location for easy delivery of your products/foods.',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // getOneTimeLocation();
          // subscribeLocationLocation();
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };
  useEffect(() => {
    requestLocationPermission();
  }, []);
  const [apiToken, setApiToken] = useState('');

  const cancelOrderIn30Second = () => {
    setLoading(true);
    let body = {
      order_id: item?.order_id,
      isCancelledWithin30Second: 0,
    };
    ApiCall('post', body, API_END_POINTS.callCancelOrder, {
      Authorization: `Bearer ${apiToken}`,
    })
      .then(response => {
        console.log(
          'cancelOrderIn30Second => ' + JSON.stringify(response?.data),
        );
        if (response?.data?.status) {
          navigation.replace('OrderCancelled');
        } else {
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', JSON.stringify(error));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [loading, setLoading] = useState(false);

  const getOneTimeLocation = () => {
    setLoading(true);
    Geolocation.getCurrentPosition(
      position => {
        const currentLongitude = JSON.stringify(position.coords.longitude);

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
        // if (coords) {
        //   let {longitude, latitude} = coords;
        //   animate(position.coords.latitude, position.coords.longitude);
        //   setHeading(position?.coords?.heading);
        //   setMapRegion({
        //     latitude: position.coords.latitude,
        //     longitude: position.coords.longitude,
        //     latitudeDelta: 0,
        //     longitudeDelta: 0,
        //   });

        //   setCoordinate(
        //     new AnimatedRegion({
        //       latitude: position.coords.latitude,
        //       longitude: position.coords.longitude,
        //       latitudeDelta: LATITUDE_DELTA,
        //       longitudeDelta: LONGITUDE_DELTA,
        //     }),
        //   );
        // }

        setLongitude(currentLongitude);
        setLatitude(currentLatitude);
      },
      error => {},
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
        if (coords) {
          let {longitude, latitude} = coords;

          // let d = [];
          // d.push(position.coords.longitude);
          // d.push(position.coords.latitude);
          // setMapRegion(d);
          setMapRegion({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0,
            longitudeDelta: 0,
          });
        }
        setLongitude(currentLongitude);
        setLatitude(currentLatitude);
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

  const userLatitude = useSelector(state => state?.state?.userLatitude);
  const userLongitude = useSelector(state => state?.state?.userLongitude);
  const markerRef = useRef();
  const latLongData = [
    // {
    //   Longitude: 9.96233,
    //   Latitude: 49.80404,
    // },
    // {
    //   Longitude: 6.11499,
    //   Latitude: 50.76891,
    // },
    // {Longitude: 6.80592, Latitude: 51.53548},
    // {
    //   Longitude: 9.50523,
    //   Latitude: 51.31991,
    // },
    // {Longitude: 9.66089, Latitude: 48.70158},
    // {Longitude: 9.93368, Latitude: 53.55608},
    // {Longitude: 11.56122, Latitude: 48.14496},
    // {Longitude: 13.34253, Latitude: 52.5319},
    // {Longitude: 6.11327, Latitude: 50.77715},
    {
      latitude: 22.7533,
      longitude: 75.8937,
    },

    {
      latitude: 23.1765,
      longitude: 75.7885,
    },
    {
      latitude: 22.6399,
      longitude: 75.8033,
    },
    {
      latitude: 22.8575,
      longitude: 75.955,
    },
  ];

  const moveToCurrent = () => {
    mapRef?.current?.animateToRegion({
      latitude: mapRegion.latitude,
      longitude: mapRegion.longitude,
      latitudeDelta: 0,
      longitudeDelta: 0,
    });
  };

  const animate = (latitude, longitude) => {
    const newCoord = {
      latitude,
      longitude,
    };

    //place platform check
    if (Platform.OS == 'android') {
      if (markerRef.current) {
        markerRef.current.animateMarkerToCoordinate(newCoord, 7000);
      }
    } else {
      //
    }
  };

  useEffect(() => {
    let {item} = route.params;

    // console.log(' route.params  >> ', JSON.stringify(item));
    getOrderDetails(item?.order_id);
    // setitem(item);

    // getRemainSeconds(item);

    getInfoFromStorage();

    // var old_time = new Date(item?.created_at).getTime();
    // var new_time = new Date().getTime();

    // let after_time = new_time - old_time;
    // let before_time = after_time / 1000;

    // let parseValue = parseInt(before_time);
    // console.log('Invalid -> ' + parseValue);
    // if (parseInt(parseValue) <= 300) {
    //   setShowTimer(true);
    //   setRemainingSeconds(30);
    //   countDown();
    // } else {
    //   setShowTimer(false);
    //   setRemainingSeconds(0);
    // }

    // alert(`added 30 second -> ${parseInt(after_time / 1000)}`); //11:55

    // alert(d); //11:55
    // d.setSeconds(d.getSeconds() + 10);
    // alert(d.getMinutes() + ':0' + d.getSeconds()); //12:05

    let orderCreationTime = new Date(item?.created_at); //
    orderCreationTime.setSeconds(orderCreationTime.getSeconds() + 10);
    // console.log(
    //   moment(item?.created_at).format('L') + ' ** ' + orderCreationTime,
    // );

    return () => {
      stopDriverTrack();
    };
  }, []);

  const [orderData, setOrderData] = useState({});

  const trackDriverPosition = async id => {
    if (id === undefined || id === null || id === '') {
      return;
    }
    database()
      .ref(`locations/${id}`)
      .on('value', snapshot => {
        console.log('User data: ', snapshot.val());
        let position = snapshot.val();
        animate(position.lat, position.long);
        setHeading(position.heading);
        setMapRegion({
          latitude: position.lat,
          longitude: position.long,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        });

        setCoordinate(
          new AnimatedRegion({
            latitude: position.lat,
            longitude: position.long,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          }),
        );
      });
  };

  const stopDriverTrack = () => {
    database()
      .ref(`locations/${item.accepted_driver_id}`)
      .off('value', snapshot => {
        console.log('User data: ', snapshot.val());
      });
  };

  const getOrderDetails = async id => {
    let t = '';
    await AsyncStorage.getItem('token', (err, value) => {
      if (err) {
      } else {
        if (value !== '' && value !== null) {
          t = value;
        } else {
        }
      }
    });
    setLoading(true);
    let body = {
      order_id: id + '',
    };
    ApiCall('post', body, API_END_POINTS.get_order_details, {
      Authorization: `Bearer ${t}`,
    })
      .then(response => {
        // console.log('responser  -? ' + JSON.stringify(response.data));
        if (response?.data?.status) {
          // setOrderData(response?.data?.response);
          // console.log('OrderDetails', response?.data?.response);
          trackDriverPosition(response?.data?.response?.accepted_driver_id);

          setitem(response?.data?.response);
          let i = response?.data?.response;

          var old_time = new Date(i?.created_at).getTime();
          var new_time = new Date().getTime();

          let after_time = new_time - old_time;
          let before_time = after_time / 1000;

          let parseValue = parseInt(before_time);
          // console.log('Invalid -> ' + parseValue);
          if (parseInt(parseValue) <= 60) {
            setShowTimer(true);
            setRemainingSeconds(30);
            countDown();
          } else {
            setShowTimer(false);
            setRemainingSeconds(0);
          }
        } else {
          // setOrderData({});
          setitem({});
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', JSON.stringify(error));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getOneTimeLocation();
    }, 6000);
    return () => clearInterval(interval);
  });

  const mapRef = useRef();
  const [pData, setPData] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [fav, setFav] = useState(false);

  const closeAddModal = () => {
    setShowAdd(!showAdd);
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
            style={{flex: 1}}></TouchableOpacity>
          <View style={style.additemView}>
            <View
              style={[
                {
                  elevation: 10,
                  backgroundColor: COLORS.white,
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15,
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
                    Order details
                  </Text>
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
            <ScrollView
              showsHorizontalScrollIndicator={false}
              style={[
                style.middleView,
                {
                  backgroundColor: COLORS.lightGray,
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                },
              ]}>
              <Text
                style={{
                  color: COLORS.black,
                  fontSize: 18,
                  fontFamily: 'Segoe UI Bold',
                  marginEnd: 10,
                  marginTop: 10,
                  marginStart: 20,
                }}>
                {item?.vendor_name}
              </Text>
              <Text
                style={{
                  color: COLORS.black,
                  fontSize: 14,
                  fontFamily: 'Segoe UI',
                  marginEnd: 10,
                  marginStart: 20,
                }}>
                {item?.vendor_address}
              </Text>

              <Text
                style={{
                  color: COLORS.black,
                  fontSize: 16,
                  fontFamily: 'Segoe UI',
                  marginTop: 10,
                  marginEnd: 10,
                  marginStart: 20,
                }}>
                Status:{' '}
                {remainingSeconds == 0
                  ? 'Waiting for\nrestaurant accept'
                  : item?.order_status == 'pending'
                  ? 'Waiting'
                  : item?.order_status}
              </Text>
              <View
                style={{
                  backgroundColor: COLORS.grey,
                  height: 0.5,
                  width: '95%',
                  alignSelf: 'center',
                  marginVertical: 10,
                }}></View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: COLORS.black,
                    fontSize: 18,
                    fontFamily: 'Segoe UI Bold',
                    marginEnd: 10,
                    marginTop: 10,
                    marginStart: 20,
                  }}>
                  Your order
                </Text>
                {/* <TouchableOpacity
                  onPress={() => setFav(!fav)}
                  style={{
                    padding: 2,
                    backgroundColor: COLORS.white,
                    alignSelf: 'flex-start',
                    marginRight: 15,
                    borderRadius: 25,
                  }}>
                  <Image
                    source={fav ? icons.favorite : icons.unfavorite}
                    style={{
                      width: 25,
                      height: 25,
                      // marginRight: 25,
                    }}
                  />
                </TouchableOpacity> */}
              </View>
              <FlatList
                style={{
                  marginTop: 10,
                }}
                data={item?.products}
                renderItem={renderOrderItem}
              />
              <View
                style={{
                  backgroundColor: COLORS.white,
                  elevation: 10,
                  padding: 10,
                  borderRadius: 10,
                  marginBottom: 10,
                  marginTop: 10,
                  marginHorizontal: 10,
                  justifyContent: 'space-between',
                  // flexDirection: 'row',
                }}>
                {/* <View
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
                    ₹{item?.net_amount}
                  </Text>
                </View> */}

                {/* <View
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
                      Taxes
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
                    ₹15
                  </Text>
                </View> */}

                {/* <View
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
                    Delivery charge
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: COLORS.darkGray,
                      fontFamily: 'Segoe UI',
                      marginTop: horizScale(5),
                      marginStart: horizScale(10),
                    }}>
                    ₹40
                  </Text>
                </View> */}

                {/* <View
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
                </View> */}
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
                    Grand Total
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      color: COLORS.black,
                      fontFamily: 'Segoe UI Bold',
                      marginTop: horizScale(5),
                      marginStart: horizScale(10),
                    }}>
                    {/* ₹ {40 + 15 + parseInt(item?.net_amount)} */}₹{' '}
                    {/* {parseInt(item?.net_amount)} */}
                    {item?.net_amount}
                  </Text>
                </View>
              </View>
              <Text
                style={{
                  color: COLORS.black,
                  fontSize: 18,
                  fontFamily: 'Segoe UI Bold',
                  marginEnd: 10,
                  marginTop: 10,
                  marginStart: 20,
                }}>
                Your order details
              </Text>
              <View
                style={{
                  backgroundColor: COLORS.white,
                  elevation: 10,
                  padding: 10,
                  borderRadius: 10,
                  marginBottom: 10,
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
                    Order id
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: COLORS.black,
                      fontFamily: 'Segoe UI Bold',
                      marginTop: horizScale(5),
                      marginStart: horizScale(10),
                    }}>
                    #{item?.order_id}
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
                    Payment Type
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: COLORS.black,
                      fontFamily: 'Segoe UI Bold',
                      marginTop: horizScale(5),
                      marginStart: horizScale(10),
                    }}>
                    {item?.payment_type}
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
                    Order Date
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: COLORS.black,
                      fontFamily: 'Segoe UI Bold',
                      marginTop: horizScale(5),
                      marginStart: horizScale(10),
                    }}>
                    {item?.order_date}
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
                    Order Delivery Address
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                      justifyContent: 'flex-end',
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: COLORS.black,
                        fontFamily: 'Segoe UI Bold',
                        marginTop: horizScale(5),
                        marginStart: horizScale(10),

                        alignSelf: 'flex-end',
                      }}>
                      {item?.delivery_address}
                      {/* address show here */}
                      {/* {'\n'}address show here */}
                    </Text>
                  </View>
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
                    Phone Number
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: COLORS.black,
                      fontFamily: 'Segoe UI Bold',
                      marginTop: horizScale(5),
                      marginStart: horizScale(10),
                    }}>
                    {/* 9955XXXXXX */}
                    {mobile}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  justifyContent: 'space-between',
                  marginHorizontal: 20,
                  marginVertical: 5,
                  flexDirection: 'row',
                  paddingBottom: 10,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: COLORS.darkGray,
                    fontFamily: 'Segoe UI',
                    marginTop: horizScale(5),
                    marginStart: horizScale(5),
                  }}>
                  FSSAI license no.
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: COLORS.black,
                    fontFamily: 'Segoe UI Bold',
                    marginTop: horizScale(5),
                    marginStart: horizScale(10),
                  }}>
                  {item?.fssai_lic_no}
                </Text>
              </View>

              {item?.order_status != 'completed' ||
              'cancelled_by_customer_before_confirmed' ||
              'cancelled_by_customer_after_confirmed' ||
              'cancelled_by_customer_during_prepare' ||
              'cancelled_by_customer_after_disptch' ? null : (
                <View
                  style={{
                    justifyContent: 'space-between',
                    marginHorizontal: 20,
                    marginVertical: 10,
                    flexDirection: 'row',
                  }}>
                  <Text
                    onPress={() => {
                      alert('Invoice will be downloaded');
                    }}
                    style={{
                      fontSize: 14,
                      color: COLORS.black,
                      fontFamily: 'Segoe UI',
                      textAlign: 'center',
                      marginTop: horizScale(5),
                      marginHorizontal: horizScale(5),
                      borderRadius: 5,

                      borderWidth: 0.5,
                      borderColor: COLORS.primary,
                      padding: 10,

                      flex: 1,
                    }}>
                    Download invoice
                  </Text>
                  <Text
                    onPress={() => {
                      alert('Order summary will be downloaded');
                    }}
                    style={{
                      fontSize: 14,
                      color: COLORS.black,
                      fontFamily: 'Segoe UI',
                      marginTop: horizScale(5),
                      marginHorizontal: horizScale(5),
                      flex: 1,
                      borderRadius: 5,
                      textAlign: 'center',
                      borderWidth: 0.5,
                      borderColor: COLORS.primary,
                      padding: 10,
                    }}>
                    Download summary
                  </Text>
                </View>
              )}

              {item?.order_status != 'completed' ||
              'cancelled_by_customer_before_confirmed' ||
              'cancelled_by_customer_after_confirmed' ||
              'cancelled_by_customer_during_prepare' ||
              'cancelled_by_customer_after_disptch' ? null : (
                <TouchableOpacity
                  style={{
                    height: 56,
                    justifyContent: 'center',
                    alignSelf: 'center',
                    alignItems: 'center',
                    width: '90%',
                    borderRadius: 10,
                    marginVertical: 15,
                    backgroundColor: COLORS.primary,
                  }}>
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: 20,
                      fontFamily: 'Segoe UI Bold',
                    }}>
                    Repeat Order
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderOrderItem = ({item, index}) => {
    return (
      <View
        style={{
          marginHorizontal: 10,
          marginVertical: 5,
          borderRadius: 10,
          padding: 10,
          backgroundColor: COLORS.white,
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
        <View>
          <Text
            style={{
              color: COLORS.black,
              fontSize: 16,
              fontFamily: 'Segoe UI',
              marginVertical: 5,
            }}>
            {item?.product_name}
          </Text>

          {item?.variant && (
            <Text
              style={{
                color: COLORS.black,
                fontSize: 14,
                fontFamily: 'Segoe UI',
                marginEnd: 25,
                maxWidth: Dimensions.get('window').width * 0.75,
              }}>
              Variant: {item?.variant?.variant_name} X{' '}
              {item?.variant?.variant_qty}
            </Text>
          )}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 5,
            }}>
            <Text
              style={{
                color: COLORS.black,
                fontSize: 14,
                fontFamily: 'Segoe UI',
                borderRadius: 2,
                borderWidth: 1,
                borderColor: COLORS.primary,
                paddingHorizontal: 5,
                paddingVertical: 2,
                // backgroundColor: COLORS.primary,

                textAlign: 'center',
              }}>
              {item?.product_qty}
            </Text>
            <Text
              style={{
                color: COLORS.black,
                fontSize: 12,
                fontFamily: 'Segoe UI',
              }}>
              {'  '} X {'  '}
            </Text>
            <Text
              style={{
                color: COLORS.black,
                fontSize: 16,
                fontFamily: 'Segoe UI',
              }}>
              ₹{item?.product_price}
            </Text>
          </View>
        </View>
        <Text
          style={{
            color: COLORS.black,
            fontSize: 16,
            fontFamily: 'Segoe UI',
          }}>
          ₹{item?.product_price}
        </Text>
      </View>
    );
  };

  const openClose = () => {};

  const timer = () => {};

  const [click, setClick] = useState(false);
  const renderContent = drag => (
    <TouchableOpacity
      activeOpacity={1}
      style={{
        backgroundColor: 'white',
        // padding: 16,

        // flex: 1,
      }}
      onPress={() => {}}>
      {remainingSeconds == 0 ? null : (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: COLORS.primary,
            paddingVertical: 5,
          }}>
          <View
            style={{
              padding: 10,
              justifyContent: 'space-between',
            }}>
            {/* <Text
            style={{
              fontSize: 16,
              color: COLORS.white,
              fontFamily: 'Segoe UI Bold',
              marginTop: horizScale(5),
              marginStart: horizScale(5),
            }}>
            Cancellation Policy
          </Text> */}

            <Text
              style={{
                fontSize: 12,
                color: COLORS.white,
                fontFamily: 'Segoe UI',
                // marginBottom: horizScale(10),
                marginEnd: horizScale(5),
                marginStart: horizScale(5),
              }}>
              If you cancel this order after 30 seconds,{'\n'}100% Cancellation
              fee will be applicable.
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                // backgroundColor: COLORS.grey,
              }}>
              <Text
                onPress={() => {
                  cancelOrderIn30Second();
                }}
                style={{
                  fontSize: 16,
                  color: COLORS.white,
                  fontFamily: 'Segoe UI Bold',
                  marginTop: horizScale(10),
                  marginStart: horizScale(5),
                  textDecorationLine: 'underline',
                  textAlignVertical: 'bottom',
                }}>
                Cancel Order
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginEnd: 15,
            }}>
            <View
              style={{
                height: 10,
                width: 10,
                borderRadius: 10,
                marginHorizontal: 4,

                backgroundColor:
                  remainingSeconds > 0
                    ? COLORS.primary
                    : COLORS.rippleColorPrimaryLight,
              }}></View>
            <View
              style={{
                height: 10,
                width: 10,
                marginHorizontal: 4,
                borderRadius: 10,
                backgroundColor:
                  remainingSeconds >= 10
                    ? COLORS.primary
                    : COLORS.rippleColorPrimaryLight,
              }}></View>
            <View
              style={{
                height: 10,
                width: 10,
                marginHorizontal: 4,

                borderRadius: 10,
                backgroundColor:
                  remainingSeconds >= 15
                    ? COLORS.primary
                    : COLORS.rippleColorPrimaryLight,
              }}></View>
            <View
              style={{
                height: 10,
                marginHorizontal: 4,

                width: 10,
                borderRadius: 10,
                backgroundColor:
                  remainingSeconds >= 20
                    ? COLORS.primary
                    : COLORS.rippleColorPrimaryLight,
              }}></View>
            <View
              style={{
                marginHorizontal: 4,

                height: 10,
                width: 10,
                borderRadius: 10,
                backgroundColor:
                  remainingSeconds >= 25
                    ? COLORS.primary
                    : COLORS.rippleColorPrimaryLight,
              }}></View>
            <View
              style={{
                marginHorizontal: 4,

                height: 10,
                width: 10,
                borderRadius: 10,
                backgroundColor:
                  remainingSeconds >= 30
                    ? COLORS.primary
                    : COLORS.rippleColorPrimaryLight,
              }}></View>
          </View>
        </View>
      )}
      {item?.order_status == 'pending' ? null : parseInt(
          myContext?.notificationData?.data?.type,
        ) == 2 ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.primary,
            flexDirection: 'row',
          }}>
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            }}
            style={{
              height: 65,
              width: 65,
              marginVertical: 10,
              marginHorizontal: 10,
              borderRadius: 50,
            }}
          />
          <Text
            style={{
              color: COLORS.white,
              fontSize: 14,
              fontFamily: 'Segoe UI Bold',
              paddingBottom: 10,
              flex: 1,
              marginEnd: 5,
            }}>
            Lucky Agrawal is assigned to deliver your order.
          </Text>
        </View>
      ) : parseInt(myContext?.notificationData?.data?.type) == 1 ||
        item?.order_status == 'preparing' ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            // borderTopLeftRadius: 20,
            // borderTopRightRadius: 20,
            backgroundColor: COLORS.primary,
          }}>
          <LottieView
            source={Animations.random}
            // source={Animations.process_failed}
            style={{
              height: 45,
              width: 100,
            }}
            autoPlay={true}
            loop={true}
          />
          <Text
            style={{
              color: COLORS.white,
              fontSize: 14,
              fontFamily: 'Segoe UI Bold',
              paddingBottom: 10,
              textAlign: 'center',
            }}>
            Food is preparing {'\n'}
            Your delivery partner will be assigned soon!
          </Text>
        </View>
      ) : null}

      <ScrollView
        nestedScrollEnabled={true}
        onScrollEndDrag={drag}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        style={{
          flex: 1,
        }}>
        <Text
          style={{
            color: COLORS.black,
            marginTop: vertScale(15),
            marginStart: horizScale(15),
            fontSize: horizScale(14),
            fontFamily: 'Segoe UI',
          }}>
          While you wait for your order, check out ours special offers!
        </Text>

        <View
          style={{
            marginTop: 15,
            borderRadius: 10,
            // backgroundColor: COLORS.red,
          }}>
          <FlatList
            data={banner}
            extraData={banner}
            renderItem={() => {
              return (
                <LinearGradient
                  colors={['#11556a', '#1fc6b1']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={{
                    flexDirection: 'row',
                    flexGrow: 1,
                    borderRadius: 10,
                    margin: 10,
                    padding: 10,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    // width: 100,
                    // height: 100,
                  }}>
                  <View>
                    <Text
                      style={{
                        color: COLORS.white,
                        fontSize: 16,
                        fontFamily: 'Segoe UI Bold',
                        marginStart: 5,
                        flexGrow: 1,
                      }}>
                      FLAT 50% OFF
                    </Text>

                    <Text
                      style={{
                        color: COLORS.white,
                        fontSize: 14,
                        marginTop: 5,
                        marginStart: 5,
                        fontFamily: 'Segoe UI',
                        flexGrow: 1,
                      }}>
                      Use code 50OFF
                    </Text>
                    <Text
                      style={{
                        color: COLORS.white,
                        fontSize: 14,
                        fontFamily: 'Segoe UI',
                        marginStart: 5,
                        flexGrow: 1,
                      }}>
                      Grab this offer at DOMINO'S PIZZA
                    </Text>

                    <Text
                      style={{
                        color: '#0050a1',
                        fontSize: 16,
                        fontFamily: 'Segoe UI Bold',
                        marginTop: 10,
                        marginStart: 5,
                        // flexGrow: 1,
                        backgroundColor: COLORS.white,
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        borderRadius: 10,
                        alignSelf: 'flex-start',
                      }}>
                      ORDER NOW
                    </Text>
                  </View>
                  <Image
                    source={{
                      uri: item?.image,
                    }}
                    style={{
                      height: 80,
                      width: 80,
                      borderRadius: 10,
                      marginHorizontal: 5,
                    }}
                  />
                </LinearGradient>
              );
            }}
          />
        </View>
      </ScrollView>
    </TouchableOpacity>
  );

  const initiateWhatsApp = () => {
    let whatsAppMsg = 'Hey, I need help!';
    const mobileNumber = '918962689850';
    // WhatsApp Number: 918962689850
    // Domain: https://live-101277.wati.io
    // Login id: grishu.cheflab@gmail.com
    // Password: eS2)enrPZ5VKrzMJ

    let url = 'whatsapp://send?text=' + whatsAppMsg + '&phone=' + mobileNumber;
    Linking.openURL(url)
      .then(data => {
        console.log('WhatsApp Opened');
      })
      .catch(() => {
        alert('Make sure Whatsapp installed on your device');
      });
  };

  const [banner, setBanner] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(false);

  useEffect(() => {
    let interval = setInterval(() => {
      // getDriverLive(apiToken);
    }, 6000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const getDriverLive = t => {
    setBannerLoading(true);
    let body = {
      driver_id: '1',
    };
    console.log(body + t);
    ApiCall('post', body, API_END_POINTS.get_driver_live, {
      Authorization: `Bearer ${t}`,
    })
      .then(response => {
        console.log(response);
        if (response?.data?.status) {
        } else {
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', JSON.stringify(error));
      })
      .finally(() => {
        setBannerLoading(false);
      });
  };

  const getHomeBanner = t => {
    setBannerLoading(true);
    let body = {
      for: 'cheflab',
    };
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

  return (
    <View style={style.mainContainer}>
      <CustomLoader loading={loading} />
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
          Track Order
        </Text>
        <TouchableOpacity
          onPress={() => {
            initiateWhatsApp();
          }}>
          <Image
            source={icons.Multicolor}
            style={{
              width: 30,
              height: 30,
              marginHorizontal: 15,
            }}
          />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={{
          flex: 1,
        }}
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: 10,
            elevation: 10,
            padding: 10,
            margin: 10,
            paddingVertical: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <View
              style={{
                width: 84.5,
                height: 85,
                borderRadius: 100,
                borderWidth: 2,
                borderColor: '#db2728',
                justifyContent: 'center',
                backgroundColor: COLORS.white,
                alignSelf: 'center',
              }}>
              <Image
                source={{
                  uri: item?.image,
                }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 100,
                }}
              />
            </View>
            <View>
              <Text
                style={{
                  color: COLORS.darkGray,
                  fontSize: 16,
                  fontFamily: 'Segoe UI Bold',
                  marginTop: 10,
                  marginStart: 10,
                }}>
                {item?.vendor_name}
              </Text>
              <Text
                style={{
                  color: COLORS.darkGray,
                  fontSize: 14,
                  fontFamily: 'Segoe UI',
                  marginTop: 5,
                  marginStart: 10,
                }}>
                Order id: #{item?.order_id}
              </Text>
              <Text
                style={{
                  color: COLORS.darkGray,
                  fontSize: 12,
                  fontFamily: 'Segoe UI',
                  marginTop: 5,
                  marginStart: 10,
                }}>
                {item?.order_date}
              </Text>
            </View>

            <View
              style={{
                paddingHorizontal: 15,
                paddingVertical: 5,
                backgroundColor: COLORS.outForDeliveryBg,
                position: 'absolute',
                top: 5,
                right: 0,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  color: COLORS.white,
                  fontSize: 12,
                  fontFamily: 'Segoe UI',
                  textAlign: 'center',
                }}>
                {/* {delivered
              ? 'Out for delivery'
              : success
              ? 'Delivered'
              : cancel
              ? 'Cancelled'
              : COLORS.white} */}
                {/* {item?.order_status} */}

                {item?.order_status == 'pending'
                  ? remainingSeconds == 0
                    ? 'Waiting for\nrestaurant accept'
                    : 'Waiting'
                  : parseInt(myContext?.notificationData?.data?.type) == 3
                  ? data?.order_status + '' == 'preparing'
                    ? 'Preparing'
                    : ''
                  : item?.order_status == 'confirmed'
                  ? 'Confirmed'
                  : item?.order_status == 'preparing'
                  ? 'Preparing'
                  : item?.order_status == 'ready_to_dispatch'
                  ? 'Ready to dispatch'
                  : item?.order_status == 'dispatched'
                  ? 'Order dispatched'
                  : item?.order_status ==
                      'cancelled_by_customer_before_confirmed' ||
                    'cancelled_by_customer_after_confirmed' ||
                    'cancelled_by_customer_during_prepare' ||
                    'cancelled_by_customer_after_disptch'
                  ? 'Order Cancelled'
                  : item?.order_status == 'cancelled_by_vendor'
                  ? 'Order cancelled by vendor'
                  : item?.order_status == 'completed'
                  ? 'Order Completed'
                  : ''}

                {/* {remainingSeconds == 0
                  ? 'Waiting for\nrestaurant accept'
                  : item?.order_status == 'pending'
                  ? 'Waiting'
                  : item?.order_status} */}
              </Text>
            </View>
          </View>
          {item?.order_status != 'completed' ||
          'cancelled_by_customer_before_confirmed' ||
          'cancelled_by_customer_after_confirmed' ||
          'cancelled_by_customer_during_prepare' ||
          'cancelled_by_customer_after_disptch' ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                style={{}}
                onPress={() => {
                  closeAddModal();
                }}>
                <Text
                  style={{
                    color: COLORS.primary,
                    fontSize: 14,
                    fontFamily: 'Segoe UI Bold',
                    marginStart: 10,
                    marginTop: 15,
                  }}>
                  View order details
                </Text>
              </TouchableOpacity>

              <Text
                style={{
                  fontSize: 20,
                  color: COLORS.darkGray,
                  fontFamily: 'Segoe UI Bold',
                  marginEnd: 5,
                }}>
                {/* 35 mins */}
              </Text>
            </View>
          ) : null}
          <View
            style={{
              marginTop: 10,
            }}></View>
          {/* {!show ? (
          <View
            style={{
              position: 'absolute',
              bottom: 80,
              right: 10,
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 18,
                color: COLORS.darkGray,
                fontFamily: 'Segoe UI Bold',
              }}>
              35 mins
            </Text>
          </View>
        ) : null} */}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
              backgroundColor: COLORS.darkGray,
              height: 1,
            }}></View>
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
                fontFamily: 'Segoe UI',
                marginTop: horizScale(5),
                marginStart: horizScale(5),
              }}>
              Grand Total
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: horizScale(5),
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.darkGray,
                  fontFamily: 'Segoe UI',
                  marginStart: horizScale(5),
                }}>
                {item?.payment_type}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  color: COLORS.darkGray,
                  fontFamily: 'Segoe UI Bold',
                  marginStart: horizScale(5),
                }}>
                ₹ {item?.net_amount}
              </Text>
            </View>
          </View>
        </View>
        {/* {item?.order_status != 'delivered' ? ( */}
        {item?.order_status != 'completed' ? (
          item?.order_status == 'cancelled_by_customer_before_confirmed' &&
          'cancelled_by_customer_after_confirmed' &&
          'cancelled_by_customer_during_prepare' &&
          'cancelled_by_customer_after_disptch' ? null : (
            <MapView
              ref={mapRef}
              style={{
                width: Dimensions.get('screen').width,
                height: 500,
              }}
              // style={StyleSheet.absoluteFillObject}
              pointerEvents="none"
              loadingEnabled
              region={mapRegion}
              pitchEnabled={true}
              rotateEnabled={true}
              scrollEnabled={true}
              zoomEnabled={true}
              minZoomLevel={0} // default => 0
              maxZoomLevel={20} // default => 20
            >
              {/* <MapViewDirections
                origin={{
                  latitude: item?.lat + 0.0 || userLatitude + 0.0,
                  longitude: item?.long + 0.0 || userLongitude + 0.0,
                  // latitude: location?.['latitude'] || 22.95569234,
                  // longitude: location?.['longitude'] || 76.03284881,
                }}
                destination={{
                  latitude: item?.vendor_lat + 0.0 || userLatitude + 0.0,
                  longitude: item?.vendor_long + 0.0 || userLongitude + 0.0,
                  // latitude: 22.950097,
                  // longitude: 76.0346,
                }}
                apikey={apiKey}
                strokeWidth={3}
                strokeColor={'#F04F5F'}
                optimizeWaypoints={true}
                onReady={result => {
                  // fetchTimeDistance(result.distance, result.duration);
                  mapRef.current.fitToCoordinates(result.coordinates, {
                    edgePadding: {
                      // right: 30,
                      // bottom: 300,
                      // left: 30,
                      // top: 100,
                    },
                  });
                }}
              /> */}
              <Marker.Animated
                // coordinate={{
                //   latitude: location?.['latitude'] || 22.95569234,
                //   longitude: location?.['longitude'] || 76.03284881,
                // }}
                ref={markerRef}
                coordinate={coordinate}>
                <Image
                  source={icons.bike}
                  style={{
                    width: 30,
                    height: 30,
                    transform: [
                      {
                        rotate: `${heading}deg`,
                      },
                    ],
                  }}
                  resizeMode="contain"
                />
              </Marker.Animated>

              {/* {/* {item && ( */}
              <Marker
                coordinate={{
                  // latitude: 22.950097,
                  // longitude: 76.0346,
                  latitude: parseFloat(userLatitude),
                  longitude: parseFloat(userLongitude),
                  // latitude: userLatitude,
                  // longitude: userLongitude,
                }}>
                <View style={styles.markerContainer}>
                  <LottieView
                    source={Animations.map_pin_animation}
                    style={{
                      height: 50,
                      width: 50,
                    }}
                    autoPlay={true}
                    loop={true}
                  />
                </View>
              </Marker>
              {/* )}  */}

              {/* {/* {item && ( */}
              {/* <Marker
                coordinate={{
                  latitude: 22.950097,
                  longitude: 76.0346,
                  // latitude: parseFloat(userLatitude),
                  // longitude: parseFloat(userLongitude),
                  // latitude: userLatitude,
                  // longitude: userLongitude,
                }}>
                <View style={styles.markerContainer}>
                  <LottieView
                    source={Animations.map_pin_animation}
                    style={{
                      height: 50,
                      width: 50,
                    }}
                    autoPlay={true}
                    loop={true}
                  />
                </View>
              </Marker> */}
              {/* )}  */}
            </MapView>
          )
        ) : null}

        {/* {item?.order_status != 'delivered' ? ( */}
        {item?.order_status != 'completed' ||
        'cancelled_by_customer_before_confirmed' ||
        'cancelled_by_customer_after_confirmed' ||
        'cancelled_by_customer_during_prepare' ||
        'cancelled_by_customer_after_disptch' ? (
          <TouchableOpacity
            onPress={() => moveToCurrent()}
            style={{
              padding: 5,
              borderRadius: 5,
              // backgroundColor: COLORS.black,
              position: 'absolute',
              bottom: 160,
              right: 10,
              borderWidth: 1,
              borderColor: COLORS.primary,
            }}>
            <Image
              source={{
                uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl5qqQqCylln98rXH2Ki0wSK70bqVjUda___iWNSY&s',
              }}
              style={{
                width: 25,
                height: 25,
              }}
            />
          </TouchableOpacity>
        ) : null}

        {/* <ScrollBottomSheet
        style={{}}
        componentType="FlatList"
        snapPoints={[128, '50%', windowHeight - 200]}
        enableOverScroll={true}
        initialSnapIndex={2}
        renderHandle={() => (
          <View style={styles.header}>
            <View style={styles.panelHandle} />
          </View>
        )}
        data={[1]}
        keyExtractor={i => i}
        renderItem={renderContent}
        contentContainerStyle={styles.contentContainerStyle}
      /> */}

        {/* <ScrollBottomSheet
        ref={bottomSheetRef}
        componentType="FlatList"
        topInset={24}
        animatedPosition={animatedPosition.current}
        snapPoints={snapPointsFromTop}
        initialSnapIndex={2}
        renderHandle={() =>
          // <View style={styles.header}>
          //   <View style={styles.panelHandle} />
          // </View>
          renderContent()
        }
        keyExtractor={i => `row-${i}`}
        initialNumToRender={5}
        contentContainerStyle={styles.contentContainerStyle}
        data={[1]}
        renderItem={renderContent}
      /> */}

        {item?.order_status != 'completed' &&
        'cancelled_by_customer_before_confirmed' &&
        'cancelled_by_customer_after_confirmed' &&
        'cancelled_by_customer_during_prepare' &&
        'cancelled_by_customer_after_disptch' ? (
          <BottomSheet
            sliderMinHeight={150}
            isOpen={false}
            outerContentStyle={{
              backgroundColor: COLORS.red,
              margin: 0,
              padding: 0,
            }}
            lineContainerStyle={{
              backgroundColor: COLORS.cartCountBgColor,
              height: 0,
            }}
            lineStyle={{
              backgroundColor: COLORS.white,
              margin: 0,
              padding: 0,
              width: 0,
              height: 0,
            }}>
            {
              onScrollEndDrag => renderContent(onScrollEndDrag)
              // <ScrollView onScrollEndDrag={onScrollEndDrag}>
              //   {renderContent()}
              // </ScrollView>
            }
          </BottomSheet>
        ) : null}

        {item?.order_status == 'completed' &&
        'cancelled_by_customer_before_confirmed' &&
        'cancelled_by_customer_after_confirmed' &&
        'cancelled_by_customer_during_prepare' &&
        'cancelled_by_customer_after_disptch' ? (
          <View
            style={
              {
                // backgroundColor: '#00000090',
                // flexGrow: 1,
                // justifyContent: 'flex-end',
              }
            }>
            {/* <TouchableOpacity
              activeOpacity={1}
              onPress={() => closeAddModal()}
              style={{flex: 1}}></TouchableOpacity> */}
            <View>
              <View
                style={[
                  {
                    elevation: 10,
                    backgroundColor: COLORS.white,
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
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
                      Order details
                    </Text>
                  </View>
                  {/* <TouchableOpacity onPress={() => closeAddModal()}>
                  <Image
                    source={icons.cancel}
                    style={{
                      width: 20,
                      height: 20,
                      marginRight: 10,
                    }}
                  />
                </TouchableOpacity> */}
                </View>
              </View>
              <View
                showsHorizontalScrollIndicator={false}
                style={[
                  // style.middleView,
                  {
                    backgroundColor: COLORS.lightGray,
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                  },
                ]}>
                <Text
                  style={{
                    color: COLORS.black,
                    fontSize: 18,
                    fontFamily: 'Segoe UI Bold',
                    marginEnd: 10,
                    marginTop: 10,
                    marginStart: 20,
                  }}>
                  {item?.vendor_name}
                </Text>
                <Text
                  style={{
                    color: COLORS.black,
                    fontSize: 14,
                    fontFamily: 'Segoe UI',
                    marginEnd: 10,
                    marginStart: 20,
                  }}>
                  {item?.vendor_address}
                </Text>

                <Text
                  style={{
                    color: COLORS.black,
                    fontSize: 16,
                    fontFamily: 'Segoe UI',
                    marginTop: 10,
                    marginEnd: 10,
                    marginStart: 20,
                  }}>
                  Status: {/* {item?.order_status} */}
                  {item?.order_status == 'pending'
                    ? null
                    : item?.order_status == 'confirmed'
                    ? 'Confirmed'
                    : item?.order_status == 'preparing'
                    ? 'Preparing'
                    : item?.order_status == 'ready_to_dispatch'
                    ? 'Ready to dispatch'
                    : item?.order_status == 'dispatched'
                    ? 'Order dispatched'
                    : item?.order_status ==
                        'cancelled_by_customer_before_confirmed' ||
                      'cancelled_by_customer_after_confirmed' ||
                      'cancelled_by_customer_during_prepare' ||
                      'cancelled_by_customer_after_disptch'
                    ? 'Order Cancelled'
                    : item?.order_status == 'cancelled_by_vendor'
                    ? 'Order cancelled by vendor'
                    : item?.order_status == 'completed'
                    ? 'Order Completed'
                    : ''}
                </Text>
                <View
                  style={{
                    backgroundColor: COLORS.grey,
                    height: 0.5,
                    width: '95%',
                    alignSelf: 'center',
                    marginVertical: 10,
                  }}></View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: 18,
                      fontFamily: 'Segoe UI Bold',
                      marginEnd: 10,
                      marginTop: 10,
                      marginStart: 20,
                    }}>
                    Your order
                  </Text>
                </View>
                <FlatList
                  style={{
                    marginTop: 10,
                  }}
                  data={item?.products}
                  renderItem={renderOrderItem}
                />
                <View
                  style={{
                    backgroundColor: COLORS.white,
                    elevation: 10,
                    padding: 10,
                    borderRadius: 10,
                    marginBottom: 10,
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
                        fontSize: 18,
                        color: COLORS.darkGray,
                        fontFamily: 'Segoe UI Bold',
                        marginTop: horizScale(5),
                        marginStart: horizScale(5),
                      }}>
                      Grand Total
                    </Text>
                    <Text
                      style={{
                        fontSize: 18,
                        color: COLORS.black,
                        fontFamily: 'Segoe UI Bold',
                        marginTop: horizScale(5),
                        marginStart: horizScale(10),
                      }}>
                      {/* ₹ {40 + 15 + parseInt(item?.net_amount)} */}₹{' '}
                      {/* {parseInt(item?.net_amount)} */}
                      {item?.net_amount}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    color: COLORS.black,
                    fontSize: 18,
                    fontFamily: 'Segoe UI Bold',
                    marginEnd: 10,
                    marginTop: 10,
                    marginStart: 20,
                  }}>
                  Your order details
                </Text>
                <View
                  style={{
                    backgroundColor: COLORS.white,
                    elevation: 10,
                    padding: 10,
                    borderRadius: 10,
                    marginBottom: 10,
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
                      Order id
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: COLORS.black,
                        fontFamily: 'Segoe UI Bold',
                        marginTop: horizScale(5),
                        marginStart: horizScale(10),
                      }}>
                      #{item?.order_id}
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
                      Payment Type
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: COLORS.black,
                        fontFamily: 'Segoe UI Bold',
                        marginTop: horizScale(5),
                        marginStart: horizScale(10),
                      }}>
                      {item?.payment_type}
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
                      Order Date
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: COLORS.black,
                        fontFamily: 'Segoe UI Bold',
                        marginTop: horizScale(5),
                        marginStart: horizScale(10),
                      }}>
                      {item?.order_date}
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
                      Order Delivery Address
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        flex: 1,
                        justifyContent: 'flex-end',
                      }}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: COLORS.black,
                          fontFamily: 'Segoe UI Bold',
                          marginTop: horizScale(5),
                          marginStart: horizScale(10),

                          alignSelf: 'flex-end',
                        }}>
                        {item?.delivery_address}
                        {/* address show here */}
                        {/* {'\n'}address show here */}
                      </Text>
                    </View>
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
                      Phone Number
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: COLORS.black,
                        fontFamily: 'Segoe UI Bold',
                        marginTop: horizScale(5),
                        marginStart: horizScale(10),
                      }}>
                      {/* 9955XXXXXX */}
                      {mobile}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    justifyContent: 'space-between',
                    marginHorizontal: 20,
                    marginVertical: 5,
                    flexDirection: 'row',
                    paddingBottom: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: COLORS.darkGray,
                      fontFamily: 'Segoe UI',
                      marginTop: horizScale(5),
                      marginStart: horizScale(5),
                    }}>
                    FSSAI license no.
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: COLORS.black,
                      fontFamily: 'Segoe UI Bold',
                      marginTop: horizScale(5),
                      marginStart: horizScale(10),
                    }}>
                    {item?.fssai_lic_no}
                  </Text>
                </View>

                {item?.order_status == 'completed' &&
                'cancelled_by_customer_before_confirmed' &&
                'cancelled_by_customer_after_confirmed' &&
                'cancelled_by_customer_during_prepare' &&
                'cancelled_by_customer_after_disptch' ? (
                  <View
                    style={{
                      justifyContent: 'space-between',
                      marginHorizontal: 20,
                      marginVertical: 10,
                      flexDirection: 'row',
                    }}>
                    <Text
                      onPress={() => {
                        alert('Invoice will be downloaded');
                      }}
                      style={{
                        fontSize: 14,
                        color: COLORS.black,
                        fontFamily: 'Segoe UI',
                        textAlign: 'center',
                        marginTop: horizScale(5),
                        marginHorizontal: horizScale(5),
                        borderRadius: 5,

                        borderWidth: 0.5,
                        borderColor: COLORS.primary,
                        padding: 10,

                        flex: 1,
                      }}>
                      Download invoice
                    </Text>
                    <Text
                      onPress={() => {
                        alert('Order summary will be downloaded');
                      }}
                      style={{
                        fontSize: 14,
                        color: COLORS.black,
                        fontFamily: 'Segoe UI',
                        marginTop: horizScale(5),
                        marginHorizontal: horizScale(5),
                        flex: 1,
                        borderRadius: 5,
                        textAlign: 'center',
                        borderWidth: 0.5,
                        borderColor: COLORS.primary,
                        padding: 10,
                      }}>
                      Download summary
                    </Text>
                  </View>
                ) : null}

                {item?.order_status != 'completed' &&
                'cancelled_by_customer_before_confirmed' &&
                'cancelled_by_customer_after_confirmed' &&
                'cancelled_by_customer_during_prepare' &&
                'cancelled_by_customer_after_disptch' ? null : (
                  <TouchableOpacity
                    style={{
                      height: 56,
                      justifyContent: 'center',
                      alignSelf: 'center',
                      alignItems: 'center',
                      width: '90%',
                      borderRadius: 10,
                      marginVertical: 15,
                      backgroundColor: COLORS.primary,
                    }}>
                    <Text
                      style={{
                        color: COLORS.white,
                        fontSize: 20,
                        fontFamily: 'Segoe UI Bold',
                      }}>
                      Repeat Order
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        ) : null}
      </ScrollView>
      {renderAddModal()}
    </View>
  );
};

export default TrackOrder;

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    // width: 60,
    backgroundColor: 'transparent',
    // height: 70,
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

  container: {
    flex: 1,
  },
  contentContainerStyle: {
    // padding: 16,
    // backgroundColor: '#F3F4F9',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHandle: {},
  item: {
    // padding: 20,
    // marginVertical: 10,
  },
});
/*

// pending
// confirmed
// preparing
// ready_to_dispatch
// dispatched
// cancelled_by_customer_before_confirmed
// cancelled_by_customer_after_confirmed
// cancelled_by_customer_during_prepare
// cancelled_by_customer_after_disptch
// cancelled_by_vendor
// completed


'pending',
'confirmed',
'preparing',
'ready_to_dispatch',
'dispatched',
'cancelled_by_customer_before_confirmed',
'cancelled_by_customer_after_confirmed',
'cancelled_by_customer_during_prepare',
'cancelled_by_customer_after_disptch',
'cancelled_by_vendor','completed'


djHxEkb2TKi8g2Pd5BdYc7:APA91bHx31cW6qMUFXEtIBH4vMyqxlg4_nFVCHKhTz0s4DTqyB82NltuxZt7XXeheFTgPqolqCmXezDCK2eeVV3HYR2lVgJf-Tb7pdO17Id6MP-TeVOiMOgKTTzaj15zAzJyq3ggWFYE

*/
