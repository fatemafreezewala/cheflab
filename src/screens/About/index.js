import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS, icons} from '../../constants';
import {horizScale} from '../../constants/themes';
import ApiCall from '../../network/ApiCall';
import {API_END_POINTS} from '../../network/ApiEndpoints';
import ToolbarWithIcon from '../../utils/ToolbarWithIcon';
import {ShowConsole} from '../../utils/Utility';
import style from './style';
var pkg = require('../../../package.json');
// console.log(pkg.version); eventtest@gmail.com 123456
const About = ({navigation, route}) => {
  const [apiToken, setApiToken] = useState('');
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  const [receivedItem, setReceivedItem] = useState({});

  useEffect(() => {
    let {item} = route.params;
    console.log('itenmrew -< ', JSON.stringify(item));

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
            getSocialMedia(value);
          } else {
            setApiToken('');
          }
        }
      });
    } catch (error) {}
  };

  const [apiData, setApiData] = useState([]);

  const [fbLink, setFbLink] = useState('');
  const [instaLink, setinstaLink] = useState('');
  const [youLink, setYouLink] = useState('');

  const getSocialMedia = val => {
    setLoading(true);
    ApiCall('get', null, API_END_POINTS.socialMediaApi, {
      Authorization: `Bearer ${val}`,
    })
      .then(response => {
        console.log(' socialMediaApi  > ' + JSON.stringify(response.data));
        if (response?.data?.status) {
          setApiData(response?.data?.response);
          setFbLink(response?.data?.response[0]?.facebook_link);
          setinstaLink(response?.data?.response[0]?.instagram_link);
          setYouLink(response?.data?.response[0]?.youtube_link);
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

  const facebook_link = () => {
    Linking.openURL(fbLink);
    // Linking.openURL('https://www.facebook.com/auntyacid/');
  };

  const instagram_link = () => {
    Linking.openURL(instaLink);
    // Linking.openURL('https://www.instagram.com/epicfunnypage/?hl=en');
  };

  const youtube_link = () => {
    Linking.openURL(youLink);
    // Linking.openURL('https://www.youtube.com/watch?v=RsgLwqIAJ1g');
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
          About ChefLab
        </Text>
      </View>
      <ScrollView
        // style={style.mainContainer}
        contentContainerStyle={{
          // backgroundColor: COLORS.white,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('AboutUs');
          }}
          style={{
            justifyContent: 'space-between',
            marginVertical: 15,
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 15,
            // backgroundColor: COLORS.primary,
          }}>
          <Text
            style={{
              fontSize: 16,
              color: COLORS.darkGray,
              fontFamily: 'Segoe UI Bold',
              marginTop: horizScale(5),
              marginStart: horizScale(15),
            }}>
            About Us
          </Text>
          <Image
            source={icons.back_arrow}
            style={{
              width: 20,
              height: 20,
              marginEnd: 10,
              tintColor: COLORS.grey,

              resizeMode: 'center',
              transform: [
                {
                  rotate: '180deg',
                },
              ],
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('TermsAndConditions');
          }}
          style={{
            justifyContent: 'space-between',
            marginVertical: 15,
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 15,
            // backgroundColor: COLORS.primary,
          }}>
          <Text
            style={{
              fontSize: 16,
              color: COLORS.darkGray,
              fontFamily: 'Segoe UI Bold',
              marginTop: horizScale(5),
              marginStart: horizScale(15),
            }}>
            Terms and Conditions
          </Text>
          <Image
            source={icons.back_arrow}
            style={{
              width: 20,
              height: 20,
              marginEnd: 10,
              tintColor: COLORS.grey,
              resizeMode: 'center',
              transform: [
                {
                  rotate: '180deg',
                },
              ],
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('PrivacyPolicy');
          }}
          style={{
            justifyContent: 'space-between',
            marginVertical: 15,
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 15,
            // backgroundColor: COLORS.primary,
          }}>
          <Text
            style={{
              fontSize: 16,
              color: COLORS.darkGray,
              fontFamily: 'Segoe UI Bold',
              marginTop: horizScale(5),
              marginStart: horizScale(15),
            }}>
            Privacy Policy
          </Text>
          <Image
            source={icons.back_arrow}
            style={{
              width: 20,
              height: 20,
              marginEnd: 10,
              tintColor: COLORS.grey,
              resizeMode: 'center',
              transform: [
                {
                  rotate: '180deg',
                },
              ],
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('CancellationPolicy');
          }}
          style={{
            justifyContent: 'space-between',
            marginVertical: 15,
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 15,
            // backgroundColor: COLORS.primary,
          }}>
          <Text
            style={{
              fontSize: 16,
              color: COLORS.darkGray,
              fontFamily: 'Segoe UI Bold',
              marginTop: horizScale(5),
              marginStart: horizScale(15),
            }}>
            Refund & Cancellation Policy
          </Text>
          <Image
            source={icons.back_arrow}
            style={{
              width: 20,
              height: 20,
              marginEnd: 10,
              tintColor: COLORS.grey,
              resizeMode: 'center',
              transform: [
                {
                  rotate: '180deg',
                },
              ],
            }}
          />
        </TouchableOpacity>

        {/* <TouchableOpacity
          onPress={() => {
            // navigation.navigate('ContactUs', {item: receivedItem});
          }}
          style={{
            justifyContent: 'space-between',
            marginVertical: 15,
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 15,
            // backgroundColor: COLORS.primary,
          }}>
          <Text
            style={{
              fontSize: 16,
              color: COLORS.darkGray,
              fontFamily: 'Segoe UI Bold',
              marginTop: horizScale(5),
              marginStart: horizScale(15),
            }}>
            Contact Us
          </Text>
          <Image
            source={icons.back_arrow}
            style={{
              width: 20,
              height: 20,
              marginEnd: 10,
              tintColor: COLORS.grey,
              resizeMode: 'center',
              transform: [
                {
                  rotate: '180deg',
                },
              ],
            }}
          />
        </TouchableOpacity> */}

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('FAQS');
          }}
          style={{
            justifyContent: 'space-between',
            marginVertical: 15,
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 15,
            // backgroundColor: COLORS.primary,
          }}>
          <Text
            style={{
              fontSize: 16,
              color: COLORS.darkGray,
              fontFamily: 'Segoe UI Bold',
              marginTop: horizScale(5),
              marginStart: horizScale(15),
            }}>
            FAQ's
          </Text>
          <Image
            source={icons.back_arrow}
            style={{
              width: 20,
              height: 20,
              marginEnd: 10,
              tintColor: COLORS.grey,
              resizeMode: 'center',
              transform: [
                {
                  rotate: '180deg',
                },
              ],
            }}
          />
        </TouchableOpacity>

        <View
          style={{
            justifyContent: 'space-between',
            // flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            marginTop: 100,
          }}>
          <Text
            style={{
              fontSize: 16,
              color: COLORS.darkGray,
              fontFamily: 'Segoe UI Bold',
            }}>
            Follow us on
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              marginVertical: 10,
            }}>
            <TouchableOpacity
              onPress={() => {
                facebook_link();
              }}>
              <Image
                source={icons.facebook}
                style={{
                  width: 50,
                  height: 50,
                  resizeMode: 'center',
                  marginHorizontal: 20,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                instagram_link();
              }}>
              <Image
                source={icons.instagram}
                style={{
                  width: 50,
                  height: 50,
                  marginHorizontal: 20,
                  resizeMode: 'center',
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                youtube_link();
              }}>
              <Image
                source={icons.youtube}
                style={{
                  width: 50,
                  height: 50,
                  marginHorizontal: 20,
                  resizeMode: 'center',
                }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Text
          style={{
            fontSize: 16,
            color: COLORS.darkGray,
            fontFamily: 'Segoe UI Bold',
            alignSelf: 'center',
            position: 'absolute',
            bottom: 50,
          }}>
          App Version {pkg.version}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default About;

const styles = StyleSheet.create({});
