import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {COLORS, icons} from '../../../constants';
import {Rating, AirbnbRating} from 'react-native-elements';

const ExpandableComponent = ({
  item,
  onClickFunction,
  onAddFunction,
  onFavPress,
  onPlus,
  onMinus,
}) => {
  //Custom Component for the Expandable List
  const [layoutHeight, setLayoutHeight] = useState(0);
  const navigation = useNavigation();
  useEffect(() => {
    if (item.isExpanded) {
      setLayoutHeight(null);
    } else {
      setLayoutHeight(0);
    }
  }, [item.isExpanded]);

  // console.log('ExpandableComponent -> ', JSON.stringify(item));
  return (
    <View>
      {/*Header of the Expandable List Item*/}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onClickFunction}
        style={styles.header}>
        <Text style={styles.headerText}>{item?.menuName}</Text>
        <Image
          source={icons.forward_arrow}
          style={{
            transform: [
              {
                rotate: layoutHeight == 0 ? '90deg' : '-90deg',
              },
            ],
            tintColor: COLORS.black,
            width: 15,
            height: 15,
            resizeMode: 'center',
            // paddingVertical: 10,
          }}
        />
      </TouchableOpacity>
      <View
        style={{
          height: layoutHeight,
          overflow: 'hidden',
        }}>
        {/*Content under the header of the Expandable List Item*/}
        {item?.products?.map((item, ins) => {
          // console.log('item?.products? expandadble co => ', ins);
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              key={ins}
              style={[
                styles.content,
                {
                  padding: 10,
                },
              ]}
              onPress={() => {
                navigation.navigate('RestDishInformation', {
                  item,
                });
              }}>
              <View>
                <Image
                  source={{
                    uri: item?.image,
                  }}
                  style={{
                    height: 115,
                    width: 115,
                    // margin: 10,
                    borderRadius: 10,
                    resizeMode: 'contain',
                  }}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    onFavPress(item, ins);
                  }}
                  style={styles.fav}>
                  <Image
                    source={
                      item?.is_like == 0 ? icons.unfavorite : icons.favorite
                    }
                    style={{
                      width: 25,
                      height: 25,
                      // tintColor: '#ff0000',
                    }}
                  />
                </TouchableOpacity>
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
                    marginStart: -2,
                  }}>
                  {item?.product_name}
                </Text>
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
                <Text
                  style={{
                    color: COLORS.grey,
                    marginTop: 5,
                    fontFamily: 'Segoe UI',
                    fontSize: 14,
                  }}>
                  Pizza
                </Text>
                <Text
                  style={{
                    color: COLORS.black,
                    fontSize: 16,
                    fontFamily: 'Segoe UI',
                    marginTop: 5,
                  }}>
                  ₹ {item?.product_price}
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
                    {item?.qty >= 1 ? (
                      // <View
                      //   style={{
                      //     height: 30,
                      //     // width: 80,
                      //     // flex: 1,
                      //     backgroundColor: COLORS.primary,
                      //     marginStart: 5,
                      //     borderRadius: 15,
                      //     flexDirection: 'row',
                      //     justifyContent: 'space-between',
                      //     paddingHorizontal: 5,
                      //     alignItems: 'center',
                      //   }}>
                      //   <TouchableOpacity
                      //     style={{
                      //       paddingStart: 3,
                      //       paddingEnd: 2,
                      //     }}
                      //     onPress={() => {
                      //       onMinus('less', key);
                      //     }}>
                      //     <FontAwesome
                      //       size={15}
                      //       color={COLORS.white}
                      //       name="minus"
                      //     />
                      //   </TouchableOpacity>
                      //   <Text
                      //     style={{
                      //       fontSize: 18,
                      //       color: COLORS.white,
                      //       paddingHorizontal: 5,
                      //     }}>
                      //     {item?.qty}
                      //   </Text>
                      //   <TouchableOpacity
                      //     style={{
                      //       paddingStart: 2,
                      //       paddingEnd: 3,
                      //     }}
                      //     onPress={() => {
                      //       onPlus('more', key);
                      //     }}>
                      //     <FontAwesome
                      //       size={15}
                      //       color={COLORS.white}
                      //       name="plus"
                      //     />
                      //   </TouchableOpacity>
                      // </View>
                      <View style={styles.addminusView}>
                        <AntDesign
                          onPress={() => {
                            onMinus('less', item?.product_id + '');
                          }}
                          name="minus"
                          color={COLORS.white}
                          size={15}
                          style={{paddingHorizontal: 5, paddingVertical: 5}}
                        />
                        <Text style={styles.countText}>{item?.qty}</Text>
                        <AntDesign
                          onPress={() => {
                            onPlus('more', item?.product_id + '');
                          }}
                          name="plus"
                          color={COLORS.white}
                          size={15}
                          style={{paddingHorizontal: 5, paddingVertical: 5}}
                        />
                      </View>
                    ) : (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          onAddFunction(item, ins);
                        }}>
                        <Text
                          style={{
                            marginHorizontal: 10,
                            fontFamily: 'Segoe UI Bold',
                            fontSize: 16,
                            // marginTop: 0,
                            paddingVertical: 5,
                            paddingHorizontal: 20,
                            alignSelf: 'center',
                            // marginVertical: 2,
                            color: COLORS.primary,
                            borderColor: COLORS.primary,
                            borderWidth: 1,
                            borderRadius: 15,
                          }}>
                          Add
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default ExpandableComponent;

