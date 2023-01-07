import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {COLORS, icons} from '../../../../constants';
import {horizScale} from '../../../../constants/themes';
import style from '../style';
import {Rating, AirbnbRating} from 'react-native-elements';

const SearchDishCardView = ({item, marginTop}) => {
  const navigation = useNavigation();
  // console.log('SearchDishCardView =-> ', JSON.stringify(item));

  return (
    <View
      style={{
        padding: 5,

        // backgroundColor: COLORS.lightGray,
        marginEnd: 15,
        marginStart: 15,
        borderRadius: 10,
        // marginTop: 5,
        marginTop: marginTop,
        // marginBottom: 10,
      }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          navigation.navigate('RestaurantDetails', {
            bookTable: false,
            item: item,
            vId: item?.vendor_id,
          });
        }}
        style={{
          flexDirection: 'row',
          //   backgroundColor: COLORS.darkGray,
          borderRadius: 10,
        }}>
        {/* <View style={style.resImageBg}> */}
        <Image source={{uri: item?.image}} style={style.resImage} />
        {/* </View> */}
        <View
          style={{
            flexDirection: 'column',
            // marginStart: 15,
            // alignItems: 'flex-start',
            flex: 1,
          }}>
          <Text style={[style.text]} numberOfLines={1}>
            {item?.product_name}
          </Text>
          {item?.type == 'veg' ? (
            <Image
              source={icons.pure_veg}
              style={[
                style.distance_logo,
                {
                  // alignSelf: 'flex-end',
                  position: 'absolute',
                  right: 0,
                  width: 10,
                  height: 10,
                  // height: 20,
                },
              ]}
            />
          ) : (
            <Image
              source={icons.non_pure_veg}
              style={[
                style.distance_logo,
                {
                  // alignSelf: 'flex-end',
                  position: 'absolute',
                  right: 0,
                  width: 10,
                  height: 10,
                  // height: 20,
                },
              ]}
            />
          )}

          <Text style={[style.tagline, {marginTop: 10}]} numberOfLines={1}>
            By {item?.restaurantName}
          </Text>
          <View
            style={{
              marginStart: 15,
              marginTop: 8,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            {item?.product_rating == '0' ? null : (
              <View
                style={{
                  flexDirection: 'row',
                }}>
                {/* <Image source={icons.star} style={style.distance_logo} /> */}
                {/* <AntDesign name="staro" color={'gold'} />
                <AntDesign name="staro" color={'gold'} />
                <AntDesign name="staro" color={'gold'} />
                <AntDesign name="staro" color={'gold'} />
                <AntDesign name="staro" color={'gold'} /> */}
                <AirbnbRating
                  isDisabled={true}
                  count={5}
                  showRating={false}
                  defaultRating={parseInt(item?.product_rating)}
                  size={10}
                />
                <Text style={[style.distance]} numberOfLines={1}>
                  {item?.product_rating}
                </Text>
              </View>
            )}
            <Text
              style={{
                // marginHorizontal: 5,
                fontFamily: 'Segoe UI',
                fontSize: 18,
                color: COLORS.black,
                // alignSelf: 'flex-end',
                marginTop: 25,
              }}>
              ₹ {item?.product_price}
            </Text>
            <View
              style={{
                marginTop: 5,
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
                marginStart: 16,
                alignSelf: 'flex-end',
              }}>
              <Image source={icons.scooter} style={styles.distance_logo} />
              <Text
                style={[
                  {
                    color: COLORS.grey,
                    marginTop: 2,
                    fontFamily: 'Segoe UI',
                    fontSize: horizScale(12),

                    marginStart: 10,
                    // paddingBottom: 15, color: item?.isClosed == 1 ? COLORS.black : COLORS.grey,
                  },
                ]}
                numberOfLines={1}>
                {item?.distance} KM
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <View
        style={{
          height: 1,
          width: '105%',
          backgroundColor: COLORS.grey,
          marginTop: 10,
          alignSelf: 'center',
        }}
      />
    </View>
  );
};

export default SearchDishCardView;
const styles = StyleSheet.create({
  distance_logo: {
    // paddingBottom: 15,
    width: 15,
    height: 15,
    resizeMode: 'cover',
  },
});

export const SearchDishCardViewSkeleton = () => {
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          paddingVertical: 10,
        }}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={80}
          height={80}
          style={{
            borderRadius: 50,
            marginStart: 20,
          }}
        />
        <View
          style={{
            alignItems: 'center',
            marginTop: 15,
          }}>
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            width={horizScale(250)}
            height={15}
            style={{
              // borderRadius: 50,
              marginStart: 20,
            }}
          />

          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            width={horizScale(220)}
            height={15}
            style={{
              // borderRadius: 50,
              marginStart: 20,
              marginTop: 10,
              alignSelf: 'flex-start',
            }}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          paddingVertical: 10,
        }}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={80}
          height={80}
          style={{
            borderRadius: 50,
            marginStart: 20,
          }}
        />
        <View
          style={{
            alignItems: 'center',
            marginTop: 15,
          }}>
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            width={horizScale(250)}
            height={15}
            style={{
              // borderRadius: 50,
              marginStart: 20,
            }}
          />

          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            width={horizScale(220)}
            height={15}
            style={{
              // borderRadius: 50,
              marginStart: 20,
              marginTop: 10,
              alignSelf: 'flex-start',
            }}
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          paddingVertical: 10,
        }}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={80}
          height={80}
          style={{
            borderRadius: 50,
            marginStart: 20,
          }}
        />
        <View
          style={{
            alignItems: 'center',
            marginTop: 15,
          }}>
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            width={horizScale(250)}
            height={15}
            style={{
              // borderRadius: 50,
              marginStart: 20,
            }}
          />

          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            width={horizScale(220)}
            height={15}
            style={{
              // borderRadius: 50,
              marginStart: 20,
              marginTop: 10,
              alignSelf: 'flex-start',
            }}
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          paddingVertical: 10,
        }}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={80}
          height={80}
          style={{
            borderRadius: 50,
            marginStart: 20,
          }}
        />
        <View
          style={{
            alignItems: 'center',
            marginTop: 15,
          }}>
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            width={horizScale(250)}
            height={15}
            style={{
              // borderRadius: 50,
              marginStart: 20,
            }}
          />

          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            width={horizScale(220)}
            height={15}
            style={{
              // borderRadius: 50,
              marginStart: 20,
              marginTop: 10,
              alignSelf: 'flex-start',
            }}
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          paddingVertical: 10,
        }}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={80}
          height={80}
          style={{
            borderRadius: 50,
            marginStart: 20,
          }}
        />
        <View
          style={{
            alignItems: 'center',
            marginTop: 15,
          }}>
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            width={horizScale(250)}
            height={15}
            style={{
              // borderRadius: 50,
              marginStart: 20,
            }}
          />

          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            width={horizScale(220)}
            height={15}
            style={{
              // borderRadius: 50,
              marginStart: 20,
              marginTop: 10,
              alignSelf: 'flex-start',
            }}
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          paddingVertical: 10,
        }}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={80}
          height={80}
          style={{
            borderRadius: 50,
            marginStart: 20,
          }}
        />
        <View
          style={{
            alignItems: 'center',
            marginTop: 15,
          }}>
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            width={horizScale(250)}
            height={15}
            style={{
              // borderRadius: 50,
              marginStart: 20,
            }}
          />

          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            width={horizScale(220)}
            height={15}
            style={{
              // borderRadius: 50,
              marginStart: 20,
              marginTop: 10,
              alignSelf: 'flex-start',
            }}
          />
        </View>
      </View>
    </View>
  );
};
