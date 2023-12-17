import {Text, View, TouchableOpacity, Alert} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../../src/styles/View.Payment.container';
import {useDispatch} from 'react-redux';
import {removeAllProduct} from '../redux/orderSlice';
import {useNavigation} from '@react-navigation/native';
import {removeVoucher} from '../redux/voucherSlice';
import {showMessage} from 'react-native-flash-message';
import {useTranslation} from 'react-i18next';

export default function HeaderPayment() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {t} = useTranslation();

  const clearOrder = () => {
    Alert.alert(t('Clear cart'), t('Cart will be remove'), [
      {
        text: t('Cancel'),
        style: 'cancel',
      },
      {
        text: t('Yes'),
        onPress: () => {
          dispatch(removeAllProduct());
          dispatch(removeVoucher());
          navigation.goBack();
          showMessage({
            message: t('Cart has been deleted'),
            description: t('Select an item to add to cart'),
            type: 'warning',
          });
        },
      },
    ]);
  };

  return (
    <View style={{backgroundColor: 'white'}}>
      <View style={[styles.container, {padding: 15}]}>
        <TouchableOpacity onPress={clearOrder}>
          <Text>{t('Clear All')}</Text>
        </TouchableOpacity>
        <Text style={[styles.bold, {fontSize: 16}]}>{t('Checkout')}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close-outline" style={styles.iconSize} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
