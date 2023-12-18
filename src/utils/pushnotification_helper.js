import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import firestore from '@react-native-firebase/firestore';
// const admin = require('firebase-admin');
// var serviceAccount = require('./notification-314b0-firebase-adminsdk-3v1m1-35caee8623.json');
import firestore from '@react-native-firebase/firestore';

const AddNotification = async data => {
  try {
    const temp = {
      title: data.notification.title,
      body: data.notification.body,
      linkImage:
        data.notification.android.imageUrl ||
        'https://firebasestorage.googleapis.com/v0/b/elysian-cfa87.appspot.com/o/Elysian.png?alt=media&token=aa75058b-9d6d-4fba-892d-88ef8cd512d9',
      date: firestore.Timestamp.now(),
      BannerID: data.data.NotificationID,
    };
    // console.log(temp)
    await firestore()
    .collection('Notifications')
    .add(temp)
    .then(docRef => {
      console.log('Noti added!');
      AddNotificationToUser(docRef.id);
    });
  } catch (error) {
    console.log(error)
  }
  
};
const AddNotificationToUser = async id => {
  await firestore()
    .collection('Users')
    .get()
    .then(query => {
      query.forEach(doc => {
        const data = {};
        Object.assign(data, doc.data().Notifications);
        data[id] = true;
        doc.ref.update({
          Notifications: data,
        });
        // console.log(doc.data().Notifications);
      });
    });
};
export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    // console.log('Authorization status:', authStatus);
    getFCMtoken();
  }
}

const getFCMtoken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmtoken');
  // console.log(fcmToken);
  if (!fcmToken) {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        await AsyncStorage.setItem('fcmtoken', fcmToken);
        // console.log(fcmToken);
      }
    } catch (error) {}
  }
};

export const notificationListener = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
      // AddNotification(remoteMessage),
    );
  });
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
        // AddNotification(remoteMessage);
      }
    });
  messaging().onMessage(async remoteMessage => {
    console.log('Notification Foreground ...', remoteMessage);
    AddNotification(remoteMessage);
  });

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    AddNotification(remoteMessage);
  });
};

export async function onUserPictureLiked(ownerId, userId, picture) {
  // admin.initializeApp({
  //   credential: admin.credential.cert(serviceAccount),
  //   //   databaseURL: "https://notification-314b0-default-rtdb.firebaseio.com"
  // });
  // const messages = {
  //   notification: {
  //     title: 'khanh',
  //     body: 'this is khanh',
  //   },
  //   token:
  //     'd2VQr5utRteDbTJ2TWeDiY:APA91bE7eTIKONnGTaXy1UQRMfDg7bmGq8pJCKCu6da887fiH7So3C_ec7luQjDxF1S2hWUNpeEwi6mzO1BEm0NlsEGwNGM9JarVhBT5j-kjGwZRGWqUHhwfedck8ch5PQtifBNPCnmU',
  // };
  // admin
  //   .messaging()
  //   .send(messages)
  //   .then(tres => {
  //     console.log('success');
  //   })
  //   .catch(error => {
  //     console.log(error);
  //   });
}
