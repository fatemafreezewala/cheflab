import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Image,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import style from './style';
import {COLORS, icons} from '../../constants';
import ToolbarWithIcon from '../../utils/ToolbarWithIcon';
import LinearGradient from 'react-native-linear-gradient';
import {horizScale, vertScale} from '../../constants/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';
import {ToastAndroid} from 'react-native';
import Loader from '../../utils/Loader';
import {API_END_POINTS} from '../../network/ApiEndpoints';
import ApiCall from '../../network/ApiCall';
import {ShowConsole} from '../../utils/Utility';

var pkg = require('../../../package.json');
// console.log(pkg.version);
const ContactUs = ({navigation, route}) => {
  const [amount, setAmount] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [receivedItem, setReceivedItem] = useState({});

  const [subject, setSubject] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    let {item} = route.params;
    setReceivedItem(item);
    getInfoFromStorage();
  }, []);
  const getInfoFromStorage = async () => {
    let t = '';
    try {
      await AsyncStorage.getItem('token', (err, value) => {
        if (err) {
        } else {
          if (value !== '' && value !== null) {
            t = value;
            setApiToken(value);
          } else {
            setApiToken('');
          }
        }
      });
    } catch (error) {}
  };

  const saveContactUs = () => {
    setLoading(true);
    let body = {
      subject: subject,
      description: feedback,
    };
    ApiCall('post', body, API_END_POINTS.saveContactUs, {
      Authorization: `Bearer ${apiToken}`,
    })
      .then(response => {
        if (response?.data?.status) {
          console.log('hello world -0> ', response?.data);
          alert('Thank you. We will get back to you.');

          setFeedback('');
          setSubject('');
          setLoading(false);
        } else {
        }
      })
      .catch(error => {
        ShowConsole('ERROR  -:> ' + JSON.stringify(error));
      })
      .finally(() => {
        setLoading(false);
      });
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
            flexGrow: 1,
            maxWidth: Dimensions.get('window').width / 2 + 15,
          }}
          numberOfLines={1}>
          {/* Contact Us */}
          Feedback
        </Text>
      </View>
      <Loader loading={loading} />

      <ScrollView
        style={{
          margin: 10,
        }}
        keyboardShouldPersistTaps={'handled'}>
        <Text
          style={{
            fontSize: 16,
            color: COLORS.black,
            fontFamily: 'Segoe UI Bold',
            marginTop: horizScale(5),
            marginStart: horizScale(15),
          }}>
          Name
        </Text>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          placeholder={'Enter amount to recharge wallet'}
          style={{
            margin: 10,
            padding: 10,
            // borderWidth: 1,
            borderBottomWidth: 1,
            borderColor: COLORS.grey,
            fontSize: 16,
            fontSize: 16,
            color: COLORS.black,
            fontFamily: 'Segoe UI',
          }}
          editable={false}
          value={receivedItem?.name}
          keyboardType="number-pad"
        />
        <Text
          style={{
            fontSize: 16,
            color: COLORS.black,
            fontFamily: 'Segoe UI Bold',
            marginTop: horizScale(5),
            marginStart: horizScale(15),
          }}>
          Email
        </Text>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          placeholder={'Enter amount to recharge wallet'}
          style={{
            margin: 10,
            padding: 10,
            // borderWidth: 1,
            borderBottomWidth: 1,
            borderColor: COLORS.grey,
            fontSize: 16,
            color: COLORS.black,
            fontFamily: 'Segoe UI',
          }}
          editable={false}
          value={receivedItem?.email}
          keyboardType="number-pad"
        />
        <Text
          style={{
            fontSize: 16,
            color: COLORS.black,
            fontFamily: 'Segoe UI',
            marginTop: horizScale(5),
            marginStart: horizScale(15),
          }}>
          Mobile
        </Text>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          placeholder={'Enter amount to recharge wallet'}
          style={{
            margin: 10,
            padding: 10,
            // borderWidth: 1,
            borderBottomWidth: 1,
            borderColor: COLORS.grey,
            fontSize: 16,
            color: COLORS.black,
            fontFamily: 'Segoe UI',
          }}
          editable={false}
          value={receivedItem?.mobile}
          keyboardType="number-pad"
        />
        <Text
          style={{
            fontSize: 16,
            color: COLORS.black,
            fontFamily: 'Segoe UI Bold',
            marginTop: horizScale(5),
            marginStart: horizScale(15),
          }}>
          Subject
        </Text>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          placeholder={'Subject'}
          style={{
            margin: 10,
            padding: 10,
            // borderWidth: 1,
            borderBottomWidth: 1,
            borderColor: COLORS.grey,
            fontSize: 16,
            color: COLORS.black,
            fontFamily: 'Segoe UI',
          }}
          onChangeText={v => {
            setSubject(v);
          }}
          maxLength={50}
          multiline={true}
          value={subject}
          keyboardType="default"
        />
        <Text
          style={{
            fontSize: 16,
            color: COLORS.black,
            fontFamily: 'Segoe UI Bold',
            marginTop: horizScale(5),
            marginStart: horizScale(15),
          }}>
          Description
        </Text>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          placeholder={'Description'}
          style={{
            margin: 10,
            padding: 10,
            // borderWidth: 1,
            borderBottomWidth: 1,
            borderColor: COLORS.grey,
            fontSize: 16,
            color: COLORS.black,
            fontFamily: 'Segoe UI',
          }}
          maxLength={250}
          multiline={true}
          onChangeText={v => {
            setFeedback(v);
          }}
          value={feedback}
          keyboardType="default"
        />

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.reqOtpBtn}
          onPress={() => {
            if (subject && feedback) {
              setLoading(true);
              // setTimeout(() => {
              saveContactUs();

              // }, 1000);
            } else {
              Platform.OS == 'android'
                ? ToastAndroid.showWithGravity(
                    'Please fill all fields',
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                  )
                : null;
            }
          }}>
          <Text style={styles.reqOtpText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ContactUs;

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
