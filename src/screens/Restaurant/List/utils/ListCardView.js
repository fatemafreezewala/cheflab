import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {COLORS, icons} from '../../../../constants';
import {horizScale, SIZES} from '../../../../constants/themes';
import {Rating, AirbnbRating} from 'react-native-elements';

const ListCardView = ({items, index, onFavPress}) => {
  // console.log('ListCardView item -> ', JSON.stringify(items));
  const navigation = useNavigation();

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          if (items?.isClosed == 1) {
          } else {
            navigation.navigate('RestaurantDetails', {
              bookTable: false,
              item: items,
            });
          }
        }}
        activeOpacity={0.9}
        style={{
          marginTop: 8,
          marginBottom: 8,
          marginHorizontal: 10,
          backgroundColor: items?.isClosed == 1 ? COLORS.grey : COLORS.white,
          elevation: 5,
          borderRadius: 10,
          paddingBottom: 10,
        }}>
        <View
          style={{
            opacity: items?.isClosed == 1 ? 0.5 : 1,
            // backgroundColor: COLORS.grey,
          }}>
          <View style={[styles.sliderMainContainer, {}]}>
            <SwiperFlatList
              autoplay
              autoplayDelay={3}
              autoplayLoop
              // data={[
              //   'https://images.unsplash.com/photo-1584055482118-3f355578daef?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZCUyMGZvciUyMHBob25lfGVufDB8fDB8fA%3D%3D',
              //   'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8Zm9vZHxlbnwwfHwwfHw%3D',
              //   'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vZHxlbnwwfHwwfHw%3D',
              //   'https://images.unsplash.com/photo-1630659996121-34204da4ce5f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vZCUyMGZvciUyMHBob25lfGVufDB8fDB8fA%3D%3D',
              // ]}
              data={items?.banner_image || [items?.image]}
              renderItem={({item}) => (
                <View
                  style={{
                    width: SIZES.width - 20,
                  }}>
                  <ImageBackground
                    imageStyle={{
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                    }}
                    source={{
                      // uri: item,
                      uri: item,
                    }}
                    style={{
                      height: 180,
                      width: '100%',
                      opacity: items?.isClosed == 1 ? 0.5 : 1,
                      // backgroundColor:items?.isClosed ==01? COLORS.grey : COLORS.tr,
                    }}
                    resizeMode={'cover'}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        // setFavorite(!favorite);
                        if (items?.isClosed == 1) {
                        } else {
                          onFavPress();
                        }
                      }}
                      style={{
                        // right: 5,
                        // top: 5,
                        // position: 'absolute',
                        borderRadius: 50,
                        backgroundColor: '#f5f5f5',
                        alignSelf: 'flex-end',
                        marginTop: 10,
                        marginEnd: 10,
                      }}>
                      <Image
                        source={
                          items?.is_like ? icons.favorite : icons?.unfavorite
                        }
                        style={{
                          width: 30,
                          height: 30,
                        }}
                      />
                    </TouchableOpacity>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent:
                          items?.vendor_food_type == '1'
                            ? 'space-around'
                            : 'flex-start',
                        // alignItems: 'center',
                        marginTop: 'auto',
                        marginBottom: 10,
                        // backgroundColor: COLORS.red,
                      }}>
                      {items?.isClosed ? null : (
                        <Image
                          style={{
                            height: 15,
                            width: 80,
                            resizeMode: 'center',
                            alignSelf: 'flex-start',
                          }}
                          source={icons.open_rest}
                        />
                      )}
                      {items?.vendor_food_type == '1' ? (
                        <Image
                          style={{
                            // height: 15,
                            height: 15,
                            resizeMode: 'cover',
                            width: 80,
                            borderRadius: 5,
                            // marginEnd: 'auto',
                            // alignSelf: 'center',
                            marginStart: 'auto',
                            marginEnd: 10,
                            // backgroundColor: COLORS.red,
                          }}
                          source={icons.restpure_veg}
                        />
                      ) : null}
                    </View>
                  </ImageBackground>
                </View>
              )}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              // justifyContent: 'space-between',
              // alignItems: 'center',
            }}>
            <Text
              style={{
                marginTop: 10,
                marginStart: 15,
                // marginEnd: 30,
                fontFamily: 'Segoe UI Bold',
                fontSize: horizScale(17),
                color: COLORS.black,
                // marginTop: 0,
                width: SIZES.width / 1.4,
                alignSelf: 'flex-start',
              }}
              numberOfLines={2}>
              {items?.name}
            </Text>
            <View
              style={{
                marginEnd: 15,
                marginTop: 5,
                flexDirection: 'row',
                paddingBottom: 15,
                alignItems: 'center',
                marginTop: 5,
              }}>
              <Image source={icons.scooter} style={styles.distance_logo} />
              <Text
                style={[
                  styles.distance,
                  {
                    color: items?.isClosed == 1 ? COLORS.black : COLORS.grey,
                  },
                ]}
                numberOfLines={1}>
                {items?.distance} KM
              </Text>
            </View>
          </View>
          <Text
            style={{
              color: items?.isClosed == 1 ? COLORS.black : COLORS.grey,

              // marginTop: 2,
              fontFamily: 'Segoe UI',
              fontSize: horizScale(14),
              // paddingBottom: items?.vendor_ratings >= 0 ? 0 : 10,

              marginEnd: 5,
              marginStart: 15,
            }}
            numberOfLines={1}>
            {items?.cuisines?.toString()}
            {/* {items?.categories?.toString()} */}
          </Text>

          <View
            style={{
              alignSelf: 'flex-start',
              alignItems: 'center',
              flexDirection: 'row',
              marginStart: 15,
              marginTop: 10,
              // paddingBottom: 10,
            }}>
            {/* <Image source={icons.star} style={styles.star_logo} /> */}
            {/* <AntDesign name="staro" color={'gold'} />
            <AntDesign name="staro" color={'gold'} />
            <AntDesign name="staro" color={'gold'} />
            <AntDesign name="staro" color={'gold'} />
            <AntDesign name="staro" color={'gold'} /> */}

            <AirbnbRating
              count={5}
              isDisabled={true}
              showRating={false}
              defaultRating={parseInt(items?.vendor_ratings)}
              size={10}
            />
            {items?.vendor_ratings > 0 ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    marginHorizontal: 3,
                    fontFamily: 'Segoe UI Bold',
                    fontSize: horizScale(12),
                    color: COLORS.black,
                    alignSelf: 'center',
                    marginVertical: 2,
                  }}>
                  {items?.vendor_ratings}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Segoe UI',
                    fontSize: horizScale(10),
                    color: '#0638ff',
                    alignSelf: 'center',
                    marginVertical: 2,
                  }}>
                  ({items?.review_count || 0} Reviews)
                </Text>
              </View>
            ) : null}
          </View>
        </View>
        {items?.isClosed == 1 ? (
          <Image
            style={{
              height: 35,
              width: 150,
              position: 'absolute',
              borderRadius: 10,
              top: 60,
              alignSelf: 'center',
            }}
            source={icons.closed_rest}
          />
        ) : null}

        {items?.isClosed == 1 ? (
          <Text
            style={{
              color: COLORS.white,
              position: 'absolute',
              top: 110,
              alignSelf: 'center',
              fontSize: 18,
            }}>
            {/* Open at 10:00 AM */}
            Opens {items?.next_available}
          </Text>
        ) : null}
      </TouchableOpacity>
    </>
  );
};

