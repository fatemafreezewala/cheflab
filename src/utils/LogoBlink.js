import React, {useEffect, useState} from 'react';
import {Animated, Image, Modal, StyleSheet, View} from 'react-native';
import {images} from '../constants';

const LogoBlink = ({timeSeconds, loading}) => {
  const [fadeAnimation, setFadeAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (loading) {
      // Animated.loop(
      //   Animated.sequence([
      //     Animated.timing(fadeAnimation, {
      //       toValue: 0,
      //       duration: timeSeconds,
      //       useNativeDriver: true,
      //     }),
      //     Animated.timing(fadeAnimation, {
      //       toValue: 1,
      //       duration: timeSeconds,
      //       useNativeDriver: true,
      //     }),
      //   ]),
      // ).start();
    }
  }, []);

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={loading}
      onRequestClose={() => {
        console.log('close modal');
      }}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <Animated.View
            style={{
              opacity: loading ? fadeAnimation : 0,
            }}>
            <Image
              source={images.blink_logo}
              style={{
                width: 80,
                height: 80,
              }}
            />
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
};

export default LogoBlink;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000000',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#00000000',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
});
