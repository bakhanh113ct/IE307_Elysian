import {View, Text, Modal, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import DatePicker from 'react-native-date-picker';
import {useDispatch, useSelector} from 'react-redux';
import {setModalTime, setTimePicker} from '../redux/addressSlice';
import COLORS from '../common/Color';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';

const ChooseTime = () => {
  const selectModalTime = useSelector(state => state.address.modalTime);
  return (
    <Modal visible={selectModalTime} transparent={true} animationType="slide">
      <ModalDetail />
    </Modal>
  );
};

const ModalDetail = () => {
  const {t} = useTranslation();
  return (
    <View style={styles.modalContainer}>
      <View style={styles.container}>
        <BtnClose />
        <Text style={{alignSelf: 'center'}}>
          {t('Time you want to receive the goods')}
        </Text>
        <TimePickerCustomer />
      </View>
    </View>
  );
};

const TimePickerCustomer = () => {
  const [date, setDate] = useState(new Date());
  const minimumDate = new Date();
  const maximumDate = new Date();
  minimumDate.setMinutes(minimumDate.getMinutes() + 30);
  maximumDate.setDate(minimumDate.getDate() + 2);
  return (
    <>
      <View style={{padding: 15}}>
        <DatePicker
          date={date}
          onDateChange={setDate}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      </View>
      <BtnOption date={date} />
    </>
  );
};

const BtnOption = ({date}) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const closeModal = () => {
    dispatch(setModalTime());
  };
  const defaultTimepicker = () => {
    dispatch(setTimePicker(null));
    dispatch(setModalTime());
  };
  const completedTimepicker = () => {
    dispatch(setTimePicker(date));
    closeModal();
  };

  return (
    <View style={{flexDirection: 'row', flex: 1}}>
      <TouchableOpacity
        onPress={defaultTimepicker}
        style={[styles.btnOption, {backgroundColor: 'gray', marginEnd: 5}]}>
        <Text style={styles.optionsBtnText}>{t('Default')}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={completedTimepicker}
        style={[
          styles.btnOption,
          {backgroundColor: COLORS.custom, marginStart: 5},
        ]}>
        <Text style={styles.optionsBtnText}>{t('Confirm')}</Text>
      </TouchableOpacity>
    </View>
  );
};
const BtnClose = () => {
  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch(setModalTime());
  };
  return (
    <View style={{position: 'absolute', end: 10, top: 10}}>
      <TouchableOpacity onPress={closeModal}>
        <Ionicon
          name="close-circle"
          style={{fontSize: 30, color: COLORS.custom}}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ChooseTime;
const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: '#00000099',
    flex: 1,
  },
  container: {
    backgroundColor: 'white',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    padding: 15,
  },
  btnOption: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  optionsBtnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});
