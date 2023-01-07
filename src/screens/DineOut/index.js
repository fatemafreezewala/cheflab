import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  ImageBackground,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import {useSelector} from 'react-redux';
import {COLORS, SIZES} from '../../constants';
import ApiCall from '../../network/ApiCall';
import {API_END_POINTS} from '../../network/ApiEndpoints';
import {ListCardViewSkeleton} from '../Restaurant/List/utils/ListCardView';
import style from './style';
import ListCardView from './utils/ListCardView';

const DineOut = ({navigation}) => {
  const image = [
    {
      image:
        'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8OXx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60',
      desc: 'Silent Waters in the mountains in midst of Himilayas',
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

  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [apiToken, setApiToken] = useState('');
  useEffect(() => {
    setLoading(true);
    getInfoFromStorage();
    if (isFocused) {
      getInfoFromStorage();
    }
    setLoading(false);
  }, []);
  const [vendorId, setVendorId] = useState('1');

  const [cartProduct, setCartProduct] = useState(null);

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
            getDineOutRestaurant(value);
          } else {
            setApiToken('');
          }
        }
      });
    } catch (error) {}
  };

  const [dineOuRestaurant, setDineOutRestaurant] = useState([]);

  const userLatitude = useSelector(state => state?.state?.userLatitude);
  const userLongitude = useSelector(state => state?.state?.userLongitude);
  const getDineOutRestaurant = value => {
    let body = {
      // lat: 23.1765,
      // lng: 75.7885,
      // lat: 22.72418,
      // lng: 75.887257,

      lat: userLatitude,
      lng: userLongitude,
      vendor_offset: 0,
      vendor_limit: 3,
      product_offset: 0,
      product_limit: 3,
    };
    ApiCall('post', body, API_END_POINTS.getDineOutRestaurant, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        if (response?.data?.status) {
          setDineOutRestaurant(response?.data?.response?.vendors);
        } else {
          setDineOutRestaurant([]);
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
  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };
  const onRefresh = () => {
    setRefreshing(true);

    setDineOutRestaurant([]);
    // wait(2000).then(() => setRefreshing(false));
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
    getDineOutRestaurant(apiToken);
  };

  const [banner, setBanner] = useState([]);

  const getHomeBanner = t => {
    let body = {
      for: 'dineout',
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
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {});
  };

  return (
    <SafeAreaView style={style.mainContainer}>
      <ScrollView
        style={style.mainContainer}
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
        {banner.length <= 0 ? (
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            style={{
              alignSelf: 'center',
              marginTop: 20,
              borderRadius: 10,
            }}
            width={Dimensions.get('window').width - 20}
            height={200}></ShimmerPlaceHolder>
        ) : (
          <View style={style.sliderMainContainer}>
            <SwiperFlatList
              autoplay
              autoplayDelay={3}
              autoplayLoop
              showPagination
              data={banner}
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
                      {/* Welcome to ChefLab Dine Out */}
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>
        )}
        <Text
          style={[
            style.moodText,
            {
              paddingBottom: 5,
            },
          ]}>
          Book a Table on your Fingertips
        </Text>

        {dineOuRestaurant.length <= 0 ? (
          <ListCardViewSkeleton />
        ) : (
          <FlatList
            style={{
              flex: 1,
              flexGrow: 1,
            }}
            extraData={dineOuRestaurant}
            data={dineOuRestaurant}
            renderItem={({item, index}) => {
              return <ListCardView item={item} />;
            }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DineOut;

const styles = StyleSheet.create({});