export default ListCardView;

export const ListCardViewSkeleton = () => {
  return (
    <>
      <View
        style={{
          backgroundColor: '#fff',
          padding: 5,
          marginVertical: 5,
          // elevation: 10,
          // borderRadius: 10,
        }}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={150}
          width={Dimensions.get('window').width - 20}
          style={{
            alignSelf: 'center',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={22}
          width={Dimensions.get('window').width - 20}
          style={{
            alignSelf: 'center',
            marginTop: 10,
            borderRadius: 10,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={15}
          width={Dimensions.get('window').width - 100}
          style={{
            // alignSelf: 'center',
            marginStart: 5,
            borderRadius: 10,
            marginTop: 5,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={15}
          width={Dimensions.get('window').width - 150}
          style={{
            marginStart: 5,
            // alignSelf: 'center',
            marginTop: 5,
            borderRadius: 10,
          }}></ShimmerPlaceHolder>
      </View>
      <View
        style={{
          backgroundColor: '#fff',
          padding: 5,
          marginVertical: 5,
          // elevation: 10,
          // borderRadius: 10,
        }}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={150}
          width={Dimensions.get('window').width - 20}
          style={{
            alignSelf: 'center',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={22}
          width={Dimensions.get('window').width - 20}
          style={{
            alignSelf: 'center',
            marginTop: 10,
            borderRadius: 10,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={15}
          width={Dimensions.get('window').width - 100}
          style={{
            // alignSelf: 'center',
            marginStart: 5,
            borderRadius: 10,
            marginTop: 5,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={15}
          width={Dimensions.get('window').width - 150}
          style={{
            marginStart: 5,
            // alignSelf: 'center',
            marginTop: 5,
            borderRadius: 10,
          }}></ShimmerPlaceHolder>
      </View>

      <View
        style={{
          backgroundColor: '#fff',
          padding: 5,
          marginVertical: 5,
          // elevation: 10,
          // borderRadius: 10,
        }}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={150}
          width={Dimensions.get('window').width - 20}
          style={{
            alignSelf: 'center',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={22}
          width={Dimensions.get('window').width - 20}
          style={{
            alignSelf: 'center',
            marginTop: 10,
            borderRadius: 10,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={15}
          width={Dimensions.get('window').width - 100}
          style={{
            // alignSelf: 'center',
            marginStart: 5,
            borderRadius: 10,
            marginTop: 5,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={15}
          width={Dimensions.get('window').width - 150}
          style={{
            marginStart: 5,
            // alignSelf: 'center',
            marginTop: 5,
            borderRadius: 10,
          }}></ShimmerPlaceHolder>
      </View>
      <View
        style={{
          backgroundColor: '#fff',
          padding: 5,
          marginVertical: 5,
          // elevation: 10,
          // borderRadius: 10,
        }}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={150}
          width={Dimensions.get('window').width - 20}
          style={{
            alignSelf: 'center',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={22}
          width={Dimensions.get('window').width - 20}
          style={{
            alignSelf: 'center',
            marginTop: 10,
            borderRadius: 10,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={15}
          width={Dimensions.get('window').width - 100}
          style={{
            // alignSelf: 'center',
            marginStart: 5,
            borderRadius: 10,
            marginTop: 5,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={15}
          width={Dimensions.get('window').width - 150}
          style={{
            marginStart: 5,
            // alignSelf: 'center',
            marginTop: 5,
            borderRadius: 10,
          }}></ShimmerPlaceHolder>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  distance: {
    color: COLORS.grey,
    marginTop: 2,
    fontFamily: 'Segoe UI',
    fontSize: horizScale(12),

    marginStart: 10,
    // paddingBottom: 15,
  },
  distance_logo: {
    // paddingBottom: 15,
    width: 15,
    height: 15,
    resizeMode: 'cover',
  },
  star_logo: {
    width: 10,
    height: 10,

    resizeMode: 'cover',
  },
  paginationStyleItem: {
    height: 6,
    width: 6,
    borderRadius: 5,
    marginTop: 25,
  },
  sliderMainContainer: {
    height: 180,
    // width: SIZES.width - 20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
/***
 *
 */
