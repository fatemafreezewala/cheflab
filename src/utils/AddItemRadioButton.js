import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {COLORS, icons} from '../constants';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function RadioButtons({
  options,
  selectedOption,
  onSelect,
  onMinus,
  onPlus,
  var_count,
  mainData,
  itemIndex,
}) {
  return (
    <View>
      {options.map((item, index) => {
        return (
          <View
            key={item.variant_name}
            style={{paddingLeft: 24, paddingRight: 6}}>
            <View style={[styles.rowView, {marginTop: 15}]}>
              <View style={{flex: 1, paddingRight: 10}}>
                <Text style={[styles.sizeText]}>{item?.variant_name}</Text>
              </View>
              {selectedOption &&
                selectedOption.variant_name === item.variant_name && (
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
                    }}>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                      }}
                      onPress={() => {
                        onMinus(item.id || '', options, mainData, index);
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
                        size={15}
                        style={{
                          marginStart: 5,
                        }}
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontSize: 16,
                        color: COLORS.primary,
                        paddingHorizontal: 5,
                        fontFamily: 'Segoe UI Bold',
                      }}>
                      {/* {parseInt(item?.cart_variant_qty) == 0
                        ? parseInt(item?.cart_variant_qty) + 1
                        : parseInt(item?.cart_variant_qty)} */}
                      {item?.qty}
                    </Text>
                    <TouchableOpacity
                      style={{
                        // paddingStart: 2,
                        flexDirection: 'row',
                        // paddingEnd: 3,
                      }}
                      onPress={() => {
                        onPlus(item.id || '', options, mainData, index);
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
                        size={15}
                        style={{
                          marginEnd: 5,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              <TouchableOpacity
                onPress={() => {
                  onSelect(item, index);
                }}
                style={{
                  flexDirection: 'row',
                }}>
                <Text style={[styles.sizeText, {marginEnd: 10}]}>
                  ₹ {item?.variant_price}
                </Text>
                <TouchableOpacity
                  style={styles.circle}
                  onPress={() => {
                    onSelect(item, index);
                  }}>
                  {selectedOption &&
                    selectedOption.variant_name === item.variant_name && (
                      <View style={styles.checkedCircle} />
                    )}
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  sizeText: {
    color: COLORS.black,
    fontFamily: 'Segoe UI',
    fontSize: 15,
  },
  circle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ACACAC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  checkedCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.primary,
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
