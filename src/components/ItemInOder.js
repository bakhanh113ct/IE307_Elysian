import {View, TouchableOpacity, Text} from 'react-native';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  openOrClose,
  setHistory,
  setOrderID,
  setWaitForLoadDetail,
  setOrder,
} from '../redux/orderDetailSlide';
import fireStore from '@react-native-firebase/firestore';
import {setProducts} from '../redux/orderDetailSlide';
import BtnActionOrder from './BtnActionOrder';
import FormatNumber from '../utils/FormatNumber';
import {Divider} from 'react-native-paper';
import convertTimeToFB from '../utils/convertTimeToFB';
import {useTranslation} from 'react-i18next';
import COLORS from '../common/Color';

export default ItemInOder = ({item}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  let arrDetailOrder = [];
  let his = {};
  const lang = useSelector(state => state.lang);

  const loadOrder = async () => {
    let order = {};
    await fireStore()
      .collection('Orders')
      .doc(item.orderID)
      .get()
      .then(documentSnapshot => {
        order = {
          decreasePrice: documentSnapshot.data().decreasePrice,
          totalCost: documentSnapshot.data().totalCost,
          totalBeforeCheckout: documentSnapshot.data().totalBeforeCheckout,
        };
      });
    dispatch(setOrder(order));
  };

  const loadProducts = async () => {
    await fireStore()
      .collection('OrderDetails')
      .where('orderID', '==', item.orderID)
      .get()
      .then(snap => {
        snap.forEach(docSnap => {
          arrDetailOrder = [...arrDetailOrder, docSnap.data()];
        });
      });

    await fireStore()
      .collection('OrderHistories')
      .where('orderID', '==', item.orderID)
      .get()
      .then(querySnap => {
        querySnap.forEach(docSnap => {
          his = docSnap.data();
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
        price: item.size === 'L' ? '16000' : item.size === 'M' ? '8000' : '0',
      };
      item.products  = products;
      item.size = size;
    }
    dispatch(setProducts(arrDetailOrder));
    dispatch(setHistory(his));
    arrDetailOrder = [];
  };

  const OpenModal = () => {
    dispatch(setOrderID(item.orderID));
    dispatch(setWaitForLoadDetail());
    loadOrder();
    loadProducts(item.orderID);
    dispatch(openOrClose());
    dispatch(setWaitForLoadDetail());
  };

  return (
    <View
      style={{
        marginTop: 15,
        marginStart: 15,
        marginEnd: 15,
        backgroundColor: 'white',
        borderRadius: 10,
        borderRadius: 15,
        padding: 15,
      }}>
      <TouchableOpacity onPress={OpenModal}>
        <Text>
          {t('Total')}: <FormatNumber number={item.totalCost} />
        </Text>
        <Text>
          {t('Create Time')}: {convertTimeToFB(item.createdAt, lang)}
        </Text>
      </TouchableOpacity>
      <Divider style={{marginTop: 15}} />
      <BtnActionOrder state={item.state} orderID={item.orderID} />
    </View>
  );
};
