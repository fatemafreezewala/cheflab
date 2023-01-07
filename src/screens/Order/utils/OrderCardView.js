import {useNavigation} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import {Animations, COLORS, icons} from '../../../constants';
import {horizScale} from '../../../constants/themes';

const OrderCardView = ({
  item,
  name,
  delivered,
  success,
  cancel,
  show,
  prepare,
}) => {
  // console.log(`OrderCardView  ` + item?.order_id);
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('TrackOrder', {item});
      }}
      activeOpacity={0.8}
      style={{
        backgroundColor: COLORS.white,
        borderRadius: 10,
        elevation: 10,
        padding: 10,
        margin: 10,
        paddingVertical: 10,
        // width: '95%',
      }}>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <View
          style={{
            width: 84.5,
            height: 85,
            borderRadius: 100,
            borderWidth: 2,
            borderColor: '#db2728',
            justifyContent: 'center',
            backgroundColor: COLORS.white,
            alignSelf: 'center',
          }}>
          <Image
            source={{
              uri: item?.image,
            }}
            style={{
              width: 80,
              height: 80,
              borderRadius: 100,
            }}
          />
        </View>
        <View>
          <Text
            style={{
              color: COLORS.darkGray,
              fontSize: 16,
              fontFamily: 'Segoe UI Bold',
              marginTop: 10,
              marginStart: 10,
            }}>
            {item?.vendor_name}
          </Text>
          <Text
            style={{
              color: COLORS.darkGray,
              fontSize: 14,
              fontFamily: 'Segoe UI',
              marginTop: 5,
              marginStart: 10,
            }}>
            Order id: #{item?.order_id}
          </Text>
          <Text
            style={{
              color: COLORS.darkGray,
              fontSize: 12,
              fontFamily: 'Segoe UI',
              marginTop: 5,
              marginStart: 10,
            }}>
            {item?.order_date}
          </Text>
        </View>

        <View
          style={{
            paddingHorizontal: 5,
            paddingVertical: 5,
            backgroundColor:
              delivered | prepare
                ? COLORS.outForDeliveryBg
                : success
                ? COLORS.greenButtonBgColor
                : cancel
                ? COLORS.primary
                : COLORS.white,
            position: 'absolute',
            top: 10,
            right: 0,
            borderRadius: 10,
          }}>
          <Text
            style={{
              color: COLORS.white,
              fontSize: 12,
              fontFamily: 'Segoe UI',
            }}>
            {/* {delivered
              ? 'Out for delivery'
              : success
              ? 'Delivered'
              : cancel
              ? 'Cancelled'
              : COLORS.white} */}
            {/* {item?.order_status} */}

            {item?.order_status == 'pending'
              ? null
              : item?.order_status == 'confirmed'
              ? 'Confirmed'
              : item?.order_status == 'preparing'
              ? 'Preparing'
              : item?.order_status == 'ready_to_dispatch'
              ? 'Ready to dispatch'
              : item?.order_status == 'dispatched'
              ? 'Order dispatched'
              : item?.order_status ==
                  'cancelled_by_customer_before_confirmed' ||
                'cancelled_by_customer_after_confirmed' ||
                'cancelled_by_customer_during_prepare' ||
                'cancelled_by_customer_after_disptch'
              ? 'Order Cancelled'
              : item?.order_status == 'cancelled_by_vendor'
              ? 'Order cancelled by vendor'
              : item?.order_status == 'completed'
              ? 'Order Completed'
              : ''}
          </Text>
        </View>
      </View>

      <FlatList
        data={item?.products.slice(0, 2)}
        renderItem={({item, index}) => {
          return (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
                marginStart: 10,
                flexGrow: 1,
              }}>
              <Image
                source={icons.pure_veg}
                style={{
                  width: 10,
                  height: 10,
                }}
              />
              <Text
                style={{
                  color: COLORS.darkGray,
                  marginStart: 5,
                  fontSize: 12,
                }}>
                {item.product_qty} x {'  '}
                {item.product_name}
              </Text>
            </View>
          );
        }}
      />
      {item?.products?.length > 2 ? (
        <Text
          style={{
            color: COLORS.primary,
            marginStart: 5,
            fontSize: 12,
            fontFamily: 'Segoe UI Bold',
            marginTop: 5,
          }}>
          More...
        </Text>
      ) : null}
      {/* <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 10,
          marginStart: 10,
          flexGrow: 1,
        }}>
        <Image
          source={icons.pure_veg}
          style={{
            width: 10,
            height: 10,
          }}
        />
        <Text
          style={{
            color: COLORS.darkGray,
            marginStart: 5,
            fontSize: 12,
          }}>
          1x {'  '}Idli Sambhar
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 2,
          marginStart: 10,
        }}>
        <Image
          source={icons.pure_veg}
          style={{
            width: 10,
            height: 10,
          }}
        />
        <Text
          style={{
            color: COLORS.darkGray,
            marginStart: 5,
            fontSize: 12,
          }}>
          1x {'  '}Idli Sambhar
        </Text>
      </View> */}
      {show ? (
        <View
          style={{
            position: 'absolute',
            bottom: 55,
            right: 25,
            alignItems: 'center',
          }}>
          {/* <Image
            source={icons.countdown}
            style={{
              width: 60,
              height: 60,
            }}
          /> */}
          <LottieView
            source={Animations.countdown}
            // source={Animations.process_failed}
            style={{
              height: 60,
              width: 60,
            }}
            autoPlay={true}
            loop={true}
          />
          <Text
            style={{
              fontSize: 14,
              color: COLORS.darkGray,
              fontFamily: 'Segoe UI Bold',
            }}>
            ETA : 35 mins
          </Text>
        </View>
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 10,
          backgroundColor: COLORS.darkGray,
          height: 1,
        }}></View>
      <View
        style={{
          justifyContent: 'space-between',
          marginVertical: 2,
          flexDirection: 'row',
        }}>
        <Text
          style={{
            fontSize: 18,
            color: COLORS.darkGray,
            fontFamily: 'Segoe UI',
            marginTop: horizScale(5),
            marginStart: horizScale(5),
          }}>
          Grand Total
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: horizScale(5),
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 14,
              color: COLORS.darkGray,
              fontFamily: 'Segoe UI',
              marginStart: horizScale(5),
            }}>
            {item?.payment_type}
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: COLORS.darkGray,
              fontFamily: 'Segoe UI Bold',
              marginStart: horizScale(5),
            }}>
            ₹ {item?.net_amount}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OrderCardView;