export const ExpandableComponentSkeleton = () => {
  return (
    <>
      <View>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={30}
          width={Dimensions.get('window').width}
          style={{
            // borderRadius: 10,
            marginHorizontal: 10,
            alignSelf: 'center',
            marginTop: 25,
          }}></ShimmerPlaceHolder>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'flex-start',
          }}>
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            height={115}
            width={115}
            style={{
              // borderRadius: 10,
              marginHorizontal: 10,
              alignSelf: 'center',
              marginTop: 15,
            }}></ShimmerPlaceHolder>
          <View>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={25}
              width={Dimensions.get('window').width - 150}
              style={{
                // borderRadius: 10,
                marginHorizontal: 5,

                marginTop: 15,
              }}></ShimmerPlaceHolder>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={15}
              width={Dimensions.get('window').width - 180}
              style={{
                // borderRadius: 10,
                marginHorizontal: 5,

                marginTop: 5,
              }}></ShimmerPlaceHolder>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={20}
              width={Dimensions.get('window').width - 150}
              style={{
                // borderRadius: 10,
                marginHorizontal: 5,

                marginTop: 5,
              }}></ShimmerPlaceHolder>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={30}
              width={Dimensions.get('window').width - 150}
              style={{
                // borderRadius: 10,
                marginHorizontal: 5,

                marginTop: 5,
              }}></ShimmerPlaceHolder>
          </View>
        </View>
      </View>
      <View>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={30}
          width={Dimensions.get('window').width}
          style={{
            // borderRadius: 10,
            marginHorizontal: 10,
            alignSelf: 'center',
            marginTop: 15,
          }}></ShimmerPlaceHolder>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'flex-start',
          }}>
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            height={115}
            width={115}
            style={{
              // borderRadius: 10,
              marginHorizontal: 10,
              alignSelf: 'center',
              marginTop: 15,
            }}></ShimmerPlaceHolder>
          <View>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={25}
              width={Dimensions.get('window').width - 150}
              style={{
                // borderRadius: 10,
                marginHorizontal: 5,

                marginTop: 15,
              }}></ShimmerPlaceHolder>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={15}
              width={Dimensions.get('window').width - 180}
              style={{
                // borderRadius: 10,
                marginHorizontal: 5,

                marginTop: 5,
              }}></ShimmerPlaceHolder>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={20}
              width={Dimensions.get('window').width - 150}
              style={{
                // borderRadius: 10,
                marginHorizontal: 5,

                marginTop: 5,
              }}></ShimmerPlaceHolder>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={30}
              width={Dimensions.get('window').width - 150}
              style={{
                // borderRadius: 10,
                marginHorizontal: 5,

                marginTop: 5,
              }}></ShimmerPlaceHolder>
          </View>
        </View>
      </View>
      <View>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={30}
          width={Dimensions.get('window').width}
          style={{
            // borderRadius: 10,
            marginHorizontal: 10,
            alignSelf: 'center',
            marginTop: 15,
          }}></ShimmerPlaceHolder>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'flex-start',
          }}>
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            height={115}
            width={115}
            style={{
              // borderRadius: 10,
              marginHorizontal: 10,
              alignSelf: 'center',
              marginTop: 15,
            }}></ShimmerPlaceHolder>
          <View>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={25}
              width={Dimensions.get('window').width - 150}
              style={{
                // borderRadius: 10,
                marginHorizontal: 5,

                marginTop: 15,
              }}></ShimmerPlaceHolder>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={15}
              width={Dimensions.get('window').width - 180}
              style={{
                // borderRadius: 10,
                marginHorizontal: 5,

                marginTop: 5,
              }}></ShimmerPlaceHolder>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={20}
              width={Dimensions.get('window').width - 150}
              style={{
                // borderRadius: 10,
                marginHorizontal: 5,

                marginTop: 5,
              }}></ShimmerPlaceHolder>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={30}
              width={Dimensions.get('window').width - 150}
              style={{
                // borderRadius: 10,
                marginHorizontal: 5,

                marginTop: 5,
              }}></ShimmerPlaceHolder>
          </View>
        </View>
      </View>
      <View>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={30}
          width={Dimensions.get('window').width}
          style={{
            // borderRadius: 10,
            marginHorizontal: 10,
            alignSelf: 'center',
            marginTop: 15,
          }}></ShimmerPlaceHolder>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'flex-start',
          }}>
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            height={115}
            width={115}
            style={{
              // borderRadius: 10,
              marginHorizontal: 10,
              alignSelf: 'center',
              marginTop: 15,
            }}></ShimmerPlaceHolder>
          <View>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={25}
              width={Dimensions.get('window').width - 150}
              style={{
                // borderRadius: 10,
                marginHorizontal: 5,

                marginTop: 15,
              }}></ShimmerPlaceHolder>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={15}
              width={Dimensions.get('window').width - 180}
              style={{
                // borderRadius: 10,
                marginHorizontal: 5,

                marginTop: 5,
              }}></ShimmerPlaceHolder>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={20}
              width={Dimensions.get('window').width - 150}
              style={{
                // borderRadius: 10,
                marginHorizontal: 5,

                marginTop: 5,
              }}></ShimmerPlaceHolder>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={30}
              width={Dimensions.get('window').width - 150}
              style={{
                // borderRadius: 10,
                marginHorizontal: 5,

                marginTop: 5,
              }}></ShimmerPlaceHolder>
          </View>
        </View>
      </View>
      <View>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={30}
          width={Dimensions.get('window').width}
          style={{
            // borderRadius: 10,
            marginHorizontal: 10,
            alignSelf: 'center',
            marginTop: 15,
          }}></ShimmerPlaceHolder>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'flex-start',
          }}>
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            height={115}
            width={115}
            style={{
              // borderRadius: 10,
              marginHorizontal: 10,
              alignSelf: 'center',
              marginTop: 15,
            }}></ShimmerPlaceHolder>
          <View>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={25}
              width={Dimensions.get('window').width - 150}
              style={{
                // borderRadius: 10,
                marginHorizontal: 5,

                marginTop: 15,
              }}></ShimmerPlaceHolder>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={15}
              width={Dimensions.get('window').width - 180}
              style={{
                // borderRadius: 10,
                marginHorizontal: 5,

                marginTop: 5,
              }}></ShimmerPlaceHolder>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={20}
              width={Dimensions.get('window').width - 150}
              style={{
                // borderRadius: 10,
                marginHorizontal: 5,

                marginTop: 5,
              }}></ShimmerPlaceHolder>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={30}
              width={Dimensions.get('window').width - 150}
              style={{
                // borderRadius: 10,
                marginHorizontal: 5,

                marginTop: 5,
              }}></ShimmerPlaceHolder>
          </View>
        </View>
      </View>
    </>
  );
};

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
