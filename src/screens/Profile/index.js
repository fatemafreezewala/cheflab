import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
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
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {COLORS, icons, images} from '../../constants';
import {horizScale} from '../../constants/themes';
import ApiCall from '../../network/ApiCall';
import {API_END_POINTS} from '../../network/ApiEndpoints';
import ToolbarWithIcon from '../../utils/ToolbarWithIcon';
import style from './style';
import Loader from '../../utils/Loader';

const Profile = ({navigation}) => {
  const [userId, setUserId] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const isFocused = useIsFocused();

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
      await AsyncStorage.getItem('userId', (err, value) => {
        if (err) {
        } else {
          if (value !== '' && value !== null) {
            setUserId(value);
            console.log(t + '<>>>>>>>>>>>>>>>>><<<<<<<<<' + value);

            getRestDetailsPage(t, value);
          } else {
            setUserId('');
          }
        }
      });
      await AsyncStorage.getItem('mobile', (err, value) => {
        if (err) {
          console.log('profile data -> ', JSON.stringify(err));
        } else {
          if (value !== '' && value !== null) {
            setMobile(value);
          } else {
            setMobile('');
          }
        }
      });
    } catch (error) {
      // console.log('profile data -> ', JSON.stringify(error));
    }
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

  useEffect(() => {
    getInfoFromStorage();
  }, []);
  useEffect(() => {
    getInfoFromStorage();
  }, [isFocused]);
  const getRestDetailsPage = (value, _id) => {
    setLoading(true);
    let body = {
      user_id: _id,
    };
    console.log('daa -> ', JSON.stringify(body) + value);
    ApiCall('post', null, API_END_POINTS.getUserInfo, {
      Authorization: `Bearer ${value}`,
    })
      .then(response => {
        console.log(
          'daa get reponse profile-> ',
          JSON.stringify(response?.data),
        );
        if (response?.data?.status) {
          setData(response?.data?.response);
        } else {
          setData({});
        }
      })
      .catch(error => {
        console.log('ERROR IN getCuisines API -> ', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const initiateWhatsApp = () => {
    let whatsAppMsg = 'Hey, I need help!';
    const mobileNumber = '918962689850';
    // WhatsApp Number: 918962689850
    // Domain: https://live-101277.wati.io
    // Login id: grishu.cheflab@gmail.com
    // Password: eS2)enrPZ5VKrzMJ

    let url = 'whatsapp://send?text=' + whatsAppMsg + '&phone=' + mobileNumber;
    Linking.openURL(url)
      .then(data => {
        console.log('WhatsApp Opened');
      })
      .catch(() => {
        alert('Make sure Whatsapp installed on your device');
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
          Your Profile
        </Text>
      </View>
      <Loader loading={loading} />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}>
        <View
          activeOpacity={0.9}
          style={[
            // style.resCard,
            {
              alignItems: 'center',
              padding: 10,
              flexDirection: 'row',
              backgroundColor: COLORS.white,
              marginEnd: 15,
              marginStart: 15,
              elevation: 10,
              borderRadius: 10,
              marginTop: 15,
            },
          ]}>
          {data?.image ? (
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 100,
                borderWidth: 1,
                borderColor: '#db2728',
                justifyContent: 'center',
                backgroundColor: COLORS.white,
                alignSelf: 'center',
                alignItems: 'center',
              }}>
              <Image
                // source={images.app_logo}
                source={{
                  uri: data?.image,
                }}
                style={{
                  width: 77,
                  height: 77,
                  borderRadius: 100,
                  padding: 1,
                }}
              />
            </View>
          ) : (
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 100,
                borderWidth: 1,
                borderColor: '#db2728',
                justifyContent: 'center',
                backgroundColor: COLORS.white,
                alignSelf: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={images.app_logo}
                // source={{
                //   uri: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoGBxQUExYUFBQYFhYZGR0cGhoaGx8fHRwaISEcIRohHB0gHysiHB0oHxwaJDQjKCwwMTExHyE3PDcvOyswMS4BCwsLDw4PHRERHTApISgwMDAyMi4zMDA2MDAwMDAwMDA7MDMyMDIwMjA5MDAwMjAwMDAwMDAwMDAwMDIwMDAwMP/AABEIALcBEwMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAAEBQACAwYBB//EAEAQAAECBAQEAwcCBgAFBAMAAAECEQADITEEEkFRBSJhcROBkQYyobHB0fBC4RQVI1Ji8VNygpLSB0PC0xYzNP/EABoBAAIDAQEAAAAAAAAAAAAAAAIDAAEEBQb/xAAyEQACAgEDAwEHAgUFAAAAAAABAgARIQMSMQRBUSITMmFxgaHBkfAFFCPR8QYzYrHh/9oADAMBAAIRAxEAPwDn+GFyKgAMSetXvS28d1w4S5clS5brWtIZjqAAU0duYK6A7R8/4QatQ0FNHB/KR38jGoMiWMuYmWirZTo4JUGPeOT/AKgyiAdzn5Ruh3hOMxpXlUEhICXJU1Dt0L08jCjiXFkpJLqql8gLFhdSTqzuQdIF4pj8s0S0DnLh2cZibMbjlFTvcPCziePmcqZi2QoBxkKm3FQp9aGvSOJ0/SnBrH4+8c2s2QO0pxKbmmS0PckpcEs7e6mu+hgaTiZiZwLg+HmyCYQWJFaFioEmgNdoDxeDmS050g8oJSVKIKUioAscxL0vS1DA2CxOIzupCiTQlYVetFklwHGp06R2E06QhSCKqZivqudFjVJnoUtEoJJW6wli6bAFJYLRmZxcVtoF7R4OUmUlKJeSYMubsQrMCCaGgdt9zGcsTvEBUoCYWBS1SKlqFzRw47RghQBJWnMhRqxcBQqKmiizXrA6RKHBsDgQ/aWKqYcKmlyh3AU4qCE3cU3cV1YQz46kjD5nQzqASPe90sQL0rW0C4VAShOVCWUs8zczPYnW6YI4xMUiWkpqyS+Z2IaxANY6aPu0TXN/mDdML8QXhYyyhzpU40e/mBB3DvERJmOEkOFhQtys7tVmbyhfgVhSTMOVDWSKNRqC58y8U4fmPKhQysX0oQQoW29IrrxvVbxX+ZSYOJ12H4ilSECgQM+pKXylRoKnmVc6NAa0+JMBKkf00MFJQUjKc2VLZ9QHsXG0I5E/KC/NW4D1/CC3WCZGLeWoEqdkqABZ1A6nQMX8o4p0SpJB+E1Lq2aM6DG8QGUJSS2dABIqDXU0BLWL0B3jw8RzSgQEpMwEg5qJILKZTPy1PlraF2EwM4vMdLXJUxrlOWouXowe8e4+XVQzBVXCmbK7FmSSFWO1QabLVUwoyYxnzNZeAWgZlS5cxFHOY5wQSzABqgs4e9OviJJEyXNciU+qmIdnamgCX2ECYlRSAQQleVyOYKIBegssW6/QJXETrcAMLlq0pb/UMCOTcytqsGoRwZIBKs7khRVV6lJ1Oxfa0JZ/EErRLCHUlC1FDuEtzdNC4psIKkYVa3oGIAtzPQNuPKIODZfClFLgBV2LCn6bjzuTDNMoBTHP/hjwWfgVPeEywlJKuYrD56jUGg/SA1Lw0VnYIlAMRUkqZrGgNdekLOJSvCzBAUtZDAKOtKubUf6CkDYDDTUJFF1VViXNnABq9QdIF03+u/oZoD7PTX6RnxvCJRLSBSijetGe5O8cwiTmN7NqfP6Q9xSQApLkkJ5qgkEg0+G28KsHMTnYkAkUpf4R3P4ev9EAnzOf1DW5IEbYXiBSgpSoJUom+hYJTW1SQK/GrM8FwpIaZMKlEi6jfUMfSn2hTw2TNyBQYgHKQAM1HFCTTT94eYefMXUpSkl2S5KgndqkO/nTpHD69iNVtvnM6HT1tG6UUXYa2BqSK0oW+FoHDIUWDlRGYvu9aasTrBeIUpJokqJoXUNLUu50YRljJQCEzCjKCagU5nZjS9tHjErVXxmhylcwRXE+ZKU1C2A5auTVRewGzdYYTBiBKZCEIKklKloVmNAqpZNVOCa2dOsMuF4Q5kPLQlgMpOgIDBwQVVendyNXE+UpYAPvgHQNVwWcav6bwnV6lQwAUTMrMxoz5txjBKTIfICvxEkqAAUQ5uwc3uT94mE9qVSJRloCirMSlQIAA6mp8g3eJ7YzZyVGWJYCCwd3KiNXZvSOc/hpxLCWrqGMdjRRdTTHtK8zNqaoV/T8p7juMzZiwpUxTpsRRuzR0mE9qAuSkTHWoUUSp1DqBrYdo51HA5r1DE7xb+UEK0J3SY0Oug4APbiogM3aO08Vw2yvQRIX/wAM2nwiQXtv+RlbB4EI4S7hg76aH4UhqeKLUkJSUhmTlL+7Rq/p15h+8K+Ee9ofv+NB8zESkKdT8rAgOHIfWmve8af4moKLi8xakgGjBsRxUgh05FKoSano5cVsL6RVGPBKffK3DJSm1hZiWta7nUxWZxaWVMUZc1E1didyzt0i87BSgAoBKzRmHvd8pFLNSscwALW5SIsG8m5txLFCaEoyKJR7wXUPpRjlatmZ/RMnGFKkvQHcuDfUbuYaYqbPW0pKxLCqFKyAlqAMAGI8oUYiSmUSSoKqwoG/yLNSuhAhuiqgV9oRN5uXmY4lTUKdB8m1ftExUienlyqFQAkila1Gr/jRXApTmbKV1dhfsGtB2BnBWfKTnd0pVLSp6PVTWaxpWD93gYjdNBU1wSw2UjM7lgRcAWJFCwsSb3DROLzAuXlAIZw3VqPrSM8FjkB0plMolnzMkF3NyakmxNKVjb2haZKCgrmSDnJIcCtKO4fWG6D7bU94RCwXhieQvUMbHWrb0+m0UkrSoulORJUHGbNoXagfW3+7cNUyKUFR1Bbbat4tKQB8CdxfXf0Ea+qo1fiLTgygkKDk7WzW717QfwThpUgrmTAhBLAkcxLPy7HqR5bBzZaVOHLjehHeNMN/TKASWNC3oNzZo5mrZWgftDQhWBadFN42tEtspTLFEqtmANVd2LU28oRqUkkqSuujBgTuos31q28b8XxwEtMvkSC3NlPSpVckFwzMPjGM7AFQGROUhhkCUjM2oUFEKckMHJYamgzaOkoWziMYMxI5g0/GqIsSkNUufTvVorg5gIKtqdqtuPUdBGuIwTTJeXMsGmbKQM7mm1r9oYDASlqTJlqLJDqWSmharsBmSMtgkXrUQ0sgGPn9JS9MRZm/CJk1QUwQEi6yzJOgBJdyB+1I9xShmzibmUEnLlBYOalRXZ6C5L+kWXxWTKASCHFhzMGOoCWKlAXf4iuc/iSV1QCaMSpIYOXIcknVgaWraMgDbr20I7cEFA8SuE4bLJzLmFRBvm/CfhG86aVD+k5NUqX7y/KtPLbpAmHAooVANSN9r2PeGaMcgAMSpX6sqgyT/lRyWB3iMWvzHaWoriuPzE+Iw6paHVmzKDnMkJAu4DXNdyd4VIWxCmdTGHPHcSVIdsvMWDaNXWuh84USVV3/AH/1HoegJOiL5zMOuAHNTrfZGWmbIqE1XYku5AelHDk32MdAnhqkminADMWOrtX5Uvakc77HSlKTMJyJSlYAKgahgWBBFTW76bwyn4gJdpwJJcgFrtZ9fSPLfxFWPUsAe8euoQgAjqatORgwej1JAtTUwKmVJXyrlpLh+VRzFjr1c7wkE5cw5kKCgCxJDGl2OatibQRMK5aXzIFjmLu21xzOTcxiGgVwGz9ZBrDkxnNV4aSEEgk7mju2jsHoKD4QuxWLXy51pQMxosh1B+VhShGl4TY7jrJUgZVZQBnWtwQW0SCTqCaW6wLg58szHUqWpsrlKCtVlEsQogOzdKU0jZpdGQNzf9XGjWBOJ0c1cmYgrKkFILKHvDSg2JDubiE6/aBKM3hJAPupKg5y9OvnCniGNmTFVYJFEpDAAdAKDePJcgKUA9etAI0L06gW36eIttbNLzNMRMXMUSsgg3a4/aMhhkj3aCLYoZVFLvS4jMKhw4xxEM2aPM3cR7F5eGmEBkxIDHmF6vEXcMD3t+3w0jfiGIQCQoOd8xb4EN2gbhaw4aLcSwa/6kwIBBLVLEWqBZQ0+1z6Pq9MuoA839pjORA50vMM1QHDgj9VLG9esUmpCL1+MDSyU3sNIHxWIJ91Vt7xhCG6vEGrMYIxzhtQbEfNowxEx6gBR1Z3PxIhamYomgrBMjELQoKGUEPRhrelvUQfstpsRijbNEz1tlqDQhrjtqIIkBZUxCyHqw6VBDtaK4ri8whQDDMXJAAL90xlNxeU0US4Dv8AEN6RKYjgCOBjWdJloDUU2gAc1sXrp5O0Y4hYMpZSlhVkkua+kKZmKcMA3mfk8XlTA2UGvy+ERdJhXzgObMc8OHKXGn52i6TRg1Wd/X81jHAqOQ68pi2AUlSgCOtVBL+tof1xKkEeIsXeIfwyZLIyzEZlaKBZQOjsKg2ck3gydwuXNUAlfhqFwVJWKbEMQXoxgHGYVfikISWqUt00cBiWfuxjBMqYus5K6H+0AsGDkkj62jkkbjuDV+/E0AXhhGuD4aZSlqmo8TRJAzXB0Y5aalMBYTh6pQOQqUDeWMzKBNHYM1NWPSJN4hMlocqzD9Ls4CdqvSDcHxNCx4qiAQOd7mlMwoH61O0L/qAEnIOMfD4doygDRmiMqFZFVQU5hnzE5XPLyEpKjTa9dib4Z8JMuWPDTQ5SSV5feqG3d3IG8Jf/AMjQlKjLCq0B76VNR0rtA8vjs1WY5l03AISQTQp0Gg+jQB0NRs1Xz/tGK4HM1X4ZVklIM2azN+lIqdBp3bSPJsuYgnxGOU+6kEjTVgMtv1RnO4qFDnCjVmdhmqXBQoN2Y7vtMFiU5SDmUkuAVE0USWLVpcGvR4fRA4/MFmDGUXxIqAsMtkg79u3zgzBcQGU5ylKT0Jq1rGnbpAuWUSpSmYD3f7q+8FMWPQgxn/RygJCujsC+71/GiFVPaJBKNZMNxoUq/uh2LNSrdCzQulKZia0hgFHKxJoNWqPlvWF6BXbz3jrdD/tj6xTtbZjfB8RKZTJyqSpTkpIOmUjcOAIJTjwopypzEUKQBlBbswLXd/sjlSEJHNYvR6Wrr0iywslyogUtRI7OwEc7qOmVtUk4uHvoUJ0CsYiTbIlQJZIqAyi5LXuKNCfF8SK/EzEqKi4egSkCwFGJLk022gKYtILFQcBmSCf2jBakkgOQDXMfkzGL0ejQZNk+ZQa8TwooWCS92LvpZ+VrW69YYYXEhI8NNwcoFatceUBmeEj3RRyAfStdi/nWMZc9JUSSrMUkJY0dVDXShIh+ppBvTUZiowxuJytlAUpQLDMDs1Gr1D6iK4PCTFqCJiMhzpOYhrlILPRX1Y9YEwXE8jFKUvUqUsqJNwnlcJdL37WhjxD2iBQZYAmLUkEzHIIVcMRUkXNWcm8Zijr6VH1jlCVdx7xtUgpZJSVggcp7029P2hbgsPKJ/qLy1FBrAk3iucA5qAAEEAnMOwqKH63i2G4ipSsyGTmdJOUApoWdkgtfVuxjIug6rWYwhGbdHSsNJ2X6KH/yj2AMv9y8x3DF9qvWkSA2HyfvNG5fAiXhyQ7l6dTBuKx6whaXCUguCug8juYV4LGoTVWZPdJb1AaFfED4k1RC0s9MxI06ikeq1MjE46gzfF4xJDjW4enkfpC9atWbpHpw62okt/jUfCMT1eMyoBIBU28fYCM1LePABF0ylGwi6AkqaymIax3AeNxhQag6WvX7QEuWpBGYmNUTcwuxdvLv0gSDyDJk8TSbKq1CejuIvKklwo0+0eS59GUDT5djHks1DMBtFrdiVmOMIR4ZPQ/KFSphTV6/H/UMZJaWrqCPgYT4dYChmSVDzDdaV9Gh3UDj5QUjzgwxBRmS6U6Emj9iRQ7x0mBlqAInKTM2JADajObAVG/cCOUVPngpmBImIuVJq99mUlu2nnHsrFy0MSJi1kkiihlDl/e94jt6Rx9bRL3VfQfma1KrOkxXDhOBClFwQwSALdTQu/zNoUS8D4isj+EHfKUPQXqcoYX841l8aQoDPLWqrOfears3uitgRvG2ClyUf1UpYJSSCAfMUOw73tCV36YIN/DjmEzAkVKYjhqGDrOn6WKmOhfo9HjGehCE0lB+ZyRers+nzg7+MzJ8UJQWo6wm+hAUGT/qF6Z8ls0yZLPMWAsPJOtjs7wSFz71mu0jGDTMMtY8RqF2GwFadOtIknFjKoKK1MQAxLCpt8elTSrw1V4KgV+LnzBlAFIzCjAkvoNrEiAZQkqKxLkqzAUBU4YXfKzEnWGq4YZBx9KgnHBgc3FkMRyvfy2N/KPcItZ90v0p1OvaPcXgVHKQmhfKhAzsNHLVP5SK4VJYpClJ2Z3+H39YZ6SLEUwN5jcoIUXVU5Xq+n72gWaKuBFJS8rcxLHYj94smcNv9Rs6bCgRLe9YmxmlIYaj6/KMAlRFRejqP1Jr5RpiJqgBlJArb4QCq5evXe0C6neSKhEyywNwxJe5+weNpssMGU7BgzJO/wDa/rAYLh2BcPX8+EZmtBX83iKpY8y1apefNcdBo9d9BGUvE5TmazgAh7vGJQB+oP5/GPfBJZyB12pcxGrvGA+INMX0eCsLOy/pcEZSxqXL3ILahxESEUCai5Ovy++keziA+Vg19fI6QJIOKljE2lYgoUSJWdwXqpns4AoDQd4LlYk8hJJS45CWD1N/+4ecAYTFkUDOd4JmYolLuk5TmqAA/wCoAEVpC3XNVGqwrmGzJiSSVBWY1P8AUVfziRh/FKNcorskAeQFokJ2fuzG4m+APN94HxMqV4ilFIJeNMDOBIrAOMxDrWBvHV18qKnOAIE1VgZbjlKNQ1KfWusaL4aCSkTMwG4zV2u4PZoXTpzsM2XyisnGErPNq7ijncVjMoYDBhKZvieHFFCg1sUlwb2BrpvEw4Qm6yFdQw6btpqIJlzVLGapCqAOQH1GY0B6/vGc3h2RBUGKSQ2qhdwrS+UOCx30E3dmhET0yUrRVOZjQitKWKS8BzZAFMuU+Yv/AM0e5EGmWu4P3MepmsKFaexV+PEFDi5ViBrKgp3/ADpFsGu9LQaZClNRCn3Sx9UtFES0pUUlJSdSkuPIK/8AKGoyk4kOYdaWegL+hhPImnMMrHoWPqDeG2ZJQRmuD7wI+NUjzMY4fCqlgFKlEtm/TlB0bMCDXaD128SkXzDOFzgn9ExBurICgAtqLXcW1F4cyVBSMqpQMss4JCS2xyje9NxC842ZRQCLCyi2r6sD2gbFY1K6KUk7kVD9OWn5WOOyF2uvvNN0IwxfEpCE5UpyhPuC40D2exNQYAPElTHAJI8g1NNh1vCrETUf5Hzt5aRlInkE5S356Q9OnAW+/wAYvdZjHEzyzrRMIblKgFW82bu8acMxktSqoGaoGVABI0qDf6axvh8QgoSoqUpOtQClXmwbr0jfBLlpDDmNbgXeo0J2gWelIrMhNS/EMCFBIyAqAF1e6kmruWoDqPvC7AYYDMplJY0UCWubEeQ1gteINWNSfdykO/YVEXwuNCAcwJTV6gh/Sn50has4WpQezmGpEwApCiVKBrQK8tCdaNrrHPrnTQGzUqzi/wC8OZOMSoNmBLUqkdvdI6xTGcNUpYcguOr+j+dBvB6QVWINQiL4iiUpRSCWBBL9aBoMlKp3H55QNjwmUvJnqLOD52oIvIUW7D8+cb19Imd8QmbOSlPOhS6kDKWNniiMYktkwwJ/zUfk7fCKzFuks1wa+keT5yqhKgNymn7+sI1Mti/1MsTWXiFgv/DyW2CH9CbNTSsYT0FycoTVyHDDfWkUlYMLJdZ81aD510HSPRKYdAC5A2drXilbacGVmBzZCySUh+xH3jNGHdXNToa+ZjZYQliUkncK+1tokiag0SF7uouw6FqG8GWaMU5myUKlnlIJHQbg73jATTmOdIV1JsCX9HekGCUSOVI6qdj1dn6wRiMAlCc6lpdN0u5Uk3OW9LtehsawneBzyY4jvFGICbp0rQ6RkkEqFHAZwNU3Neoh2OGpKVBVzbKRlYkGhc1MXTgEoCWIJVYXe3TqIMaygSFcxd4MpPKs8wv9NdmiQcmXPL0WakUDihIpy9IkV7UfsyYmeFlhx02hZi086iTqYb4W7j0hUpIUTu/1jo62AJnnkiakqCSElzqPSLzJFQwS1+UAKbpR27RthuHylAuooWCHBsKgO9xWG8r2OKgVhZoHHXsQTCl0Sx9MAsoOYrwHKyZZykXCte2xYQNPxq0qBCyCAQa0KT+wFCNBtBGN9nZqQV5w13Kku/mp3gTG8PZAWqZmcsGFdNXgm0G5Ihh1PBlEY4WUlL76RrgilRNb0JY/loGTw9LA5i2oy/vBWF4cqi0lWUH4gVb4/ghbaZrEvmGypeX3RTrp+UiuJklatTSlLftq8ZYnGkg5coYkgOSe1U6d49TiV5EhTDNtcijOX6xnVHBsyHiVQcjhTgs3R4zlsl8qlZjU1IHk166vBiMQMqklKWVuAXPmO0ATkLS4TUEO5anSp/PWHMWbkyKJrLmuOZRCu2YEUaqgdXgfEYwKLFKSN6pPwLRaTJWpOYnKB8Xt+GNZvClEpCpgY0FOtK+d2gbAOTGboMmem6QpB8lfNo2lTwKFuhKC/wAFfSDcJwJILKJLGoIb0t01i07habFknTKfV9IoshkqUweMCVZkkPZ2W/Y8vWL47FJUc2VL661+EU/l/hpzBebZwQBY7100at4AGIKlM7voYUdIFrEBi3EuZ5KrCooPtX5vBeFngWJJ2o3atPSFs+SRWhHQg+rWjbCp+ez/AEg2QFZVd4zK5ZqZYSpv7Q++7QTKxZzpIUhmINObyL0HaE2NlrVzZzT8ev5aM1YEk5czK2uD0AS5+MB7NCM/3hjI4mvFJoXNzDo1Gp20Mb5Sm9/QebxpguEcwzL90igqzaGoY2gnFcDmku4YG5cM29CAfOG7lFC/1iipMFwRClZDZX4IbI4c6gMjgC2Vz694CwHBlqV7yKX94t6JaN8bh1yScwN/eY5WaEaoDdzIQALNzTFypaUkB8zFsqbFtzTb0ig5hyoJLBq9jYigvGWFSuYSlJFXqTa2hq3nqYriuKiVlQZauUAOnKrsSd/Mwgadnaps/GEtHiaSFS3abJzEDlyinoxALaveLzxLS/hy1EBqlJFemhYiumsBI4mgOUoUkkuFLpa1ApzUW+UaTeLEoKTMBN81lXezMBp2hn8u5N/mGFrvNMRglGWylqSpSn5AAG3IBqOjva0URwwIqHmBrsbWeqba7Gu0ZYrjaQOVRJapVzFztUAehjyR7SryJDhwGKimpEGNHVrkQhg5jDATgMoWQycyf7qpZiRqWL+sHZEq5gWLO5SbVAADNevb1jmP5slJUUqUVEu1fe1etP8AUVxHtAtQYs3q3aKboyxu5e4d42Xj1yypCUzCkKUxDsXJNL7xIQ/zVY2+MSGfyy+JW+M5JOlKfnlC6TMSDsRfUekGpmcpbYwol4ZR1F7x0NUWRM4zOpl4MLKZiDlJTylhcP67Vjp+BYuaWExSSGZsrK8yCx9IVcH4WZksBK5fLbmAFtPS0NuGcFn+I/KA9aivZvxhVo1DTAozKzXicn7XSymaR+kqDdqk/FvSOdxUxRRLD2zfP9o+n8e9lZ808ssq2IZvWE8//wBPcQySqW7CwiaiFuDD03A5nDIxaktQH/mf7w64HxOW5SqWFChAdiCLtpbcGJxb2aXLulSTsR9YTYRBE1GhCh86/CEAMrC40lWU1GXHuFiWQuU6paq2qH0MBSZC1VTVv0kh/IGOxxnFeVITRLNlFh1AhLi0BaHKghSTyqJam25EO1emU5BidPVNUYoViNyxGhHz2ii8S7/eK42WScxmBRIvUP2YQK7XPpWMJSjNQjOTjiAAEgs14NwmIl5cxBUt3dwGFLZiX7s9TCdEtVDlV6GCpPD5qiSZZAZ3LD5mFsiwlPiMU8aTm/8AcVvUdniv8zzApzKSC7EhqP0vGMvhy7ABtbG25tGmMwGWWVAPZmYsNbG1OsL2qRgyWZlj1k0E8kEXIV9/zrCqY2heCUYGasOEltzR+z3gAiGqtSXc2EzSrxczjZ/KBouiSVM0XUqFSZ2Ysd/zqYO4fKMteehcZRoepOmkZYPD5Q5D+f07w2wGGJQp05U5XdQuw5cupq1rPCWbsstRcphMcFTQHGU1O+VIq3/SFRqZk086pagkkEJSzl3pV2FhQE084XYTiSULNEtlISAmuY0LqZ9CC70Po1VxNcwJKUEAWYgDV6O/4YoqbzCrEE41MmACZKBlFL50PUet/sYw4Zx6cv8ApTF5gQ3MAX6GlYPxchM1JC1FCiNwOWrU/tLGnwhSvhvhqdOflYuVI9crgt5xSuvBlE1N/F8MlJXkDjLyhVW6hwO20DYlMya6kAlSbgEA+gZ3GgjbieLQShSkDVKkhr0I8meMuGYgJUZmYIFQEAlyNk7nQd4vZR3DmVUB5HdSydWAr5ObVjXDyZc0kIRMzdKhupahv0hzisIgZFz0pMxShyVozOFF7hw+h+MGcNnIZRSw1AAAr1+EE2pXNwhFJ9nAkBSypjVnDjuAk+rxirgRBGVQILOSDT76QwxHGpiSbC9Dt9YS4nikxRd2+21dOkCDqMbXj4yib4hifZxAKgucyhcBNvMloULkpBZJK2IqAz9tYdKwcybKCvEd0uoqJKqaOQKPo92vBGA4WMjklSQ5AOV6WKRXWtSe2sM9pQ5uEViVUjKWrT56/GPY6Fif1jzf/wAREgfaCXsi3Cl6dftrGGalLux6d/tEws1jG8vh5VMplDmvMnuaP+fLRrOoFmZlPqoTbhmLmSAVJVVQZQ0794cYX2uUSlKkEkMkEKHlRQZ/OEeMw+QkAOLhykFurG+hF4GCVOEiXzGwu9NAaQtOocC1bEj6QY5E7NHtvMJyoUUq/wAn+QhpgOLYiZVWMSOiQ5+EfOJSPDXmWJgYmuShNaO7VrDBGJQtIJSUlr03uzv6bRt0upBHqqJbQA4n0dU2VNTlmz1K6sxhWv2ewWZ/GI8mMc/g8BiQnxEzUhG5U4bok3hpg+Oy0p/qSkzSNQlvWrRqtTgxJRhxGJ9i5K2Mua46v83gPifsWJUtU1eISEpBpUk9B1h/w32rlKl//wA6UtpYQB7Wcaw6pbLk5n0zEQthfIxCXGO8+ejDBTkpoNTGowqGcJDhmZrfm8OROwKh/wDqXL6gu352hfOwy8zSUCbsykh/IsXjK+lQtTNaEcGYSSaABL1ejkbXoI2m1OQKHUlz+79IDn8SKcyDJVLWDW4IoWd7B/WLYHFpIIUpnIYOUj/uBck2qGvGQoze9G0CKhvD5AQSc4U36dK3oYP8RKqqDioc/be2ukL0tmLHkqw86MVNTT7QFiOJFKlVL1YMCNq/GLOhQvzJuFbRGMxYUxRN1sWyttejecJpXDvEWVTDldRBFnPTp1/3Fw6CkKuoW6RpNnByQ5agYanqfOA9QxchrmSTwKX+pShXo3q0Ffy/DywypjE65gCPJm3vAmFxZURLVd6A22ofy0HHDBaCiYl+pqR2OnnCizKaY4hJkcTfx8PLqVAbOHL60asBYjiUxcw+EppaGzLLhna3Xpcwqx3A5iHKDmSOtR94HOKUEBA5QKlv1E3JOtvSHoi8g3KJPeOMTwqXOKlS1qzGtSCD5AXPeFMybNkqHMR1BbMO9ztW0TAE8xCylv7bnoBcn5QdiuIZgHkrUQfeWDU7sA2b9oLIkxUphMTMmTAVvd3Lh81KA3p8B0jHHLmKISsggFk2e1nvpGC8UsKCmKVDVq+prE/iTUkj6v3vWsQKBwJLxUbIwckynnLINGL9BRqmx1t0jXx5Moo8KWlWgUUh+vmN+ohXMSrIyQpTsd2Ucr0YvRvwQXw7BTlMfDOQ3BoCbe6KnyHnFSznAjJeFQtXOACoFmoQW2G9W7RJ2HMlLJztZIULbVeg6NqawViOGJDPyMoJDhjm0FT8/vA0/AFZAM8hI94HQi4S7BT6RR2tiUVInOcQmKUc/MRYk6H6ecCeJHRqlyUkqMiahgxKeZCh/k1CegMZKEtTZFoMsuSkhNLkuXCgW1gga4lVPOEYCXNQPCURMQMy0qBZTM2XKCfiDFlGQpDElMxP6VFTv2ffu0Xw/BZS1Ay5oB2BCr7E2PrBGPwuVJKwpTMApTKINL2cM/SFuQ1VYMIYipUuQo5uYPpmSPhVokUVITsj/t/aPYr6mXfwlULAt3g/hk+ao5pcoOj9VXBNias2lt4VSlBznSroHb1pSD8FOYEJTlUTRjRti55vOGa5taERpoFNxiccnNmmINRUA0zWo7UF9e5jOfxKaE0JKXcakA7UsXhYoEVuAQ43HeMPGNcpbo/yP3aM40RcaX7RnOnqnf8Atha8rVSSSRf3crBrXt1gPDFJHMnmBYEHXVx+fCAxNU9yD0pD/wBiMGFzFTFhwk66n8eNeho2doiXahZjjguFmTpCUIS+UuzPrro3eCT7JrBdctbDVLVHUCNJ3Gj4pCBlQKBqPDrBcYUWfaOr7IADvMRdriA4ZEpCwkq3AVpCPik9Uw6skfOO2TJRNWc99o53ifDvBmrSPcWmkAVPuxit3iLCqBICvdepv9qQ64YSmfLmykMHL7dR6W7wklSlKORKSSS1NY6XgmHLIQujXGrxNNbsGFqNQsTqF8Pw09jNR0BsR07Rw3tl7F+ESuSSU7G/rHVCcqSupcafv8ILxM5M+WWu1vpAtoiANYifHpE1UtTpoQf9uDF14kqOZTnT/cOPaPhfMVJFdRCSSpQ5QL0Zoy6iFMGakcMLEa8OC5kxS35WAokgdgNW+Zgibhyk5QnMHflYk1u7d2i6BklpS4IFAOutBU1jfDLyJCyan9NgNmjDliWPEeQANsCm4S6g4uQbEbUs3ltBGDxSj71wWoN7knbqDG88qyA1G2rP89NIVzZU1C/Eyg0e9GbYWPSKww2t9JdbciMsQSBckfID5xyWPlZFkC1xHUYSclQzeZFj6Vb8foHjDJmKbKpTm9A27dG1gtO0NGRhebifDY8oUDLcUap3vZtWjbFY1azVR8qD0EPEypIoJaCOgFP+oj4NGs+Thv8Ahh2/tDfKLOsoNQLHmcmZjPr+fGKzVUHWOixXC5SqJlrSSKEJOX00LvtAc32cWkjmCk+YeCGsp7wtjdhNuHcUISBMSFAnlSAxPU7DQansIJm8YUJtQyFsmtgbOb2FMtBehhaOHTQp1pvqCG/1BUyWrMoqyIzAMVoqohyeg3zdusX6LsSergzbimNmJnBKlAoygAJoktodjFkqzpcrBOq1M2jgA2SKgecIZywHAmFSTVgGr5u0ayF5ksXAJ8j9IjLUG7nR4LHpcJQvN0SMobf3d4rxXDIV/Uypf9QFFC+qakdITLnZT4UoBJLArBc9ajSMsRPIPIpstARQner1MLOnZsYkjNExK0hASl2uXfrUForOQpmBALCoUQdBfN84E/mk5aQhBymlEgDMz1fepcGPeHoUlbzQaPQ9umoBf0izYGTxCwBYk/lSNVOdeY//AFmJHs3iSHLN6CJF20C5ES8zEv8Amsey5LhyAwLE9ngmYtUtwFNoRcHyIqO4MYJ5lMGTm2001Pf9ov6wiKxKGWBUG+9usVThUE0b1NDuBR+0UmSk5ixcOWJDPWnwjw47L7tD/dq/e8BTXgxZ5hXgpFlOO1fnDbh+ORIkKABKndkguXjnZM1P6oNM0sFBiBdtO8MR9TTN3AKbsGbDiCyaAo9L/ONMRiVEjLzMP1vW92P1gJc8kHIS4+P5SMJfElP72nzvAMdR8k38yZYUDgTqeD8alSZMtMxaisZs3KSzqUQM1jQixhjj+N4ackETAFD+4EfSOEmk5QoEgG9X+EZYeQlRLk+X307RqTqHAHGIB0QZ3vCkSQmYpBCyW9wg5Tra0YYSe0x3N45/2d41Owa1+CpPOA+dOYFnajgg1uDHTcP9tsK+bF4PMskOuUSB5pUqh6PGterUijzEnQYGFYucVZhHnBJc0rYIU3Yx33BUYKYhM2VLSygFDNdja8N0YmWKJKfJoja/gSDS+M5eR7GyVjPNSpzpZo4D/wBQkycMoSZUoJWeZyXLfuY+v8RzTEES15VaGPmHtZ7FYrETAoIzEJqoGp9YXbOpsxgCowqfOlYpZLlRjfDcVmS1ZsxJ6kkjsXpB2O9kcVLLeEqnrCmdw+am6CIQyGqIxHhwcgwv+fTSoqJodBT0aGWD43KU+Z3O50+RjmVSVbGN5PD1KDwl9NTkxiuROixikFPIGzFiqWQSQf8Aq5bVPw1hPjMck8oQkEBswJ00697xjIwU0EsmpDP01rpHh4TMF012cRaJY8yFofwzHy01Wkn5en7xp/OsquQKTLclhb59ISqlKT7ySNo8TiFCFtoKTcWZ1WH4+g0ql6aD4WgmZidk2cglTu+z944rOYMwPFVy6PmTsfpCm6avdjBqNxcc4rjM2Uo5paSltCHY0qztCWfxZalBqAWSWynuLfgjOfilLOrbXDn4RvKVYgJNecFiaOzbDp+ByIFGRmTcT3gyp5LvUmu/xiylvcA/D5NDCfw5K1PKGYvUiidHv52gnEcORLAWrkFlAc72/uNPSCDAyqzEom5fcdzRiyvQ3eCsPwtZDqBSG7/WNV4+XLBTJS7/AKjf/ULzOJLuXi89pRhsqUEKBFCKuSXHUARuJ4ILsHc2qT+GFWcx6qaos5NKAQBQnkyrjRKtkjzZ/OsSFVYkFtkjGeBlDGu2np6wGqbpQCDZiALB9yNIzlzWqPwwK2BBAPeDLmpsI0wuBXMLAAdTYQV/FixSH7CNcNiDcRA9HiXN8N7OgVmLdI/tp+8aSMTKke4CEr5a1bZ30/eMcelRIIJHZRLPZ2pHk4S8igtQFhRyxNoJmuqkwZfiGGyLBAZKqjv3hTNw5JNKPfTrau8EYfF5kpQbh67ijR6vCTMwUkHYfX5iAypxLUEwhPBlmWCSQlzVjQMdDp1MBTJCpRAUocyTa1DY/gMOJeJmEgGblb4dHAqe0a4/HJUkKmy81WOUAqIs5cU7VvEXUs1+zDAHESBYBSVdbaQYiaD/AJDY1EM+GKwxXL8L3nfnLd2cMT2dqWg3inhzFFUtCTlpmA9/foda/GGbbW5V0ai3C8QUkMlRSRQZTen5R42RxzEoL+I4Z3NPzygTF4dUtQWD1NaDoe8bS8P4nMUNs1P9U16RQ1XGIBVTOs4N7dmUQJyVrTRygWfUOXUB2Ed/J4xLUgLSeUhwemkfF5qUhPMoJaoe9Gobw84Vx4plICVlkhhcUFo0aT7zTRTKy+7O6xftDLJIKXA6XjieOcdlLWWwyFaOUuY8ne0czVah1BhfjeLzikn+IJG1o0bkQQRpuTZgOLxkpa0pEhKa1YG0P8FwvDYiiUmSQKlTt8Y5HAKmqJmeIQTqVNHuMUonmUtXV3EZxqjJIjQhI5nQcU4Nh5KgDOzpN8unxrHieHSAP6WJKQbixjn5OGQtJJWEnqde0DqQl2zAtqLQA1NuQABCIIwTG+J9mkLL+O9GDxUezhH/AAl9wPpCaZOYMFH1PyiicasWWofKJ7QXdfeHtMbTOBMGVLBbUKZ+9IH/AJTKKiVS1JH+KvvAqeITdVEjvEXxM1D1+XnFF2PEulEvPwclJf8AqXsQB8Qfi0ZDDoyqUCAoWChUvc5oCVPLnXqYuid6Qu2BzKuUXOmC2Ya0f6Rp/GzVJKSolLMc35eNJOZPOg1bpHvgzlpMwgkakqFPUvBVY9Igsagv8J/mgHYv9oscEpnBSv8A5S59CATFTIWrfzg/AShLZSuZtHYfCsLZiou5YyczOXwaaUeIQEhqZixP51gdUjKQSHO2n7wz4vPQwEkKCXc5iCp+926QkmzybwKMWyZbUDQhlB/YPIfaPYATiiNYkN2yXDpWLIsS0WDnWPIkA5riLPM2XICjmAoRXvG2ESlLZnq4/PSJEgzLhGV0vq4BO+xPUfSMMZw4E5gcqHGYbdQOtYkSKECXmcMloyl3cBQuKekVnYkZV3Chynerk18okSAZRu/SFpZP6wXDTiUqUVUSLkOT9o14fxYhYCmymjgWOhbUbjaJEhg01MKEcaliWQogBdwRbq41fyicB4qtSfD94pHI9mrQm9/nEiRYwMSzmapKs/8AVLquG91PlqdHgTiPGwSPCzA2zWF9Be8SJEgy01wkOHOqiXMFYcqKAQaj4jSJEjEdRlyPME4lf4lR6tAWOxT8oJ6xIkbXJqNMuFAJSAu5YUN4rNzCJEiiMSLMsx1iswMXjyJCzCbiUWn4xZCRdokSLHEpeJVU4qBSmx8ngZCHiRIaOItjLTKUEeS7xIkUJO0NRJAAevyj2XNTa2waJEim4ih6jmWmyF0Z7E6Cgu3Nb49IzlLSlTTAq9Qkh+tSCHaJEhK5GY9lA4lzNQSQnMalnYcujizxmuUg6Xs1PoR8okSJxxKY1Bv4MRIkSGWZc//Z',
                // }}
                style={{
                  width: 77,
                  height: 77,
                  borderRadius: 100,
                  padding: 1,
                  opacity: 0.6,
                }}
              />
            </View>
          )}
          <View
            style={{
              // alignItems: 'flex-start',
              flex: 1,
            }}>
            <Text
              style={[
                style.text,
                {
                  color: COLORS.darkGray,
                  marginStart: 10,
                },
              ]}>
              {data?.name} {data?.surname}
            </Text>
            <Text
              style={[
                style.tagline,
                {
                  marginStart: 10,
                },
              ]}
              numberOfLines={1}>
              +91 {mobile}
            </Text>
            <Text style={[style.tagline]}>{data?.email}</Text>
            {/* <View style={style.resStarView}>
              <Image source={icons.star} style={style.distance_logo} />
              <Text style={[style.distance]} numberOfLines={1}>
                4.5
              </Text>
            </View> */}

            {/* <TouchableOpacity
              style={{
                right: 1,
                bottom: -8,
                position: 'absolute',
              }}
              onPress={() => {
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
              }}>
              <Image
                source={icons.shutdown}
                style={{
                  width: 25,
                  height: 25,
                }}
              />
            </TouchableOpacity> */}
          </View>
          <Text
            style={[
              style.tagline,
              {
                color: '#0638ff',
                alignSelf: 'flex-start',
                marginTop: 0,
                fontSize: 12,
              },
            ]}
            onPress={() => {
              navigation.navigate('EditProfile', {
                item: {
                  name: data?.name,
                  surname: data?.surname,
                  email: data?.email,
                  alternative_number: data?.alternative_number,
                  mobile: mobile,
                  userId: userId,
                  apiToken: apiToken,
                  image: data?.image,
                },
              });
            }}
            numberOfLines={1}>
            {/* Edit Profile */}
            View Profile
          </Text>
        </View>
        <View
          style={{
            marginTop: 15,
          }}
        />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Favorites');
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
            Favorites
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
            navigation.navigate('SavedAddress');
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
            Saved Addresses
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
            navigation.navigate('Wallet');
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
            Refer and Earn
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
            navigation.navigate('ContactUs', {
              item: {
                name: data?.name,
                email: data?.email,
                alternative_number: data?.alternative_number,
                mobile: mobile,
                userId: userId,
                apiToken: apiToken,
              },
            });
          }}
          style={{
            justifyContent: 'space-between',
            marginVertical: 15,
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 15,
          }}>
          <Text
            style={{
              fontSize: 16,
              color: COLORS.darkGray,
              fontFamily: 'Segoe UI Bold',
              marginTop: horizScale(5),
              marginStart: horizScale(15),
            }}>
            Feedback
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
            initiateWhatsApp();
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
            Chat with us
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
            navigation.navigate('About', {
              item: {
                name: data?.name,
                email: data?.email,
                alternative_number: data?.alternative_number,
                mobile: mobile,
                userId: userId,
                apiToken: apiToken,
              },
            });
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
            About ChefLab
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
            Rate us on Play Store / App Store
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
            marginTop: 80,
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({});
