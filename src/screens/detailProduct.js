import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  LogBox,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import NumberFormat from 'react-number-format';
import Icon from 'react-native-vector-icons/Ionicons';
import ButtonGroup from '../components/buttonGroup';
import COLOR from '../common/Color';
import SelectMultiple from 'react-native-select-multiple';
import {useDispatch} from 'react-redux';
import {addProduct} from '../redux/orderSlice';
import firestore from '@react-native-firebase/firestore';
import fireauth from '@react-native-firebase/auth';
import {showMessage} from 'react-native-flash-message';
import {useTranslation} from 'react-i18next';

const DetailProduct = () => {
  const {t} = useTranslation();
  const uid = fireauth().currentUser.uid;
  const router = useRoute();
  const navigation = useNavigation();
  const [favorite, setFavorite] = useState(false);
  const [size, setSize] = useState(router.params.size[0]);
  const [price, setPrice] = useState(router.params.item.price);
  const [count, setCount] = useState(1);
  const [id, setId] = useState();
  const [selectedTopping, setselectedTopping] = useState([]);
  LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  LogBox.ignoreAllLogs();
  const total =
    (parseInt(size.price) +
      parseInt(price) +
      selectedTopping.reduce(
        (total, currentValue) => total + parseInt(currentValue.value.price),
        0,
      )) *
    count;
  const topping = router.params.topping.map(e => {
    return {
      label: {name: e.name, price: e.price},
      value: e,
    };
  });
  const dispatch = useDispatch();
  const check = async () => {
    await firestore()
      .collection('Favorite')
      .where('userID', '==', uid)
      .where('productID', '==', router.params.item.productID)
      .get()
      .then(snap => {
        if (snap.size > 0) {
          setFavorite(true);
          snap.forEach(e => {
            setId(e.id);
          });
        }
      });
  };
  const clickfavotite = async () => {
    if (!favorite) {
      await firestore()
        .collection('Favorite')
        .add({
          userID: uid,
          productID: router.params.item.productID,
          createTime: firestore.Timestamp.now(),
        })
        .then(() => {
          setFavorite(true);
        });
    } else {
      await firestore()
        .collection('Favorite')
        .doc(id)
        .delete()
        .then(() => {
          setFavorite(false);
        });
    }
  };
  const handleSummit = () => {
    const value = {
      product: router.params.item,
      size: size,
      topping: [
        ...selectedTopping.map(e => {
          return {...e.value};
        }),
      ],
      count: count,
      total: total,
    };
    const action = addProduct(value);
    dispatch(action);
    navigation.goBack();
    showMessage({
      message: `${t('Add')} ${value.product.name} ${t('to cart successfully')}`,
      description: t('Press to go to cart'),
      type: 'success',
      onPress: () => {
        navigation.push('Payment');
      },
      duration: 2000,
    });
  };
  const onSelectionsChange = selectedFruits => {
    setselectedTopping(selectedFruits);
  };
  const increaseCount = () => {
    setCount(count + 1);
  };
  const decreaseCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };
  const renderLabel = (label, style) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: 300,
          justifyContent: 'space-between',
        }}>
        <Text style={{fontSize: 16}}>{label.name}</Text>
        <NumberFormat
          value={parseInt(label.price)}
          displayType="text"
          thousandSeparator
          suffix="đ"
          renderText={value => <Text>{value}</Text>}
        />
      </View>
    );
  };
  useEffect(() => {
    check();
  }, [favorite]);
  return (
    <View style={{flex: 1}}>
      <ScrollView style={styles.container}>
        <View>
          <View style={styles.imgContainer}>
            <TouchableOpacity
              style={styles.btnfl}
              onPress={() => {
                navigation.goBack();
              }}>
              <Icon name="close-outline" size={26} color="white" />
            </TouchableOpacity>
            <Image
              source={{uri: router.params.item.linkImage}}
              style={styles.img}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              paddingVertical: 10,
              alignItems: 'center',
              backgroundColor: 'white',
            }}>
            <View>
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                {router.params.item.name}
              </Text>
              <NumberFormat
                value={parseInt(router.params.item.price)}
                displayType="text"
                thousandSeparator
                suffix="đ"
                renderText={value => (
                  <Text style={{fontSize: 16}}>{value}</Text>
                )}
              />
            </View>
            <Icon
              name={favorite ? 'heart' : 'heart-outline'}
              size={24}
              color={favorite ? COLOR.custom : 'gray'}
              onPress={() => {
                clickfavotite();
              }}
            />
          </View>
          <View
            style={{
              paddingHorizontal: 16,
              marginTop: 20,
              backgroundColor: 'white',
            }}>
            <Text style={{fontWeight: 'bold', fontSize: 18, marginTop: 10}}>
              Size
            </Text>
            <Text>{t('Select size')}</Text>
            <ButtonGroup
              size={router.params.size}
              item={router.params.item}
              onSelect={setSize}
            />
          </View>
          <View
            style={{
              height: 380,
              backgroundColor: 'white',
              marginTop: 20,
              paddingHorizontal: 16,
            }}>
            <Text style={{fontWeight: 'bold', fontSize: 18, marginTop: 10}}>
              Topping
            </Text>
            <Text>{t('Select up to 2 types')}</Text>
            <SelectMultiple
              renderLabel={renderLabel}
              items={topping}
              selectedItems={selectedTopping}
              onSelectionsChange={onSelectionsChange}
              maxSelect={2}
            />
          </View>
          <View style={{height: 130}} />
        </View>
      </ScrollView>
      <View
        style={{
          height: '15%',
          position: 'absolute',
          bottom: 0,
          width: '100%',
          backgroundColor: 'white',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            paddingHorizontal: 110,
            flex: 0.5,
          }}>
          <Icon
            name="remove-circle-outline"
            size={32}
            color={count > 1 ? COLOR.custom : 'gray'}
            onPress={() => decreaseCount()}
          />
          <Text style={{fontSize: 24, fontWeight: '600', color: COLOR.custom}}>
            {count}
          </Text>
          <Icon
            name="add-circle-outline"
            size={32}
            color={COLOR.custom}
            onPress={() => increaseCount()}
          />
        </View>
        <View style={{flex: 0.5}}>
          <TouchableOpacity
            style={{
              borderRadius: 5,
              backgroundColor: COLOR.custom,
              height: 45,
              marginHorizontal: 16,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={handleSummit}>
            <NumberFormat
              value={total}
              displayType="text"
              thousandSeparator
              suffix="đ"
              renderText={value => (
                <Text style={{color: 'white'}}>
                  {t('Add to cart')}: {value}
                </Text>
              )}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default DetailProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  imgContainer: {
    height: 200,
    backgroundColor: '#F6F1E7',
    justifyContent: 'center',
  },
  img: {
    height: 180,
    width: 180,
    alignSelf: 'center',
  },
  btnfl: {
    backgroundColor: 'gray',
    width: 30,
    height: 30,
    borderRadius: 15,
    position: 'absolute',
    top: 10,
    left: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
