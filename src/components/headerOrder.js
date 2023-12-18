import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import COLORS from '../common/Color';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const HeaderOrder = ({data,topping,size}) => {
  const Navigation = useNavigation();
  const {t}=useTranslation();
  const navPayment = () => {
    Navigation.push('Favorite');
  };
  const navSearch = () => {
    Navigation.push('SearchProduct',{data:data,topping:topping,size:size});
  };
  return (
    <View style={styles.container}>
      <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
        {t("Đặt hàng")}
      </Text>
      <View style={{flexDirection:'row'}}>
        <Icon name="search-outline" size={26} color="white" onPress={navSearch} style={{marginRight:15}}/>
        <Icon name="heart-outline" size={26} color="white" onPress={navPayment} />
      </View>
      
    </View>
  );
};

export default HeaderOrder;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.custom,
    height: 50,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
});
