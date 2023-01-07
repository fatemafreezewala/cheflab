import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import {API_END_POINTS} from '../network/ApiEndpoints';
import ApiCall from '../network/ApiCall';
export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  // console.log('Authorization status:', authStatus);

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFcmToken();
  }
}
const getFcmToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');

  console.log(fcmToken, 'the old token');
  if (!fcmToken) {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log(fcmToken, 'the new genrated token');
        await AsyncStorage.setItem('fcmToken', fcmToken);
        getRiderInfoFromStorage(fcmToken);
      } else {
      }
    } catch (error) {
      console.log(error, 'error raised in fcmToken');
      //   showError(error.message);
    }
  }
  if (fcmToken) {
    getRiderInfoFromStorage(fcmToken);
  }
};

export const notificationListener = async () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state: ',
      remoteMessage.notification,
    );
  });

  messaging().onMessage(async remoteMessage => {
    console.log('received in foreground -> ', remoteMessage.notification);

    PushNotification.createChannel(
      {
        channelId: 'ChefLab', // (required)
        channelName: 'ChefLab_Channel', // (required)
        channelDescription: 'ChefLab app', // (optional) default: undefined.
        playSound: true, // (optional) default: true
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );

    PushNotification.localNotification({
      message: remoteMessage.notification.body,
      title: remoteMessage.notification.title,
      bigPictureUrl: remoteMessage.notification.android.imageUrl,
      smallIcon: remoteMessage.notification.android.imageUrl,
      importance: 4,
    });
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });
};

const getRiderInfoFromStorage = async token => {
  let t = '';
  try {
    await AsyncStorage.getItem('token', (err, value) => {
      if (err) {
      } else {
        if (value !== '' && value !== null) {
          t = value;
          callUpdateTokenApi(value, token);
        } else {
        }
      }
    });
  } catch (error) {}
};

const callUpdateTokenApi = (apiToken, token) => {
  const body = {fcm_token: token};
  console.log('\n');
  console.log(
    'UPDATE TOKEN API POST REQUEST : ' +
      API_END_POINTS.callRegisterToken +
      '--------> BODY ---> ' +
      JSON.stringify(body),
  );
  console.log('\n');

  ApiCall('post', body, API_END_POINTS.callRegisterToken, {
    Authorization: `Bearer ${apiToken}`,
  })
    .then(response => {
      console.log('\n');
      console.log(
        'UPDATE TOKEN API RESPONSE : ' +
          API_END_POINTS.callRegisterToken +
          '--------> ' +
          JSON.stringify(response.data),
      );
      console.log('\n');
      if (response?.data?.status) {
      } else {
      }
    })
    .catch(error => {
      console.log('\n');
      console.log(
        'UPDATE TOKEN API ERROR RESPONSE : ' +
          API_END_POINTS.callRegisterToken +
          '--------> ' +
          JSON.stringify(error),
      );
      console.log('\n');
    })
    .finally(() => {});
};
