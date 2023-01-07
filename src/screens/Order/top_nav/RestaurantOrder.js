import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS, icons} from '../../../constants';
import ApiCall from '../../../network/ApiCall';
import {API_END_POINTS} from '../../../network/ApiEndpoints';
import OrderCardView, {OrderCardViewSkeleton} from '../utils/OrderCardView';

const RestaurantOrder = ({navigation}) => {
  const [data, setData] = useState([]);
  const [apiToken, setApiToken] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);

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
    } catch (error) {
      console.log('profile data -> ', JSON.stringify(error));
    }
  };

  useEffect(() => {
    getInfoFromStorage();
    if (isFocused) {
      setOffset(0);
      getInfoFromStorage();
    }
  }, []);

  const [masterData, setMasterData] = useState([]);
  const [offset, setOffset] = useState(0);

  const [showNoOrder, setShowNoOrder] = useState(true);

  const getRestDetailsPage = (value, _id) => {
    setLoading(true);
    let body = {
      order_for: 'restaurant',
      // offset: offset + '',
      offset: 0,
    };
    console.log('daa -> ', JSON.stringify(body) + value);
    ApiCall('post', body, API_END_POINTS.getUserOrder, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        // console.log('profile data getUserOrder -> ', JSON.stringify(response));
        if (response?.data?.status) {
          // console.log(
          //   'profile data getUserOrder -> ',
          //   JSON.stringify(response?.data),
          // );
          // setData([...data, ...response?.data?.response]);
          setData(response?.data?.response);
          setMasterData(response?.data?.response);
          setShowNoOrder(true);
        } else {
          setData({});
          setShowNoOrder(false);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getRestNewDetailsPage = (value, _id) => {
    let body = {
      order_for: 'restaurant',
      offset: _id,
    };
    // console.log('getRestNewDetailsPage body -> ', JSON.stringify(body) + value);
    ApiCall('post', body, API_END_POINTS.getUserOrder, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        // console.log('profile data getUserOrder -> ', JSON.stringify(response));
        if (response?.data?.status) {
          // console.log(
          //   'profile data getUserOrder -> ',
          //   JSON.stringify(response?.data),
          // );
          setData([...data, ...response?.data?.response]);
          setMasterData([...masterData, ...response?.data?.response]);
          setShowNoOrder(true);
        } else {
          setData({});
          setShowNoOrder(true);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {});
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

  const [loadMore, setLoadMore] = useState(false);

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
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}>
      {loading ? (
        <OrderCardViewSkeleton />
      ) : data.length > 0 ? (
        <FlatList
          extraData={data}
          data={data}
          keyExtractor={(item, index) => index.toString()}
          // stickyHeaderIndices={[0]}
          StickyHeaderComponent={() => {
            return (
              <TouchableOpacity
                style={{
                  // height: 35,
                  width: '95%',
                  borderColor: '#707070',
                  borderWidth: 1,
                  borderRadius: 5,
                  alignItems: 'center',
                  // justifyContent: 'center',
                  alignSelf: 'center',
                  marginBottom: 15,
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
              </TouchableOpacity>
            );
          }}
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
          ListEmptyComponent={() => {
            return showNoOrder ? null : (
              <Text
                style={{
                  color: COLORS.black,
                  fontSize: 16,
                  fontFamily: 'Segoe UI Bold',
                }}>
                No orders found
              </Text>
            );
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
            />
          }
          onEndReached={() => {
            console.log('onEndReached called');
            setLoadMore(true);
            getRestNewDetailsPage(apiToken, offset + 10);
            // setOffset(offset + 10);
            setTimeout(() => {
              setLoadMore(false);
            }, 1500);
          }}
          // ListFooterComponent={() => {
          //   return loadMore ? (
          //     <ActivityIndicator
          //       size={'large'}
          //       color={COLORS.primary}
          //       style={{
          //         paddingVertical: 10,
          //       }}
          //     />
          //   ) : null;
          // }}
        />
      ) : (
        <Text
          style={{
            color: COLORS.black,
            fontSize: 18,
            fontFamily: 'Segoe UI Bold',
            textAlign: 'center',
            marginTop: 100,
          }}>
          No orders found
        </Text>
      )}
      {loadMore ? (
        <ActivityIndicator
          size={'large'}
          color={COLORS.primary}
          style={{
            paddingVertical: 10,
          }}
        />
      ) : null}
    </View>
  );
};

export default RestaurantOrder;

const styles = StyleSheet.create({});
