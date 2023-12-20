import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useState, useEffect} from 'react';
import ItemNotification from '../components/ItemNotification';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../common/Color';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {ActivityIndicator} from 'react-native';
import {Button} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Loading from '../components/Loading';
const Notification = () => {
  const navigation = useNavigation();
  const [notiData, setNotiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState([]);
  const getData = async () => {
    let temp = [];
    let tempData = [];
    let data = [];
    await Promise.all([
      await firestore()
        .collection('Notifications')
        .orderBy('date', 'desc')
        .get()
        .then(query => {
          query.forEach(doc => {
            const data1 = doc.data();
            data1.id = doc.id;
            tempData.push(data1);
          });
        }),
      await firestore()
        .collection('Users')
        .doc(auth().currentUser.uid)
        .get()
        .then(documentSnapshot => {
          try {
            data = Object.keys(documentSnapshot.data().Notifications);
          } catch (error) {}
        }),

      tempData.forEach(data1 => {
        if (data.includes(data1.id)) temp.push(data1);
      }),
      setNotiData(temp),
    ]);
    setLoading(false);
  };
  const getNotification = data => {
    const temp = [];
    console.log(data);
    data.forEach(key => {
      firestore()
        .collection('Notifications')
        .onSnapshot(query => {
          query.forEach(documentSnapshot => {
            if (documentSnapshot.id === key) {
              const data = documentSnapshot.data();
              data.id = documentSnapshot.id;
              temp.push(data);
              // tempData.push(data);
              setNotiData(pre => [...pre, data]);
            }
          });
          return temp;
        });
    });
    return temp;
  };
  const getLocation = async () => {
    const temp = [];
    await firestore()
      .collection('Locations')
      .get()
      .then(query => {
        query.forEach(doc => {
          temp.push(doc.data());
        });
        setLocation(temp);
      });
  };
  useEffect(() => {
    getData();
    getLocation();
  }, []);

  if (loading) {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator color={COLORS.custom} />
      </View>
    );
  }
  if(notiData.length <= 0)
    return(
      <Loading uri={require('../assets/4021-no-notification-state.json')} backgroundColor={'#fff'}/>
    )
  return (
    <ScrollView style={{marginTop: 15, flex: 1}}>
      {notiData.map((item, index) => {
        return <ItemNotification key={index} item={item} />;
      })}
    </ScrollView>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.custom,
    height: 50,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
});
