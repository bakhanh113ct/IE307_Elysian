import {useDispatch, useSelector} from 'react-redux';
import {removeVoucher} from '../redux/voucherSlice';

export default function calculatorTotalPrice() {
  const arrProduct = useSelector(state => state.orders.list);
  const voucher = useSelector(state => state.voucher);
  const dispatch = useDispatch();
  let ship = 30000;
  let totalPrice = 0;
  for (let item of arrProduct) {
    totalPrice += parseInt(item.total);
  }
  if (voucher === '') {
    return totalPrice + ship;
  } else {
    if (voucher.type == 'total') {
      if (totalPrice < voucher.condition) {
        dispatch(removeVoucher());
      } else totalPrice -= voucher.discount;
    } else {
      if (parseFloat(voucher.percent) * totalPrice >= voucher.max) {
        totalPrice -= voucher.max;
      } else {
        totalPrice -= Math.floor((totalPrice / 1000) * voucher.percent) * 1000;
      }
    }
  }

  return totalPrice + ship;
}
