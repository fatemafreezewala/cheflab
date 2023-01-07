import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import OtpInputs from 'react-native-otp-inputs';
import {COLORS, icons, STRINGS} from '../../../constants';
import ApiCall from '../../../network/ApiCall';
import {API_END_POINTS} from '../../../network/ApiEndpoints';
import Loader from '../../../utils/Loader';
import {
  ShowMessage,
  validateFieldNotEmpty,
  validateMobileNumber,
} from '../../../utils/Utility';
import style from './style';

const Signup = ({navigation}) => {
  const [showOtp, setShowOtp] = useState(false);
  const [reqOtpDisable, setReqOtpDisable] = useState(false);
  const [continueDisable, setContinueDisable] = useState(false);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [code, setCode] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [mobileValid, setMobileValid] = useState('');
  const [counter, setCounter] = React.useState(59);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const otpInput = useRef(null);
  const [loading, setLoading] = useState(false);
  const handleSendOtp = () => {
    if (validateFieldNotEmpty(mobile)) {
      setMobileError(true);
      ShowMessage('Please enter mobile number');
    } else if (!validateMobileNumber(mobile)) {
      setMobileValid(true);
      ShowMessage('Please enter valid mobile number');
    } else {
      setLoading(true);
      setReqOtpDisable(true);

      let payload = {
        mobile_number: mobile,
      };
      console.log('data passed inn api => ', JSON.stringify(payload));
      ApiCall('post', payload, API_END_POINTS.registerOtpSend)
        .then(response => {
          console.log(
            'RESPONSE OF OTP SEND API => ',
            JSON.stringify(response?.data),
          );
          if (response?.data?.status) {
            setLoading(false);
            setShowOtp(true);
            ShowMessage('OTP Sent Successfully');
            setOtp(response?.data?.otp);
          } else {
            ShowMessage(response?.data?.error + '');
            setReqOtpDisable(false);
            setLoading(false);
            setShowOtp(false);
          }
        })
        .catch(error => {
          setLoading(false);
          setReqOtpDisable(false);

          console.log(
            'Error in sign up send otp api=> ',
            JSON.stringify(error),
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleContinue = () => {
    if (validateFieldNotEmpty(code)) {
      ShowMessage('Please enter OTP');
    } else if (code?.length < 4) {
      ShowMessage('Please enter correct otp');
    } else {
      setLoading(true);
      setContinueDisable(true);

      let payload = {
        mobile_number: mobile,
        otp: '' + code + '',
      };
      console.log('data passed inn api => ', JSON.stringify(payload));
      ApiCall('post', payload, API_END_POINTS.registerVerifyOtp)
        .then(response => {
          console.log(
            'RESPONSE OF OTP SEND API => ',
            JSON.stringify(response?.data),
          );
          if (response?.data?.status) {
            setLoading(false);
            ShowMessage('OTP Verified Successfully');
            navigation.replace('SignupInfo', {
              item: {
                mobile: mobile,
              },
            });
          } else {
            setLoading(false);
            ShowMessage('OTP not Verified');
          }
        })
        .catch(error => {
          setLoading(false);

          console.log(
            'Error in sign up send otp api=> ',
            JSON.stringify(error),
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (showOtpBox) {
      const timer =
        counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [counter, showOtpBox]);
  return (
    <ScrollView
      style={style.mainContainer}
      keyboardShouldPersistTaps={'handled'}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      <Loader loading={loading} />
      <View style={style.header}>
        <Text style={style.loginHeader}>{STRINGS.signup}</Text>
        <View style={style.line} />
      </View>
      <Image style={style.logo} source={icons.login_user_info} />
      <Text style={style.loginHeader}>{STRINGS.please_verify}</Text>
      <View
        style={{
          marginTop: 15,
          width: '100%',
        }}>
        <View
          style={{
            alignItems: 'center',
          }}>
          <View style={style.numberContainer}>
            <Text style={style.code}>+91</Text>
            <View style={style.vertLine} />
            <TextInput
              style={style.textInput}
              placeholder="Mobile Number"
              keyboardType="number-pad"
              value={mobile}
              onChangeText={value => {
                setMobile(value);
              }}
              editable={!reqOtpDisable}
              maxLength={10}
            />
            {showOtp ? (
              <TouchableOpacity
                onPress={() => {
                  setReqOtpDisable(false);
                  setShowOtp(false);
                }}
                style={{position: 'absolute', right: 15}}>
                <Image style={[style.edit]} source={icons.number_edit} />
              </TouchableOpacity>
            ) : null}
          </View>

          <View style={style.horizLine} />
        </View>
      </View>
      <TouchableOpacity
        disabled={reqOtpDisable}
        activeOpacity={0.8}
        style={style.reqOtpBtn}
        onPress={() => {
          // setShowOtp(!showOtp);
          handleSendOtp();
        }}>
        <Text style={style.reqOtpText}>
          {showOtp ? STRINGS.otpSent : STRINGS.requestOTP}
        </Text>
      </TouchableOpacity>
      <View
        style={[
          style.donText,
          {
            marginTop: showOtp ? 30 : 100,
            flexDirection: showOtp ? 'column' : 'row',
          },
        ]}>
        <Text
          style={[
            style.noAccount,
            {
              fontFamily: showOtp ? 'Segoe UI' : 'Segoe UI Bold',
              fontSize: showOtp ? 12 : 16,
            },
          ]}>
          {showOtp
            ? STRINGS.otpSentSuccess + ' +91-' + mobile
            : // : STRINGS.already_registered}
              'Existing User ?'}
        </Text>

        {/* <TouchableOpacity
          onPress={() => {
            if (!showOtp) {
              navigation.navigate('Login');
            } else {
              handleSendOtp();
            }
          }}>
          <Text
            style={[
              style.signup,
              {
                fontSize: showOtp ? 16 : 12,
                marginTop: showOtp ? 15 : 0,
              },
            ]}>
            {showOtp ? STRINGS.resendOtp : STRINGS.login}
          </Text>
        </TouchableOpacity> */}
      </View>
      {!showOtp ? (
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={reqOtpDisable}
          style={[
            style.reqOtpBtn,
            {
              width: 120,
              marginTop: 10,
              backgroundColor: COLORS.white,
              borderColor: COLORS.primary,
              borderWidth: 1,
            },
          ]}
          onPress={() => {
            if (!showOtp) {
              navigation.navigate('Login');
            } else {
              handleSendOtp();
            }
          }}>
          <Text
            style={[
              style.reqOtpText,
              {
                color: COLORS.black,
                fontSize: 16,
              },
            ]}>
            Login
          </Text>
        </TouchableOpacity>
      ) : null}
      {showOtp ? (
        <Text
          style={[
            style.noAccount,
            {
              fontFamily: showOtp ? 'Segoe UI' : 'Segoe UI Bold',
              fontSize: 0,
              textAlign: 'center',
              marginTop: 5,
            },
          ]}>
          {/* your otp is {otp} */}
        </Text>
      ) : null}
      {showOtp ? (
        <>
          <Text style={[style.loginHeader, {marginTop: 25}]}>
            {STRINGS.enter_otp_here}
          </Text>
          <View
            style={{
              alignItems: 'center',
              marginTop: 15,
            }}>
            <OtpInputs
              handleChange={code => setCode(code)}
              numberOfInputs={4}
              inputContainerStyles={{
                borderWidth: 1,
                borderColor: COLORS.grey,
                marginHorizontal: 10,
                width: 50,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                backgroundColor: '#e7e7e7',
              }}
              inputStyles={{
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[style.reqOtpBtn, {width: '90%'}]}
            onPress={() => {
              handleContinue();
            }}>
            <Text style={[style.reqOtpText]}>{STRINGS.continue}</Text>
          </TouchableOpacity>
        </>
      ) : null}
    </ScrollView>
  );
};
export default Signup;
