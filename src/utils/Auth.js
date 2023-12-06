import auth from '@react-native-firebase/auth';
import {ToastAndroid, Alert} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import database from '@react-native-firebase/database';

//d9:99:c9:3a:8b:bf:84:8c:a5:db:3a:d4:4f:41:a3:91:35:3e:ce:62
export const signIn = (email, password) => {
  auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      ToastAndroid.show('Logged in', ToastAndroid.SHORT);
    })
    .catch(err => {
      Alert.alert('error', err.toString());
      // ToastAndroid.show(err, ToastAndroid.LONG)
      console.log(err);
    });
};
const addUser = async inputs => {
  await database().ref(`/user/${auth().currentUser.uid}`).set({
    uid: auth().currentUser.uid,
    username: inputs.username,
    email: inputs.email,
    firstname: inputs.name,
    name: inputs.lastname,
  });
};
export const signUp = inputs => {
  auth()
    .createUserWithEmailAndPassword(inputs.email, inputs.password)
    .then(() => {
      ToastAndroid.show('Signed up', ToastAndroid.SHORT);
      addUser(inputs);
    })
    .catch(err => {
      if (err.code === 'auth/email-already-in-use') {
        ToastAndroid.show(
          'That email address is already in use!',
          ToastAndroid.SHORT,
        );
      }

      if (err.code === 'auth/invalid-email') {
        ToastAndroid.show('That email address is invalid!', ToastAndroid.SHORT);
      }
      console.error(err);
    });
};

export const signOut = () => {
  auth()
    .signOut()
    .then(() => {
      ToastAndroid.show('Signed Out', ToastAndroid.SHORT);
    });
};

export const googleLogin = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const {idToken} = await GoogleSignin.signIn();
    // console.log(userInfo)
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    // setUser(userInfo)
    return auth().signInWithCredential(googleCredential);
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
      console.log(error);
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // operation (e.g. sign in) is in progress already
      console.log(error);
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log(error);
      // play services not available or outdated
    } else {
      console.log(error);
      // some other error happened
    }
  }
};

export const onFacebookButtonPress = async () => {
  // Attempt login with permissions
  const result = await LoginManager.logInWithPermissions([
    'public_profile',
    'email',
  ]);

  if (result.isCancelled) {
    throw 'User cancelled the login process';
  }

  // Once signed in, get the users AccesToken
  const data = await AccessToken.getCurrentAccessToken();

  if (!data) {
    throw 'Something went wrong obtaining access token';
  }

  // Create a Firebase credential with the AccessToken
  const facebookCredential = auth.FacebookAuthProvider.credential(
    data.accessToken,
  );

  // Sign-in the user with the credential
  return auth().signInWithCredential(facebookCredential);
};
