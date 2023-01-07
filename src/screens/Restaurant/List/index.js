import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {COLORS, icons} from '../../../constants';
import {horizScale} from '../../../constants/themes';
import ApiCall from '../../../network/ApiCall';
import {API_END_POINTS} from '../../../network/ApiEndpoints';
import ToolbarWithIcon from '../../../utils/ToolbarWithIcon';
import {ShowMessage} from '../../../utils/Utility';
import style from './style';
import ListCardView, {ListCardViewSkeleton} from './utils/ListCardView';
const List = ({navigation, route}) => {
  const [toolBarTitle, setToolbarTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const [selected, setSelected] = useState(false);

  const [firstSelected, setFirstSelected] = useState(false);
  const [secondSelected, setSecondSelected] = useState(false);
  const [thirdSelected, setThirdSelected] = useState(false);

  const iconcheckname = selected ? 'check-box' : 'check-box-outline-blank';
  useEffect(() => {
    let {title} = route.params;
    // console.log('title -> ', title);
    setToolbarTitle(title);
  }, []);

  const [showFilter, setShowFilter] = useState(false);

  const closeFilterModal = () => {
    setShowFilter(!showFilter);
  };

  const [value, setValue] = useState(0);

  const [data, setData] = useState([
    {
      title: 'Top Rated',
      value: 1,
    },
    {
      title: 'Pure Veg',
      value: 2,
    },
    {
      title: 'Non - Veg',
      value: 3,
    },
  ]);

  const renderFilterModal = () => {
    return (
      <Modal
        visible={showFilter}
        animationType="slide"
        transparent={true}
        statusBarTranslucent
        onRequestClose={() => closeFilterModal()}
        style={{flexGrow: 1}}>
        <View
          style={{
            backgroundColor: '#00000090',
            flexGrow: 1,
            justifyContent: 'flex-end',
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => closeFilterModal()}
            style={{flex: 1}}></TouchableOpacity>
          <View style={style.additemView}>
            <View style={style.addItemHeader}>
              <View
                style={[
                  style.rowView,
                  {
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    elevation: 10,
                  },
                ]}>
                <View style={{flex: 1}}>
                  <Text style={style.addHeaderText}>Filter</Text>
                </View>
                <TouchableOpacity onPress={() => closeFilterModal()}>
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
            <View
              style={[
                style.middleView,
                {
                  borderTopRightRadius: 0,
                  borderTopLeftRadius: 0,
                },
              ]}>
              <View style={{overflow: 'hidden', paddingBottom: 10}}>
                <View
                  style={[
                    // style.listView,
                    // style.shadow,
                    {paddingLeft: 24, paddingRight: 6},
                  ]}>
                  {/* <View style={[style.rowView, {marginTop: 15}]}>
                    <View style={{flex: 1, paddingRight: 10}}>
                      <Text style={[style.sizeText]}>Nearest Restaurant</Text>
                    </View>
                    <TouchableOpacity>
                      <Image
                        source={selected ? icons.checked : icons.unchecked}
                        style={style.checkbox}
                      />
                    </TouchableOpacity>
                  </View> */}
                  <View style={[style.rowView, {marginTop: 15}]}>
                    <View style={{flex: 1, paddingRight: 10}}>
                      <Text style={[style.sizeText]}>Top Rated</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        // setSecondSelected(false);
                        setFirstSelected(!firstSelected);
                        // setThirdSelected(false);
                      }}>
                      <Image
                        source={firstSelected ? icons.checked : icons.unchecked}
                        style={style.checkbox}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={[style.rowView, {marginTop: 15}]}>
                    <View style={{flex: 1, paddingRight: 10}}>
                      <Text style={[style.sizeText]}>Pure Veg</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        // setFirstSelected(false);
                        setSecondSelected(!secondSelected);
                        // setThirdSelected(false);
                      }}>
                      <Image
                        source={
                          secondSelected ? icons.checked : icons.unchecked
                        }
                        style={style.checkbox}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={[style.rowView, {marginTop: 15}]}>
                    <View style={{flex: 1, paddingRight: 10}}>
                      <Text style={[style.sizeText]}>Non Veg</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        // setFirstSelected(false);
                        setThirdSelected(!thirdSelected);
                        // setSecondSelected(false);
                      }}>
                      <Image
                        source={thirdSelected ? icons.checked : icons.unchecked}
                        style={style.checkbox}
                      />
                    </TouchableOpacity>
                  </View>
                  {/* <View style={[style.rowView, {marginTop: 15}]}>
                    <View style={{flex: 1, paddingRight: 10}}>
                      <Text style={[style.sizeText]}>Eggetarian</Text>
                    </View>
                    <TouchableOpacity>
                      <Image
                        source={selected ? icons.checked : icons.unchecked}
                        style={style.checkbox}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={[style.rowView, {marginTop: 15}]}>
                    <View style={{flex: 1, paddingRight: 10}}>
                      <Text style={[style.sizeText]}>Free Delivery</Text>
                    </View>
                    <TouchableOpacity onPress={() => closeFilterModal()}>
                      <Image
                        source={selected ? icons.checked : icons.unchecked}
                        style={style.checkbox}
                      />
                    </TouchableOpacity>
                  </View> */}
                </View>

                <View
                  style={[
                    style.rowView,
                    {
                      marginTop: 20,
                      marginBottom: 10,
                      alignSelf: 'center',
                      alignItems: 'center',
                      // justifyContent: 'space-between',
                      marginHorizontal: 20,
                    },
                  ]}>
                  <TouchableOpacity
                    onPress={() => {
                      setFirstSelected(false);
                      setSecondSelected(false);
                      setThirdSelected(false);
                      closeFilterModal();
                      getRestDetailsPage(apiToken, id);
                    }}
                    activeOpacity={0.8}
                    style={{
                      height: 45,
                      width: '45%',
                      backgroundColor: COLORS.buttonBgColor,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 25,
                      marginHorizontal: 10,
                    }}>
                    <Text
                      style={[
                        style.sizeText,
                        {fontSize: 18, color: COLORS.white},
                      ]}>
                      Cancel all
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      closeFilterModal();
                      if (firstSelected || secondSelected || thirdSelected) {
                        applyFilter();
                      }
                    }}
                    activeOpacity={0.8}
                    style={{
                      height: 45,
                      width: '45%',
                      backgroundColor: COLORS.greenButtonBgColor,
                      justifyContent: 'center',
                      marginHorizontal: 10,
                      alignItems: 'center',
                      borderRadius: 25,
                    }}>
                    <Text
                      style={[
                        style.sizeText,
                        {fontSize: 18, color: COLORS.white},
                      ]}>
                      Apply
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const [loading, setLoading] = useState(false);
  const [apiToken, setApiToken] = useState('');
  const [detailsData, setDetailsData] = useState([]);
  const [cuisinesData, setCuisinesData] = useState([]);
  const isFocused = useIsFocused();

  const [bookTable, setBookTable] = useState(false);

  let {fromCuisine} = route.params;

  // console.log(
  //   'aaaaaaaaaaaaaaaaaaaaaaaa 111 fromCuisine fromCuisine whats-> ',
  //   fromCuisine,
  // );
  const [id, setID] = useState('');

  useEffect(() => {
    let {id} = route.params;
    setID(id);
    getInfoFromStorage(id);

    if (isFocused) {
      getInfoFromStorage(id);
    }
  }, []);

  const updateFavUnFav = idx => {
    // if (item?.is_like) {
    //   ApiCall('post', body, API_END_POINTS.restaurantRemoveFavorite, {});
    // } else {
    //   ApiCall('post', body, API_END_POINTS.restaurantAddFavorite, {});
    // }
    let a = detailsData.map((item, index) => {
      let temp = Object.assign({}, item);
      if (index == idx) {
        if (temp.is_like) {
          // console.log('aaaaaaaaaaaaaaaaaaaaaaaa 111 -> ', idx + ' ' + index);
          temp.is_like = false;
          let body = {user_id: userId, vendor_id: temp?.id + ''};
          console.log(
            'aaaaaaaaaaaaaaaaaaaaaaaa 111 -> ',
            idx + ' ' + JSON.stringify(body),
          );

          ApiCall('post', body, API_END_POINTS.restaurantRemoveFavorite, {
            Authorization: `Bearer ${apiToken}`,
          }).then(response => {
            if (response?.data?.status) {
              // ShowMessage(response?.data?.message);
              console.log('restaurantRemoveFavorite ->>. ', response?.data);
            }
          });
        } else {
          // console.log('aaaaaaaaaaaaaaaaaaaaaaaa 222 -> ', idx + ' ' + index);
          let body = {user_id: userId, vendor_id: temp?.id + ''};
          console.log(
            'aaaaaaaaaaaaaaaaaaaaaaaa 111 -> ',
            idx + ' ' + JSON.stringify(body),
          );

          ApiCall('post', body, API_END_POINTS.restaurantAddFavorite, {
            Authorization: `Bearer ${apiToken}`,
          }).then(response => {
            if (response?.data?.status) {
              // ShowMessage(response?.data?.message);

              console.log('restaurantRemoveFavorite ->>. ', response?.data);
            }
          });
          temp.is_like = true;
        }
      }
      return temp;
    });
    // console.log('aaaaaaaaaaaaaaaaaaaaaaaa -> ', JSON.stringify(a));
    // items = a;
    // console.log('aaaaaaaaaaaaaaaaaaaaaaaa -> ', JSON.stringify(items));
    setDetailsData(a);
  };

  const [userId, setUserId] = useState('');

  const getInfoFromStorage = async id => {
    let t = '';
    try {
      await AsyncStorage.getItem('token', (err, value) => {
        if (err) {
        } else {
          if (value !== '' && value !== null) {
            setApiToken(value);
            getRestDetailsPage(value, id);
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
            getUserCartCount(t, value);
            setUserId(value);
          } else {
            setUserId('');
          }
        }
      });
    } catch (error) {}
  };

  const userLatitude = useSelector(state => state?.state?.userLatitude);
  const userLongitude = useSelector(state => state?.state?.userLongitude);

  const getRestDetailsPage = (value, id) => {
    if (fromCuisine) {
      // console.log('getRestDetailsPage getRestDetailsPage id ->>>>>>>>', id);
      setLoading(true);
      let body = {
        cuisines_id: id + '',
        // lat: 22.72418,
        // lng: 75.887257,
        lat: userLatitude,
        lng: userLongitude,
        vendor_offset: parseInt(offset),
        vendor_limit: limit,
      };

      ApiCall('post', body, API_END_POINTS.getRestaurantByCuisines, {
        Authorization: `Bearer ${value}`,
      })
        .then(response => {
          if (response?.data?.status) {
            // console.log(
            //   'getRestDetailsPage getRestDetailsPage id ->>>>>>>>',
            //   JSON.stringify(response?.data),
            // );

            setDetailsData(response?.data?.response?.vendors);
            setShowVector(response?.data?.response?.vendors?.length <= 0);
          } else {
            setShowVector(true);
            setDetailsData([]);
          }
        })
        .catch(error => {
          console.log('ERROR IN getCuisines API -> ', error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.log('getRestDetailsPage getRestDetailsPage id ->>>>>>>>', id);
      setLoading(true);
      let body = {
        category_id: id + '',
        // lat: 22.72418,
        // lng: 75.887257,
        lat: userLatitude,
        lng: userLongitude,
        vendor_offset: offset,
        vendor_limit: limit,
      };

      ApiCall('post', body, API_END_POINTS.getRestaurantListByCategory, {
        Authorization: `Bearer ${value}`,
      })
        .then(response => {
          if (response?.data?.status) {
            // console.log(
            //   'getRestDetailsPage getRestDetailsPage id ->>>>>>>>',
            //   JSON.stringify(response?.data),
            // );

            setDetailsData(response?.data?.response?.vendors);
            setShowVector(response?.data?.response?.vendors?.length <= 0);
          } else {
            setShowVector(true);
            setDetailsData([]);
          }
        })
        .catch(error => {
          console.log('ERROR IN getCuisines API -> ', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const callEndReach = (value, id, offsets, limits) => {
    if (fromCuisine) {
      let body = {
        cuisines_id: id + '',
        // lat: 22.72418,
        // lng: 75.887257,
        lat: userLatitude,
        lng: userLongitude,
        vendor_offset: offsets,
        vendor_limit: 10,
      };

      // console.log('getRestDetailsPage getRestDetailsPage id ->>>>>>>>', id);
      ApiCall('post', body, API_END_POINTS.getRestaurantByCuisines, {
        Authorization: `Bearer ${value}`,
      })
        .then(response => {
          if (response?.data?.status) {
            console.log(
              'getRestDetailsPage getRestDetailsPage id ->>>>>>>>',
              JSON.stringify(response?.data?.response?.vendors?.length),
            );

            setDetailsData([
              ...detailsData,
              ...response?.data?.response?.vendors,
            ]);
          } else {
            setDetailsData([]);
          }
        })
        .catch(error => {
          console.log('ERROR IN getCuisines API -> ', error);
        })
        .finally(() => {});
    } else {
      console.log('getRestDetailsPage getRestDetailsPage id ->>>>>>>>', id);
      let body = {
        category_id: id + '',
        // lat: 22.72418,
        // lng: 75.887257,
        lat: userLatitude,
        lng: userLongitude,
        vendor_offset: offsets,
        vendor_limit: 10,
      };

      ApiCall('post', body, API_END_POINTS.getRestaurantListByCategory, {
        Authorization: `Bearer ${value}`,
      })
        .then(response => {
          if (response?.data?.status) {
            console.log(
              'getRestDetailsPage getRestDetailsPage id ->>>>>>>>',
              JSON.stringify(response?.data?.response?.vendors),
            );

            setDetailsData([
              ...detailsData,
              ...response?.data?.response?.vendors,
            ]);
          } else {
            setDetailsData([]);
          }
        })
        .catch(error => {
          console.log('ERROR IN getCuisines API -> ', error);
        })
        .finally(() => {});
    }
  };

  /***
    let body = {
      value: "1","2"."3","4","5"  // kuch bhi ho  sakta hai 1 se 5 ke bich
      lat: 24.4637223,
      lng: 74.8866346,
    };
   */
  const applyFilter = () => {
    if (fromCuisine) {
      setLoading(true);
      let body = {
        cuisines_id: id + '',
        // lat: 22.72418,
        // lng: 75.887257,
        vendor_offset: 0,
        vendor_limit: 10,
        filter: firstSelected
          ? ['1']
          : secondSelected
          ? ['2']
          : thirdSelected
          ? ['3']
          : firstSelected && secondSelected
          ? ['1', '2']
          : firstSelected && thirdSelected
          ? ['1', '3']
          : secondSelected && thirdSelected
          ? ['2', '3']
          : secondSelected && firstSelected
          ? ['1', '2']
          : thirdSelected && firstSelected
          ? ['1', '3']
          : thirdSelected && secondSelected
          ? ['2', '3']
          : ['1'],
        // lat: 22.72418,
        // lng: 75.887257,
        // lat: 24.4637223,
        // lng: 74.8866346,
        lat: userLatitude,
        lng: userLongitude,
      };
      console.log(
        'getRestDetailsPage response body =-> ',
        JSON.stringify(body),
      );

      ApiCall('post', body, API_END_POINTS.getRestaurantByCuisines, {
        Authorization: `Bearer ${apiToken}`,
      })
        .then(response => {
          console.log(
            'getRestDetailsPage response =-> ',
            JSON.stringify(response?.data),
          );
          if (response?.data?.status) {
            setDetailsData(response?.data?.response?.vendors);
          } else {
            setDetailsData([]);
          }
        })
        .catch(error => {
          console.log('ERROR IN getCuisines API -> ', error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(true);
      let body = {
        category_id: id + '',
        // lat: 22.72418,
        // lng: 75.887257,
        vendor_offset: 0,
        vendor_limit: 10,
        filter:
          firstSelected && secondSelected
            ? ['1', '2']
            : firstSelected && thirdSelected
            ? ['1', '3']
            : secondSelected && thirdSelected
            ? ['2', '3']
            : secondSelected && firstSelected
            ? ['1', '2']
            : thirdSelected && firstSelected
            ? ['1', '3']
            : thirdSelected && secondSelected
            ? ['2', '3']
            : firstSelected
            ? ['1']
            : secondSelected
            ? ['2']
            : thirdSelected
            ? ['3']
            : ['0'],
        // lat: 22.72418,
        // lng: 75.887257,
        // lat: 24.4637223,
        // lng: 74.8866346,
        lat: userLatitude,
        lng: userLongitude,
      };
      console.log(
        'getRestDetailsPage response body =-> ',
        JSON.stringify(body),
      );

      ApiCall('post', body, API_END_POINTS.getRestaurantListByCategory, {
        Authorization: `Bearer ${apiToken}`,
      })
        .then(response => {
          console.log(
            'getRestDetailsPage response =-> ',
            JSON.stringify(response?.data),
          );
          if (response?.data?.status) {
            setDetailsData(response?.data?.response?.vendors);
          } else {
            setDetailsData([]);
          }
        })
        .catch(error => {
          console.log('ERROR IN getCuisines API -> ', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const [showVector, setShowVector] = useState(false);

  const [loadMore, setLoadMore] = useState(false);

  const [cartCount, setCartCount] = useState(0);

  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);

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
          setCartCount(response?.data?.response?.cart?.products_count);
        } else {
          setCartCount('');
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {});
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
            fontSize: horizScale(20),
            fontFamily: 'Segoe UI Bold',
            color: COLORS.black,
            flexGrow: 1,
            // maxWidth: Dimensions.get('window').width / 2 + 15,
            maxWidth: Dimensions.get('window').width / 1.25 + 0,
          }}
          numberOfLines={1}
          ellipsizeMode="tail">
          {toolBarTitle}
        </Text>

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
          flex: 1,
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        {showVector ? (
          <View
            style={{
              flexGrow: 1,
              flex: 1,
              alignItems: 'center',
              alignSelf: 'center',
              justifyContent: 'center',
            }}>
            <Text style={style.no_data_found}>No results found</Text>
          </View>
        ) : loading ? (
          <ListCardViewSkeleton />
        ) : (
          <FlatList
            // style={{
            //   marginTop: 15,
            //   flexGrow: 1,
            // }}
            ListHeaderComponent={() => {
              return (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Search');
                    }}
                    style={{
                      height: 35,
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
                    <Text
                      style={{
                        flex: 1,
                        color: COLORS.darkGray,
                        paddingStart: 10,
                        fontFamily: 'Segoe UI',
                      }}
                      numberOfLines={1}>
                      Search by Restaurant or Dish...
                    </Text>
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
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 20,
                      // justifyContent: 'space-between',
                    }}>
                    <Text style={style.moodText}>Restaurants</Text>
                    <TouchableOpacity
                      onPress={() => {
                        closeFilterModal();
                      }}
                      activeOpacity={0.8}
                      style={{
                        alignSelf: 'flex-end',
                        marginTop: 20,
                        position: 'absolute',
                        right: 15,
                      }}>
                      <Image
                        source={icons.filter}
                        style={{
                          width: 60,
                          height: 20,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </>
              );
            }}
            // ListFooterComponent={() => {
            //   return
            // }}
            extraData={detailsData}
            data={detailsData}
            onEndReached={() => {
              setLoadMore(true);
              callEndReach(apiToken, id, offset + 10, limit + 10);
              setOffset(offset + 10);
              setTimeout(() => {
                setLoadMore(false);
              }, 3000);
            }}
            renderItem={({item, index}) => {
              // console.log('exports', JSON.stringify(item));

              return (
                <ListCardView
                  items={item}
                  index={index}
                  onFavPress={() => {
                    // console.log('exports', idx + JSON.stringify(i));
                    updateFavUnFav(index);
                  }}
                />
              );
            }}
          />
        )}
        {loadMore ? (
          <ActivityIndicator size={'large'} color={COLORS.primary} />
        ) : null}
      </View>
      {renderFilterModal()}
    </SafeAreaView>
  );
};

export default List;
