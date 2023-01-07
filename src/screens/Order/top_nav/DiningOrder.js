import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import {COLORS} from '../../../constants';
import ApiCall from '../../../network/ApiCall';
import {API_END_POINTS} from '../../../network/ApiEndpoints';
import OrderCardView, {OrderCardViewSkeleton} from '../utils/OrderCardView';

const DiningOrder = ({navigation}) => {
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
      getInfoFromStorage();
    }
  }, []);

  const [masterData, setMasterData] = useState([]);

  const getRestDetailsPage = (value, _id) => {
    setLoading(true);
    let body = {
      order_for: 'dineout',
      offset: '0',
    };
    // console.log('daa -> ', JSON.stringify(body) + value);
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
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}
      contentContainerStyle={{
        // alignItems: 'center',
        justifyContent: 'center',
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[COLORS.primary]}
        />
      }>
      {loading ? (
        <OrderCardViewSkeleton />
      ) : data.length > 0 ? (
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
          ListEmptyComponent={() => {
            return loading ? null : (
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
    </ScrollView>
  );
};

export default DiningOrder;

const styles = StyleSheet.create({});
