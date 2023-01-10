import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import {API_END_POINTS} from '../network/ApiEndpoints';
import ApiCall from '../network/ApiCall';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {Platform} from "react-native"
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
  try {
    const fcmToken = await messaging().getToken();
    console.log(fcmToken)
    if (fcmToken) {
      console.log('the new genrated token',fcmToken);
      await AsyncStorage.setItem('fcmToken', fcmToken);
      getRiderInfoFromStorage(fcmToken);
    } else {
    }
  } catch (error) {
    console.log(error, 'error raised in fcmToken');
  }
  if (fcmToken) {
    getRiderInfoFromStorage(fcmToken);
  }
};

export const notificationListener = async () => {
  if(Platform.OS == 'android'){
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state: ',
        remoteMessage.notification,
      );
    });
  
    messaging().onMessage(async remoteMessage => {
  
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
  }else{
   
   
  }
  
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

  ApiCall('post', body, API_END_POINTS.callRegisterToken, {
    Authorization: `Bearer ${apiToken}`,
  })
    .then(response => {
     
      if (response?.data?.status) {
      } else {
      }
    })
    .catch(error => {
      
    })
    .finally(() => {});
};
