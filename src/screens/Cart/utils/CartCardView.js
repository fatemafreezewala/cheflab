import React from 'react';
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
import {COLORS, icons} from '../../../constants';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {horizScale, vertScale} from '../../../constants/themes';
const CartCardView = ({item, chilli, onCustomizeClick, onPlus, onMinus}) => {
  // console.log('item 1111111 => ', JSON.stringify(item?.product_price));
  /** {"id":2,"userId":1,"product_name":"Big Burger",
   * "product_image":"https://web10technologies.com/Chelab_full_project/public/products/1663421109-restau
   * rant-product-745.png",
   * "cuisines":"Chinese","category":2,"menu_id":2,"dis":"Big Burger","type":"veg",
   * "product_price":"300.00","customizable":"true","addons":null,"product_for":"3",
   * "status":"1",
   * "product_variants":[{"id":3,"product_id":2,"variant_name":"Cheese Slice XL","variant_price":"450.00","variant_qty":0}]} */

  let addonCount = 0;
  let variantCount = 0;
  let addonPrice = 0;
  let variantPrice = 0;

  let a = item?.addons?.map((it, index) => {
    // console.log('addons  222222 -> ', JSON.stringify(i/t));
    if (it?.added) {
      addonPrice += parseInt(it.price);
      addonCount += 1;
    }
  });

  let b = item?.variants?.map((it, index) => {
    if (it?.added) {
      variantPrice += parseInt(it.variant_price);
      variantCount += 1;
    } else {
      // variantPrice += parseInt(item?.product_price);
    }
  });

  // console.log('addons price 44444 ->', addonPrice);
  // console.log('variant price 5555 ->', variantPrice);
  // item.product_price = parseInt(addonPrice) + parseInt(variantPrice);
  item.product_price = parseInt(variantPrice);

  let chili = [];
  if (item?.chili_level != 'no') {
    for (let i = 0; i < parseInt(item?.chili_level); i++) {
      // console.log('push method executres ->>>> ', item?.chili_level);
      chili.push(
        <View key={i}>
          <Image
            source={icons.chilli_level}
            style={{
              width: 10,
              height: 10,
            }}
          />
        </View>,
      );
    }
  }

  return (
    <View
      style={{
        margin: 10,
        padding: 10,
        backgroundColor: COLORS.white,
        borderRadius: 10,
        elevation: 10,
      }}>
      <View
        activeOpacity={0.8}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: '100%',
            // flex: 1,
            // backgroundColor: COLORS.black,
          }}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Image
              source={item?.type == 'veg' ? icons.pure_veg : icons.non_pure_veg}
              style={{
                width: 10,
                height: 10,
              }}
            />
            <Text
              style={{
                fontSize: 16,
                color: COLORS.black,
                fontFamily: 'Segoe UI Bold',
                marginStart: horizScale(10),
                marginTop: -3,

                marginEnd: 10,
              }}>
              {item?.product_name}
              {chili}
            </Text>
          </View>

          {item?.customizable === 'true'
            ? item?.variants?.map(it =>
                it?.added == true ? (
                  <View
                    style={{
                      // backgroundColor: COLORS.red,
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginVertical: 5,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View style={{flex: 1, paddingRight: 10}}>
                        <Text
                          style={{
                            color: COLORS.black,
                            fontFamily: 'Segoe UI',
                            fontSize: 15,
                            marginStart: horizScale(20),
                          }}>
                          {it?.variant_name}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: COLORS.black,
                            fontFamily: 'Segoe UI',
                            marginStart: horizScale(20),
                          }}>
                          ₹{it?.variant_price}
                        </Text>

                        {/* <View
                          style={{
                            flexDirection: 'row',
                            marginStart: 'auto',
                            alignSelf: 'flex-end',
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              marginEnd: 15,
                              marginStart: 10,
                              borderRadius: 15,
                              borderWidth: 1,
                              borderColor: COLORS.primary,
                              width: 85,
                              alignItems: 'center',
                            }}>
                            <TouchableOpacity
                              onPress={() => {
                                onMinus(item?.product_id, it?.variant_id);
                              }}>
                              <View
                                style={[
                                  {
                                    paddingTop: 2,
                                    paddingBottom: 2,
                                    paddingEnd: 2,
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    borderColor: COLORS.primary,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginStart: -1,
                                  },
                                ]}>
                                <Image
                                  source={icons.minus}
                                  style={{
                                    width: 15,
                                    height: 15,
                                    marginStart: 2,
                                  }}
                                />
                              </View>
                            </TouchableOpacity>
                            <Text
                              style={{
                                fontSize: 16,
                                color: COLORS.black,
                                paddingHorizontal: 5,
                              }}>
                              {it?.qty}
                            </Text>
                            <TouchableOpacity
                              onPress={() => {
                                onPlus(item?.product_id, it?.variant_id);
                              }}>
                              <View
                                style={[
                                  {
                                    paddingTop: 2,
                                    paddingBottom: 2,
                                    paddingStart: 2,
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    borderColor: COLORS.primary,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginEnd: -1,
                                  },
                                ]}>
                                <Image
                                  source={icons.plus}
                                  style={{
                                    width: 15,
                                    height: 15,
                                    marginEnd: 2,
                                  }}
                                />
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View> */}
                      </View>
                    </View>
                  </View>
                ) : null,
              )
            : null}

          {addonCount != 0 ? (
            <Text
              style={{
                fontSize: 15,
                color: COLORS.black,
                fontFamily: 'Segoe UI',
                marginStart: horizScale(20),
                marginTop: 5,
              }}>
              Addons{' '}
            </Text>
          ) : null}
          {item?.addons?.map(it =>
            it?.added == true ? (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    // backgroundColor: 'red',
                    marginVertical: 5,
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: COLORS.darkGray,
                      fontFamily: 'Segoe UI',
                      // marginStart: 5,
                      marginStart: horizScale(20),
                    }}>
                    {it?.addon}
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: COLORS.black,
                        fontFamily: 'Segoe UI',
                        marginStart: horizScale(20),
                      }}>
                      ₹{it?.price}
                    </Text>
                  </View>
                </View>
              </>
            ) : null,
          )}
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'flex-end',
          marginTop: 5,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginEnd: 15,
            marginStart: 10,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: COLORS.primary,
            width: 85,
            alignItems: 'center',
            paddingVertical: 3,
          }}>
          <TouchableOpacity
            onPress={() => {
              onMinus(item?.product_id);
            }}>
            {/* <View
              style={[
                {
                  paddingTop: 2,
                  paddingBottom: 2,
                  paddingEnd: 2,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: COLORS.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginStart: -1,
                },
              ]}>
              <Image
                source={icons.minus}
                style={{
                  width: 15,
                  height: 15,
                  marginStart: 2,
                }}
              />
            </View> */}
            <FontAwesome
              name="minus"
              color={COLORS.primary}
              size={18}
              style={{
                marginStart: 5,
              }}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 16,
              color: COLORS.primary,
              fontFamily: 'Segoe UI Bold',
              paddingHorizontal: 5,
            }}>
            {item?.product_qty}
          </Text>
          <TouchableOpacity
            onPress={() => {
              onPlus(item?.product_id);
            }}>
            {/* <View
              style={[
                {
                  paddingTop: 2,
                  paddingBottom: 2,
                  paddingStart: 2,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: COLORS.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginEnd: -1,
                },
              ]}>
              <Image
                source={icons.plus}
                style={{
                  width: 15,
                  height: 15,
                  marginEnd: 2,
                }}
              />
            </View> */}
            <FontAwesome
              name="plus"
              color={COLORS.primary}
              size={18}
              style={{
                marginEnd: 5,
              }}
            />
          </TouchableOpacity>
        </View>
        <Text
          style={{
            fontSize: horizScale(20),
            color: COLORS.black,
            marginTop: 2.5,
            fontFamily: 'Segoe UI Bold',
            // paddingHorizontal: 10,
            paddingStart: 10,
          }}>
          ₹
          {parseInt(item?.product_qty) * parseInt(item?.product_price) +
            parseInt(addonPrice)}
          .00
        </Text>
      </View>
    </View>
  );
};

