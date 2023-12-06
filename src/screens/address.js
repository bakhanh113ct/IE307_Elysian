import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ItemAddress from '../components/itemAddress';
import firestore from '@react-native-firebase/firestore';
import fireauth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
const Address = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [data, setData] = useState([]);
  const onResult = QuerySnapshot => {
    const temp = [];
    QuerySnapshot.forEach(documentSnapshot => {
      temp.push(documentSnapshot.data());
    });
    setData(temp);
  };

  const onError = error => {
    console.error(error);
  };
  useEffect(() => {
    const address = firestore()
      .collection('Addresses')
      .where('userID', '==', fireauth().currentUser.uid)
      .orderBy('selected', 'desc')
      .onSnapshot(onResult, onError);
    return () => address();
  }, []);
  return (
    <ScrollView style={{flex: 1}}>
      {data.map(e => {
        return <ItemAddress item={e} key={e.idAddress} />;
      })}
      <TouchableOpacity
        style={{
          height: 50,
          backgroundColor: 'white',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
        }}
        activeOpacity={0.5}
        onPress={() => {
          navigation.push('AddAddress');
        }}>
        <Text style={{color: 'black'}}>{t('Thêm địa chỉ mới')}</Text>
        <Icon name="add-outline" size={24} />
      </TouchableOpacity>
      <View style={{height: 50}}></View>
    </ScrollView>
  );
};

export default Address;

const styles = StyleSheet.create({});
