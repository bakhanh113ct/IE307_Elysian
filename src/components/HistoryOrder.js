import {View, Text} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import {selectHistory} from '../redux/orderDetailSlide';
import convertTimeToFB from '../utils/convertTimeToFB';
import COLORS from '../common/Color';
import {useTranslation} from 'react-i18next';

const HistoryOrder = () => {
  const his = useSelector(selectHistory);
  const {t} = useTranslation();

  return (
    <View style={{marginTop: 15, backgroundColor: 'white', padding: 15}}>
      <Text
        style={{
          alignSelf: 'center',
          color: 'black',
          fontSize: 17,
          fontWeight: '600',
        }}>
        {t('Order history')}
      </Text>
      <View>
        <ConfirmTime time={his.createTime} title={t('Ordered')} color="green" />
        {his.checkedTime !== '' ? (
          <ConfirmTime
            time={his.checkedTime}
            title={t('Confirmed')}
            color={COLORS.waiting}
          />
        ) : null}
        {his.shippingTime !== '' ? (
          <ConfirmTime
            time={his.shippingTime}
            title={t('Start delivery')}
            color={COLORS.shipping}
          />
        ) : null}
        {his.cancelledTime !== '' ? (
          <ConfirmTime
            time={his.cancelledTime}
            title={t('Cancelled order')}
            color={COLORS.cancelled}
          />
        ) : null}
        {his.completeTime !== '' ? (
          <ConfirmTime
            time={his.completeTime}
            title={t('Delivered')}
            color={COLORS.completed}
          />
        ) : null}
      </View>
    </View>
  );
};

const ConfirmTime = ({time, title, color}) => {
  const lang = useSelector(state => state.lang);
  return (
    <View paddingTop={10}>
      <Text style={{color: color, fontWeight: '600', fontSize: 15}}>
        {title}
      </Text>
      <Text style={{paddingStart: 20, color: 'black'}}>
        {convertTimeToFB(time, lang)}
      </Text>
    </View>
  );
};

export default HistoryOrder;
