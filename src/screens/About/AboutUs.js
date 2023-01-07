import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import {COLORS} from '../../constants';
import ApiCall from '../../network/ApiCall';
import {API_END_POINTS} from '../../network/ApiEndpoints';
import ToolbarWithIcon from '../../utils/ToolbarWithIcon';
import {ShowConsole} from '../../utils/Utility';
import style from './style';
var pkg = require('../../../package.json');
// console.log(pkg.version);
const AboutUs = ({navigation}) => {
  const [apiToken, setApiToken] = useState('');
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
            getData(value);
          } else {
            setApiToken('');
          }
        }
      });
    } catch (error) {}
  };

  const getData = value => {
    setLoading(true);
    ApiCall('get', null, API_END_POINTS.getAboutUs, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        ShowConsole(
          'getAboutUs api response  =-> ' + JSON.stringify(response?.data),
        );
        if (response?.data?.status) {
          setData(response?.data?.response[0]?.aboutus);
          //   setData('No data available');
        } else {
          setData('No data available');
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
          About Us
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          margin: 10,
        }}>
        {loading ? (
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            activeOpacity={0.8}
            height={Dimensions.get('window').height - 90}
            width={Dimensions.get('window').width - 20}
            style={{
              marginTop: 10,
              marginBottom: 5,
              elevation: 10,
              shadowRadius: 10,
              borderRadius: 10,
            }}></ShimmerPlaceHolder>
        ) : (
          <Text
            style={{
              padding: 10,
              color: COLORS.black,
              fontFamily: 'Segoe UI',
              fontSize: 16,
            }}>
            {/* {JSON.stringify(data)} */}
            {data}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutUs;

const styles = StyleSheet.create({});
