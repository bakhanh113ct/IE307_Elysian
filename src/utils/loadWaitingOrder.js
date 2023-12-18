import {addWaitingOrder} from '../redux/orderDetailSlide';
import {useDispatch} from 'react-redux';
import fireStore from '@react-native-firebase/firestore';

export default async function loadWaitingOrder() {
  const dispatch = useDispatch();
  await fireStore()
    .collection('Orders')
    .where('state', '==', 'waiting')
    .onSnapshot(snap => {
      snap.forEach(documentSnapshot => {
        dispatch(addWaitingOrder(documentSnapshot.data()));
      });
    });
}
