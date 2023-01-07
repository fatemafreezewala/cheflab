import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

const ChefOrderBookTable = ({
  title,
  onPress,
  paddingHorizontal,
  height,
  backgroundColor,
  borderRadius,
  marginHorizontal,
  alignItems,
  justifyContent,
  marginVertical,
  textColor,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        onPress();
      }}
      style={{
        paddingHorizontal: paddingHorizontal,
        height: height,
        backgroundColor: backgroundColor,
        borderRadius: borderRadius,
        marginVertical: marginVertical,
        marginHorizontal: marginHorizontal,
        alignItems: alignItems,
        justifyContent: justifyContent,
        flex: 1,
      }}>
      <Text
        style={{
          color: textColor,
          fontSize: 18,
          fontFamily: 'Segoe UI Bold',
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default ChefOrderBookTable;

const styles = StyleSheet.create({});
