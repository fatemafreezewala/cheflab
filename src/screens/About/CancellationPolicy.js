import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView, ScrollView, StyleSheet,
  Text,
  View
} from 'react-native';
import { COLORS } from '../../constants';
import ApiCall from '../../network/ApiCall';
import { API_END_POINTS } from '../../network/ApiEndpoints';
import ToolbarWithIcon from '../../utils/ToolbarWithIcon';
import { ShowConsole } from '../../utils/Utility';
import style from './style';
var pkg = require('../../../package.json');
// console.log(pkg.version);
const CancellationPolicy = ({navigation}) => {
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
    ApiCall('get', null, API_END_POINTS.getCancellationPolicy, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        if (response?.data?.status) {
          // ShowConsole(JSON.stringify(response?.data));
          setData(response?.data?.response[0]?.refund_cancellation_user);
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
            // maxWidth: Dimensions.get('window').width / 2 + 15,
          }}
          numberOfLines={1}>
          Refund & Cancellation Policy
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          margin: 10,
        }}>
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default CancellationPolicy;

const styles = StyleSheet.create({});
