import {useSelector} from 'react-redux';
export const calculatorTotal = () => {
  const arrProduct = useSelector(state => state.orders.list);
  let totalPrice = 0;
  for (let item of arrProduct) {
    totalPrice += parseInt(item.total);
  }
  return totalPrice;
};
export const TotalAmount = () => {
  const arrProduct = useSelector(state => state.orders.list);
  let totalAmount = 0;
  for (let item of arrProduct) {
    totalAmount += parseInt(item.count);
  }
  return totalAmount;
};
export const calculatorDiscount = () => {
  const arrProduct = useSelector(state => state.orders.list);
  const voucher = useSelector(state => state.voucher);
  let discount = 0;
  let totalPrice = 0;
  for (let item of arrProduct) {
    totalPrice += parseInt(item.total);
  }
  if (voucher === '') {
    return discount;
  } else {
    if (voucher.type == 'total') {
      discount = voucher.discount;
    } else {
      if (parseFloat(voucher.percent) * totalPrice >= voucher.max) {
        discount = voucher.max;
      } else {
        discount = Math.floor((totalPrice / 1000) * voucher.percent) * 1000;
      }
    }
  }
  return discount;
};
