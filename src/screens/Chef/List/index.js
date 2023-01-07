import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
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
import ApiCall from '../../../network/ApiCall';
import {API_END_POINTS} from '../../../network/ApiEndpoints';
import ToolbarWithIcon from '../../../utils/ToolbarWithIcon';
import style from './style';
import ListCardView, {ChefListCardViewSkeleton} from './utils/ListCardView';

const ChefList = ({navigation, route}) => {
  const [toolBarTitle, setToolbarTitle] = useState('');
  const [selected, setSelected] = useState(false);
  const [showVector, setShowVector] = useState(false);
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

  const [loading, setLoading] = useState(false);
  const [apiToken, setApiToken] = useState('');
  const [detailsData, setDetailsData] = useState([]);
  const [cuisinesData, setCuisinesData] = useState([]);
  const isFocused = useIsFocused();

  const [bookTable, setBookTable] = useState(false);

  useEffect(() => {
    let {id} = route.params;

    getInfoFromStorage(id);
    console.log('title -> ', id);

    if (isFocused) {
      getInfoFromStorage(id);
    }
  }, []);

  const [userId, setUserId] = useState('');

  const getInfoFromStorage = async id => {
    try {
      await AsyncStorage.getItem('token', (err, value) => {
        if (err) {
        } else {
          if (value !== '' && value !== null) {
            setApiToken(value);
            getRestDetailsPage(value, id);
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
              ShowMessage(response?.data?.message);

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
  const userLatitude = useSelector(state => state?.state?.userLatitude);
  const userLongitude = useSelector(state => state?.state?.userLongitude);
  const getRestDetailsPage = (value, id) => {
    setLoading(true);
    let body = {
      category_id: id + '',
      // lat: 24.4637223,
      // lng: 74.8866346,
      // lat: 22.72418,
      // lng: 75.887257,
      lat: userLatitude,
      lng: userLongitude,
    };
    ApiCall('post', body, API_END_POINTS.getChefListByCategory, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        if (response?.data?.status) {
          // let t = response?.data?.response?.map(item => {
          //   return {
          //     ...item,
          //   };
          // });
          console.log(
            'getRestDetailsPage response  aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa=-> ',
            JSON.stringify(response?.data?.response),
          );
          setDetailsData(response?.data?.response);
          setShowVector(response?.data?.response?.length <= 0);
        } else {
          setDetailsData([]);
          setShowVector(true);
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
            <View style={style.middleView}>
              <View style={{overflow: 'hidden', paddingBottom: 10}}>
                <View
                  style={[
                    // style.listView,
                    // style.shadow,
                    {paddingLeft: 24, paddingRight: 6},
                  ]}>
                  <View style={[style.rowView, {marginTop: 15}]}>
                    <View style={{flex: 1, paddingRight: 10}}>
                      <Text style={[style.sizeText]}>Nearest Chefs</Text>
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
                      <Text style={[style.sizeText]}>Top Rated</Text>
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
                      <Text style={[style.sizeText]}>Pure Veg</Text>
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
                      <Text style={[style.sizeText]}>Non Veg</Text>
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
                  </View>
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
                    onPress={() => closeFilterModal()}
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
                    onPress={() => closeFilterModal()}
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
          numberOfLines={1}
          ellipsizeMode="tail">
          {toolBarTitle}
          {/* South Indian */}
        </Text>

        <TouchableOpacity
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
        </TouchableOpacity>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ChefSearch');
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
            Search by Chef or Dish...
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
            // justifyContent: 'space-between',
          }}>
          <Text style={style.moodText}>Experts from your town</Text>
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
        {/* <ChefListCardViewSkeleton /> */}
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
          <ChefListCardViewSkeleton />
        ) : (
          <FlatList
            data={detailsData}
            renderItem={({item, index}) => {
              return (
                <ListCardView
                  item={item}
                  onFavPress={() => {
                    // console.log('exports', idx + JSON.stringify(i));
                    updateFavUnFav(index);
                  }}
                />
              );
            }}
          />
        )}
      </ScrollView>
      {renderFilterModal()}
    </SafeAreaView>
  );
};

export default ChefList;
