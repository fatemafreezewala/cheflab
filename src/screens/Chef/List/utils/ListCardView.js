import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {AirbnbRating} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import {COLORS, icons} from '../../../../constants';
import {horizScale} from '../../../../constants/themes';

const ListCardView = ({item, veg, onFavPress}) => {
  const navigation = useNavigation();
  // console.log(' ChefDetails ListCardView item -> ', JSON.stringify(item));
  /**{"name":"Cook Ankur Bajaj","image":"","Age":17
   * ,"vendor_ratings":0,"speciality":"3","deal_categories":"1,2","chef_id":3
   * ,"experience":"10","fssai_lic_no":null,"order_served":0,"vendor_food_type":"1",
   * "review_count":0,"is_like":true,"distance":134.3,"food_specility":"Marathi",
   * "isClosed":true,"categories":["Pizza one","Burger"]} */
  // let chilli = [];

  // for (let i = 0; i < parseInt(item?.chili_level); i++) {
  //   console.log('push method executres ->>>> ', item?.chili_level);
  //   chilli.push(
  //     <View key={i}>
  //       <Image
  //         source={icons.chilli_level}
  //         style={{
  //           width: 10,
  //           height: 10,
  //         }}
  //       />
  //     </View>,
  //   );
  // }

  return (
    <TouchableOpacity
      onPress={() => {
        // navigation.navigate('ChefDetails', item);
        // console.log(' ChefDetails ListCardView item -> ', JSON.stringify(item?.chef_id));

        navigation.navigate('ChefDetails', {bookTable: false, item});
      }}
      activeOpacity={0.9}
      style={{
        borderWidth: 1,
        borderColor: '#DB2728',
        borderRadius: 10,
        marginStart: 20,
        marginBottom: 5,
        marginTop: 15,
        height: 150,
        marginEnd: 20,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View>
          <View
            style={{
              height: 105,
              width: 104.5,
              borderRadius: 100,
              margin: 10,
              borderWidth: 2,
              borderColor: '#db2728',
              //   paddingStart: 5,
              justifyContent: 'center',
              backgroundColor: COLORS.white,
            }}>
            <Image
              source={{
                uri: item?.image,
              }}
              style={{
                height: 100,
                width: 100,
                borderRadius: 100,
              }}
            />
          </View>
          {item?.vendor_food_type == '1' ? (
            <View
              style={{
                backgroundColor: COLORS.greenButtonBgColor,
                borderRadius: 10,
                position: 'absolute',
                bottom: 8,
                alignSelf: 'center',
                paddingHorizontal: 3,
              }}>
              <Image
                source={icons.rest_pure_veg}
                style={{
                  width: 50,
                  height: 15,
                  resizeMode: 'contain',
                }}
              />
            </View>
          ) : null}
        </View>
        <View>
          <View
            style={
              {
                // backgroundColor: COLORS.red,
              }
            }>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={[
                  {
                    fontFamily: 'Segoe UI Bold',
                    fontSize: 16,
                    color: 'rgba(0, 0, 0, 255)',
                    marginTop: 5,
                    flex: 1,
                  },
                ]}
                numberOfLines={2}>
                {item?.name}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: 'Segoe UI',
                fontSize: 13,
                color: COLORS.grey,
                // marginStart: 25,
                marginTop: 5,
              }}>
              Age - {item?.Age} yrs, Cooking Exp - {item?.experience} Yrs
            </Text>
            <View
              style={{
                // alignSelf: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                marginTop: 10,
                paddingBottom: 10,
              }}>
              {/* <Image source={icons.star} style={styles.star_logo} /> */}
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
              {item?.vendor_ratings == '0' ? null : (
                <>
                  <Text
                    style={{
                      marginHorizontal: 3,
                      fontFamily: 'Segoe UI Bold',
                      fontSize: 14,
                      color: COLORS.black,
                      // marginTop: 0,
                      alignSelf: 'center',
                      // marginVertical: 2,
                    }}>
                    {item?.vendor_ratings}
                  </Text>
                  <Text
                    style={{
                      // marginHorizontal: 10,
                      fontFamily: 'Segoe UI',
                      fontSize: 10,
                      color: '#0638ff',
                      // marginTop: 0,
                      alignSelf: 'center',
                      marginVertical: 2,
                    }}>
                    ({item?.review_count} Reviews)
                  </Text>
                </>
              )}
            </View>
          </View>

          <View
            style={{
              // flexDirection: 'row',
              justifyContent: 'space-between',
              // backgroundColor: COLORS.red,
            }}>
            <Text
              style={{
                // marginHorizontal: 3,
                fontFamily: 'Segoe UI',
                fontSize: 12,
                color: COLORS.grey,
                // paddingBottom: 10,
              }}>
              Order Served - {item?.order_served}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginTop: 5,
            position: 'absolute',
            bottom: 10,
            right: 5,
            // alignSelf: 'flex-end',

            // justifyContent: 'space-between',
          }}>
          <Image
            source={icons.scooter}
            style={[
              styles.distance_logo,
              {
                marginEnd: 0,
              },
            ]}
          />
          <Text
            style={[
              styles.distance,
              {
                marginTop: 2,
              },
            ]}
            numberOfLines={1}>
            {item?.distance} KM
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            // setFavorite(!favorite);
            onFavPress();
          }}
          style={{
            position: 'absolute',
            top: 5,
            right: 5,
          }}>
          <Image
            source={item?.is_like != 0 ? icons.favorite : icons.unfavorite}
            style={{
              width: 30,
              height: 30,
              // tintColor: item?.is_like ? '#ff0000' : '#e7e7e7',
            }}
          />
        </TouchableOpacity>
      </View>

      <View
        style={{
          backgroundColor: COLORS.black,
          alignItems: 'center',
          justifyContent: 'center',
          width: '105%',
          position: 'absolute',
          bottom: -1,
          marginStart: -8,
          paddingVertical: 3,
          borderRadius: 15,
          // top: 5,
        }}>
        <Text
          style={{
            fontFamily: 'Segoe UI',
            fontSize: horizScale(14),
            color: COLORS.white,
          }}>
          Specialty - {item?.food_specility}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ListCardView;

