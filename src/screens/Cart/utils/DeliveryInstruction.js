import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {COLORS} from '../../../constants';
import {horizScale} from '../../../constants/themes';

const DeliveryInstruction = ({item, onClick}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onClick();
      }}
      activeOpacity={0.8}
      style={{
        borderRadius: 10,
        // backgroundColor: COLORS.rippleColorPrimaryLight,
        backgroundColor: item?.selected ? COLORS.primary : '#e7e7e7',
        padding: 10,
        // minWidth: 100,
        maxWidth: 100,
        alignItems: 'flex-start',
        marginHorizontal: 5,
      }}>
      {/* {item?.selected ? (
        <MaterialCommunityIcons
          name={'checkbox-marked'}
          size={18}
          style={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
          color={COLORS.primary}
        />
      ) : (
        <MaterialCommunityIcons
          name={'checkbox-blank-outline'}
          size={18}
          style={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
          color={COLORS.primary}
        />
      )} */}
      <Image
        source={item?.icon}
        style={{
          width: 18,
          height: 18,
          resizeMode: 'center',
          tintColor: item?.selected ? COLORS.white : COLORS.darkGray,
        }}
      />
      <Text
        style={{
          fontSize: 12,
          color: item?.selected ? COLORS.white : COLORS.darkGray,
          fontFamily: 'Segoe UI',
          marginTop: horizScale(10),
        }}>
        {item?.title}
      </Text>
    </TouchableOpacity>
  );
};

export default DeliveryInstruction;

const styles = StyleSheet.create({});
