import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {icons} from '../constants';

const ToolbarWithIcon = ({showShare}) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        height: 56,
        // width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
      }}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}>
        <Image
          source={icons.back}
          style={{
            width: 30,
            height: 30,
            alignSelf: 'center',
            marginHorizontal: 15,
            resizeMode: 'center',
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ToolbarWithIcon;

const styles = StyleSheet.create({});
