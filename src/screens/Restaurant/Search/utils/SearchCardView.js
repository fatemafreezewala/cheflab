import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {COLORS, icons} from '../../../../constants';
import {horizScale, SIZES} from '../../../../constants/themes';
import {Rating, AirbnbRating} from 'react-native-elements';

import style from '../style';
const SearchCardView = ({item, marginTop}) => {
  const navigation = useNavigation();
  // console.log('SearchCardView =-> ', JSON.stringify(item));
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
          if (item?.isClosed == 0) {
            navigation.navigate('RestaurantDetails', {
              bookTable: false,
              item: item,
              vId: item?.id,
            });
          }
        }}
        style={{
          flexDirection: 'row',
          //   backgroundColor: COLORS.darkGray,
          alignItems: 'center',
          borderRadius: 10,
        }}>
        {/* <View style={style.resImageBg}> */}
        <Image source={{uri: item?.image}} style={style.resImage} />
        {/* </View> */}
        <View
          style={{
            alignItems: 'flex-start',
            // flexDirection: 'row',
          }}>
          {/* <View
            style={{
              flexDirection: 'row',
            }}>
            <Text
              style={[
                {
                  backgroundColor: 'red',
                  color: COLORS.black,
                  fontFamily: 'Segoe UI Bold',
                  fontSize: 16,
                  flexWrap: 'wrap',
                },
              ]}
              numberOfLines={1}>
              {item?.name}dfsfsffdsfds
            </Text>
          </View> */}
          <View
            style={{
              flexDirection: 'row',
              marginStart: 15,
              // flex: 1,
              width: SIZES.width / 1.9,
            }}>
            <Text
              style={[
                {
                  color: COLORS.black,
                  fontFamily: 'Segoe UI Bold',
                  fontSize: 16,
                },
              ]}
              numberOfLines={3}>
              {item?.name}
              {/* sad safd dad a ad a a d dff df ds f ds fd sf d f d f dsf ds */}
            </Text>
          </View>
          <View>
            {item?.vendor_ratings == 0 ? null : (
              <View style={style.resStarView}>
                {/* <AntDesign name="staro" color={'gold'} />
                <AntDesign name="staro" color={'gold'} />
                <AntDesign name="staro" color={'gold'} />
                <AntDesign name="staro" color={'gold'} />
                <AntDesign name="staro" color={'gold'} /> */}
                <AirbnbRating
                  isDisabled={true}
                  count={5}
                  showRating={false}
                  defaultRating={parseInt(item?.vendor_ratings)}
                  size={10}
                />
                <Text style={[style.distance]} numberOfLines={1}>
                  {item?.vendor_ratings}
                </Text>
                <Text
                  style={{
                    marginHorizontal: 5,
                    fontFamily: 'Segoe UI',
                    fontSize: 12,
                    color: '#0638ff',
                    alignSelf: 'center',
                    marginVertical: 2,
                  }}>
                  ({item?.review_count} reviews)
                </Text>
              </View>
            )}
          </View>
          <View
            style={{
              marginTop: 5,
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 5,
              marginStart: 16,
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

          {item?.isClosed == 1 ? (
            <Text
              style={{
                color: COLORS.red,
                fontFamily: 'Segoe UI Bold',
                fontSize: horizScale(16),

                marginTop: 10,
                marginStart: 15,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: 'red',
                paddingTop: 2,
                paddingHorizontal: 8,
              }}>
              Closed
            </Text>
          ) : null}
        </View>

        {item?.vendor_food_type == '1' ? (
          <Image
            source={icons.pure_veg}
            style={{
              width: 10,
              height: 10,
              // alignSelf: 'flex-end',
              position: 'absolute',
              right: 10,
              top: 15,
            }}
          />
        ) : (
          <Image
            source={icons.non_pure_veg}
            style={{
              width: 10,
              height: 10,
              // alignSelf: 'flex-end',
              position: 'absolute',
              right: 10,
              top: 15,
            }}
          />
        )}
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

export default SearchCardView;

const styles = StyleSheet.create({
  distance_logo: {
    // paddingBottom: 15,
    width: 15,
    height: 15,
    resizeMode: 'cover',
  },
});

export const SearchCardViewSkeleton = () => {
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
