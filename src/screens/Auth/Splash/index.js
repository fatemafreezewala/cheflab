import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  ImageBackground,
  View,
  Modal,
  TouchableOpacity,
  Text,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useDispatch} from 'react-redux';
import {COLORS, images} from '../../../constants/index';
import ApiCall from '../../../network/ApiCall';
import {API_END_POINTS} from '../../../network/ApiEndpoints';
import {ShowMessage} from '../../../utils/Utility';
import style from '../../Home/style';
var pkg = require('../../../../package.json');
console.log(pkg.version);

const Splash = ({navigation}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      getUserFromStorage();
    }, 3000);
  }, []);

  const getUserFromStorage = async () => {
    try {
      // await AsyncStorage.getItem('cartArray', (err, value) => {
      //   if (err) {
      //   } else {
      //     if (value !== '' && value !== null) {
      //       // navigation.replace('MainContainer');
      //       let a = JSON.parse(value).forEach((item, index) => {
      //         console.log('params  - >> ', JSON.parse(value) + ' ' + index);
      //         // dispatch(addItemToCart(item));
      //       });
      //     } else {
      //       // navigation.replace('Login');
      //     }
      //   }
      // });
      await AsyncStorage.getItem('token', (err, value) => {
        if (err) {
        } else {
          if (value !== '' && value !== null) {
            navigation.replace('MainContainer', {
              screen: 'Home',
              params: {
                intentFromMap: false,
              },
            });
            AsyncStorage.setItem('CHECK_VERSION', 'true');
          } else {
            // navigation.replace('Login');
            navigation.replace('Signup');
          }
        }
      });
    } catch (error) {
      console.log('EXCEPTION IN GETTING INFO -> ' + error);
    }
  };

  const [forceUpdate, setForceUpdate] = useState('0');
  const [softUpdate, setSoftUpdate] = useState('0');
  const [currentVersion, setCurrentVersion] = useState('0');

  // const checkUpdateVersion = () => {
  //   let body = {
  //     version: pkg.version + '',
  //     // version: '1.2',
  //   };
  //   ApiCall('post', body, API_END_POINTS.get_update_version)
  //     .then(response => {
  //       if (response.data.status) {
  //         setForceUpdate(response.data?.data?.force_update);
  //         setCurrentVersion(response.data?.data?.current_version);
  //         setSoftUpdate(response.data?.data?.user_app_soft_update);
  //         if (response.data?.data?.user_app_soft_update === '0') {
  //           navigation.replace('MainContainer', {
  //             screen: 'Home',
  //             params: {
  //               intentFromMap: false,
  //             },
  //           });
  //         } else if (response.data?.data?.force_update === '0') {
  //           navigation.replace('MainContainer', {
  //             screen: 'Home',
  //             params: {
  //               intentFromMap: false,
  //             },
  //           });
  //         } else if (response.data?.data?.user_app_soft_update === '1') {
  //           setShowUpdateModal(true);
  //         } else if (response.data?.data?.force_update === '1') {
  //           setShowUpdateModal(true);
  //         }
  //       } else {
  //       }
  //     })
  //     .catch(error => {})
  //     .finally(() => {});
  // };

  const [showUpdateModal, setShowUpdateModal] = useState(false);

  return (
    <View
      style={{
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        backgroundColor: '#FBFBFB',
      }}>
      <Modal
        transparent={true}
        animationType={'slide'}
        visible={showUpdateModal}
        onRequestClose={() => {
          console.log('close modal');
          setShowUpdateModal(false);
        }}
        style={{flexGrow: 1}}>
        <View
          style={{
            backgroundColor: '#00000090',
            flexGrow: 1,
            justifyContent: 'flex-end',
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setShowUpdateModal(false)}
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}></TouchableOpacity>
          <View style={style.additemView}>
            <View style={style.middleView}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 15,
                }}>
                <Text
                  style={[style.addressText, {marginStart: 20, fontSize: 18}]}>
                  App update available - {currentVersion}
                </Text>
                <FontAwesome
                  name="close"
                  size={20}
                  color={COLORS.black}
                  style={{
                    marginEnd: 25,
                  }}
                  onPress={() => {
                    setShowUpdateModal(false);
                  }}
                />
              </View>
              <Text
                style={{
                  marginVertical: 10,
                  marginHorizontal: 25,
                  fontFamily: 'Segoe UI',
                  fontSize: 16,
                  color: COLORS.black,
                }}>
                App update available, please update the app to use the latest
                version.
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              paddingVertical: 10,
              backgroundColor: COLORS.lightGray,
            }}>
            <View
              style={{
                flexDirection: 'row',
                // alignItems: 'center',
                justifyContent: 'center',
              }}>
              {softUpdate == '1' ? (
                <TouchableOpacity
                  onPress={() => {
                    setShowUpdateModal(false);
                    navigation.replace('MainContainer', {
                      screen: 'Home',
                      params: {
                        intentFromMap: false,
                      },
                    });
                  }}
                  activeOpacity={0.8}
                  style={{
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: COLORS.primary,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginVertical: 5,
                    width: '40%',
                    height: 45,
                    marginHorizontal: 10,
                  }}>
                  <Text
                    style={[
                      {
                        color: COLORS.black,
                        fontSize: 18,
                        fontFamily: 'Segoe UI Bold',
                        textAlign: 'center',
                      },
                    ]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                onPress={() => {
                  if (forceUpdate == '0') {
                    ShowMessage('User will be notified to update the app');
                    navigation.replace('MainContainer', {
                      screen: 'Home',
                      params: {
                        intentFromMap: false,
                      },
                    });
                  }
                }}
                activeOpacity={0.8}
                style={{
                  backgroundColor: COLORS.primary,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginVertical: 5,
                  marginHorizontal: 10,
                  borderRadius: 10,
                  width: softUpdate == '1' ? '40%' : '60%',
                  height: 45,
                }}>
                <Text
                  style={[
                    {
                      color: COLORS.white,
                      fontSize: 18,
                      fontFamily: 'Segoe UI Bold',
                      textAlign: 'center',
                    },
                  ]}>
                  Update
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ImageBackground
        source={images.splash_gif}
        style={{
          width: Dimensions.get('window').width / 1.1,
          height: 300,
        }}></ImageBackground>
    </View>
  );
};
export default Splash;
