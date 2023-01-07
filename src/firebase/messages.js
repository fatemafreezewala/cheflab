import {firebase} from '@react-native-firebase/database';

export const senderMsg = async (orderId, senderId, long, lat) => {
  try {
    await firebase
      .database()
      .ref('messages/' + senderId + '')
      .set({
        message: {
          driver_id: senderId,
          orderId: orderId,
          lat: lat,
          long: long,
          time: new Date().getTime(),
        },
      });
  } catch (error) {
    console.log('EXCEPTION IN GETTING INFO FIREBASE DB -> ' + error);
  }
};

export const receiverMsg = async (msgValue, senderId, receiverId, img) => {
  try {
    await firebase
      .database()
      .ref('messages/' + receiverId + '')
      // .child(senderId + '')
      .push({
        message: {
          sendBy: senderId,
          // receivedBy: receiverId,
          msg: msgValue,
          time: new Date().getTime(),
        },
      });
  } catch (error) {
    console.log('EXCEPTION IN GETTING INFO FIREBASE DB -> ' + error);
  }
};
