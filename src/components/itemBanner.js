import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import React from 'react';
import {keyExtractor} from 'react-native/Libraries/Lists/VirtualizeUtils';
import {SharedElement} from 'react-navigation-shared-element';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';

const {width, height} = Dimensions.get('window');
const ItemBanner = ({item, navigation}) => {
  const uitem = item;
  return (
    <View
      style={{
        height: width / 2 - 10,
        width: width / 2 - 25,
        marginBottom: 25,
        marginHorizontal: 7,
      }}>
      <TouchableWithoutFeedback
        onPress={() => navigation.navigate('Banner', {item: uitem})}>
        <SharedElement id={`${uitem.image}`}>
          <Image
            source={{uri: uitem.image}}
            style={{
              height: width / 2 - 30,
              width: width / 2 - 25,
              marginBottom: 0,
              borderRadius: 10,
            }}
            resizeMode="contain"
          />
        </SharedElement>
      </TouchableWithoutFeedback>
      <Text style={{color: 'black'}}>{uitem.title.toUpperCase()}</Text>
    </View>
  );
};

export default ItemBanner;

const styles = StyleSheet.create({});
