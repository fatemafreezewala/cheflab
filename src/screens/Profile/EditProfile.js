import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Modal,
  ScrollView,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {COLORS, icons, images, STRINGS} from '../../constants';
import ApiCall from '../../network/ApiCall';
import {API_END_POINTS} from '../../network/ApiEndpoints';
import CustomEditText from '../../utils/EditText/CustomEditText';
import ToolbarWithIcon from '../../utils/ToolbarWithIcon';
import {
  ShowMessage,
  validateEmail,
  validateFieldNotEmpty,
} from '../../utils/Utility';
import style from './style';
import Loader from '../../utils/Loader';
import ImagePicker from 'react-native-image-crop-picker';
import {PermissionsAndroid} from 'react-native';
import {Platform} from 'react-native';

// image api code start
// import ImagePicker from 'react-native-image-crop-picker';
/**
 * 
 * 
const openImagePicker = () => {
    ImagePicker.openPicker({
      multiple: false,
      cropping: true,
    }).then(images => {
      setImage(images.path);
    });
  };

  const openCameraPicker = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(images => {
      setImage(images.path);
    });
  };

  const [image, setImage] = useState();

 const isPermitted = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs access to Camera to upload profile photo',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        alert('Write permission err', err);
        return false;
      }
    } else {
      return true;
    }
  };
// image api code end

*/

