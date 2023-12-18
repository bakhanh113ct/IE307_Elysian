import {ScrollView, RefreshControl, View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import ItemInOder from '../components/ItemInOder';
import fireStore from '@react-native-firebase/firestore';
import COLORS from '../common/Color';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectCancelledOrders,
  addCancelledOrder,
  resetCancelledOrder,
} from '../redux/orderDetailSlide';
import fireauth from '@react-native-firebase/auth';
import NothingToShow from '../components/NothingToShow';

const CancelledOrder = () => {
  const dispatch = useDispatch();
  const Orders = useSelector(selectCancelledOrders);
  const loadOrder = async () => {
    await fireStore()
      .collection('Orders')
      .where('state', '==', 'cancelled')
      .where('userID', '==', fireauth().currentUser.uid)
      .onSnapshot(snap => {
        const temp = [];
        dispatch(resetCancelledOrder());
        snap.forEach(documentSnapshot => {
          temp.push(documentSnapshot.data());
        });
        temp.sort((a, b) => {
          return b.createdAt - a.createdAt;
        });
        dispatch(addCancelledOrder(temp));
      });
  };

  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    loadOrder();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(resetCancelledOrder());
    loadOrder();
    setRefreshing(false);
  };
  if (Orders.length == 0)
    return <NothingToShow uri={require('../assets/NothingToShow.json')} />;
  return (
    <View>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressBackgroundColor={COLORS.custom}
          />
        }>
        {Orders.map((item, index) => (
          <View key={index}>
            <ItemInOder item={item} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default CancelledOrder;
