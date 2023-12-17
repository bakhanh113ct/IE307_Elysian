import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../common/Color';
import {signOut} from '../utils/Auth';
import {Avatar} from '@rneui/themed';
import fireauth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {changeLang} from '../redux/langSlice';
import { useTranslation } from 'react-i18next';
import { removeAllProduct } from '../redux/orderSlice';
import { removeVoucher } from '../redux/voucherSlice';
import { clear } from '../redux/addressSlice';
const User = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [user, setUser] = useState();
  const [location, setLocation] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const lang=useSelector(state=>state.lang)
  const {t}=useTranslation()
  const onResult = QuerySnapshot => {
    setUser(QuerySnapshot.data());
    setLoading(false);
  };
  const onError = error => {
    console.error(error);
  };
  const getLocation = async () => {
    const temp = [];
    await firestore()
      .collection('Locations')
      .get()
      .then(query => {
        query.forEach(doc => {
          temp.push(doc.data());
        });
        setLocation(temp);
      });
  };
  const dispatch = useDispatch();
  const changeLanguage=(lang)=>{
    dispatch(changeLang(lang))
  }
  const logout=()=>{
    signOut()
    dispatch(removeAllProduct())
    dispatch(removeVoucher())
    dispatch(clear())
  }
  useEffect(() => {
    firestore()
      .collection('Users')
      .doc(fireauth().currentUser.uid)
      .onSnapshot(onResult, onError);
    getLocation();
    return () => {};
  }, []);
  if (loading) {
    return (<View style={{justifyContent:'center',alignItems:'center',flex:1}}>
      <ActivityIndicator color={COLORS.custom}/>
    </View>);
  }
  return (
    <View style={{flex: 1}}>
      <View style={{paddingHorizontal: 16, backgroundColor: 'white'}}>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 25,
            marginBottom: 10,
            alignItems: 'center',
          }}>
          <Avatar
            size={64}
            rounded
            source={{
              uri:
                user?.avatar == undefined
                  ? 'http://danhgia.snv.kontum.gov.vn/Images/no-avatar.png'
                  : user.avatar,
            }}
          />
          <View style={{marginLeft: 10}}>
            <Text style={{fontSize: 20, color: 'black', fontWeight: '500'}}>
              {user.name}
            </Text>
            <Text>{user.email}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
            marginBottom: 20,
          }}>
          <TouchableOpacity
            style={{
              width: '30%',
              height: 80,
              borderRadius: 10,
              backgroundColor: '#F6F1E7',
            }}
            activeOpacity={0.6}
            onPress={() => {
              navigation.push('InfoUser', user);
            }}>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Icon
                name="create-outline"
                color={COLORS.custom}
                size={28}
                style={{marginBottom: 4}}
              />
              <Text
                style={{fontSize: 14, color: COLORS.custom, fontWeight: '500'}}>
                {t('Thông tin')}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: '30%',
              height: 80,
              borderRadius: 10,
              backgroundColor: '#F6F1E7',
            }}
            activeOpacity={0.6}
            onPress={() => {
              navigation.push('Address');
            }}>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Icon
                name="location-outline"
                color={COLORS.custom}
                size={28}
                style={{marginBottom: 4}}
              />
              <Text
                style={{fontSize: 14, color: COLORS.custom, fontWeight: '500'}}>
                {t('Địa chỉ')}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: '30%',
              height: 80,
              borderRadius: 10,
              backgroundColor: '#F6F1E7',
            }}
            activeOpacity={0.6}
            onPress={() => {
              navigation.navigate('Map', {markers: location});
            }}>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Icon
                name="map-outline"
                color={COLORS.custom}
                size={28}
                style={{marginBottom: 4}}
              />
              <Text
                style={{fontSize: 14, color: COLORS.custom, fontWeight: '500'}}>
                {t('Cửa hàng')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          height: 80,
          backgroundColor: 'white',
          marginTop: 15,
          paddingHorizontal: 10,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="alert-circle-outline" size={24} />
          <Text
            style={{
              fontSize: 16,
              color: 'black',
              fontWeight: '500',
              marginLeft: 10,
              marginVertical: 10,
            }}>
            {t('Thông tin chung')}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            justifyContent: 'space-between',
          }}
          onPress={() => {
            Linking.openURL('https://gongcha.com.vn/gioi-thieu/');
          }}>
          <Text>{t('Thông tin về Elysian')}</Text>
          <Icon name="chevron-forward-outline" size={24} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          height: 110,
          backgroundColor: 'white',
          marginTop: 15,
          paddingHorizontal: 10,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="people-outline" size={24} />
          <Text
            style={{
              fontSize: 16,
              color: 'black',
              fontWeight: '500',
              marginLeft: 10,
              marginVertical: 10,
            }}>
            {t('Trung tâm hỗ trợ')}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            justifyContent: 'space-between',
          }}
          onPress={() => {
            Linking.openURL('https://gongcha.com.vn/lien-he/');
          }}>
          <Text>{t('Phản hồi')}</Text>
          <Icon name="chevron-forward-outline" size={24} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            justifyContent: 'space-between',
            marginTop: 10,
          }}
          onPress={() => {
            navigation.push('Support');
          }}>
          <Text>{t('Hỗ trợ')}</Text>
          <Icon name="chevron-forward-outline" size={24} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          height: 75,
          backgroundColor: 'white',
          marginTop: 15,
          paddingHorizontal: 10,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="menu-outline" size={24} />
          <Text
            style={{
              fontSize: 16,
              color: 'black',
              fontWeight: '500',
              marginLeft: 10,
              marginVertical: 10,
            }}>
            {t('Khác')}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            justifyContent: 'space-between',
          }}
          onPress={() => {
            setModalVisible(true)
          }}>
          <Text>{t('Ngôn ngữ')}</Text>
          <Icon name="chevron-forward-outline" size={24} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
          marginTop: 10,
        }}
        activeOpacity={1}
        onPress={logout}>
        <Icon name="log-out-outline" size={24} color="black" />
        <Text style={{marginLeft: 10, color: 'black'}}>{t('Thoát ứng dụng')}</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={{flex:1,flexDirection:'column-reverse'}}>
          <View style={{height:160, backgroundColor:'white', borderTopRightRadius:15, borderTopLeftRadius:15}}>
            <TouchableOpacity onPress={()=>{setModalVisible(false)}} style={{position:'absolute',left:10,top:5}}>
              <Icon name='close-outline' size={28}/>
            </TouchableOpacity>
            <Text style={{alignSelf:'center',marginTop:10}}>{t('Vui lòng chọn ngôn ngữ')}</Text>
            <TouchableOpacity style={{borderWidth:1,borderColor:lang=='vn'?COLORS.custom:'#C5C5C5',borderRadius:10, height:40, alignItems:'center', justifyContent:'center', marginHorizontal:16, marginVertical:8}}
              onPress={()=>{changeLanguage('vn')}}>
              <Text style={{color:lang=='vn'?COLORS.custom:'#C5C5C5'}}>{t('Tiếng Việt')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{borderWidth:1,borderColor:lang=='en'?COLORS.custom:'#C5C5C5',borderRadius:10, height:40, alignItems:'center', justifyContent:'center', marginHorizontal:16, marginVertical:8}}
              onPress={()=>{changeLanguage('en')}}>
              <Text style={{color:lang=='en'?COLORS.custom:'#C5C5C5'}}>{t('Tiếng Anh')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default User;

const styles = StyleSheet.create({});