export const ChefListCardViewSkeleton = () => {
  return (
    <View>
      {/* <ShimmerPlaceHolder
        isReversed={true}
        LinearGradient={LinearGradient}
        height={25}
        width={Dimensions.get('window').width - 25}
        style={{
          marginTop: 25,
          alignSelf: 'center',
          borderRadius: 5,
          marginBottom: 10,
        }}
      /> */}
      {/* <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{}}> */}
      <View style={{flex: 1, marginTop: 20}}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            width={100}
            height={100}
            style={{
              marginStart: 15,
              borderRadius: 50,
            }}
          />
          <View
            style={{
              // alignSelf: 'center',
              marginStart: 15,
            }}>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={15}
              width={horizScale(220)}
              style={{
                marginStart: 10,
                marginTop: 10,
                // alignSelf: 'center',
                borderRadius: 5,
              }}
            />
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={15}
              width={horizScale(220)}
              style={{
                marginStart: 10,
                marginTop: 10,
                borderRadius: 5,
              }}
            />

            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={15}
              width={horizScale(220)}
              style={{
                marginStart: 10,
                marginTop: 10,
                borderRadius: 5,
              }}
            />
            <View
              style={{
                // justifyContent: 'space-between',
                flexDirection: 'row',
                // flex: 1,
              }}>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                height={15}
                width={horizScale(100)}
                style={{
                  marginStart: 10,
                  marginTop: 10,
                  borderRadius: 5,
                }}
              />
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                height={15}
                width={horizScale(100)}
                style={{
                  marginStart: 30,
                  marginTop: 10,
                  borderRadius: 5,
                  // alignSelf: 'flex-end',
                }}
              />
            </View>
          </View>
        </View>

        <View>
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            height={15}
            width={horizScale(200)}
            style={{
              marginStart: 10,
              marginTop: 15,
              borderRadius: 5,
              alignSelf: 'center',
            }}
          />
        </View>
      </View>
      <View style={{flex: 1, marginTop: 20}}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            width={100}
            height={100}
            style={{
              marginStart: 15,
              borderRadius: 50,
            }}
          />
          <View
            style={{
              // alignSelf: 'center',
              marginStart: 15,
            }}>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={15}
              width={horizScale(220)}
              style={{
                marginStart: 10,
                marginTop: 10,
                // alignSelf: 'center',
                borderRadius: 5,
              }}
            />
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={15}
              width={horizScale(220)}
              style={{
                marginStart: 10,
                marginTop: 10,
                borderRadius: 5,
              }}
            />

            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={15}
              width={horizScale(220)}
              style={{
                marginStart: 10,
                marginTop: 10,
                borderRadius: 5,
              }}
            />
            <View
              style={{
                // justifyContent: 'space-between',
                flexDirection: 'row',
                // flex: 1,
              }}>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                height={15}
                width={horizScale(100)}
                style={{
                  marginStart: 10,
                  marginTop: 10,
                  borderRadius: 5,
                }}
              />
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                height={15}
                width={horizScale(100)}
                style={{
                  marginStart: 30,
                  marginTop: 10,
                  borderRadius: 5,
                  // alignSelf: 'flex-end',
                }}
              />
            </View>
          </View>
        </View>

        <View>
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            height={15}
            width={horizScale(200)}
            style={{
              marginStart: 10,
              marginTop: 15,
              borderRadius: 5,
              alignSelf: 'center',
            }}
          />
        </View>
      </View>
      <View style={{flex: 1, marginTop: 20}}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            width={100}
            height={100}
            style={{
              marginStart: 15,
              borderRadius: 50,
            }}
          />
          <View
            style={{
              // alignSelf: 'center',
              marginStart: 15,
            }}>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={15}
              width={horizScale(220)}
              style={{
                marginStart: 10,
                marginTop: 10,
                // alignSelf: 'center',
                borderRadius: 5,
              }}
            />
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={15}
              width={horizScale(220)}
              style={{
                marginStart: 10,
                marginTop: 10,
                borderRadius: 5,
              }}
            />

            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={15}
              width={horizScale(220)}
              style={{
                marginStart: 10,
                marginTop: 10,
                borderRadius: 5,
              }}
            />
            <View
              style={{
                // justifyContent: 'space-between',
                flexDirection: 'row',
                // flex: 1,
              }}>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                height={15}
                width={horizScale(100)}
                style={{
                  marginStart: 10,
                  marginTop: 10,
                  borderRadius: 5,
                }}
              />
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                height={15}
                width={horizScale(100)}
                style={{
                  marginStart: 30,
                  marginTop: 10,
                  borderRadius: 5,
                  // alignSelf: 'flex-end',
                }}
              />
            </View>
          </View>
        </View>

        <View>
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            height={15}
            width={horizScale(200)}
            style={{
              marginStart: 10,
              marginTop: 15,
              borderRadius: 5,
              alignSelf: 'center',
            }}
          />
        </View>
      </View>

      <View style={{flex: 1, marginTop: 20}}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            width={100}
            height={100}
            style={{
              marginStart: 15,
              borderRadius: 50,
            }}
          />
          <View
            style={{
              // alignSelf: 'center',
              marginStart: 15,
            }}>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={15}
              width={horizScale(220)}
              style={{
                marginStart: 10,
                marginTop: 10,
                // alignSelf: 'center',
                borderRadius: 5,
              }}
            />
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={15}
              width={horizScale(220)}
              style={{
                marginStart: 10,
                marginTop: 10,
                borderRadius: 5,
              }}
            />

            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={15}
              width={horizScale(220)}
              style={{
                marginStart: 10,
                marginTop: 10,
                borderRadius: 5,
              }}
            />
            <View
              style={{
                // justifyContent: 'space-between',
                flexDirection: 'row',
                // flex: 1,
              }}>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                height={15}
                width={horizScale(100)}
                style={{
                  marginStart: 10,
                  marginTop: 10,
                  borderRadius: 5,
                }}
              />
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                height={15}
                width={horizScale(100)}
                style={{
                  marginStart: 30,
                  marginTop: 10,
                  borderRadius: 5,
                  // alignSelf: 'flex-end',
                }}
              />
            </View>
          </View>
        </View>

        <View>
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            height={15}
            width={horizScale(200)}
            style={{
              marginStart: 10,
              marginTop: 15,
              borderRadius: 5,
              alignSelf: 'center',
            }}
          />
        </View>
      </View>

      <View style={{flex: 1, marginTop: 20}}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            width={100}
            height={100}
            style={{
              marginStart: 15,
              borderRadius: 50,
            }}
          />
          <View
            style={{
              // alignSelf: 'center',
              marginStart: 15,
            }}>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={15}
              width={horizScale(220)}
              style={{
                marginStart: 10,
                marginTop: 10,
                // alignSelf: 'center',
                borderRadius: 5,
              }}
            />
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={15}
              width={horizScale(220)}
              style={{
                marginStart: 10,
                marginTop: 10,
                borderRadius: 5,
              }}
            />

            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={15}
              width={horizScale(220)}
              style={{
                marginStart: 10,
                marginTop: 10,
                borderRadius: 5,
              }}
            />
            <View
              style={{
                // justifyContent: 'space-between',
                flexDirection: 'row',
                // flex: 1,
              }}>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                height={15}
                width={horizScale(100)}
                style={{
                  marginStart: 10,
                  marginTop: 10,
                  borderRadius: 5,
                }}
              />
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                height={15}
                width={horizScale(100)}
                style={{
                  marginStart: 30,
                  marginTop: 10,
                  borderRadius: 5,
                  // alignSelf: 'flex-end',
                }}
              />
            </View>
          </View>
        </View>

        <View>
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            height={15}
            width={horizScale(200)}
            style={{
              marginStart: 10,
              marginTop: 15,
              borderRadius: 5,
              alignSelf: 'center',
            }}
          />
        </View>
      </View>

      <View style={{flex: 1, marginTop: 20}}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            width={100}
            height={100}
            style={{
              marginStart: 15,
              borderRadius: 50,
            }}
          />
          <View
            style={{
              // alignSelf: 'center',
              marginStart: 15,
            }}>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={15}
              width={horizScale(220)}
              style={{
                marginStart: 10,
                marginTop: 10,
                // alignSelf: 'center',
                borderRadius: 5,
              }}
            />
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={15}
              width={horizScale(220)}
              style={{
                marginStart: 10,
                marginTop: 10,
                borderRadius: 5,
              }}
            />

            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={15}
              width={horizScale(220)}
              style={{
                marginStart: 10,
                marginTop: 10,
                borderRadius: 5,
              }}
            />
            <View
              style={{
                // justifyContent: 'space-between',
                flexDirection: 'row',
                // flex: 1,
              }}>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                height={15}
                width={horizScale(100)}
                style={{
                  marginStart: 10,
                  marginTop: 10,
                  borderRadius: 5,
                }}
              />
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                height={15}
                width={horizScale(100)}
                style={{
                  marginStart: 30,
                  marginTop: 10,
                  borderRadius: 5,
                  // alignSelf: 'flex-end',
                }}
              />
            </View>
          </View>
        </View>

        <View>
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            height={15}
            width={horizScale(200)}
            style={{
              marginStart: 10,
              marginTop: 15,
              borderRadius: 5,
              alignSelf: 'center',
            }}
          />
        </View>
      </View>
      {/* </ScrollView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  distance: {
    color: COLORS.grey,
    marginTop: 2,
    fontFamily: 'Segoe UI',
    fontSize: 12,
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
    width: 12,
    height: 12,

    resizeMode: 'cover',
  },
  fav: {
    right: -25,
    top: 5,
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: '#f5f5f5',
  },
  moodText: {
    fontFamily: 'Segoe UI Bold',
    fontSize: 18,
    color: 'rgba(0, 0, 0, 255)',
    marginTop: 15,
  },
});

/**
 * 
8. getChefProfile  --api end point

response":{"profile":{"name":"John Chef","image":"","Age":26,"vendor_ratings":0,"speciality":"1,2,4",

"deal_categories":"1,2,4",
"id":4,"experience":"5","fssai_lic_no":null, "bio":"biosadsdsa"}

// missing key
origin, specialty,   review count

 * 
 */