const EditProfile = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);

  const [apiToken, setApiToken] = useState('');
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false);

  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState(false);

  const [mobile, setMobile] = useState('');
  const [mobileError, setMobileError] = useState(false);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);

  const [alternateMobile, setAlternateMobile] = useState('');
  const [alternateMobileError, setAlternateMobileError] = useState(false);

  const [enableEdit, setEnableEdit] = useState(false);

  const [showCameraModal, setShowCameraModal] = useState(false);

  const [receivedItem, setReceivedItem] = useState({});

  const [image, setImage] = useState();

  const isPermitted = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs access to Camera to upload profile photo',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        alert('Write permission err', err);
        return false;
      }
    } else {
      return true;
    }
  };

  const openImagePicker = () => {
    ImagePicker.openPicker({
      multiple: false,
      cropping: true,
    }).then(images => {
      setImage(images.path);
    });
  };

  const openCameraPicker = () => {
    try {
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
      }).then(images => {
        setImage(images.path);
      });
    } catch (error) {
      console.log('ero  in camera open-> ,', JSON.stringify(error));
    }
  };

  useEffect(() => {
    let {item} = route.params;

    setEmail(item?.email);
    setName(item?.name);
    setLastName(item?.surname);
    setMobile(item?.mobile);
    setAlternateMobile(item?.alternative_number);
    setImage(item?.image);
    setApiToken(item?.apiToken);
    setReceivedItem(item);
  }, []);

  const handleContinue = () => {
    if (validateFieldNotEmpty(name)) {
      setNameError(true);
      ShowMessage('Please enter first name');
    } else if (validateFieldNotEmpty(lastName)) {
      setLastNameError(true);
      ShowMessage('Please enter last name');
    } else if (validateFieldNotEmpty(email)) {
      setEmailError(true);
      ShowMessage('Please enter email');
    } else if (!validateEmail(email)) {
      setEmailError(true);
      ShowMessage('Please enter valid email');
    }
    // else if (validateFieldNotEmpty(alternateMobile)) {
    //   setAlternateMobileError(true);
    //   ShowMessage('Please enter alternate mobile number');
    // }
    else {
      // if (alternateMobile != '' && alternateMobile.length <= 10) {
      //   if (alternateMobile.length < 10) {
      //     ShowMessage('Please enter valid mobile number');
      //   }
      //   ShowMessage('Please enter alternate mobile number');
      // } else {
      setLoading(true);
      // let payload = {
      //   id: receivedItem?.userId,
      //   name: name,
      //   email: email,
      //   alternative_number: alternateMobile,
      // };

      const payload = new FormData();
      payload.append('id', receivedItem?.userId);
      payload.append('name', name);
      payload.append('lastname', lastName);
      payload.append('email', email);
      payload.append('alternative_number', alternateMobile);
      payload.append('image', {
        uri: image,
        name: 'profile_pic',
        type: 'image/jpeg',
      });

      console.log(
        'data passed inn api continue page => ',
        JSON.stringify(payload),
      );
      ApiCall('post', payload, API_END_POINTS.updateUserProfile, {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'multipart/form-data',
      })
        .then(response => {
          console.log(
            'RESPONSE OF API continue page=> ',
            JSON.stringify(response),
          );
          if (response?.data?.status) {
            // console.log(
            //   'RESPONSE OF API continue page=> 11 ',
            //   JSON.stringify(response),
            // );
            setLoading(false);
            ShowMessage(response?.data?.message);
            setEnableEdit(false);
          } else {
            setLoading(false);
            // console.log(
            //   'RESPONSE OF API continue page=> 22 ',
            //   JSON.stringify(response),
            // );
            ShowMessage(response?.data?.message);
          }
        })
        .catch(error => {
          setLoading(false);
          setEnableEdit(false);

          console.log(
            'Error in sign up send otp api=> ',
            JSON.stringify(error),
          );
        })
        .finally(() => {
          console.log('RESPONSE OF API continue page=> 33');
          setLoading(false);
        });
    }
    // }
  };

  const pickImageModal = () => {
    return (
      <Modal
        transparent={true}
        animationType={'none'}
        visible={showCameraModal}
        onRequestClose={() => {
          setShowCameraModal(false);
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
            onPress={() => setShowCameraModal(false)}
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
              // backgroundColor: COLORS.cartCountBgColor,
            }}></TouchableOpacity>

          <View style={style.additemView}>
            <ScrollView
              style={[
                style.middleView,
                {
                  paddingTop: 10,
                  paddingHorizontal: 10,
                },
              ]}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Text
                  style={[
                    style.addressText,
                    {
                      marginBottom: 10,
                      marginTop: 5,
                      marginStart: 15,

                      fontSize: 20,
                      fontFamily: 'Segoe UI Bold',
                      textAlign: 'center',
                      // marginVertical: 10,
                      color: COLORS.black,
                    },
                  ]}>
                  Choose
                </Text>
                <FontAwesome
                  name="close"
                  size={20}
                  color={COLORS.black}
                  style={{
                    position: 'absolute',
                    top: 5,
                    right: 10,
                  }}
                  onPress={() => {
                    setShowCameraModal(false);
                  }}
                />
              </View>

              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  flexDirection: 'row',
                }}>
                {/* <TouchableOpacity
                  onPress={() => {
                    setShowCameraModal(false);
                    if (isPermitted()) {
                      openCameraPicker();
                    }
                  }}
                  activeOpacity={0.8}
                  style={{
                    padding: 10,
                    marginVertical: 10,
                    marginHorizontal: 30,
                    alignItems: 'center',
                    backgroundColor: COLORS.white,
                  }}>
                  <Image
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/512/1042/1042339.png',
                    }}
                    style={{
                      width: 50,
                      height: 50,
                      margin: 5,
                    }}
                  />
                  <Text>Camera</Text>
                </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() => {
                    setShowCameraModal(false);
                    openImagePicker();
                  }}
                  activeOpacity={0.8}
                  style={{
                    padding: 10,
                    marginVertical: 10,
                    marginHorizontal: 30,
                    alignItems: 'center',
                    backgroundColor: COLORS.white,
                  }}>
                  <Image
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/128/2659/2659360.png',
                    }}
                    style={{
                      width: 50,
                      height: 50,
                      margin: 5,
                    }}
                  />
                  <Text>Gallery</Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  padding: 11,
                  backgroundColor: COLORS.white,
                }}></View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={style.mainContainer}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: COLORS.white,
          elevation: 10,
        }}>
        <ToolbarWithIcon showShare={false} />
        <Text
          style={{
            fontSize: 18,
            fontFamily: 'Segoe UI Bold',
            color: COLORS.black,
            // flex: 1,
            flexGrow: 1,
            // maxWidth: Dimensions.get('window').width / 2 + 15,
          }}
          numberOfLines={1}>
          {enableEdit ? 'Edit' : 'View'} Profile
        </Text>
        <FontAwesome
          size={22}
          name="edit"
          color={COLORS.black}
          style={{
            marginEnd: 15,
          }}
          onPress={() => {
            setEnableEdit(!enableEdit);
          }}
        />
      </View>

      <Loader loading={loading} />

      <ScrollView
        keyboardShouldPersistTaps={'handled'}
        style={{
          marginTop: 15,
          marginHorizontal: 10,
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
            // flexDirection: 'row',
            width: 120,
          }}>
          {image ? (
            <View
              style={{
                height: 108,
                width: 108,
                borderRadius: 100,
                justifyContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
                marginTop: 20,
                // marginStart: 20,
                // padding: 5,
                borderWidth: 2,
                borderColor: COLORS.primary,
              }}>
              <Image
                // source={{
                //   uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
                // }}
                source={{uri: image}}
                style={{
                  height: 100,
                  width: 100,
                  // resizeMode: 'center',
                  borderRadius: 100,

                  alignSelf: 'center',
                }}
              />
            </View>
          ) : (
            <View
              style={{
                height: 108,
                width: 108,
                borderRadius: 100,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                marginTop: 20,

                // padding: 5,
                borderWidth: 2,
                borderColor: COLORS.primary,
              }}>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png',
                }}
                // source={images.app_logo}
                style={{
                  height: 100,
                  width: 100,
                  borderRadius: 100,

                  alignSelf: 'center',
                }}
              />
            </View>
          )}

          {enableEdit && (
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 30,
                right: 6,
                backgroundColor: COLORS.primary,
                padding: 5,
                borderRadius: 50,
              }}
              onPress={() => {
                setShowCameraModal(true);
              }}>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/128/45/45010.png',
                }}
                // source={}
                style={{
                  height: 12,
                  width: 12,
                  // resizeMode: 'center',
                  // marginTop: 10,
                  //   marginStart: 20,
                  tintColor: COLORS.white,
                }}
              />
            </TouchableOpacity>
          )}
        </View>

        <CustomEditText
          borderRadius={5}
          star={<Text style={{color: COLORS.red}}>*</Text>}
          borderColor={COLORS.grey}
          borderWidth={1}
          backgroundColor={COLORS.grey}
          label={'First Name'}
          iconPosition="right"
          placeholder={'Enter first name'}
          editable={enableEdit}
          value={name}
          keyBoardType="default"
          onChangeText={value => {
            setName(value);
            setNameError(false);
          }}
          error={nameError ? <Text>{STRINGS.fieldRequired}</Text> : ''}
        />

        <CustomEditText
          borderRadius={5}
          star={<Text style={{color: COLORS.red}}>*</Text>}
          borderColor={COLORS.grey}
          borderWidth={1}
          backgroundColor={COLORS.grey}
          label={'Last Name'}
          iconPosition="right"
          placeholder={'Enter last name'}
          editable={enableEdit}
          value={lastName}
          keyBoardType="default"
          onChangeText={value => {
            setLastName(value);
            setLastNameError(false);
          }}
          error={lastNameError ? <Text>{STRINGS.fieldRequired}</Text> : ''}
        />

        <CustomEditText
          borderRadius={5}
          star={<Text style={{color: COLORS.red}}>*</Text>}
          borderColor={COLORS.grey}
          borderWidth={1}
          backgroundColor={COLORS.grey}
          label={'Email'}
          iconPosition="right"
          placeholder={'Enter email'}
          editable={enableEdit}
          value={email}
          keyBoardType="default"
          onChangeText={value => {
            setEmail(value);
            setEmailError(false);
          }}
          error={emailError ? <Text>{STRINGS.fieldRequired}</Text> : ''}
        />

        <CustomEditText
          borderRadius={5}
          star={<Text style={{color: COLORS.red}}>*</Text>}
          borderColor={COLORS.grey}
          borderWidth={1}
          backgroundColor={COLORS.grey}
          label={'Mobile Number'}
          iconPosition="right"
          placeholder={'Enter mobile'}
          editable={false}
          value={mobile}
          keyBoardType="default"
          onChangeText={value => {
            setMobile(value);
            setMobileError(false);
          }}
          error={mobileError ? <Text>{STRINGS.fieldRequired}</Text> : ''}
        />

        <CustomEditText
          borderRadius={5}
          // star={<Text style={{color: COLORS.red}}>*</Text>}
          borderColor={COLORS.grey}
          borderWidth={1}
          backgroundColor={COLORS.grey}
          label={'Alternative Mobile Number'}
          iconPosition="right"
          placeholder={'Enter number'}
          editable={enableEdit}
          maxLength={10}
          value={alternateMobile}
          keyBoardType="number-pad"
          onChangeText={value => {
            setAlternateMobile(value);
            setAlternateMobileError(false);
          }}
          error={
            alternateMobileError ? <Text>{STRINGS.fieldRequired}</Text> : ''
          }
        />

        {/* {enableEdit ? ( */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.reqOtpBtn}
          // disabled={continueDisable}
          onPress={() => {
            // navigation.navigate('MainContainer');
            if (enableEdit) {
              handleContinue();
            } else {
              Alert.alert(
                'Logout',
                'Are you sure want to logout?',
                [
                  {
                    text: 'Cancel',
                    onPress: () => {
                      return null;
                    },
                  },
                  {
                    text: 'Confirm',
                    onPress: () => {
                      AsyncStorage.clear();
                      navigation.replace('Auth');
                    },
                  },
                ],
                {cancelable: false},
              );
            }
          }}>
          <Text style={styles.reqOtpText}>
            {enableEdit ? 'Update' : 'Logout'}
          </Text>
        </TouchableOpacity>
        {/* ) : null} */}
        <View
          style={{
            padding: 15,
          }}></View>
      </ScrollView>

      {pickImageModal()}
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  reqOtpBtn: {
    alignSelf: 'center',
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    width: 160,
    height: 45,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
  },
  reqOtpText: {
    fontFamily: 'Segoe UI Bold',
    fontSize: 20,
    color: 'rgba(255, 255, 255, 255)',
  },
});
