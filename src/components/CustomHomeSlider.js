import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  Dimensions,
  Pressable,
} from 'react-native';

export default (Preview = ({
  style,
  item,
  imageKey,
  onPress,
  index,
  active,
  local,
}) => {
  return (
    <Pressable
      style={styles.videoContainer}
      onPress={() => onPress(item)}>
      
        <Image
          style={[styles.videoPreview, active ? {} : {height: 200}]}
          source={{uri: item[imageKey]}}
        />
      
    </Pressable>
  );
});

const styles = StyleSheet.create({
  videoContainer: {
    width: Dimensions.get('window').width,
   
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  videoPreview: {
    width: Dimensions.get('window').width,
    height: 200,
    resizeMode: 'cover',
  },

  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});