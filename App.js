import React, {useState, useEffect} from 'react';
import {SafeAreaView, StyleSheet, View,LogBox} from 'react-native';
import Navigation from './src/navigators/Navigation';
import auth from '@react-native-firebase/auth';
import SiginInNavigate from './src/navigators/SiginInNavigate';
import Register from './src/screens/Register';
import PhoneVertify from './src/screens/PhoneVertify';
import {Provider} from 'react-redux';
import {store, persistor} from './src/redux/store'
import {ActivityIndicator} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { PersistGate } from 'redux-persist/integration/react'
import {
  notificationListener,
  requestUserPermission,
} from './src/utils/pushnotification_helper';
import SplashScreen from 'react-native-splash-screen';
import COLORS from './src/common/Color';
import FlashMessage from 'react-native-flash-message';
import Loading from './src/components/Loading';
const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [hasPhone, setHasPhone] = useState(false);
  const [loading, setLoading] = useState(true);
  LogBox.ignoreAllLogs()
  const checkProfileUpdated = async () => {
    await firestore()
      .collection('Users')
      .doc(auth().currentUser.uid)
      .get()
      .then(doc => {
        if (doc.data()?.dateofbirth !== undefined) {
          setLoading(false);
          setProfileUpdated(true);
        } else {
          if (auth().currentUser.providerData[0].providerId === 'phone') {
            setLoading(false);
            setProfileUpdated(true);
          } else {
            setLoading(false);
            setProfileUpdated(false);
          }
        }
      });
  };
  const  onAuthStateChanged =(user) =>{
    setUser(user);
    // console.log(user)
    if(user === null){
      setHasPhone(false)
      setProfileUpdated(false)
      setLoading(true)
    }
    if (initializing) setInitializing(false);
    if (auth().currentUser !== null) {
      if (auth().currentUser.displayName !== null) {
        checkProfileUpdated();
      }
      else{
        setLoading(false)
      }
      if (auth().currentUser.phoneNumber != null) {
        setHasPhone(true);
      }
    }
    // console.log(user)
    // console.log(auth().currentUser.email.toString())

    // console.log(profileUpdated)
  }

  useEffect(() => {
    let isMounted = true;
    SplashScreen.hide();
    if(isMounted)requestUserPermission();
    if(isMounted)notificationListener();
    auth().onAuthStateChanged(onAuthStateChanged);
    return () => {
      isMounted = false
    }; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <View style={{flex: 1}}>
        <SiginInNavigate />
      </View>
    );
  }
  if (!hasPhone)
    return (
      <View style={{flex: 1}}>
        <PhoneVertify setHasPhone={setHasPhone} />
      </View>
    );
  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Loading
          uri={require('./src/assets/98092-loading.json')}
          title="Đang tải dữ liệu..."
        />
      </View>
    );
  }
  if (!profileUpdated)
    return (
      <View style={{flex: 1}}>
        <Register setProfileUpdated={setProfileUpdated} />
      </View>
    );

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <SafeAreaView style={{flex: 1}}>
        <Navigation />
      </SafeAreaView>
      <FlashMessage position="top" />
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({});

export default App;