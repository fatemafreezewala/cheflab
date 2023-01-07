import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS, icons, STRINGS} from '../../../constants';
import ApiCall from '../../../network/ApiCall';
import {API_END_POINTS} from '../../../network/ApiEndpoints';
import CustomEditText from '../../../utils/EditText/CustomEditText';
import Loader from '../../../utils/Loader';
import {
  ShowMessage,
  validateEmail,
  validateFieldNotEmpty,
  validateMobileNumber,
} from '../../../utils/Utility';
import style from './style';

const SignupInfo = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);

  const [continueDisable, setContinueDisable] = useState(false);
  const [mobile, setMobile] = useState('');
  useEffect(() => {
    let {item} = route.params;
    // console.log('item ->?>?', JSON.stringify(item));
    setMobile(item?.mobile);
  }, []);

  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false);

  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState(false);

  const [referral, setReferral] = useState('');
  const [referralError, setReferralError] = useState(false);

  const [alternateMobile, setAlternateMobile] = useState('');
  const [alternateMobileError, setAlternateMobileError] = useState(false);

  const handleContinue = () => {
    if (validateFieldNotEmpty(name)) {
      ShowMessage('Please enter first name');
    } else if (validateFieldNotEmpty(lastName)) {
      ShowMessage('Please enter last name');
    } else if (validateFieldNotEmpty(email)) {
      ShowMessage('Please enter email');
    } else if (!validateEmail(email)) {
      ShowMessage('Please enter valid email');
    } else if (!validateFieldNotEmpty(alternateMobile)) {
      if (!validateMobileNumber(alternateMobile)) {
        ShowMessage('Please enter valid mobile number');
      } else {
        setLoading(true);
        setContinueDisable(true);
        let payload = {
          mobile_number: mobile,
          referralcode: referral,
          alternative_mobile: alternateMobile,
          name: name,
          lastname: lastName,
          email: email,
        };
        console.log('data passed inn api => ', JSON.stringify(payload));
        ApiCall('post', payload, API_END_POINTS.registerVerifiedUser)
          .then(response => {
            console.log(
              'RESPONSE OF OTP SEND API => ',
              JSON.stringify(response?.data),
            );
            if (response?.data?.status) {
              setLoading(false);
              ShowMessage(response?.data?.message + '');
              AsyncStorage.setItem('token', response?.data?.token?.token);
              AsyncStorage.setItem(
                'userId',
                response?.data?.token?.user_id + '',
              );
              AsyncStorage.setItem('mobile', mobile + '');

              console.log('userId =>> ', response?.data?.token?.user_id + '');

              // navigation.replace('MainContainer');
              navigation.replace('MainContainer', {
                screen: 'Home',
                params: {
                  intentFromMap: false,
                },
              });
            } else {
              setLoading(false);
              setContinueDisable(false);

              // ShowMessage(response?.data?.error + '');
              ShowMessage('Alternate Mobile Number already exist');
            }
          })
          .catch(error => {
            setContinueDisable(false);

            setLoading(false);
            console.log(
              'Error in sign up send otp api=> ',
              JSON.stringify(error),
            );
          })
          .finally(() => {
            setContinueDisable(false);

            setLoading(false);
          });
      }
    } else {
      setLoading(true);
      setContinueDisable(true);
      let payload = {
        mobile_number: mobile,
        referralcode: referral,
        name: name,
        lastname: lastName,
        alternative_mobile: alternateMobile,
        email: email,
      };
      console.log(
        'data passed inn api continue page => ',
        JSON.stringify(payload),
      );
      ApiCall('post', payload, API_END_POINTS.registerVerifiedUser)
        .then(response => {
          console.log(
            'RESPONSE OF API continue page=> ',
            JSON.stringify(response?.data),
          );
          if (response?.data?.status) {
            setLoading(false);
            setContinueDisable(false);
            ShowMessage(response?.data?.message + '');
            AsyncStorage.setItem('token', response?.data?.token?.token);
            AsyncStorage.setItem('userId', response?.data?.token?.user_id + '');
            AsyncStorage.setItem('mobile', mobile + '');
            console.log('userId =>> ', response?.data?.token?.user_id + '');

            // navigation.replace('MainContainer');
            navigation.replace('MainContainer', {
              screen: 'Home',
              params: {
                intentFromMap: false,
              },
            });
          } else {
            setLoading(false);
            setContinueDisable(false);
            ShowMessage('Sign up failed');
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

  return (
    <ScrollView
      style={style.mainContainer}
      keyboardShouldPersistTaps={'handled'}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      <Loader loading={loading} />
      <View style={style.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Image style={[style.edit]} source={icons.back_arrow} />
        </TouchableOpacity>
        <Text style={style.loginHeader}>{STRINGS.signup}</Text>
        <View style={style.line} />
      </View>
      <View style={style.faltuText}>
        <Text style={[style.loginHeader, {fontSize: 18}]}>
          {STRINGS.almostThere}
        </Text>
        <Text
          style={[
            style.loginHeader,
            {fontSize: 16, fontFamily: 'Segoe UI', marginTop: 5},
          ]}>
          {STRINGS.bitMore}
        </Text>
      </View>
      {/* <Text style={[style.loginHeader, {fontSize: 16, marginTop: 15}]}>
        {STRINGS.awesomeWhat}
      </Text> */}
      <View
        style={{
          marginTop: 15,
          marginHorizontal: 10,
        }}>
        <CustomEditText
          borderRadius={5}
          star={<Text style={{color: COLORS.red}}>*</Text>}
          borderColor={COLORS.grey}
          borderWidth={1}
          backgroundColor={COLORS.grey}
          label={'First Name'}
          iconPosition="right"
          placeholder={STRINGS.nameHint}
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
          placeholder={STRINGS.nameHint}
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
          label={STRINGS.email}
          iconPosition="right"
          placeholder={STRINGS.emailHint}
          value={email}
          keyBoardType="email-address"
          onChangeText={value => {
            setEmail(value);
            setEmailValid(false);
            setEmailError(false);
          }}
          error={
            emailError ? (
              <Text>{STRINGS.fieldRequired}</Text>
            ) : emailValid ? (
              <Text>{STRINGS.invalidEmailAddress}</Text>
            ) : (
              ''
            )
          }
        />

        <CustomEditText
          borderRadius={5}
          star={
            <Text
              style={{
                color: COLORS.grey,
                fontSize: 12,
                fontFamily: 'Segoe UI',
              }}>
              {' '}
              ({STRINGS.optional})
            </Text>
          }
          borderColor={COLORS.grey}
          borderWidth={1}
          backgroundColor={COLORS.grey}
          label={STRINGS.referralCode}
          iconPosition="right"
          placeholder={STRINGS.referralCode}
          value={referral}
          keyBoardType="default"
          onChangeText={value => {
            setReferral(value);
            setReferralError(false);
          }}
          error={
            referralError ? (
              <Text>{STRINGS.fieldRequired}</Text>
            ) : emailValid ? (
              <Text>{STRINGS.invalidEmailAddress}</Text>
            ) : (
              ''
            )
          }
        />
      </View>
      <Text style={[style.loginHeader, {fontSize: 16, paddingStart: 16}]}>
        {STRINGS.alternativeMobile}
      </Text>
      <View style={style.numberContainer}>
        <Text style={style.code}>+91</Text>
        <View style={style.vertLine} />
        <TextInput
          style={style.textInput}
          placeholder="Mobile Number"
          keyboardType="number-pad"
          value={alternateMobile}
          onChangeText={value => {
            setAlternateMobile(value);
          }}
          maxLength={10}
        />
      </View>
      <View style={style.horizLine} />

      <TouchableOpacity
        activeOpacity={0.8}
        style={style.reqOtpBtn}
        // disabled={continueDisable}
        onPress={() => {
          // navigation.navigate('MainContainer');
          handleContinue();
        }}>
        <Text style={style.reqOtpText}>{STRINGS.continue}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
export default SignupInfo;