const styles = StyleSheet.create({});

export const OrderCardViewSkeleton = () => {
  return (
    <View>
      <View>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            height={90}
            width={90}
            style={{
              marginStart: 15,
              borderRadius: 2,
              marginTop: 10,
            }}
          />
          <View>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={20}
              width={Dimensions.get('window').width - 150}
              style={{
                marginStart: 15,
                borderRadius: 2,
                marginTop: 15,
              }}
            />
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={10}
              width={Dimensions.get('window').width - 200}
              style={{
                marginStart: 15,
                borderRadius: 2,
                marginTop: 5,
              }}
            />
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={10}
              width={Dimensions.get('window').width - 180}
              style={{
                marginStart: 15,
                borderRadius: 2,
                marginTop: 5,
              }}
            />

            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={10}
              width={Dimensions.get('window').width - 180}
              style={{
                marginStart: 15,
                borderRadius: 2,
                marginTop: 10,
              }}
            />
          </View>
        </View>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={10}
          width={Dimensions.get('window').width - 50}
          style={{
            marginStart: 15,
            borderRadius: 2,
            marginTop: 8,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={20}
          width={Dimensions.get('window').width - 30}
          style={{
            marginEnd: 15,
            marginStart: 15,
            borderRadius: 2,
            marginTop: 8,
          }}
        />
      </View>

      <View
        style={{
          marginTop: 15,
        }}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            height={90}
            width={90}
            style={{
              marginStart: 15,
              borderRadius: 2,
              marginTop: 10,
            }}
          />
          <View>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={20}
              width={Dimensions.get('window').width - 150}
              style={{
                marginStart: 15,
                borderRadius: 2,
                marginTop: 15,
              }}
            />
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={10}
              width={Dimensions.get('window').width - 200}
              style={{
                marginStart: 15,
                borderRadius: 2,
                marginTop: 5,
              }}
            />
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={10}
              width={Dimensions.get('window').width - 180}
              style={{
                marginStart: 15,
                borderRadius: 2,
                marginTop: 5,
              }}
            />

            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={10}
              width={Dimensions.get('window').width - 180}
              style={{
                marginStart: 15,
                borderRadius: 2,
                marginTop: 10,
              }}
            />
          </View>
        </View>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={10}
          width={Dimensions.get('window').width - 50}
          style={{
            marginStart: 15,
            borderRadius: 2,
            marginTop: 8,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={20}
          width={Dimensions.get('window').width - 30}
          style={{
            marginEnd: 15,
            marginStart: 15,
            borderRadius: 2,
            marginTop: 8,
          }}
        />
      </View>

      <View
        style={{
          marginTop: 15,
        }}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            height={90}
            width={90}
            style={{
              marginStart: 15,
              borderRadius: 2,
              marginTop: 10,
            }}
          />
          <View>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={20}
              width={Dimensions.get('window').width - 150}
              style={{
                marginStart: 15,
                borderRadius: 2,
                marginTop: 15,
              }}
            />
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={10}
              width={Dimensions.get('window').width - 200}
              style={{
                marginStart: 15,
                borderRadius: 2,
                marginTop: 5,
              }}
            />
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={10}
              width={Dimensions.get('window').width - 180}
              style={{
                marginStart: 15,
                borderRadius: 2,
                marginTop: 5,
              }}
            />

            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={10}
              width={Dimensions.get('window').width - 180}
              style={{
                marginStart: 15,
                borderRadius: 2,
                marginTop: 10,
              }}
            />
          </View>
        </View>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={10}
          width={Dimensions.get('window').width - 50}
          style={{
            marginStart: 15,
            borderRadius: 2,
            marginTop: 8,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={20}
          width={Dimensions.get('window').width - 30}
          style={{
            marginEnd: 15,
            marginStart: 15,
            borderRadius: 2,
            marginTop: 8,
          }}
        />
      </View>

      <View
        style={{
          marginTop: 15,
        }}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            height={90}
            width={90}
            style={{
              marginStart: 15,
              borderRadius: 2,
              marginTop: 10,
            }}
          />
          <View>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={20}
              width={Dimensions.get('window').width - 150}
              style={{
                marginStart: 15,
                borderRadius: 2,
                marginTop: 15,
              }}
            />
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={10}
              width={Dimensions.get('window').width - 200}
              style={{
                marginStart: 15,
                borderRadius: 2,
                marginTop: 5,
              }}
            />
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={10}
              width={Dimensions.get('window').width - 180}
              style={{
                marginStart: 15,
                borderRadius: 2,
                marginTop: 5,
              }}
            />

            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={10}
              width={Dimensions.get('window').width - 180}
              style={{
                marginStart: 15,
                borderRadius: 2,
                marginTop: 10,
              }}
            />
          </View>
        </View>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={10}
          width={Dimensions.get('window').width - 50}
          style={{
            marginStart: 15,
            borderRadius: 2,
            marginTop: 8,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={20}
          width={Dimensions.get('window').width - 30}
          style={{
            marginEnd: 15,
            marginStart: 15,
            borderRadius: 2,
            marginTop: 8,
          }}
        />
      </View>

      <View
        style={{
          marginTop: 15,
        }}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            height={90}
            width={90}
            style={{
              marginStart: 15,
              borderRadius: 2,
              marginTop: 10,
            }}
          />
          <View>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={20}
              width={Dimensions.get('window').width - 150}
              style={{
                marginStart: 15,
                borderRadius: 2,
                marginTop: 15,
              }}
            />
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={10}
              width={Dimensions.get('window').width - 200}
              style={{
                marginStart: 15,
                borderRadius: 2,
                marginTop: 5,
              }}
            />
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={10}
              width={Dimensions.get('window').width - 180}
              style={{
                marginStart: 15,
                borderRadius: 2,
                marginTop: 5,
              }}
            />

            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={10}
              width={Dimensions.get('window').width - 180}
              style={{
                marginStart: 15,
                borderRadius: 2,
                marginTop: 10,
              }}
            />
          </View>
        </View>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={10}
          width={Dimensions.get('window').width - 50}
          style={{
            marginStart: 15,
            borderRadius: 2,
            marginTop: 8,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={20}
          width={Dimensions.get('window').width - 30}
          style={{
            marginEnd: 15,
            marginStart: 15,
            borderRadius: 2,
            marginTop: 8,
          }}
        />
      </View>

      <View
        style={{
          marginTop: 15,
        }}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            height={90}
            width={90}
            style={{
              marginStart: 15,
              borderRadius: 2,
              marginTop: 10,
            }}
          />
          <View>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={20}
              width={Dimensions.get('window').width - 150}
              style={{
                marginStart: 15,
                borderRadius: 2,
                marginTop: 15,
              }}
            />
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={10}
              width={Dimensions.get('window').width - 200}
              style={{
                marginStart: 15,
                borderRadius: 2,
                marginTop: 5,
              }}
            />
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={10}
              width={Dimensions.get('window').width - 180}
              style={{
                marginStart: 15,
                borderRadius: 2,
                marginTop: 5,
              }}
            />

            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              height={10}
              width={Dimensions.get('window').width - 180}
              style={{
                marginStart: 15,
                borderRadius: 2,
                marginTop: 10,
              }}
            />
          </View>
        </View>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={10}
          width={Dimensions.get('window').width - 50}
          style={{
            marginStart: 15,
            borderRadius: 2,
            marginTop: 8,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={20}
          width={Dimensions.get('window').width - 30}
          style={{
            marginEnd: 15,
            marginStart: 15,
            borderRadius: 2,
            marginTop: 8,
          }}
        />
      </View>
    </View>
  );
};
