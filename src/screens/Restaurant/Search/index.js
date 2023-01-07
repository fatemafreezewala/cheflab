import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native';
import {
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {COLORS, icons, SIZES} from '../../../constants';
import ApiCall from '../../../network/ApiCall';
import {API_END_POINTS} from '../../../network/ApiEndpoints';
import ToolbarWithIcon from '../../../utils/ToolbarWithIcon';
import style from './style';
import SearchCardView, {SearchCardViewSkeleton} from './utils/SearchCardView';
import SearchDishCardView, {
  SearchDishCardViewSkeleton,
} from './utils/SearchDishCardView';

const Search = ({navigation}) => {
  const [changeOne, setChangeOne] = useState(true);
  const [changeTwo, setChangeTwo] = useState(false);

  const [vectorOne, setVectorOne] = useState(false);
  const [vectorTwo, setVectorTwo] = useState(false);

  const [searchText, setSearchText] = useState('');

  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiToken, setApiToken] = useState('');
  const [searchData, setSearchData] = useState([]);
  const isFocused = useIsFocused();
  useEffect(() => {
    // setLoading(true);
    getInfoFromStorage();
    if (isFocused) {
      getInfoFromStorage();
    }
    // setLoading(false);
  }, []);

  const getInfoFromStorage = async () => {
    try {
      await AsyncStorage.getItem('token', (err, value) => {
        if (err) {
        } else {
          if (value !== '' && value !== null) {
            setApiToken(value);
          } else {
            setApiToken('');
          }
        }
      });
    } catch (error) {}
  };

  // useEffect(() => {
  //   setChangeOne(!changeOne);
  // }, [changeOne]);

  // useEffect(() => {
  //   setChangeTwo(!changeTwo);
  // }, [changeTwo]);

  const userLatitude = useSelector(state => state?.state?.userLatitude);
  const userLongitude = useSelector(state => state?.state?.userLongitude);

  const [dishOffset, setDishOffset] = useState(0);
  const [restOffset, setRestOffset] = useState(0);

  const callSearchApi = (val, restDish, offset) => {
    if (restOffset == 0) {
      setLoading(true);
    } else if (dishOffset == 0) {
      setLoading(true);
    }
    console.log('callSearchApi => ', 'Restaurant ' + val + 'Dish ' + restDish);

    if (restDish) {
      let body = {
        keyword: '' + val,
        search_for: 'restaurant',
        offset: offset + '',
        // lat: 24.4637223,
        // lng: 74.8866346,
        // lat: 22.72418,
        // lng: 75.887257,
        lat: userLatitude,
        lng: userLongitude,
      };
      console.log('callSearchApi => ', apiToken + ' ' + JSON.stringify(body));

      ApiCall('post', body, API_END_POINTS.restaurantSearchData, {
        Authorization: `Bearer ${apiToken}`,
      })
        .then(response => {
          console.log('callSearchApi => ', JSON.stringify(response?.data));

          if (response?.data?.status) {
            setSearchData([...searchData, ...response?.data?.response]);
            setVectorOne(response?.data?.response?.length <= 0);
          } else {
            setVectorOne(false);
            setSearchData([]);
          }
        })
        .catch(error => {
          setVectorOne(true);
          console.log('ERROR IN getCuisines API -> ', error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      let body = {
        keyword: '' + val,
        search_for: 'dishes',
        offset: offset + '',
        // lat: 24.4637223,
        // lng: 74.8866346,
        // lat: 22.72418,
        // lng: 75.887257,
        lat: userLatitude,
        lng: userLongitude,
      };
      console.log('callSearchApi => ', val + ' ' + JSON.stringify(body));

      ApiCall('post', body, API_END_POINTS.restaurantSearchData, {
        Authorization: `Bearer ${apiToken}`,
      })
        .then(response => {
          // console.log('callSearchApi => ', JSON.stringify(response?.data));
          if (response?.data?.status) {
            setSearchData([...searchData, ...response?.data?.response]);

            setVectorOne(response?.data?.response?.length <= 0);

            setLoading(false);
          } else {
            setSearchData([]);
            setVectorOne(false);

            setLoading(false);
          }
        })
        .catch(error => {
          setVectorOne(true);
          console.log('ERROR IN getCuisines API -> ', error);
        })
        .finally(() => {
          setLoading(false);
        });
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
            fontSize: 20,
            color: COLORS.black,
            flexGrow: 1,

            fontFamily: 'Segoe UI Bold',
            maxWidth: Dimensions.get('window').width / 2 + 15,
          }}
          numberOfLines={1}
          ellipsizeMode="tail">
          {/* {toolBarTitle} */}
          Search
        </Text>

        {/* <TouchableOpacity
          style={{
            width: 22,
            height: 22,
            alignSelf: 'center',
            marginHorizontal: 15,
            position: 'absolute',
            right: 5,
          }}
          onPress={() => {
            navigation.navigate('Cart');
          }}>
          <Image
            source={icons.cart}
            style={{
              width: 22,
              height: 22,
              alignSelf: 'center',
              marginHorizontal: 15,
              tintColor: COLORS.primary,
            }}
          />
        </TouchableOpacity> */}
      </View>
      <TouchableOpacity
        onPress={() => {
          // navigation.navigate('Search');
          // Keyboard.dismiss();
        }}
        style={{
          height: 45,
          width: '95%',
          borderColor: '#707070',
          borderWidth: 1,
          borderRadius: 5,
          alignItems: 'center',
          // justifyContent: 'center',
          alignSelf: 'center',
          marginTop: 20,
          flexDirection: 'row',
        }}
        activeOpacity={0.8}>
        <TextInput
          style={{
            flex: 1,
            color: COLORS.black,
            paddingStart: 10,
            fontFamily: 'Segoe UI',
            fontSize: 16,
          }}
          onChangeText={value => {
            setSearchText(value);
            if (value.length == 0) {
              setDishOffset(0);
              setRestOffset(0);
            }
            if (changeOne) {
              callSearchApi(value + '', true, restOffset);
            } else {
              callSearchApi(value + '', false, dishOffset);
            }
          }}
          placeholder={'Type Restaurant / Dish name'}
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
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss();
            if (changeOne) {
              callSearchApi(searchText + '', true, restOffset);
            } else {
              callSearchApi(searchText + '', false, dishOffset);
            }
          }}>
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
      </TouchableOpacity>
      <View
        style={[
          style.resStarView,
          {
            marginTop: 20,
            marginStart: 0,
            paddingBottom: 10,
          },
        ]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setDishOffset(0);
            setRestOffset(0);
            setChangeOne(true);
            setChangeTwo(false);
            setSearchData([]);

            if (searchText) {
              callSearchApi(searchText, true, restOffset);
            }
            // callSearchApi(searchText);
          }}
          style={{
            width: '43%',
            height: 35,
            backgroundColor: changeOne ? COLORS.primary : '#e7e7e7',
            borderRadius: 10,
            marginHorizontal: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: changeOne ? COLORS.white : COLORS.darkGray,
              fontSize: 18,
              fontFamily: 'Segoe UI Bold',
            }}>
            Restaurant
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setDishOffset(0);
            setRestOffset(0);
            setChangeTwo(true);
            // setChangeOne(false);
            setChangeOne(false);
            setSearchData([]);
            if (searchText) {
              callSearchApi(searchText, false, dishOffset);
            }
            // callSearchApi(searchText);
          }}
          style={{
            width: '43%',
            height: 35,
            backgroundColor: changeTwo ? COLORS.primary : '#e7e7e7',

            borderRadius: 10,
            marginHorizontal: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: changeTwo ? COLORS.white : COLORS.darkGray,
              fontSize: 19,
              fontFamily: 'Segoe UI Bold',
            }}>
            Dishes
          </Text>
        </TouchableOpacity>
      </View>
      {changeOne ? (
        // searchData.length <= 0 ? null :
        // loading ? (
        //   <SearchCardViewSkeleton />
        // ) : (
        <FlatList
          style={{}}
          data={searchData}
          keyExtractor={(item, index) => index + ''}
          onEndReached={() => {
            setLoadingMore(true);
            callSearchApi(searchText, true, restOffset + 10);
            setRestOffset(restOffset + 10);
          }}
          ListFooterComponent={() => {
            return searchText
              ? loadingMore && (
                  <ActivityIndicator
                    size={'large'}
                    color={COLORS.primary}
                    style={{
                      marginVertical: 25,
                    }}
                  />
                )
              : null;
          }}
          renderItem={({item, index}) => {
            return (
              <SearchCardView
                item={item}
                marginTop={index == 0 ? SIZES.padding : 0}
              />
            );
          }}
        />
      ) : // )
      null}
      {changeTwo ? (
        // loading ? (
        //   <SearchDishCardViewSkeleton />
        // ) : (
        <FlatList
          style={{}}
          data={searchData}
          keyExtractor={(item, index) => index + ''}
          onEndReached={() => {
            callSearchApi(searchText, false, dishOffset + 10);
            setDishOffset(dishOffset + 10);
          }}
          ListFooterComponent={() => {
            return searchText
              ? loadingMore && (
                  <ActivityIndicator
                    size={'large'}
                    color={COLORS.primary}
                    style={{
                      marginVertical: 25,
                    }}
                  />
                )
              : null;
          }}
          renderItem={({item, index}) => {
            return (
              <SearchDishCardView
                item={item}
                marginTop={index == 0 ? SIZES.padding : 0}
              />
            );
          }}
        />
      ) : // )
      null}
    </SafeAreaView>
  );
};

export default Search;

const styles = StyleSheet.create({});
