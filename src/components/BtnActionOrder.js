import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import COLORS from '../common/Color';
import styles from '../styles/View.OrderDetail';
import BtnCancel from './BtnCancel';
import {showMessage} from 'react-native-flash-message';
import {useDispatch} from 'react-redux';
import {addProduct, removeAllProduct} from '../redux/orderSlice';
import fireStore from '@react-native-firebase/firestore';
import {useTranslation} from 'react-i18next';
import {removeVoucher} from '../redux/voucherSlice';

const BtnActionOrder = ({state, orderID}) => {
  return (
    <View style={[styles.layout, {marginTop: 10}]}>
      <Text
        style={{
          alignSelf: 'center',
          color: changeColor({state}),
          fontWeight: 'bold',
        }}>
        {changeState({state})}
      </Text>
      {state === 'waiting' ? (
        <BtnCancel orderID={orderID} />
      ) : state === 'shipping' ? (
        <BtnContact />
      ) : (
        <BtnReOrder orderID={orderID} />
      )}
    </View>
  );
};

const BtnReOrder = ({orderID}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  let arrDetailOrder = [];

  const loadProducts = async () => {
    arrDetailOrder = [];
    await fireStore()
      .collection('OrderDetails')
      .where('orderID', '==', orderID)
      .get()
      .then(snap => {
        snap.forEach(docSnap => {
          arrDetailOrder = [...arrDetailOrder, docSnap.data()];
        });
      });

    for (let item of arrDetailOrder) {
      let products = {};
      await fireStore()
        .collection('Products')
        .doc(item.productID)
        .get()
        .then(docSnap => {
          products = docSnap.data();
        });
      const size = {
        name: item.size,
        price: item.size === 'L' ? '8000' : item.size === 'M' ? '16000' : '0',
      };
      item.products = products;
      item.size = size;
    }
    addProductToShopping(arrDetailOrder);
  };

  function addProductToShopping(arrDetailOrder) {
    arrDetailOrder.forEach(item => {
      const value = {
        product: item.products,
        size: item.size,
        topping: item.toppingIDs,
        count: item.amount,
        total: calculatorPrice(item),
      };
      const action = addProduct(value);
      dispatch(action);
    });
  }

  function calculatorPrice(item) {
    let result = 0;
    if (item.toppingIDs.length != 0)
      item.toppingIDs.forEach(item => {
        result += parseInt(item.price);
      });
    result += parseInt(item.products.price) * parseInt(item.amount);
    return result;
  }
  function resetCart() {
    dispatch(removeAllProduct());
    dispatch(removeVoucher());
  }

  const nav = () => {
    resetCart();
    loadProducts();
    showMessage({
      message: t('Order Success'),
      description: t('Go to cart to view details'),
      type: 'success',
    });
  };

  return (
    <TouchableOpacity
      onPress={nav}
      style={{backgroundColor: COLORS.custom, borderRadius: 10}}>
      <Text style={styles.textAction}>{t('Re-order')}</Text>
    </TouchableOpacity>
  );
};
const BtnContact = () => {
  const {t} = useTranslation();
  return (
    <TouchableOpacity
      style={{backgroundColor: COLORS.custom, borderRadius: 10}}>
      <Text style={styles.textAction}>{t('Contact')}</Text>
    </TouchableOpacity>
  );
};

const changeColor = ({state}) => {
  return state === 'waiting'
    ? COLORS.waiting
    : state === 'shipping'
    ? COLORS.shipping
    : state === 'cancelled'
    ? COLORS.cancelled
    : COLORS.completed;
};

const changeState = ({state}) => {
  const {t} = useTranslation();
  return state === 'waiting'
    ? t('Waiting')
    : state === 'shipping'
    ? t('Shipping')
    : state === 'cancelled'
    ? t('Cancelled')
    : t('Completed');
};

export default BtnActionOrder;
