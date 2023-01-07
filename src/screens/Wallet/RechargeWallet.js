import React, {useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS} from '../../constants';
import ApiCall from '../../network/ApiCall';
import {API_END_POINTS} from '../../network/ApiEndpoints';
import Loader from '../../utils/Loader';
import ToolbarWithIcon from '../../utils/ToolbarWithIcon';
import {ShowMessage} from '../../utils/Utility';
import style from './style';

const RechargeWallet = ({navigation, route}) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState('');

  let uId = route.params.userId;
  let apiToken = route.params.apiToken;

  const rechargeNow = () => {
    let b = {
      user_id: uId + '',
      amount: '' + amount,
      type: '1',
      transaction_id: Date.now().toString(),
    };
    console.log(JSON.stringify(b) + ' ' + apiToken);

    ApiCall('post', b, API_END_POINTS.rechargeWallets, {
      Authorization: `Bearer ${apiToken}`,
    })
      .then(response => {
        // console.log(response);
        ShowMessage(response?.data?.message);
        navigation.goBack();
      })
      .catch(error => {})
      .finally(() => {});
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
          Recharge Wallet
        </Text>
      </View>

      <Loader loading={loading} />
      <View
        style={{
          margin: 10,
        }}>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          placeholder={'Enter amount to recharge wallet'}
          style={{
            margin: 10,
            padding: 10,
            borderBottomWidth: 1,
            borderColor: COLORS.grey,
            fontSize: 16,
            color: COLORS.black,
          }}
          value={amount}
          keyboardType="number-pad"
          onChangeText={v => {
            setAmount(v);
          }}
        />
      </View>

      <TouchableOpacity
        onPress={() => {
          rechargeNow();
        }}
        style={{
          alignSelf: 'center',
          alignItems: 'center',
          paddingVertical: 10,
          paddingHorizontal: 30,
          borderRadius: 10,
          margin: 10,
          backgroundColor: COLORS.primary,
        }}>
        <Text
          style={{
            fontSize: 18,
            color: COLORS.white,
            fontFamily: 'Segoe UI Bold',
          }}>
          Recharge Now
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default RechargeWallet;
