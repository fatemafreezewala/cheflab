import {
  Dimensions, FlatList, SafeAreaView, StyleSheet,
  Text, TouchableOpacity, View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

import React, { useEffect, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { COLORS } from '../../constants';
import ToolbarWithIcon from '../../utils/ToolbarWithIcon';
import style from './style';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { horizScale } from '../../constants/themes';
import ApiCall from '../../network/ApiCall';
import { API_END_POINTS } from '../../network/ApiEndpoints';
import { ShowMessage } from '../../utils/Utility';

var pkg = require('../../../package.json');
// console.log(pkg.version);
const FAQS = ({navigation}) => {
  useEffect(() => {
    getInfoFromStorage();
  }, []);
  const [apiToken, setApiToken] = useState('');

  const [loading, setLoading] = useState(false);

  const getInfoFromStorage = async () => {
    let t = '';
    try {
      await AsyncStorage.getItem('token', (err, value) => {
        if (err) {
        } else {
          if (value !== '' && value !== null) {
            t = value;
            setApiToken(value);
            getFaqs(value);
          } else {
            setApiToken('');
          }
        }
      });
    } catch (error) {}
  };

  const [data, setData] = useState([]);

  const getFaqs = value => {
    setLoading(true);
    ApiCall('get', null, API_END_POINTS.getFAQS, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        if (response?.data?.status) {
          // ShowMessage(response?.data?.message);
          // setData(response?.data?.response);
          let a = response?.data?.response?.map(item => {
            return {
              ...item,
              expanded: false,
            };
          });
          setData(a);
        } else {
          setData([]);
          ShowMessage(response?.data?.message);
        }
      })
      .catch(error => {
        console.log('ERROR In GET FaQ APi -> ', JSON.stringify(error));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const updateCouponArray = (i, index) => {
    let _a = data?.map(item => {
      let temp = Object.assign({}, item);
      if (i?.id == temp.id) {
        temp.expanded = !temp.expanded;
      } else {
        temp.expanded = false;
      }
      return temp;
    });
    setData(_a);
    // setData([...data, _a]);
  };

  const renderCouponItem = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          {
            paddingLeft: 10,
            borderRadius: 5,
            margin: 10,
            // elevation: 10,
            paddingRight: 10,
            backgroundColor: '#e7e7e7',
            // flexDirection: 'row',
            // alignItems: 'center',
            padding: 10,
            // justifyContent: 'space-between',
          },
        ]}
        onPress={() => {
          updateCouponArray(item, index);
        }}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <Text
              style={{
                color: COLORS.black,
                fontSize: 16,
                fontFamily: 'Segoe UI Bold',

                flexGrow: 1,

                // maxWidth: SIZES.width - 100,
              }}>
              {item?.faq_question}
              {/* /adf fds fd sf ds fds f ds fds f ds fsd f sd fds f dsf ds f */}
            </Text>
            <AntDesign name="plus" size={15} color={COLORS.black} />
          </View>
          {item.expanded ? (
            <View
              style={{
                backgroundColor: '#e9e9e9',
              }}>
              <Text
                style={{
                  fontSize: 15,
                  color: COLORS.black,
                  fontFamily: 'Segoe UI',
                  // maxWidth: SIZES.width - 100,
                  marginTop: horizScale(10),
                }}>
                {item?.faq_answer}
              </Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
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
            flexGrow: 1,
            maxWidth: Dimensions.get('window').width / 2 + 15,
          }}
          numberOfLines={1}>
          FAQ's
        </Text>
      </View>
      {loading ? (
        <RenderSkeleton />
      ) : (
        <FlatList data={data} extraData={data} renderItem={renderCouponItem} />
      )}
    </SafeAreaView>
  );
};

export default FAQS;

const styles = StyleSheet.create({});

const RenderSkeleton = () => {
  return (
    <View>
      <View>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 15}
          height={20}
          style={{
            alignSelf: 'center',
            marginTop: 10,
            marginEnd: 10,
            marginStart: 10,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 80}
          height={15}
          style={{
            marginTop: 5,
            marginStart: 10,
            marginEnd: 5,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 15}
          height={10}
          style={{
            marginTop: 5,
            marginEnd: 5,
            marginStart: 10,
          }}></ShimmerPlaceHolder>
      </View>
      <View
        style={{
          marginTop: 10,
        }}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 15}
          height={20}
          style={{
            alignSelf: 'center',
            marginTop: 10,
            marginEnd: 10,
            marginStart: 10,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 80}
          height={15}
          style={{
            marginTop: 5,
            marginStart: 10,
            marginEnd: 5,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 15}
          height={10}
          style={{
            marginTop: 5,
            marginEnd: 5,
            marginStart: 10,
          }}></ShimmerPlaceHolder>
      </View>
      <View
        style={{
          marginTop: 10,
        }}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 15}
          height={20}
          style={{
            alignSelf: 'center',
            marginTop: 10,
            marginEnd: 10,
            marginStart: 10,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 80}
          height={15}
          style={{
            marginTop: 5,
            marginStart: 10,
            marginEnd: 5,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 15}
          height={10}
          style={{
            marginTop: 5,
            marginEnd: 5,
            marginStart: 10,
          }}></ShimmerPlaceHolder>
      </View>
      <View
        style={{
          marginTop: 10,
        }}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 15}
          height={20}
          style={{
            alignSelf: 'center',
            marginTop: 10,
            marginEnd: 10,
            marginStart: 10,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 80}
          height={15}
          style={{
            marginTop: 5,
            marginStart: 10,
            marginEnd: 5,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 15}
          height={10}
          style={{
            marginTop: 5,
            marginEnd: 5,
            marginStart: 10,
          }}></ShimmerPlaceHolder>
      </View>
      <View
        style={{
          marginTop: 10,
        }}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 15}
          height={20}
          style={{
            alignSelf: 'center',
            marginTop: 10,
            marginEnd: 10,
            marginStart: 10,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 80}
          height={15}
          style={{
            marginTop: 5,
            marginStart: 10,
            marginEnd: 5,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 15}
          height={10}
          style={{
            marginTop: 5,
            marginEnd: 5,
            marginStart: 10,
          }}></ShimmerPlaceHolder>
      </View>
      <View
        style={{
          marginTop: 10,
        }}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 15}
          height={20}
          style={{
            alignSelf: 'center',
            marginTop: 10,
            marginEnd: 10,
            marginStart: 10,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 80}
          height={15}
          style={{
            marginTop: 5,
            marginStart: 10,
            marginEnd: 5,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 15}
          height={10}
          style={{
            marginTop: 5,
            marginEnd: 5,
            marginStart: 10,
          }}></ShimmerPlaceHolder>
      </View>
      <View
        style={{
          marginTop: 10,
        }}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 15}
          height={20}
          style={{
            alignSelf: 'center',
            marginTop: 10,
            marginEnd: 10,
            marginStart: 10,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 80}
          height={15}
          style={{
            marginTop: 5,
            marginStart: 10,
            marginEnd: 5,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 15}
          height={10}
          style={{
            marginTop: 5,
            marginEnd: 5,
            marginStart: 10,
          }}></ShimmerPlaceHolder>
      </View>

      <View
        style={{
          marginTop: 10,
        }}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 15}
          height={20}
          style={{
            alignSelf: 'center',
            marginTop: 10,
            marginEnd: 10,
            marginStart: 10,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 80}
          height={15}
          style={{
            marginTop: 5,
            marginStart: 10,
            marginEnd: 5,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 15}
          height={10}
          style={{
            marginTop: 5,
            marginEnd: 5,
            marginStart: 10,
          }}></ShimmerPlaceHolder>
      </View>

      <View
        style={{
          marginTop: 10,
        }}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 15}
          height={20}
          style={{
            alignSelf: 'center',
            marginTop: 10,
            marginEnd: 10,
            marginStart: 10,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 80}
          height={15}
          style={{
            marginTop: 5,
            marginStart: 10,
            marginEnd: 5,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 15}
          height={10}
          style={{
            marginTop: 5,
            marginEnd: 5,
            marginStart: 10,
          }}></ShimmerPlaceHolder>
      </View>

      <View
        style={{
          marginTop: 10,
        }}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 15}
          height={20}
          style={{
            alignSelf: 'center',
            marginTop: 10,
            marginEnd: 10,
            marginStart: 10,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 80}
          height={15}
          style={{
            marginTop: 5,
            marginStart: 10,
            marginEnd: 5,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 15}
          height={10}
          style={{
            marginTop: 5,
            marginEnd: 5,
            marginStart: 10,
          }}></ShimmerPlaceHolder>
      </View>

      <View
        style={{
          marginTop: 10,
        }}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 15}
          height={20}
          style={{
            alignSelf: 'center',
            marginTop: 10,
            marginEnd: 10,
            marginStart: 10,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 80}
          height={15}
          style={{
            marginTop: 5,
            marginStart: 10,
            marginEnd: 5,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 15}
          height={10}
          style={{
            marginTop: 5,
            marginEnd: 5,
            marginStart: 10,
          }}></ShimmerPlaceHolder>
      </View>

      <View
        style={{
          marginTop: 10,
        }}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 15}
          height={20}
          style={{
            alignSelf: 'center',
            marginTop: 10,
            marginEnd: 10,
            marginStart: 10,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 80}
          height={15}
          style={{
            marginTop: 5,
            marginStart: 10,
            marginEnd: 5,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 15}
          height={10}
          style={{
            marginTop: 5,
            marginEnd: 5,
            marginStart: 10,
          }}></ShimmerPlaceHolder>
      </View>

      <View
        style={{
          marginTop: 10,
        }}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 15}
          height={20}
          style={{
            alignSelf: 'center',
            marginTop: 10,
            marginEnd: 10,
            marginStart: 10,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 80}
          height={15}
          style={{
            marginTop: 5,
            marginStart: 10,
            marginEnd: 5,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 15}
          height={10}
          style={{
            marginTop: 5,
            marginEnd: 5,
            marginStart: 10,
          }}></ShimmerPlaceHolder>
      </View>

      <View
        style={{
          marginTop: 10,
        }}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 15}
          height={20}
          style={{
            alignSelf: 'center',
            marginTop: 10,
            marginEnd: 10,
            marginStart: 10,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 80}
          height={15}
          style={{
            marginTop: 5,
            marginStart: 10,
            marginEnd: 5,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 15}
          height={10}
          style={{
            marginTop: 5,
            marginEnd: 5,
            marginStart: 10,
          }}></ShimmerPlaceHolder>
      </View>

      <View
        style={{
          marginTop: 10,
        }}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 15}
          height={20}
          style={{
            alignSelf: 'center',
            marginTop: 10,
            marginEnd: 10,
            marginStart: 10,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 80}
          height={15}
          style={{
            marginTop: 5,
            marginStart: 10,
            marginEnd: 5,
          }}></ShimmerPlaceHolder>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={Dimensions.get('window').width - 15}
          height={10}
          style={{
            marginTop: 5,
            marginEnd: 5,
            marginStart: 10,
          }}></ShimmerPlaceHolder>
      </View>
    </View>
  );
};
