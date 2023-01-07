import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import {useIsFocused} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import CheckBox from 'react-native-check-box';
import MapView, {AnimatedRegion} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {Extrapolate, interpolateNode, Value} from 'react-native-reanimated';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import {Animations, COLORS, icons, SIZES, STRINGS} from '../../constants';
import ApiCall from '../../network/ApiCall';
import {API_END_POINTS} from '../../network/ApiEndpoints';
import CustomEditText from '../../utils/EditText/CustomEditText';
import Loader from '../../utils/Loader';
import {ShowConsole, ShowMessage} from '../../utils/Utility';
import style from './style';
import Geocoder from 'react-native-geocoding';
import Qs from 'qs';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const snapPointsFromTop = [150, '50%', windowHeight - 128];

const apiKey = 'AIzaSyAp19nG1uHd60NgoviVZy2MhJccOwWS7yM';
Geocoder.init(apiKey);
const ASPECT_RATIO = windowWidth / windowHeight;
const LATITUDE_DELTA = 0.9222;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const Maps = ({navigation, route}) => {
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
                'This App needs to Access your location for easy delivery of your products/foods.',
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
  }, []);

  const [userId, setUserId] = useState('');

  const [mapRegion, setMapRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });
  const [location, setLocation] = useState(null);
  const markerRef = useRef();

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [coordinate, setCoordinate] = useState(
    new AnimatedRegion({
      latitude: 0,
      longitude: 0,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }),
  );

  const moveToCurrent = () => {
    getOneTimeLocation();

    mapRef?.current?.animateToRegion({
      latitude: mapRegion.latitude,
      longitude: mapRegion.longitude,
      latitudeDelta: 0,
      longitudeDelta: 0,
    });
  };

  const [heading, setHeading] = useState(0);
  const [loading, setLoading] = useState(false);

  const animate = (latitude, longitude) => {
    const newCoord = {
      latitude,
      longitude,
    };

    if (latitude && longitude) {
      setTimeout(() => {
        // markerRef.current.animateMarkerToCoordinate(newCoord, 7000);
        markerRef?.current?.animateMarkerToCoordinate(newCoord, 7000);
      }, 2000);
    }

    //place platform check
    if (Platform.OS == 'android') {
      if (markerRef.current) {
        markerRef.current.animateMarkerToCoordinate(newCoord, 7000);
      }
    } else {
      //
    }
  };
  const animatedPosition = React.useRef(new Value(0));
  const opacity = interpolateNode(animatedPosition.current, {
    inputRange: [0, 1],
    outputRange: [0, 0.75],
    extrapolate: Extrapolate.CLAMP,
  });

  const [currentAddress, setCurrentAddress] = useState('');
  const [city, setCity] = useState('');
  const [count, setCount] = useState(0);
  const [apiToken, setApiToken] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    getInfoFromStorage();
    let {lat} = route.params;
    let {long} = route.params;
    console.log('lat: ' + typeof lat);
    console.log('long: ' + long);
    setMapRegion({
      latitude: parseFloat(lat),
      longitude: parseFloat(long),
      latitudeDelta: 0,
      longitudeDelta: 0,
    });

    // BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    // return () => {
    //   BackHandler.removeEventListener(
    //     'hardwareBackPress',
    //     handleBackButtonClick,
    //   );
    // };
  }, []);

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
          } else {
            setUserId('');
          }
        }
      });
    } catch (error) {}
  };

  const getOneTimeLocation = () => {
    setLoading(true);
    Geolocation.getCurrentPosition(
      position => {
        const currentLongitude = JSON.stringify(position.coords.longitude);

        const currentLatitude = JSON.stringify(position.coords.latitude);
        let truncLat = parseFloat(currentLatitude).toFixed(5);
        let truncLon = parseFloat(currentLongitude).toFixed(5);

        console.log(
          'currentLongitude -> ' +
            currentLongitude +
            ' ' +
            'currentLatitude => ' +
            currentLatitude,
        );
        let coords = position.coords;
        setLocation(coords);
        if (coords) {
          let {longitude, latitude} = coords;
          animate(position.coords.latitude, position.coords.longitude);
          setHeading(position?.coords?.heading);
          setMapRegion({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0,
            longitudeDelta: 0,
          });

          setCoordinate(
            new AnimatedRegion({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }),
          );
        }

        setLongitude(currentLongitude);
        setLatitude(currentLatitude);

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
                console.log(' greater then if 8');
                setCount(count + 1);
                setCurrentAddress(responseJson.results[0].formatted_address);
                // setCurrentAddress(responseJson.results[0].address_components[1]?.long_name);
                if (responseJson.results[5].address_components.length > 4) {
                  console.log(' greater then if 4');
                  let str = `${responseJson.results[5].address_components[1].long_name}, ${responseJson.results[5].address_components[3].long_name}, ${responseJson.results[5].address_components[4].long_name}`;
                  // let str = `${responseJson.results[5].address_components[1].long_name}`;
                  setCity(str);
                } else {
                  console.log(' greater then else 5');
                  let str = `${responseJson.results[5].address_components[1].long_name}, ${responseJson.results[5].address_components[2].long_name}, ${responseJson.results[5].address_components[3].long_name}`;
                  // let str = `${responseJson.results[5].address_components[1].long_name}`;
                  setCity(str);
                }
              }

              if (responseJson.results.length == 6) {
                console.log('equal to 6');
                setCount(count + 1);
                setCurrentAddress(responseJson.results[0].formatted_address);
                // setCurrentAddress(
                //   responseJson.results[0].address_components[1]?.long_name,
                // );
                let str = `${responseJson.results[1].address_components[0].long_name}, ${responseJson.results[1].address_components[2].long_name}, ${responseJson.results[1].address_components[3].long_name}`;
                // let str = `${responseJson.results[1].address_components[0].long_name}`;
                setCity(str);
              }

              if (responseJson.results.length == 7) {
                console.log('equal to 7');
                setCount(count + 1);
                setCurrentAddress(responseJson.results[0].formatted_address);
                // setCurrentAddress(
                //   responseJson.results[0].address_components[1]?.long_name,
                // );
                let str = `${responseJson.results[1].address_components[0].long_name}, ${responseJson.results[1].address_components[2].long_name}, ${responseJson.results[1].address_components[3].long_name}`;
                // let str = `${responseJson.results[1].address_components[0].long_name}`;
                setCity(str);
              }
              if (responseJson.results.length == 8) {
                console.log('greater then else 8');
                setCount(count + 1);
                setCurrentAddress(responseJson.results[0].formatted_address);
                // setCurrentAddress(
                //   responseJson.results[0].address_components[1]?.long_name,
                // );
                let str = `${responseJson.results[5].address_components[0].long_name}, ${responseJson.results[5].address_components[1].long_name}, ${responseJson.results[5].address_components[2].long_name}`;
                setCity(str);
              }
            }
          })
          .catch(err => {
            console.log('ADDRESS GEOCODE ERROR!! => ' + err);
          });
      },
      error => {},
      {
        // enableHighAccuracy: true,
        // maximumAge: 1000,
        timeout: 30000,
        showLocationDialog: true,
        forceRequestLocation: true,
      },
    );
    setLoading(false);
  };

  const getPlaceNameOnChange = (lat, long) => {
    fetch(
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
        lat +
        ',' +
        long +
        '&key=' +
        apiKey,
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status === 'OK') {
          if (responseJson.results.length > 8) {
            console.log(' greater then if 8');
            setCount(count + 1);
            setCurrentAddress(responseJson.results[0].formatted_address);
            // setCurrentAddress(responseJson.results[0].address_components[1]?.long_name);
            if (responseJson.results[5].address_components.length > 4) {
              console.log(' greater then if 4');
              let str = `${responseJson.results[5].address_components[1].long_name}, ${responseJson.results[5].address_components[3].long_name}, ${responseJson.results[5].address_components[4].long_name}`;
              // let str = `${responseJson.results[5].address_components[1].long_name}`;
              setCity(str);
            } else {
              console.log(' greater then else 5');
              let str = `${responseJson.results[5].address_components[1].long_name}, ${responseJson.results[5].address_components[2].long_name}, ${responseJson.results[5].address_components[3].long_name}`;
              // let str = `${responseJson.results[5].address_components[1].long_name}`;
              setCity(str);
            }
          }

          if (responseJson.results.length == 6) {
            console.log('equal to 6');
            setCount(count + 1);
            setCurrentAddress(responseJson.results[0].formatted_address);
            // setCurrentAddress(
            //   responseJson.results[0].address_components[1]?.long_name,
            // );
            let str = `${responseJson.results[1].address_components[0].long_name}, ${responseJson.results[1].address_components[2].long_name}, ${responseJson.results[1].address_components[3].long_name}`;
            // let str = `${responseJson.results[1].address_components[0].long_name}`;
            setCity(str);
          }

          if (responseJson.results.length == 7) {
            console.log('equal to 7');
            setCount(count + 1);
            setCurrentAddress(responseJson.results[0].formatted_address);
            // setCurrentAddress(
            //   responseJson.results[0].address_components[1]?.long_name,
            // );
            let str = `${responseJson.results[1].address_components[0].long_name}, ${responseJson.results[1].address_components[2].long_name}, ${responseJson.results[1].address_components[3].long_name}`;
            // let str = `${responseJson.results[1].address_components[0].long_name}`;
            setCity(str);
          }
          if (responseJson.results.length == 8) {
            console.log('greater then else 8');
            setCount(count + 1);
            setCurrentAddress(responseJson.results[0].formatted_address);
            // setCurrentAddress(
            //   responseJson.results[0].address_components[1]?.long_name,
            // );
            let str = `${responseJson.results[5].address_components[0].long_name}, ${responseJson.results[5].address_components[1].long_name}, ${responseJson.results[5].address_components[2].long_name}`;
            setCity(str);
          }
        }
      })
      .catch(err => {
        console.log('ADDRESS GEOCODE ERROR!! => ' + err);
      });

    setLoading(false);
  };

  const [searchedLocation, setSearchLocation] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const convertAddressToLatLong = address => {
    console.log('convertAddressToLatLong =>>> ', address);

    Geocoder.from(address)
      .then(json => {
        var location = json.results[0].geometry.location;
        console.log('convertAddressToLatLong =>>> ', location);
        setCoordinate(
          new AnimatedRegion({
            latitude: json.results[0].geometry.location?.lat,
            longitude: json.results[0].geometry.location?.lat,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }),
        );
        setMapRegion({
          latitude: parseFloat(json.results[0].geometry.location?.lat),
          longitude: parseFloat(json.results[0].geometry.location?.lng),
          latitudeDelta: 0,
          longitudeDelta: 0,
        });
        getPlaceNameOnChange(
          json.results[0].geometry.location?.lat,
          json.results[0].geometry.location?.lng,
        );
      })
      .catch(error => console.warn(error));
  };

  const renderSearchLocationItem = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setShowSearchModal(false);
          setSearchLocation([]);
          convertAddressToLatLong(item?.description);
        }}
        style={{
          flexDirection: 'row',
          paddingVertical: 15,
          alignItems: 'center',
          paddingHorizontal: 5,
          // backgroundColor: COLORS.restCardColor,
        }}>
        <View
          style={{
            alignItems: 'center',
          }}>
          <Ionicons
            name="location-outline"
            color={COLORS.grey}
            size={20}
            style={{
              marginHorizontal: 8,
            }}
          />
        </View>
        <View>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Segoe UI Bold',
              color: COLORS.black,
            }}>
            {item?.terms[0]?.value}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              // backgroundColor: COLORS.buttonBgColor,
            }}>
            <Text
              style={{
                flexWrap: 'wrap',
                fontSize: 13,
                fontFamily: 'Segoe UI',
                paddingEnd: 15,
              }}>
              {item?.description}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const searchLocationViaName = locationName => {
    setSearchLoading(true);
    //https://maps.googleapis.com/maps/api/distancematrix/json?origins=Washington,DC&destinations=New+York+City,NY&key=YOUR_API_KEY

    /**
      request.open(
        'GET',
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=` +
          encodeURIComponent(text) +
          '&' +
          Qs.stringify(props.query),
      );
     */
    console.log(
      'searchLocationViaName' +
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=` +
        encodeURIComponent(locationName) +
        '&key=' +
        apiKey +
        '&' +
        Qs.stringify({components: 'country:ind'}),
    );
    fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=` +
        encodeURIComponent(locationName) +
        '&key=' +
        apiKey +
        '&' +
        Qs.stringify({components: 'country:ind'}),
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status === 'OK') {
          console.log(
            'ADDRESS AUTOCOMPLETE => ' +
              JSON.stringify(responseJson?.predictions?.length),
          );
          setSearchLocation(responseJson?.predictions);
        } else {
          setSearchLocation([]);
        }
      })
      .catch(err => {
        console.log('ADDRESS GEOCODE ERROR!! => ' + err);
      })
      .finally(() => {
        setSearchLoading(false);
      });

    setLoading(false);
  };
  const [houseNumber, setHouseNumber] = useState('');
  const [houseNumberError, setHouseNumberError] = useState(false);
  const [reachAddress, setReachAddress] = useState('');
  const [reachAddressError, setReachAddressError] = useState(false);
  const [reachAddressContact, setReachAddressContact] = useState('');
  const [reachAddressContactError, setReachAddressContactError] =
    useState(false);

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

  // function handleBackButtonClick() {
  //   // navigation.goBack();
  //   navigation.replace('MainContainer', {
  //     intentFromMap: true,
  //   });

  //   return true;
  // }

  const userLatitude = useSelector(state => state?.state?.userLatitude);
  const userLongitude = useSelector(state => state?.state?.userLongitude);

  console.log(
    ' userLatitude  ->  ',
    userLatitude + ' -> userLongitude ' + userLongitude,
  );

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
        lat: latitude,
        long: longitude,
        is_primary: primary ? 1 : 0,
      };
      console.log('daa -> ', JSON.stringify(body));
      ApiCall('post', body, API_END_POINTS.saveUserDeliveryAddress, {
        Authorization: `Bearer ${apiToken}`,
      })
        .then(response => {
          console.log('daa -> ', JSON.stringify(response?.data));
          if (response?.data?.status) {
            ShowMessage(response?.data?.message);
            navigation.goBack();
            // handleBackButtonClick();
            // navigation.replace('MainContainer', {
            //   screen: 'Home',
            //   params: {
            //     intentFromMap: true,
            //   },
            // });
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

  const mapRef = useRef();
  const [showAddModal, setShowAddModal] = useState(false);

  const [primary, setPrimary] = React.useState(false);

  const onRegionChange = region => {
    ShowConsole('onRegionChange -> ', JSON.stringify(region));
    setCoordinate(
      new AnimatedRegion({
        latitude: region.latitude,
        longitude: region.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }),
    );

    // getPlaceNameOnChange(region.latitude, region?.longitude);
  };

  const onRegionChangeComplete = region => {
    ShowConsole('onRegionChangeComplete -> ', JSON.stringify(region));
    setCoordinate(
      new AnimatedRegion({
        latitude: region.latitude,
        longitude: region.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }),
    );

    setLatitude(region.latitude);
    setLongitude(region.longitude);

    getPlaceNameOnChange(region.latitude, region?.longitude);
  };

  const [showSearchModal, setShowSearchModal] = useState(false);
  // const [showSearchModal, setShowSearchModal] = useState(false);

  const renderSearchModal = () => {
    return (
      <Modal
        transparent={true}
        animationType={'none'}
        visible={showSearchModal}
        onRequestClose={() => {
          setSearchLocation([]);
          setShowSearchModal(false);
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
              setSearchLocation([]);
              setShowSearchModal(false);
            }}
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}></TouchableOpacity>
          <View
            style={{
              // minHeight: SIZES.height * 0.8,
              maxHeight: SIZES.height * 0.8,
            }}>
            <ScrollView
              style={[
                {
                  paddingBottom: 25,
                  paddingTop: 10,
                  // paddingHorizontal: 5,
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
                      marginStart: 20,
                      fontSize: 20,
                      fontFamily: 'Segoe UI Bold',
                      textAlign: 'center',
                      // marginVertical: 10,
                      color: COLORS.black,
                    },
                  ]}>
                  Select a location
                </Text>
                <FontAwesome
                  name="close"
                  size={20}
                  color={COLORS.black}
                  style={{
                    position: 'absolute',
                    top: 5,
                    right: 20,
                  }}
                  onPress={() => {
                    setShowSearchModal(false);
                    setSearchLocation([]);
                  }}
                />
              </View>
              <View
                style={{
                  height: 45,
                  width: '90%',
                  backgroundColor: COLORS.lightGray3,
                  marginTop: 15,
                  alignSelf: 'center',
                  borderRadius: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Ionicons
                  name="location-sharp"
                  color={COLORS.primary}
                  size={20}
                  style={{
                    marginHorizontal: 8,
                  }}
                />
                <TextInput
                  style={{
                    flex: 1,
                    fontSize: 16,
                    fontFamily: 'Segoe UI',
                  }}
                  onChangeText={val => {
                    searchLocationViaName(val);
                  }}
                  placeholder="Search for area or street name"
                />
              </View>

              <FlatList
                data={searchedLocation}
                style={
                  {
                    // marginTop: 20,
                  }
                }
                ItemSeparatorComponent={() => {
                  return (
                    <View
                      style={{
                        width: '100%',
                        height: 0.5,
                        backgroundColor: COLORS.lightGray3,
                      }}></View>
                  );
                }}
                renderItem={renderSearchLocationItem}
              />
              {searchLoading ? (
                <ActivityIndicator
                  size={'large'}
                  color={COLORS.primary}
                  style={{
                    marginVertical: 15,
                  }}
                />
              ) : null}
              <View
                style={{
                  height: 1,
                  width: '100%',
                  backgroundColor: COLORS.lightGray3,
                  marginTop: 20,
                }}></View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 5,
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'Segoe UI',
                  }}>
                  powered by
                </Text>
                <Image
                  source={{
                    uri: 'https://play-lh.googleusercontent.com/1-hPxafOxdYpYZEOKzNIkSP43HXCNftVJVttoo4ucl7rsMASXW3Xr6GlXURCubE1tA=w3840-h2160-rw',
                  }}
                  style={{
                    height: 15,
                    width: 50,
                    alignSelf: 'center',
                  }}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={style.mainContainer}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: COLORS.white,
          elevation: 10,
          height: 56,
        }}>
        {/* <ToolbarWithIcon showShare={false} /> */}
        <TouchableOpacity
          onPress={() => {
            // handleBackButtonClick();
            navigation.goBack();
          }}>
          <Image
            source={icons.back}
            style={{
              width: 30,
              height: 30,
              alignSelf: 'center',
              marginHorizontal: 15,
              resizeMode: 'center',
            }}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            fontFamily: 'Segoe UI Bold',
            color: COLORS.black,
            flexGrow: 1,
            maxWidth: Dimensions.get('window').width / 2 + 15,
          }}
          numberOfLines={1}>
          Select from Map
        </Text>
      </View>
      <Loader loading={loading} />

      <MapView
        ref={mapRef}
        style={{
          width: Dimensions.get('screen').width,
          height: Dimensions.get('screen').height - 200,
        }}
        // style={{...StyleSheet.absoluteFillObject}}
        pointerEvents="none"
        loadingEnabled
        region={mapRegion}
        pitchEnabled={true}
        rotateEnabled={true}
        scrollEnabled={true}
        zoomEnabled={true}
        minZoomLevel={0} // default => 0
        maxZoomLevel={20} // default => 20
        onRegionChange={onRegionChange}
        onRegionChangeComplete={onRegionChangeComplete}>
        {/* <MapViewDirections
          origin={{
            latitude: coordinate?.latitude,
            longitude: coordinate?.longitude,
          }}
          destination={{
            latitude: coordinate?.latitude,
            longitude: coordinate?.longitude,
          }}
          apikey={apiKey}
          strokeWidth={0.5}
          strokeColor={'#00000000'}
          optimizeWaypoints={true}
          onReady={result => {
            // fetchTimeDistance(result.distance, result.duration);
            mapRef.current.fitToCoordinates(result.coordinates, {
              edgePadding: {
                right: 40,
                bottom: 300,
                left: 30,
                top: 100,
              },
            });
          }}
        /> */}
        {/* <Marker.Animated
          // coordinate={{
          //   latitude: location?.['latitude'] || 22.95569234,
          //   longitude: location?.['longitude'] || 76.03284881,
          // }}
          ref={markerRef}
          draggable={false}
          coordinate={coordinate}>
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
        </Marker.Animated> */}
      </MapView>
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

              <Text
                style={{
                  textAlign: 'left',
                  color: COLORS.black,
                  fontSize: 14,
                  marginStart: 10,
                }}>
                {currentAddress}
              </Text>

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
              />

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
              <View
                style={{
                  padding: 5,
                  backgroundColor: COLORS.white,
                }}></View>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 10,
          backgroundColor: COLORS.white,
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
        }}>
        <View
          style={{
            flexDirection: 'column',
            // alignItems: 'center',
            // justifyContent: 'space-evenly',
          }}>
          <TouchableOpacity
            onPress={() => {
              moveToCurrent();
              console.log('animate ');
            }}
            activeOpacity={0.8}
            style={{
              // width: 100,
              // height: 35,
              paddingVertical: 5,
              alignItems: 'center',
              alignSelf: 'center',
              marginBottom: 10,
              marginBottom: 15,
              borderRadius: 10,

              borderWidth: 1,
              borderColor: COLORS.primary,
            }}>
            <Text
              style={[
                {
                  marginHorizontal: 5,
                  color: COLORS.primary,
                  fontSize: 16,
                  fontFamily: 'Segoe UI Bold',
                  textAlign: 'center',
                  // marginVertical: 10,
                  color: COLORS.primary,
                },
              ]}>
              Use Current Location
            </Text>
          </TouchableOpacity>

          {city && currentAddress ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flexGrow: 1,
              }}>
              <Image
                source={icons.location}
                style={[
                  style.headerImage,
                  {
                    marginStart: 10,
                    marginTop: 10,
                    alignSelf: 'flex-start',
                  },
                ]}
              />

              <View
                style={[
                  {
                    flexDirection: 'column',
                    marginStart: 15,
                  },
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                    // alignItems: 'center',
                    // maxWidth: Dimensions.get('window').width - 25,
                    // backgroundColor: COLORS.red,
                    // flex: 1,
                    // flexWrap: 'wrap',
                  }}>
                  <Text
                    style={[
                      // style.placeText,
                      {
                        // width: Dimensions.get('window').width - 150,
                        // width: Dimensions.get('window').width - 25,
                        // flex: 1,
                        fontSize: 18,
                        fontFamily: 'Segoe UI Bold',
                        color: COLORS.black,
                        // alignSelf: 'flex-start',
                        marginEnd: 34,
                      },
                    ]}>
                    {currentAddress}
                  </Text>
                </View>
                <Text
                  style={[
                    {
                      // width: Dimensions.get('window').width - 150,
                      fontSize: 15,
                      fontFamily: 'Segoe UI',
                      color: COLORS.black,
                      marginTop: 10,
                      marginEnd: 25,
                      alignSelf: 'flex-start',
                    },
                  ]}>
                  {city}
                </Text>
              </View>

              {/* <Text
                onPress={() => {}}
                style={[
                  style.placeText,
                  {
                    fontSize: 15,
                    fontFamily: 'Segoe UI Bold',
                    color: COLORS.primary,
                    alignSelf: 'flex-start',
                    marginEnd: 10,
                    // position: 'absolute',
                    // top: 10,
                    // right: 10,
                  },
                ]}>
                Change
              </Text> */}
            </View>
          ) : (
            <ActivityIndicator color={COLORS.primary} size={'large'} />
          )}

          <TouchableOpacity
            onPress={() => {
              // addUserAddress();
              setShowAddModal(true);
              // setHouseNumber(currentAddress);
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
              marginBottom: 5,
              marginTop: 15,
              borderRadius: 10,
              flexDirection: 'row',
            }}>
            <Text
              style={[
                style.addressText,
                {marginHorizontal: 15, color: COLORS.white},
              ]}>
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          bottom: 120,
          left: 0,
          right: 0,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
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
      </View>

      <TouchableOpacity
        onPress={() => {
          setShowSearchModal(true);
        }}
        activeOpacity={0.9}
        style={{
          height: 40,
          width: '95%',
          backgroundColor: COLORS.lightGray3,
          alignSelf: 'center',
          position: 'absolute',
          top: 60,
          bottom: 0,
          borderRadius: 10,
          alignItems: 'center',
          borderColor: COLORS.primary,
          borderWidth: 1,
          flexDirection: 'row',
          // paddingHorizontal: 15,
        }}>
        <Ionicons
          name="location-sharp"
          color={COLORS.primary}
          size={20}
          style={{
            marginStart: 10,
          }}
        />
        <Text
          style={{
            marginStart: 5,
            textAlign: 'center',
          }}>
          Search for area, street name
        </Text>
      </TouchableOpacity>

      {renderSearchModal()}
    </View>
  );
};

export default Maps;

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
