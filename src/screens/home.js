import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  FlatList,
  SafeAreaView,
  LogBox,
} from 'react-native';
import COLORS from '../common/Color';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import Swiper from 'react-native-swiper';
import auth from '@react-native-firebase/auth';
// import {keyExtractor} from 'react-native/Libraries/Lists/VirtualizeUtils';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Ionicons';
import Materialdesignicons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SharedElement} from 'react-navigation-shared-element';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import ItemBanner from '../components/itemBanner';
import ItemProduct from '../components/itemProduct';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {Button} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
const {height, width} = Dimensions.get('window');

const Home = ({navigation}) => {
  const [notificationNum, setNotiNum] = useState('0');
  const orders = useSelector(state => state.orders.list);
  const navigator = useNavigation();
  const [databanner, setDatabanner] = useState([]);
  const [dataProducts, setDataProducts] = useState([]);
  const [dataSize, setDataSize] = useState([]);
  const [datatopping, setDataTopping] = useState([]);
  const [voucher, setVoucher] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const getData = async () => {
    const listBanner = [];
    const listProduct = [];
    const size = [];
    const topping = [];
    await firestore()
    .collection('Banners')
    .get()
    .then(querySnapshot => {
      // console.log('Total users: ', querySnapshot.size);
      querySnapshot.forEach(documentSnapshot => {
        listBanner.push(documentSnapshot.data());
        // console.log(documentSnapshot.data());
      });
      setDatabanner(listBanner);
    });
    await firestore()
      .collection('Products')
      .limit(5)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          listProduct.push(documentSnapshot.data());
        });
        setDataProducts(listProduct);
      });
    await firestore()
      .collection('Vouchers')
      .get()
      .then(querySnapshot => {
        setVoucher(querySnapshot.size);
      });

    await firestore()
      .collection('Sizes')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          size.push(documentSnapshot.data());
        });
        setDataSize(size);
      });
    
    await firestore()
      .collection('Toppings')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          topping.push(documentSnapshot.data());
        });
        setDataTopping(topping);
      });
    
    setIsReady(true)
  };

  const getCountNewNotification = async () => {
    await firestore()
      .collection('Users')
      .doc(auth().currentUser.uid)
      .onSnapshot(doc => {
        try {
          const data = Object.values(doc.data().Notifications);
          const count = data.filter(value => value === true).length;
          setNotiNum(count);
        } catch (error) {
          setNotiNum(0);
        }
      });
  };
  const {t, i18n} = useTranslation();
  useEffect(() => {
    getData();
    getCountNewNotification();
  }, []);

  return (
    <View style={styles.container} nestedScrollEnabled={false}>
      {/* Header start*/}
      <View style={styles.header}>
        <Image
          source={require('../assets/elysian.jpg')}
          style={styles.imageLogo}
        />
        <Text style={styles.txtHeader}>
          {t('Xin chào')}, {auth().currentUser.displayName}
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.push('Voucher');
          }}
          activeOpacity={0.6}
          style={{
            position: 'absolute',
            right: 65,
            height: 38,
            width: 57,
            justifyContent: 'center',
            backgroundColor: 'white',
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 17,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
          }}>
          <Materialdesignicons
            name="ticket-percent-outline"
            size={25}
            color={COLORS.custom}
          />
          <Text style={{marginLeft: 4, fontWeight: '500', color: 'black'}}>
            {voucher}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.notificationContainer} onPress={() => navigator.navigate('Notification')}>
          <Icon1
            name="notifications-outline"
            size={28}
            
          />
          <View style={styles.NotiNum}>
            <Text style={styles.txtNotiNum}>{notificationNum}</Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* Header-end */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingHorizontal: 15}}>
        <Text style={styles.txtBST}>{t('Bộ sưu tập')}</Text>
        {/* Slider start */}
        <View style={styles.slider}>
          <Swiper
            activeDotColor="white"
            dotStyle={{marginTop: 40}}
            activeDotStyle={{marginTop: 40}}
            style={{height: width / 2 + 22}}
            autoplay
            autoplayTimeout={2}
            key={Math.random(5)}
            loop={true}>
            {isReady &&
              databanner.map((item, index) => {
                return (
                  <TouchableWithoutFeedback
                    key={item.image}
                    onPress={() => {
                      navigator.navigate('Banner', {item: item});
                    }}>
                    <Image
                      key={index}
                      style={{
                        borderRadius: 20,
                        // flex: 1,
                        width: width - 30,
                        height: width / 2,
                        resizeMode: 'contain',
                      }}
                      source={{uri: item.image}}
                      // resizeMethod='resize'
                    />
                  </TouchableWithoutFeedback>
                );
              })}
          </Swiper>
        </View>
        {/* Slider end */}
        <Text style={styles.txtSuggest}>{t('Gợi ý')}</Text>
        {/* Suggest Product start */}
        <View>
          {dataProducts.map((item, index) => {
            return (
              <ItemProduct
                item={item}
                key={index}
                topping={datatopping}
                size={dataSize}
              />
            );
          })}
        </View>
        {/* Suggest Product end */}
        <Text style={styles.txtDiscover}>{t('Khám phá thêm')}</Text>
        {/* Banner start */}
        <View style={styles.Banner}>
          {databanner.map((item, index) => {
            return (
              <ItemBanner item={item} navigation={navigation} key={index} />
            );
          })}
        </View>
        {/* Banner end */}
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    height: 60,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 0.2,
    borderColor: '#ccc',
  },
  txtHeader: {
    fontWeight: 'bold',
    fontSize: 15,
    paddingLeft: 5,
    color: 'black',
  },
  imageLogo: {
    marginHorizontal: 5,
    width: 35,
    height: 35,
    marginBottom: 5,
  },
  notificationContainer: {
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center',
    borderRadius: 20,
    position: 'absolute',
    right: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  NotiNum: {
    backgroundColor: 'red',
    height: 15,
    width: 15,
    borderRadius: 7.5,
    position: 'absolute',
    left: 20,
    top: 5,
  },
  txtNotiNum: {
    fontSize: 10,
    alignSelf: 'center',
    color: 'white',
    fontWeight: '500',
  },
  txtBST: {
    fontSize: 19,
    fontWeight: 'bold',
    color: 'black',
  },
  slider: {
    flex: 1,
    paddingVertical: 20,
  },
  txtSuggest: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  txtDiscover: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40,
    color: 'black',
  },
  Banner: {
    // flex: 2,
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginHorizontal: -5,
  },
  btnfl: {
    backgroundColor: COLORS.custom,
    width: 50,
    height: 50,
    borderRadius: 25,
    position: 'absolute',
    bottom: 15,
    right: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    backgroundColor: '#BC945D',
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
    bottom: 48,
    right: 15,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
});
