import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS, icons} from '../../constants';
import ApiCall from '../../network/ApiCall';
import {API_END_POINTS} from '../../network/ApiEndpoints';
import ToolbarWithIcon from '../../utils/ToolbarWithIcon';
import style from './style';
import TopTabBar from './top_nav';

const Order = ({navigation}) => {
  const [changeOne, setChangeOne] = useState(true);
  const [changeTwo, setChangeTwo] = useState(false);
  const [changeThree, setChangeThree] = useState(false);

  const [userId, setUserId] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [masterData, setMasterData] = useState([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getInfoFromStorage();
    });
    return () => {
      unsubscribe();
    };
  }, [navigation]);

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
    if (isFocused) {
      getInfoFromStorage();
    }
  }, []);

  const getRestDetailsPage = (value, _id) => {
    setLoading(true);
    let body = {
      order_for: 'restaurant',
      offset: '0',
    };
    // console.log('daa -> ', JSON.stringify(body) + value);
    ApiCall('post', body, API_END_POINTS.getUserOrder, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        if (response?.data?.status) {
          // console.log(
          //   'profile data getUserOrder -> ',
          //   JSON.stringify(response?.data),
          // );
          setData(response?.data?.response);
          setMasterData(response?.data?.response);
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

  const [refreshing, setRefreshing] = useState(false);
  const [orderValue, setOrderValue] = useState('');
  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };
  const onRefresh = () => {
    setRefreshing(true);
    setData([]);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
    getRestDetailsPage(apiToken, '');
  };

  const searchFilterFunction = text => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      console.log('<<<<<< ', JSON.stringify(masterData));

      const newData = masterData.filter(function (item) {
        console.log('<<<<<< ', JSON.stringify(item));
        const itemData = item.vendor_name
          ? item.vendor_name.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setData(newData);
      setOrderValue(text);
    } else {
      setData(masterData);
      setOrderValue(text);
    }
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
          Orders
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}>
        {/* <TouchableOpacity
          style={{
            // height: 35,
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
          <TextInput
            style={{
              flex: 1,
              // color: COLORS.darkGray,
              paddingStart: 10,
              fontFamily: 'Segoe UI',
              fontSize: 16,
              color: COLORS.black,
            }}
            onChangeText={v => {
              setOrderValue(v);
              searchFilterFunction(v);
            }}
            value={orderValue}
            placeholder={'Search orders'}
            placeholderTextColor={COLORS.grey}
            numberOfLines={1}
          />

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

        <TopTabBar />

        {/* <View
          style={{
            width: '95%',
            height: 50,
            marginEnd: 25,
            marginStart: 10,
            marginTop: 15,
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {}}
            style={{
              // width: '35%',
              paddingHorizontal: 10,
              height: 35,
              // backgroundColor: changeOne ? COLORS.primary : '#e7e7e7',
              backgroundColor: '#e7e7e7',
              borderRadius: 10,
              // marginHorizontal: 10,
              alignItems: 'center',
              justifyContent: 'space-evenly',
              flexDirection: 'row',
            }}>
            <Text
              style={{
                // color: changeOne ? COLORS.white : COLORS.darkGray,
                color: COLORS.darkGray,

                fontSize: 19,
                fontFamily: 'Segoe UI Bold',
              }}>
              Chefs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {}}
            style={{
              // width: '35%',
              paddingHorizontal: 15,
              height: 35,
              backgroundColor: changeOne ? COLORS.primary : '#e7e7e7',
              borderRadius: 10,
              marginHorizontal: 10,
              alignItems: 'center',
              justifyContent: 'space-evenly',
              flexDirection: 'row',
            }}>
            <Text
              style={{
                color: changeOne ? COLORS.white : COLORS.darkGray,

                fontSize: 19,
                fontFamily: 'Segoe UI Bold',
              }}>
              Restaurant
            </Text>
            <Text
              style={{
                paddingHorizontal: 5,
                paddingVertical: 5,
                color: changeOne ? COLORS.black : COLORS.black,
                fontSize: 12,
                fontFamily: 'Segoe UI Bold',
                backgroundColor: COLORS.white,
                borderRadius: 200,
                marginStart: 15,
              }}>
              {data.length}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {}}
            style={{
              // width: '43%',
              paddingHorizontal: 25,
              height: 35,
              backgroundColor: changeThree ? COLORS.primary : '#e7e7e7',
              borderRadius: 10,
              marginHorizontal: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: changeThree ? COLORS.white : COLORS.darkGray,

                fontSize: 19,
                fontFamily: 'Segoe UI Bold',
              }}>
              Dining
            </Text>
          </TouchableOpacity>
        </View> */}

        {/* {loading ? (
          <OrderCardViewSkeleton />
        ) : (
          <FlatList
            extraData={data}
            data={data}
            renderItem={({item, index}) => {
              return (
                <OrderCardView
                  item={item}
                  delivered={true}
                  success={false}
                  cancel={false}
                />
              );
            }}
          />
        )} */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Order;

const styles = StyleSheet.create({});