export default CartCardView;

const styles = StyleSheet.create({});

export const CartSkeleton = () => {
  return (
    <View>
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        height={25}
        width={Dimensions.get('window').width - 15}
        style={{
          margin: 10,
          borderRadius: 5,
          alignSelf: 'center',
        }}
      />
      <View>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={15}
          width={Dimensions.get('window').width - 20}
          style={{
            marginTop: 5,
            marginHorizontal: 5,
            borderRadius: 5,
            alignSelf: 'center',
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={20}
          width={Dimensions.get('window').width - 100}
          style={{
            marginTop: 5,
            borderRadius: 5,
            // alignSelf: 'center',
            marginStart: 10,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={15}
          width={Dimensions.get('window').width - 70}
          style={{
            marginTop: 5,

            borderRadius: 5,
            // alignSelf: 'center',
            marginStart: 10,
          }}
        />
      </View>
      <View
        style={{
          marginTop: 10,
        }}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={15}
          width={Dimensions.get('window').width - 80}
          style={{
            marginTop: 5,
            marginHorizontal: 5,
            borderRadius: 5,
            // alignSelf: 'center',
            marginStart: 10,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={20}
          width={Dimensions.get('window').width - 20}
          style={{
            marginTop: 5,
            borderRadius: 5,
            // alignSelf: 'center',
            marginStart: 10,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={15}
          width={Dimensions.get('window').width - 60}
          style={{
            marginTop: 5,

            borderRadius: 5,
            // alignSelf: 'center',
            marginStart: 10,
          }}
        />
      </View>
      <View
        style={{
          marginTop: 10,
        }}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={15}
          width={Dimensions.get('window').width - 100}
          style={{
            marginTop: 5,
            marginHorizontal: 5,
            borderRadius: 5,
            // alignSelf: 'center',
            marginStart: 10,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={20}
          width={Dimensions.get('window').width - 50}
          style={{
            marginTop: 5,
            borderRadius: 5,
            // alignSelf: 'center',
            marginStart: 10,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={15}
          width={Dimensions.get('window').width - 30}
          style={{
            marginTop: 5,

            borderRadius: 5,
            // alignSelf: 'center',
            marginStart: 10,
          }}
        />
      </View>
      <View
        style={{
          marginTop: 10,
        }}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={15}
          width={Dimensions.get('window').width - 80}
          style={{
            marginTop: 5,
            marginHorizontal: 5,
            borderRadius: 5,
            // alignSelf: 'center',
            marginStart: 10,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={20}
          width={Dimensions.get('window').width - 20}
          style={{
            marginTop: 5,
            borderRadius: 5,
            // alignSelf: 'center',
            marginStart: 10,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={15}
          width={Dimensions.get('window').width - 60}
          style={{
            marginTop: 5,

            borderRadius: 5,
            // alignSelf: 'center',
            marginStart: 10,
          }}
        />
      </View>

      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        height={25}
        width={Dimensions.get('window').width - 20}
        style={{
          marginTop: 15,

          borderRadius: 5,
          // alignSelf: 'center',
          marginStart: 10,
        }}
      />
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        height={25}
        width={Dimensions.get('window').width - 20}
        style={{
          marginTop: 15,

          borderRadius: 5,
          // alignSelf: 'center',
          marginStart: 10,
        }}
      />
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        height={25}
        width={Dimensions.get('window').width - 20}
        style={{
          marginTop: 15,

          borderRadius: 5,
          // alignSelf: 'center',
          marginStart: 10,
        }}
      />
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        height={25}
        width={Dimensions.get('window').width - 20}
        style={{
          marginTop: 15,

          borderRadius: 5,
          // alignSelf: 'center',
          marginStart: 10,
        }}
      />
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        height={15}
        width={Dimensions.get('window').width - 100}
        style={{
          marginTop: 15,

          borderRadius: 5,
          // alignSelf: 'center',
          marginStart: 10,
        }}
      />

      <View
        style={{
          flexDirection: 'row',
        }}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={80}
          width={90}
          style={{
            marginStart: 20,
            marginTop: 15,

            borderRadius: 5,
            // alignSelf: 'center',
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={80}
          width={90}
          style={{
            marginStart: 10,
            marginTop: 15,

            borderRadius: 5,
            // alignSelf: 'center',
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={80}
          width={90}
          style={{
            marginStart: 10,
            marginTop: 15,

            borderRadius: 5,
            // alignSelf: 'center',
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={80}
          width={90}
          style={{
            marginStart: 10,
            marginTop: 15,

            borderRadius: 5,
            // alignSelf: 'center',
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={80}
          width={90}
          style={{
            marginStart: 10,
            marginTop: 15,

            borderRadius: 5,
            // alignSelf: 'center',
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={80}
          width={90}
          style={{
            marginStart: 10,
            marginTop: 15,

            borderRadius: 5,
            // alignSelf: 'center',
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={80}
          width={90}
          style={{
            marginStart: 10,
            marginTop: 15,

            borderRadius: 5,
            // alignSelf: 'center',
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={80}
          width={90}
          style={{
            marginStart: 10,
            marginTop: 15,

            borderRadius: 5,
            // alignSelf: 'center',
          }}
        />
      </View>

      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        height={20}
        width={Dimensions.get('window').width - 20}
        style={{
          marginTop: 25,

          borderRadius: 5,
          // alignSelf: 'center',
          marginStart: 10,
        }}
      />
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        height={25}
        width={Dimensions.get('window').width - 20}
        style={{
          marginTop: 10,

          borderRadius: 5,
          // alignSelf: 'center',
          marginStart: 10,
        }}
      />

      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        height={15}
        width={Dimensions.get('window').width - 20}
        style={{
          marginTop: 25,

          borderRadius: 5,
          // alignSelf: 'center',
          marginStart: 10,
        }}
      />
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        height={15}
        width={Dimensions.get('window').width - 100}
        style={{
          marginTop: 10,

          borderRadius: 5,
          // alignSelf: 'center',
          marginStart: 10,
        }}
      />
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        height={15}
        width={Dimensions.get('window').width - 90}
        style={{
          marginTop: 10,

          borderRadius: 5,
          // alignSelf: 'center',
          marginStart: 10,
        }}
      />

      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        height={15}
        width={Dimensions.get('window').width - 35}
        style={{
          marginTop: 10,

          borderRadius: 5,
          // alignSelf: 'center',
          marginStart: 10,
        }}
      />

      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        height={15}
        width={Dimensions.get('window').width - 70}
        style={{
          marginTop: 10,

          borderRadius: 5,
          // alignSelf: 'center',
          marginStart: 10,
        }}
      />

      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        height={15}
        width={Dimensions.get('window').width - 55}
        style={{
          marginVertical: 10,

          borderRadius: 5,
          // alignSelf: 'center',
          marginStart: 10,
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={2}
          width={10}
          style={{
            marginTop: 10,

            borderRadius: 5,
            // alignSelf: 'center',
            marginStart: 15,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={2}
          width={10}
          style={{
            marginTop: 10,

            borderRadius: 5,
            // alignSelf: 'center',
            marginStart: 10,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={2}
          width={10}
          style={{
            marginTop: 10,

            borderRadius: 5,
            // alignSelf: 'center',
            marginStart: 10,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={2}
          width={10}
          style={{
            marginTop: 10,

            borderRadius: 5,
            // alignSelf: 'center',
            marginStart: 10,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={2}
          width={10}
          style={{
            marginTop: 10,

            borderRadius: 5,
            // alignSelf: 'center',
            marginStart: 10,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={2}
          width={10}
          style={{
            marginTop: 10,

            borderRadius: 5,
            // alignSelf: 'center',
            marginStart: 10,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={2}
          width={10}
          style={{
            marginTop: 10,

            borderRadius: 5,
            // alignSelf: 'center',
            marginStart: 10,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={2}
          width={10}
          style={{
            marginTop: 10,

            borderRadius: 5,
            // alignSelf: 'center',
            marginStart: 10,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={2}
          width={10}
          style={{
            marginTop: 10,

            borderRadius: 5,
            // alignSelf: 'center',
            marginStart: 10,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={2}
          width={10}
          style={{
            marginTop: 10,

            borderRadius: 5,
            // alignSelf: 'center',
            marginStart: 10,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={2}
          width={10}
          style={{
            marginTop: 10,

            borderRadius: 5,
            // alignSelf: 'center',
            marginStart: 10,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={2}
          width={10}
          style={{
            marginTop: 10,

            borderRadius: 5,
            // alignSelf: 'center',
            marginStart: 10,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={2}
          width={10}
          style={{
            marginTop: 10,

            borderRadius: 5,
            // alignSelf: 'center',
            marginStart: 10,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={2}
          width={10}
          style={{
            marginTop: 10,

            borderRadius: 5,
            // alignSelf: 'center',
            marginStart: 10,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={2}
          width={10}
          style={{
            marginTop: 10,

            borderRadius: 5,
            // alignSelf: 'center',
            marginStart: 10,
          }}
        />

        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={2}
          width={10}
          style={{
            marginTop: 10,

            borderRadius: 5,
            // alignSelf: 'center',
            marginStart: 10,
          }}
        />

        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={2}
          width={10}
          style={{
            marginTop: 10,

            borderRadius: 5,
            // alignSelf: 'center',
            marginStart: 10,
          }}
        />

        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={2}
          width={10}
          style={{
            marginTop: 10,

            borderRadius: 5,
            // alignSelf: 'center',
            marginStart: 10,
          }}
        />

        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          height={2}
          width={10}
          style={{
            marginTop: 10,

            borderRadius: 5,
            // alignSelf: 'center',
            marginStart: 10,
          }}
        />
      </View>
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        height={25}
        width={Dimensions.get('window').width - 20}
        style={{
          marginTop: 20,

          borderRadius: 5,
          // alignSelf: 'center',
          marginStart: 10,
        }}
      />

      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        height={15}
        width={Dimensions.get('window').width - 200}
        style={{
          marginTop: 20,

          borderRadius: 5,
          // alignSelf: 'center',
          marginStart: 10,
        }}
      />

      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        height={15}
        width={Dimensions.get('window').width - 70}
        style={{
          marginTop: 10,

          borderRadius: 5,
          // alignSelf: 'center',
          marginStart: 10,
        }}
      />
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        height={15}
        width={Dimensions.get('window').width - 250}
        style={{
          marginTop: 10,

          borderRadius: 5,
          // alignSelf: 'center',
          marginStart: 10,
        }}
      />

      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        height={15}
        width={Dimensions.get('window').width - 200}
        style={{
          marginTop: 20,

          borderRadius: 5,
          // alignSelf: 'center',
          marginStart: 10,
        }}
      />

      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        height={15}
        width={Dimensions.get('window').width - 70}
        style={{
          marginTop: 10,

          borderRadius: 5,
          // alignSelf: 'center',
          marginStart: 10,
        }}
      />
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        height={15}
        width={Dimensions.get('window').width - 250}
        style={{
          marginTop: 10,

          borderRadius: 5,
          // alignSelf: 'center',
          marginStart: 10,
        }}
      />

      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        height={15}
        width={Dimensions.get('window').width - 200}
        style={{
          marginTop: 20,

          borderRadius: 5,
          // alignSelf: 'center',
          marginStart: 10,
        }}
      />

      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        height={15}
        width={Dimensions.get('window').width - 70}
        style={{
          marginTop: 10,

          borderRadius: 5,
          // alignSelf: 'center',
          marginStart: 10,
        }}
      />
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        height={15}
        width={Dimensions.get('window').width - 250}
        style={{
          marginTop: 10,

          borderRadius: 5,
          // alignSelf: 'center',
          marginStart: 10,
        }}
      />

      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        height={15}
        width={Dimensions.get('window').width - 200}
        style={{
          marginTop: 20,

          borderRadius: 5,
          // alignSelf: 'center',
          marginStart: 10,
        }}
      />

      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        height={15}
        width={Dimensions.get('window').width - 70}
        style={{
          marginTop: 10,

          borderRadius: 5,
          // alignSelf: 'center',
          marginStart: 10,
        }}
      />
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        height={15}
        width={Dimensions.get('window').width - 250}
        style={{
          marginTop: 10,

          borderRadius: 5,
          // alignSelf: 'center',
          marginStart: 10,
        }}
      />

      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        height={50}
        width={Dimensions.get('window').width - 20}
        style={{
          marginVertical: 20,

          borderRadius: 5,
          // alignSelf: 'center',
          marginStart: 10,
        }}
      />
    </View>
  );
};

/**
 https://web10technologies.com/Chelab_full_project/public/api/get-cart

 {
    "user_id": "3"
}

{
    "status": true,
    "message": "Data Get Successfully",
    "response": {
        "cart": {
            "user_id": 3,
            "vendor_id": 1,
            "id": 84,
            "products": [
                {
                    "id": 3,
                    "cart_id": 84,
                    "product_id": 1,
                    "product_qty": 6,
                    "created_at": "2022-11-19T19:56:44.000000Z",
                    "updated_at": "2022-11-19T20:17:58.000000Z"
                },
                {
                    "id": 23,
                    "cart_id": 84,
                    "product_id": 2,
                    "product_qty": 5,
                    "created_at": "2022-11-19T21:12:57.000000Z",
                    "updated_at": "2022-11-19T21:26:40.000000Z"
                },
                {
                    "id": 24,
                    "cart_id": 84,
                    "product_id": 2,
                    "product_qty": 1,
                    "created_at": "2022-11-19T23:08:11.000000Z",
                    "updated_at": "2022-11-19T23:08:11.000000Z"
                }
            ],
            "total_product_in_cart": "6"
        }
    }
}

 */
