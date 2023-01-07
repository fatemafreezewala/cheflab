import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import {COLORS, icons} from '../../../constants';
import {horizScale, vertScale} from '../../../constants/themes';
import ApiCall from '../../../network/ApiCall';
import {API_END_POINTS} from '../../../network/ApiEndpoints';
import ToolbarWithIcon from '../../../utils/ToolbarWithIcon';
import {ShowConsole} from '../../../utils/Utility';
import style from '../style';

const Profile = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);
  const [apiToken, setApiToken] = useState('');
  const [cuisinesData, setCuisinesData] = useState({});
  const [videoData, setVideoData] = useState([]);
  const isFocused = useIsFocused();
  useEffect(() => {
    let {item} = route.params;
    console.log('irtewm >. ', JSON.stringify(item));
    // setLoading(true);
    getInfoFromStorage(item?.chef_id);
    if (isFocused) {
      getInfoFromStorage(item?.chef_id);
    }
    // setLoading(false);
  }, []);

  const getInfoFromStorage = async id => {
    try {
      await AsyncStorage.getItem('token', (err, value) => {
        if (err) {
        } else {
          if (value !== '' && value !== null) {
            setLoading(true);

            setApiToken(value);
            getChefProfile(value, id);
            // console.log('getChefProfile response =-> ', ' tt =>' + value);
          } else {
            setApiToken('');
          }
        }
      });
    } catch (error) {}
  };

  const getChefProfile = (value, id) => {
    setLoading(true);
    let body = {
      vendor_id: id + '',
    };
    ShowConsole(JSON.stringify(body));

    ApiCall('post', body, API_END_POINTS.getChefProfile, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        console.log(
          'getChefProfile response =-> ',
          JSON.stringify(response?.data) + ' tt =>' + value,
        );
        if (response?.data?.status) {
          setCuisinesData(response?.data?.response?.profile);
          setVideoData(response?.data?.response?.videos);
        } else {
          setCuisinesData({});
          setVideoData([]);
        }
      })
      .catch(error => {
        console.log('ERROR IN getChefProfile API -> ', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [restHomePageData, setRestHomePageData] = useState([]);

  return (
    <SafeAreaView style={style.mainContainer}>
      <ScrollView
        style={style.mainContainer}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}>
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
            numberOfLines={1}
            ellipsizeMode="tail">
            Chef's Profile
          </Text>

          <TouchableOpacity
            style={{
              width: 22,
              height: 22,
              alignSelf: 'center',
              marginHorizontal: 15,
              position: 'absolute',
              right: 5,
            }}
            onPress={() => {
              navigation.navigate('Cart');
            }}>
            <Image
              source={icons.cart}
              style={{
                width: 22,
                height: 22,
                alignSelf: 'center',
                marginHorizontal: 15,
                tintColor: COLORS.primary,
              }}
            />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ProfileSkeleton />
        ) : (
          <View
            style={{
              elevation: 10,
              backgroundColor: COLORS.white,
              borderRadius: 15,
              margin: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View
                style={{
                  elevation: 10,
                  width: 140,
                  height: 300,
                  backgroundColor: COLORS.white,
                  margin: 10,
                  borderRadius: 15,
                }}>
                <Image
                  source={{
                    // uri: cuisinesData?.image,
                    uri: cuisinesData?.profile_image,
                  }}
                  style={{
                    borderRadius: 15,
                    flex: 1,
                    resizeMode: 'contain',
                  }}
                />
              </View>
              <View
                style={{
                  marginTop: 8,
                  alignItems: 'flex-start',
                  flex: 1,
                }}>
                <Text
                  style={[
                    {
                      color: COLORS.black,
                      fontFamily: 'Segoe UI Bold',
                      marginTop: 18,
                      fontSize: 18,
                      marginStart: 5,
                    },
                  ]}
                  numberOfLines={1}>
                  {cuisinesData?.name}
                </Text>

                <Text
                  style={[
                    style.tagline,
                    {
                      color: COLORS.black,
                      marginStart: 5,
                      marginTop: 15,
                      flex: 1,
                    },
                  ]}>
                  Age - {cuisinesData?.Age} Yrs {'\n'}
                  {'\n'}
                  Cooking Exp - {cuisinesData?.experience} Yrs
                  {'\n'}
                  {'\n'}
                  Origin - Chennai
                  {'\n'}
                  {'\n'}
                  Speciality - {cuisinesData?.speciality?.toString()}
                  {'\n'}
                  {'\n'}
                  Ratings - {cuisinesData?.vendor_ratings}
                  <Text
                    style={[
                      style.tagline,
                      {
                        color: '#0638ff',
                        marginStart: 5,
                        marginTop: 15,
                        flex: 1,
                      },
                    ]}>
                    {' '}
                    ({cuisinesData?.vendor_ratings} Reviews)
                  </Text>
                  {'\n'}
                  {'\n'}
                  Fssai License No. - {cuisinesData?.fssai_lic_no}
                </Text>
              </View>
            </View>
            {cuisinesData?.bio ? (
              <View
                style={{
                  marginTop: 18,
                  borderRadius: 10,
                  backgroundColor: '#E1E9FB',
                  marginBottom: 10,
                  marginHorizontal: 10,
                }}>
                <Text
                  style={[
                    {
                      color: COLORS.black,
                      fontFamily: 'Segoe UI Bold',
                      fontSize: 18,
                      marginStart: 10,
                      paddingTop: 10,
                    },
                  ]}
                  numberOfLines={1}>
                  Bio
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                  }}>
                  <Image
                    style={{
                      width: 22,
                      height: 22,
                      alignSelf: 'flex-start',
                      resizeMode: 'center',
                      marginStart: 10,
                    }}
                    source={icons.bio_quote}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Segoe UI',
                      marginVertical: 10,
                      marginHorizontal: 5,
                      alignSelf: 'center',
                      flex: 1,
                      color: COLORS.black,
                    }}>
                    {/* I am here to entice your taste-buds! #enticeyourtastebuds Boring
                recipes can make you sad, so always try to make some interesting
                cuisine. We will feel ill if we spend too much time out of the
                kitchen. Chefs know that cooking is not their job but the
                calling of life. A chef has the common drive of spreading
                happiness. */}
                    {cuisinesData?.bio}
                  </Text>
                  <Image
                    style={{
                      width: 22,
                      height: 22,
                      alignSelf: 'flex-end',
                      resizeMode: 'center',
                      marginBottom: 10,
                      marginEnd: 10,
                      transform: [
                        {
                          rotate: '180deg',
                        },
                      ],
                    }}
                    source={icons.bio_quote}
                  />
                </View>
              </View>
            ) : null}
          </View>
        )}

        {videoData?.length == 0 ? null : (
          <Text
            style={[
              {
                color: COLORS.black,
                fontFamily: 'Segoe UI',
                fontSize: 18,
                marginStart: 20,
                paddingTop: 10,
              },
            ]}
            numberOfLines={1}>
            Videos
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({});

const ProfileSkeleton = () => {
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          width={140}
          height={300}
          style={{
            marginTop: 20,
            borderRadius: 20,
            marginStart: 20,
          }}
        />
        <View>
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            width={horizScale(180)}
            height={vertScale(20)}
            style={{
              marginTop: 50,
              borderRadius: 5,
              marginStart: 10,
            }}
          />
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            width={horizScale(180)}
            height={vertScale(13)}
            style={{
              marginTop: 20,
              borderRadius: 5,
              marginStart: 10,
            }}
          />
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            width={horizScale(180)}
            height={vertScale(13)}
            style={{
              marginTop: 20,
              borderRadius: 5,
              marginStart: 10,
            }}
          />
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            width={horizScale(180)}
            height={vertScale(13)}
            style={{
              marginTop: 20,
              borderRadius: 5,
              marginStart: 10,
            }}
          />
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            width={horizScale(180)}
            height={vertScale(13)}
            style={{
              marginTop: 20,
              borderRadius: 5,
              marginStart: 10,
            }}
          />
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            width={horizScale(180)}
            height={vertScale(13)}
            style={{
              marginTop: 20,
              borderRadius: 5,
              marginStart: 10,
            }}
          />
        </View>
      </View>
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        width={Dimensions.get('window').width - 40}
        height={150}
        style={{
          marginTop: 20,
          borderRadius: 20,
          marginStart: 20,
        }}
      />

      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        width={Dimensions.get('window').width - 40}
        height={20}
        style={{
          marginTop: 20,
          borderRadius: 5,
          marginStart: 20,
        }}
      />
      <View>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <View>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              width={Dimensions.get('window').width / 2.3}
              height={130}
              style={{
                marginTop: 20,
                borderRadius: 20,
                marginStart: 20,
              }}
            />
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              width={Dimensions.get('window').width / 2.5}
              height={10}
              style={{
                marginTop: 10,
                borderRadius: 20,
                marginStart: 20,
              }}
            />
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              width={Dimensions.get('window').width / 3}
              height={15}
              style={{
                marginTop: 5,
                borderRadius: 20,
                marginStart: 20,
              }}
            />
          </View>
          <View>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              width={Dimensions.get('window').width / 2.3}
              height={130}
              style={{
                marginTop: 20,
                borderRadius: 20,
                marginStart: 15,
              }}
            />
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              width={Dimensions.get('window').width / 2.5}
              height={10}
              style={{
                marginTop: 10,
                borderRadius: 20,
                marginStart: 15,
              }}
            />
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              width={Dimensions.get('window').width / 3}
              height={15}
              style={{
                marginTop: 5,
                borderRadius: 20,
                marginStart: 15,
              }}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <View>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              width={Dimensions.get('window').width / 2.3}
              height={130}
              style={{
                marginTop: 20,
                borderRadius: 20,
                marginStart: 20,
              }}
            />
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              width={Dimensions.get('window').width / 2.5}
              height={10}
              style={{
                marginTop: 10,
                borderRadius: 20,
                marginStart: 20,
              }}
            />
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              width={Dimensions.get('window').width / 3}
              height={15}
              style={{
                marginTop: 5,
                borderRadius: 20,
                marginStart: 20,
              }}
            />
          </View>
          <View>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              width={Dimensions.get('window').width / 2.3}
              height={130}
              style={{
                marginTop: 20,
                borderRadius: 20,
                marginStart: 15,
              }}
            />
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              width={Dimensions.get('window').width / 2.5}
              height={10}
              style={{
                marginTop: 10,
                borderRadius: 20,
                marginStart: 15,
              }}
            />
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              width={Dimensions.get('window').width / 3}
              height={15}
              style={{
                marginTop: 5,
                borderRadius: 20,
                marginStart: 15,
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
