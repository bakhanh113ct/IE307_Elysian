import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Avatar} from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../common/Color';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import fireauth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useTranslation} from 'react-i18next';
const InfoUser = () => {
  const navigation = useNavigation();
  const router = useRoute();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [image, setImage] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [checkName, setCheckName] = useState(true);
  const [checkEmail, setCheckEmail] = useState(true);
  const [isChange, setIsChange] = useState(false);
  const {t} = useTranslation();
  const openCamera = () => {
    ImagePicker.openCamera({
      cropping: true,
      cropperCircleOverlay: true,
    })
      .then(image => {
        setImage(image.path);
        setModalVisible(false);
      })
      .catch(e => {});
  };
  const openGalery = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      cropping: true,
      cropperCircleOverlay: true,
    })
      .then(image => {
        console.log(image.path);
        setImage(image.path);
        setModalVisible(false);
      })
      .catch(e => {});
  };
  const update = async () => {
    const uri = image;
    if (user.avatar != image)
      try {
        await storage().ref(fireauth().currentUser.uid).putFile(uri);
      } catch (e) {
        console.log(e);
      }
    await firestore()
      .collection('Users')
      .doc(fireauth().currentUser.uid)
      .update({
        name: name,
        email: email,
        avatar: await storage()
          .ref(fireauth().currentUser.uid)
          .getDownloadURL(),
      })
      .then(() => {
        setIsChange(false);
      });
  };
  const formatDate = data => {
    const temp = new Date(data * 1000);
    const day = temp.getDate() < 10 ? '0' + temp.getDate() : temp.getDate();
    const month =
      temp.getMonth() + 1 < 10
        ? '0' + (temp.getMonth() + 1)
        : temp.getMonth() + 1;
    const year = temp.getFullYear();
    const result = day + '/' + month + '/' + year;
    return result;
  };
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [user, setUser] = useState();
  const getInfoUser = async () => {
    const temp = await firestore()
      .collection('Users')
      .doc(fireauth().currentUser.uid)
      .get();
    return temp.data();
  };
  const setInfo = async () => {
    const data = await getInfoUser();
    setUser(data);
    setImage(data?.avatar);
    setName(data.name);
    setEmail(data.email);
    setLoading(false);
  };
  useEffect(() => {
    setInfo();
  }, []);
  useEffect(() => {
    if (!loading) {
      if (
        (name != user.name || email != user.email || user.avatar != image) &&
        checkName &&
        checkEmail
      ) {
        setIsChange(true);
      } else {
        setIsChange(false);
      }
    }
  }, [name, email, image]);
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
  const validateEmail = email => {
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g;
    if (regex.test(email)) {
      setCheckEmail(true);
    } else {
      setCheckEmail(false);
    }
  };
  if (loading) {
    return <ActivityIndicator />;
  }
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Avatar
        size={120}
        rounded
        source={{
          uri:
            image == undefined
              ? 'http://danhgia.snv.kontum.gov.vn/Images/no-avatar.png'
              : image,
        }}
        containerStyle={{
          backgroundColor: 'grey',
          alignSelf: 'center',
          marginTop: 20,
          marginBottom: 10,
        }}>
        <Avatar.Accessory
          size={24}
          onPress={() => {
            setModalVisible(true);
          }}
        />
      </Avatar>
      <TextInput
        value={name}
        placeholder={t('Nhập họ tên')}
        onChangeText={text => {
          setName(text), validateName(text);
        }}
        style={{
          borderRadius: 10,
          borderWidth: 1,
          marginHorizontal: 16,
          fontSize: 16,
          borderColor: 'gray',
          paddingLeft: 15,
        }}
      />
      <View style={{height: 25}}>
        {!checkName && (
          <Text style={{marginLeft: 25, color: '#D9415D'}}>
            {t('Your name is not valid')} !
          </Text>
        )}
      </View>
      <TextInput
        value={email}
        placeholder={t('Nhập Email')}
        onChangeText={text => {
          setEmail(text), validateEmail(text);
        }}
        style={{
          borderRadius: 10,
          borderWidth: 1,
          marginHorizontal: 16,
          fontSize: 16,
          borderColor: 'gray',
          paddingLeft: 15,
        }}
      />
      <View style={{height: 25}}>
        {!checkEmail && (
          <Text style={{marginLeft: 25, color: '#D9415D'}}>
            {t('Your mail is not valid')} !
          </Text>
        )}
      </View>
      <View
        style={{
          height: 50,
          borderRadius: 10,
          marginHorizontal: 16,
          fontSize: 18,
          backgroundColor: '#C4C4C4',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: 15,
          paddingRight: 6,
        }}>
        <Text style={{fontSize: 16, color: 'black'}}>
          {formatDate(user.dateofbirth.seconds)}
        </Text>
        <Icon name="calendar-outline" size={24} color="black" />
      </View>
      <View
        style={{
          height: 50,
          borderRadius: 10,
          marginHorizontal: 16,
          fontSize: 18,
          backgroundColor: '#C4C4C4',
          marginTop: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: 15,
          paddingRight: 6,
        }}>
        <Text style={{fontSize: 16, color: 'black'}}>{t(user.gender)}</Text>
        <Icon name="transgender-outline" size={24} color="black" />
      </View>
      <TouchableOpacity
        style={{
          marginTop: 150,
          height: 50,
          backgroundColor: isChange ? COLORS.custom : '#C4C4C4',
          borderRadius: 10,
          marginHorizontal: 16,
          alignItems: 'center',
          justifyContent: 'center',
          marginVertical: 6,
        }}
        onPress={update}
        disabled={!isChange}>
        <Text style={{color: 'white'}}>{t('Cập nhật thông tin')}</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={{flex: 1, flexDirection: 'column-reverse'}}>
          <View style={{height: 280, backgroundColor: 'white'}}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '500',
                color: 'black',
                alignSelf: 'center',
                marginTop: 10,
              }}>
              {t('Cập nhật ảnh')}
            </Text>
            <Text style={{fontSize: 14, alignSelf: 'center', marginTop: 4}}>
              {t('Chọn ảnh đại diện của bạn')}
            </Text>
            <TouchableOpacity
              style={{
                height: 50,
                backgroundColor: COLORS.custom,
                borderRadius: 10,
                marginHorizontal: 16,
                alignItems: 'center',
                justifyContent: 'center',
                marginVertical: 6,
              }}
              onPress={() => {
                openCamera();
              }}>
              <Text style={{color: 'white'}}>{t('Chụp ảnh')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: 50,
                backgroundColor: COLORS.custom,
                borderRadius: 10,
                marginHorizontal: 16,
                alignItems: 'center',
                justifyContent: 'center',
                marginVertical: 6,
              }}
              onPress={() => {
                openGalery();
              }}>
              <Text style={{color: 'white'}}>{t('Chọn ảnh từ thư viện')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: 50,
                backgroundColor: COLORS.custom,
                borderRadius: 10,
                marginHorizontal: 16,
                alignItems: 'center',
                justifyContent: 'center',
                marginVertical: 6,
              }}
              onPress={() => {
                setModalVisible(false);
              }}>
              <Text style={{color: 'white'}}>{t('Hủy')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default InfoUser;

const styles = StyleSheet.create({});
