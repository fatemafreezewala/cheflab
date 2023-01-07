import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';
import {COLORS, icons} from '../../constants';
import ApiCall from '../../network/ApiCall';
import {API_END_POINTS} from '../../network/ApiEndpoints';
import Loader from '../../utils/Loader';
import ToolbarWithIcon from '../../utils/ToolbarWithIcon';
import style from './style';
import TopTabBar from './top_tab_nav';
import {Rating, AirbnbRating} from 'react-native-elements';

const Favorites = ({navigation, route}) => {
  const [userId, setUserId] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([
    {
      product_name: 'Pizza',
      rating: '4.5',
      product_image:
        'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8cGl6emF8ZW58MHx8MHx8',
    },
    {
      product_name: 'Sai Pooja Restaurant',
      rating: '4.4',
      product_image:
        'https://images.unsplash.com/photo-1559329007-40df8a9345d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D',
    },

    {
      product_name: 'Frenny Darji',
      rating: '4.3',
      product_image:
        'https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGNoZWZ8ZW58MHx8MHx8',
    },
  ]);

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

  const userLatitude = useSelector(state => state?.state?.userLatitude);
  const userLongitude = useSelector(state => state?.state?.userLongitude);

  const getRestDetailsPage = (value, _id) => {
    setLoading(true);
    let body = {
      // lat: 24.4637223,
      // lng: 74.8866346,
      // lat: 22.72418,
      // lng: 75.887257,

      lat: userLatitude,
      lng: userLongitude,
    };
    // console.log('daa -> ', JSON.stringify(body) + value);
    ApiCall('post', body, API_END_POINTS.getUserFavList, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        if (response?.data?.status) {
          //   console.log('profile data -> ', JSON.stringify(response?.data));
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
        setLoading(false);
      });
  };

  const renderItem = ({item, index}) => {
    // console.log('sdada=> ', JSON.stringify(item));
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
        <View>
          <Image
            source={{uri: '' + item?.product_image}}
            style={{
              height: 80,
              width: 80,
              // margin: 10,
              borderRadius: 10,
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'column',
            marginStart: 15,
            // alignItems: 'flex-start',
            flex: 1,
          }}>
          <Text
            style={{
              color: COLORS.black,
              fontSize: 16,
              fontFamily: 'Segoe UI Bold',
              //   marginStart: -2,
              marginTop: 5,
            }}>
            {item?.product_name}
          </Text>
          {item?.type == 'non_veg' ? null : (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {}}
              style={styles.fav}>
              <Image
                source={icons.pure_veg}
                style={{
                  width: 10,
                  height: 10,
                }}
              />
            </TouchableOpacity>
          )}
          <Text
            style={{
              color: COLORS.grey,
              marginTop: 5,
              fontFamily: 'Segoe UI',
              fontSize: 14,
            }}>
            {/* North Indian */}
          </Text>

          <View
            style={{
              // marginStart: 15,
              marginTop: 8,
              flexDirection: 'row',
              // justifyContent: 'center',
              alignItems: 'center',
            }}>
            {/* <Image source={icons.star} style={styles.distance_logo} /> */}
            {/* <AntDesign name="staro" color={'gold'} />
            <AntDesign name="staro" color={'gold'} />
            <AntDesign name="staro" color={'gold'} />
            <AntDesign name="staro" color={'gold'} />
            <AntDesign name="staro" color={'gold'} /> */}
            {/* <AirbnbRating
                count={5}
                showRating={false}
                defaultRating={parseInt(item?.product_rating)}
                size={10}
              /> */}
            <Text style={[styles.distance]} numberOfLines={1}>
              4.5
            </Text>

            <View
              style={{
                position: 'absolute',
                right: 5,
              }}>
              {item?.customizable == 'true' ? (
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
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
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
          Your Favorites
        </Text>
      </View>

      {/* <FlatList
        data={data}
        renderItem={renderItem}
        style={{
          flex: 1,
          flexGrow: 1,
        }}
      /> */}

      <View
        style={{
          marginTop: 15,
          // marginTop: 2,
        }}></View>
      <TopTabBar />
    </SafeAreaView>
  );
};

export default Favorites;

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
});
