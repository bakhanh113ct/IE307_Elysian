import {StyleSheet, Text, View, TextInput, Switch, Button} from 'react-native';
import React, {useState, useEffect} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import COLORS from '../common/Color';
import firestore from '@react-native-firebase/firestore';
import fireauth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
const customData = require('../assets/address.json');
const AddAddress = () => {
  const {t} = useTranslation();
  const [open, setOpen] = useState(false);
  const [province, setProvince] = useState(null);
  const [items, setItems] = useState([]);
  const [open1, setOpen1] = useState(false);
  const [district, setDistrict] = useState(null);
  const [items1, setItems1] = useState([]);
  const [open2, setOpen2] = useState(false);
  const [ward, setWard] = useState(null);
  const [items2, setItems2] = useState([]);
  const [data, setData] = useState([]);
  const [checkName, setCheckName] = useState(true);
  const [checkPhone, setCheckPhone] = useState(true);
  const [checkAddress, setCheckAddress] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [isComplete, setIsComplete] = useState(true);
  const [isDetailAddress, setIsDetailAddress] = useState(false);
  const [detailAddress, setDetailAddress] = useState('');
  const navigation = useNavigation();
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const getData = () => {
    const location = customData;
    setData(customData);
    setItems(
      location.map(e => {
        return {label: e.name, value: e.name};
      }),
    );
  };
  useEffect(() => {
    getData();
    return () => {};
  }, []);
  useEffect(() => {
    data.forEach(e => {
      if (e.name == province) {
        setItems1(
          e.districts.map(e => {
            return {label: e.name, value: e.name};
          }),
        );
        setItems2([]);
        setDistrict(null);
        setWard(null);
      }
    });
    return () => {};
  }, [province]);
  useEffect(() => {
    data.forEach(e => {
      if (e.name == province) {
        e.districts.forEach(e => {
          if (e.name == district) {
            setItems2(
              e.wards.map(e => {
                return {label: e.name, value: e.name};
              }),
            );
            setWard(null);
          }
        });
      }
    });
    return () => {};
  }, [district]);
  useEffect(() => {
    if (province != null && district != null && ward != null)
      setIsDetailAddress(true);
    else {
      setDetailAddress('');
      setIsDetailAddress(false);
    }
    return () => {};
  }, [province, district, ward]);
  useEffect(() => {
    if (isDetailAddress && detailAddress != '') setCheckAddress(true);
    else setCheckAddress(false);
    return () => {};
  }, [detailAddress]);
  useEffect(() => {
    if (checkName && checkPhone && checkAddress) setIsComplete(true);
    else setIsComplete(false);
    return () => {};
  }, [checkAddress, checkName, checkPhone]);
  const removeAscent = str => {
    if (str === null || str === undefined) return str;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    return str;
  };
  const validateName = name => {
    let regex = /^[a-zA-Z ]{2,}$/g;
    if (regex.test(removeAscent(name))) {
      setCheckName(true);
    } else {
      setCheckName(false);
    }
  };
  const validatePhone = phone => {
    let regex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
    if (regex.test(phone)) {
      setCheckPhone(true);
    } else {
      setCheckPhone(false);
    }
  };
  const randomID = () => {
    let temp = fireauth().currentUser.uid;
    let number = Math.floor(Math.random() * 1000) + 1;
    let number1 = Math.floor(Math.random() * 1000) + 1;
    return temp + number + number1;
  };
  const onSubmit = async () => {
    const id = randomID();
    if (isEnabled) {
      await firestore()
        .collection('Addresses')
        .where('userID', '==', fireauth().currentUser.uid)
        .get()
        .then(QuerySnapshot => {
          QuerySnapshot.forEach(e => {
            e.ref.update({
              selected: false,
            });
          });
        });
    }
    await firestore()
      .collection('Addresses')
      .doc(id)
      .set({
        userID: fireauth().currentUser.uid,
        idAddress: id,
        name: name,
        phone: phone,
        province: province,
        district: district,
        ward: ward,
        detail: detailAddress,
        selected: isEnabled,
      })
      .then(() => {
        navigation.goBack();
      });
  };
  return (
    <View style={{flex: 1}}>
      <Text style={{margin: 16}}>{t('Contact')}</Text>
      <TextInput
        placeholder={t('Full name')}
        value={name}
        style={{paddingLeft: 10, backgroundColor: 'white'}}
        onChangeText={text => {
          validateName(text), setName(text);
        }}
      />
      {!checkName && name != '' && (
        <View
          style={{
            paddingLeft: 10,
            backgroundColor: '#FFF4F3',
            height: 30,
            justifyContent: 'center',
          }}>
          <Text style={{color: '#D9415D'}}>
            {t('Full name is not valid')} !
          </Text>
        </View>
      )}
      <TextInput
        placeholder={t('Phone number')}
        value={phone}
        style={{paddingLeft: 10, backgroundColor: 'white'}}
        keyboardType="phone-pad"
        maxLength={10}
        onChangeText={text => {
          validatePhone(text), setPhone(text);
        }}
      />
      {!checkPhone && phone != '' && (
        <View
          style={{
            paddingLeft: 10,
            backgroundColor: '#FFF4F3',
            height: 30,
            justifyContent: 'center',
          }}>
          <Text style={{color: '#D9415D'}}>
            {t('Phone number is not invalid')}
          </Text>
        </View>
      )}
      <Text style={{margin: 16}}>{t('Address')}</Text>
      <DropDownPicker
        searchable={true}
        style={{borderWidth: 0}}
        placeholder={t("Chọn tỉnh/thành phố")}
        searchPlaceholder={t("Tìm tỉnh/thành phố")}
        zIndex={10}
        open={open}
        value={province}
        items={items}
        setOpen={setOpen}
        setValue={setProvince}
        setItems={setItems}
      />
      <DropDownPicker
        style={{borderWidth: 0}}
        placeholder={t("Chọn quận/huyện")}
        zIndex={5}
        open={open1}
        value={district}
        items={items1}
        setOpen={setOpen1}
        setValue={setDistrict}
        setItems={setItems1}
      />
      <DropDownPicker
        style={{borderWidth: 0}}
        placeholder={t("Chọn phường/xã")}
        zIndex={3}
        open={open2}
        value={ward}
        items={items2}
        setOpen={setOpen2}
        setValue={setWard}
        setItems={setItems2}
      />
      <TextInput
        placeholder={t("Tên đường, Tòa nhà, Số nhà.")}
        value={detailAddress}
        style={{paddingLeft: 10, backgroundColor: 'white'}}
        editable={isDetailAddress}
        onChangeText={setDetailAddress}
      />
      <Text style={{margin: 16}}>{t('Setting')}</Text>
      <View
        style={{
          backgroundColor: 'white',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 45,
          marginBottom: 40,
        }}>
        <Text style={{color: 'black', marginLeft: 10}}>
          {t('Set address to default')}
        </Text>
        <Switch
          trackColor={{false: '#767577', true: COLORS.backgroundWeak}}
          thumbColor={isEnabled ? COLORS.custom : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
      <Button
        title={t('Complete')}
        disabled={!isComplete}
        color={COLORS.custom}
        onPress={onSubmit}
      />
    </View>
  );
};

export default AddAddress;

const styles = StyleSheet.create({});
