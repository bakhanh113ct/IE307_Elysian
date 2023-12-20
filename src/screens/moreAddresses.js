import {Text, View, TouchableOpacity, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../../src/styles/View.Payment.container';
import firestore from '@react-native-firebase/firestore';
import fireAuth from '@react-native-firebase/auth';
import COLORS from '../common/Color';
import {useDispatch, useSelector} from 'react-redux';
import {setSelected, setValue, selectedID} from '../redux/addressSlice';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

export default function MoreAddresses({navigation}) {
  return (
    <View>
      <ScrollView>
        <Body navigation={navigation} />
        <Bot />
        <View style={{height: 100}} />
      </ScrollView>
    </View>
  );
}

const Body = ({navigation}) => {
  const [update, setUpdate] = useState([]);
  const onResult = QuerySnapshot => {
    const temp = [];
    QuerySnapshot.forEach(documentSnapshot => {
      temp.push(documentSnapshot.data());
    });
    setUpdate(temp);
  };
  useEffect(() => {
    const getMoreAddress = async () => {
      await firestore()
        .collection('Addresses')
        .where('userID', '==', fireAuth().currentUser.uid)
        .orderBy('selected', 'desc')
        .onSnapshot(onResult);
    };
    getMoreAddress();
  }, []);

  return (
    <View style={{marginTop: 20}}>
      {update.map((address, index) => (
        <View key={index}>
          <Address address={address} navigation={navigation} />
        </View>
      ))}
    </View>
  );
};
const Bot = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  return (
    <View style={{backgroundColor: 'white', marginTop: 20}}>
      <TouchableOpacity
        onPress={() => {
          navigation.push('AddAddress');
        }}
        style={[
          styles.container,
          {alignItems: 'center', justifyContent: 'center', padding: 15},
        ]}>
        <Ionicons name="add" size={20} />
        <Text style={{marginStart: 5, color: 'black'}}>
          {t('Add new address')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const Address = ({address, navigation}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const changeAdd = () => {
    dispatch(setValue(address));
    dispatch(setSelected(address.idAddress));
    navigation.goBack();
  };
  return (
    <TouchableOpacity onPress={changeAdd}>
      <View style={styles.moreAddressContainer}>
        <View style={{flex: 9}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{color: 'black', paddingBottom: 5}}>
              {address.name}
            </Text>
            {address.selected == true ? (
              <Text style={{color: COLORS.custom, paddingStart: 10}}>
                [{t('Default')}]
              </Text>
            ) : null}
          </View>
          <Text>{address.phone}</Text>
          <Text>{address.detail}</Text>
          <Text>
            {address.village}', '{address.ward}','{address.district}','
            {address.province}
          </Text>
        </View>
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          {address.idAddress == useSelector(selectedID) ? (
            <Ionicons
              name="location-sharp"
              style={{fontSize: 20, color: COLORS.custom}}
            />
          ) : (
            <Ionicons
              name="location-outline"
              style={{fontSize: 20, color: COLORS.custom}}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
