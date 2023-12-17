import {View, Text, Modal, TouchableOpacity} from 'react-native';
import React from 'react';
import COLORS from '../common/Color';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectedAddress,
  openOrCloseModel,
  selectModal,
  setCompleted,
} from '../redux/addressSlice';
import FormatText from '../utils/FormatText';
import {useTranslation} from 'react-i18next';

const AlertCompleted = () => {
  const {t} = useTranslation();
  const address = useSelector(selectedAddress);
  const modal = useSelector(selectModal);
  return (
    <Modal visible={modal} transparent={true} animationType="fade">
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#00000099',
        }}>
        <View
          style={{
            width: '90%',
            height: 200,
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 10,
          }}>
          <View flex={1}>
            <View style={{alignItems: 'center'}}>
              <Text style={{color: 'black'}}>
                {t('Are you sure you want to order?')}
              </Text>
            </View>
            <View style={{paddingTop: 20, padding: 10}}>
              <Text>{t('Orders will be delivered to')}</Text>
              <FormatText title={t('Address')} content={address.detail} />
              <FormatText title={t('Receiver')} content={address.name} />
              <FormatText title={t('Phone number')} content={address.phone} />
            </View>
          </View>
          <Btn />
        </View>
      </View>
    </Modal>
  );
};

const Btn = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch(openOrCloseModel());
  };
  const completed = () => {
    dispatch(setCompleted());
    dispatch(openOrCloseModel());
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
      }}>
      <TouchableOpacity
        onPress={closeModal}
        style={{
          padding: 15,
          paddingTop: 5,
          paddingBottom: 5,
          borderRadius: 10,
          marginEnd: 10,
          borderWidth: 0.5,
        }}>
        <Text style={{color: 'black', fontWeight: '500'}}>{t('Cancel')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={completed}
        style={{
          backgroundColor: COLORS.custom,
          padding: 15,
          paddingTop: 5,
          paddingBottom: 5,
          borderRadius: 10,
        }}>
        <Text style={{color: 'white', fontWeight: '500'}}>{t('OK')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AlertCompleted;
