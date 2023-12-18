import {StyleSheet, Text, View, Image, TouchableHighlight} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import {useTranslation} from 'react-i18next';

const ItemHistory = ({iitem, setRerender}) => {
  const {t} = useTranslation();
  const [colorStatus, setColorStatus] = useState(
    iitem.status === 'delivery'
      ? '#4FC4F5'
      : iitem.status == 'completed'
      ? 'green'
      : 'red',
  );
  const ConvertTime = time => {
    const date = new Date(time * 1000);
    return (
      date.getDate() +
      '/' +
      (date.getMonth() + 1) +
      '/' +
      date.getFullYear() +
      ' ' +
      date.getHours() +
      ':' +
      date.getMinutes() +
      ':' +
      date.getSeconds()
    );
  };

  useEffect(() => {
    if (iitem.id !== undefined) {
      const subscriber = firestore()
        .collection('Orders')
        .doc(iitem.id)
        .onSnapshot(documentSnapshot => {
          console.log('User data: ', documentSnapshot.data());
          setRerender(true);
        });
      setColorStatus(
        iitem.status === 'delivery'
          ? '#4FC4F5'
          : iitem.status == 'completed'
          ? 'green'
          : 'red',
      );
      return () => subscriber();
    }
  }, []);

  return (
    <TouchableHighlight
      style={{
        flex: 1,
        borderRadius: 20,
        justifyContent: 'center',
        paddingHorizontal: 20,
      }}
      onPress={() => {
        console.log(iitem.id);
      }}
      underlayColor={'white'}>
      <View style={styles.container}>
        <Image source={require('../assets/coffee-cup.png')} style={{}} />
        <View style={styles.middle}>
          <Text style={styles.productname}>
            this is my Product Name hello you
          </Text>
          <Text style={{marginVertical: 5}}>
            {ConvertTime(iitem.createTime.seconds)}
          </Text>
          <TouchableHighlight
            onPress={() => {}}
            style={{width: 80, height: 40, justifyContent: 'center'}}
            underlayColor={'white'}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{color: '#E37806', marginRight: 10, fontSize: 15}}>
                Reorder
              </Text>
              <Icon name="arrow-right" color={'#E37806'} />
            </View>
          </TouchableHighlight>
        </View>
        <View style={styles.price}>
          <Text style={{fontSize: 16, color: 'black'}}>{iitem.totalCost}đ</Text>
          <TouchableHighlight
            style={{
              backgroundColor: colorStatus,
              borderRadius: 5,
              marginTop: 5,
            }}>
            <Text style={{padding: 4, color: 'white'}}>{iitem.status}</Text>
          </TouchableHighlight>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default ItemHistory;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 120,
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 20,
  },
  middle: {
    flex: 3,
    marginLeft: 30,
  },
  productname: {
    fontSize: 18,
    marginTop: 25,
    color: 'black',
  },
  price: {
    alignItems: 'flex-end',
    marginLeft: 20,
  },
});
