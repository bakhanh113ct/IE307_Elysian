import {View, Text, TouchableOpacity, Alert} from 'react-native';
import React from 'react';
import firestore from '@react-native-firebase/firestore';
import fireAuth from '@react-native-firebase/auth';
import COLORS from '../common/Color';
import styles from '../styles/View.Payment.container';
import {useSelector, useDispatch} from 'react-redux';
import {
  selectChecked,
  selectedAddress,
  openOrCloseModel,
  selectCompleted,
  setCompleted,
  setChecked,
} from '../redux/addressSlice';
import calculatorTotalPrice from '../utils/calculatorTotalPrice';
import {removeAllProduct} from '../redux/orderSlice';
import {useNavigation} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import {clearNote, selectNote} from '../redux/orderSlice';
import {useTranslation} from 'react-i18next';
import {calculatorDiscount} from '../utils/solveVoucher';
import {calculatorTotal} from '../utils/solveVoucher';

const BtnCompletePayment = () => {
  const arrProduct = useSelector(state => state.orders.list);
  const {t} = useTranslation();
  const checked = useSelector(selectChecked);
  const addressChoose = useSelector(selectedAddress);
  const completed = useSelector(selectCompleted);
  const total = calculatorTotalPrice();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const note = useSelector(selectNote);
  const decreasePrice = calculatorDiscount();
  const totalBeforeCheckout = calculatorTotal();

  let orderID = '';
  let time = null;
  let address = useSelector(selectedAddress);

  const addOrderToFireBase = async () => {
    await firestore()
      .collection('Orders')
      .add({
        totalCost: total.toString(),
        userID: fireAuth().currentUser.uid,
        orderID: 'temp',
        idAddress: address.idAddress,
        state: 'waiting',
        note: note,
        decreasePrice: decreasePrice,
        shippingPrice: 30000,
        createdAt: (time = firestore.Timestamp.now()),
        totalBeforeCheckout: totalBeforeCheckout,
      })
      .then(snap => {
        orderID = snap.id;
        updateOrderID();
        addOrderDetailToFirebase();
      });
    await firestore().collection('OrderHistories').add({
      orderID: orderID,
      createTime: time,
      checkedTime: '',
      shippingTime: '',
      cancelledTime: '',
      completeTime: '',
    });
    if (checked === true) {
      await firestore()
        .collection('Addresses')
        .get()
        .then(snap =>
          snap.forEach(doc => {
            doc.id === addressChoose.idAddress
              ? chooseAddress(doc.id)
              : unChooseAddress(doc.id);
          }),
        );
    }
    dispatch(setCompleted());
    dispatch(removeAllProduct());
    dispatch(clearNote());
    dispatch(setChecked());
    navigation.goBack();
    showMessage({
      message: t('Order Success'),
      description: t('Orders will be shipped immediately'),
      type: 'success',
    });
  };
  const updateOrderID = async () => {
    await firestore().collection('Orders').doc(orderID).update({
      orderID: orderID,
    });
  };

  const unChooseAddress = AddressID => {
    firestore().collection('Addresses').doc(AddressID).update({
      selected: false,
    });
  };

  const chooseAddress = AddressID => {
    firestore().collection('Addresses').doc(AddressID).update({
      selected: true,
    });
  };

  const addOrderDetailToFirebase = () => {
    for (let item of arrProduct) {
      firestore().collection('OrderDetails').add({
        amount: item.count,
        productID: item.product.productID,
        size: item.size.name,
        orderID: orderID,
        toppingIDs: item.topping,
      });
    }
  };
  const checkLocation = async () => {
    let check = false;
    await firestore()
      .collection('Locations')
      .where('ward', '==', addressChoose.ward)
      .get()
      .then(snap => {
        if (snap.size > 0) check = true;
        else {
          Alert.alert(t('Error'), t('Error Address'), [
            {text: 'OK', onPress: () => console.log('Ok Pressed')},
          ]);
        }
      });
    return check;
  };
  if (completed == true) {
    addOrderToFireBase();
  }

  const openModal = async () => {
    if (addressChoose == '') {
      Alert.alert(
        t('No delivery address yet'),
        t('Please choose a shipping address'),
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => navigation.push('MoreAddresses')},
        ],
      );
    } else {
      const check = await checkLocation();
      if (check)
      dispatch(openOrCloseModel());
    }
  };
  return (
    <View>
      <TouchableOpacity onPress={openModal}>
        <View style={styles.btnCompletePayment}>
          <Text style={{color: COLORS.custom}}>{t('Order')}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default BtnCompletePayment;
