import {StyleSheet, Text, View, SectionList} from 'react-native';
import React, {useState, useEffect} from 'react';
import ItemVoucher from '../components/itemVoucher';
import firestore from '@react-native-firebase/firestore';
import {useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
const Voucher = () => {
  const {t} = useTranslation();
  const [dataVoucher, setDataVoucher] = useState([]);
  const convertTime = time => {
    const newTime = new Date(time * 1000);
    // console.log(newTime)
    return newTime;
  };

  const checkIsExpired = time => {
    const end = convertTime(time);
    const now = new Date();
    // console.log((now.getTime() - end.getTime())*(2.77777778*0.0000001))
    // if(((end.getTime() - now.getTime())*(2.77777778*0.0000001)) <= 24)
    if (now < end) return true;
    return false;
  };
  const checkIn24H = time => {
    const end = convertTime(time);
    const now = new Date();
    // console.log((now.getTime() - end.getTime())*(2.77777778*0.0000001))
    if ((end.getTime() - now.getTime()) * (2.77777778 * 0.0000001) <= 24)
      return true;
    return false;
  };

  const getData = async () => {
    const tempExpired = [];
    const tempReady = [];
    await firestore()
      .collection('Vouchers')
      .get()
      .then(query => {
        query.forEach(doc => {
          if (checkIsExpired(doc.data().end.seconds)) {
            if (checkIn24H(doc.data().end.seconds))
              tempExpired.push(doc.data());
            else {
              tempReady.push(doc.data());
            }
          }
        });
      let temp;
        if(tempExpired.length <= 0){
          temp = [
            {
              title: t('Available to use'),
              data: tempReady,
            },
          ];
        }
        else {
          temp = [
            {
              title: t('Expiration soon'),
              data: tempExpired,
            },
            {
              title: t('Available to use'),
              data: tempReady,
            },
          ];
        }
        // console.log(temp)
        setDataVoucher(temp);
      });
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <View>
      <SectionList
        sections={dataVoucher}
        keyExtractor={(item, index) => item + index}
        renderItem={({item}) => <ItemVoucher item={item} />}
        renderSectionHeader={({section: {title}}) => (
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: 'black',
              marginLeft: 16,
              marginVertical: 10,
            }}>
            {title}
          </Text>
        )}
      />
    </View>
  );
};

export default Voucher;

const styles = StyleSheet.create({});
