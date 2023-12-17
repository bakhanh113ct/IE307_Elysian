import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import COLORS from '../common/Color';
const ItemCategory = ({item, dataCategory, setDataCategory, scroll}) => {
  const choose = () => {
    const newData = dataCategory.map(e => {
      if (e.title == item.title) {
        return {
          ...e,
          select: 'true',
        };
      } else {
        return {
          ...e,
          select: 'false',
        };
      }
    });
    setDataCategory(newData);
    scroll(item.index);
  };
  return (
    <TouchableOpacity style={styles.container} onPress={choose}>
      <Text style={item.select == 'true' ? styles.selectText : styles.Text}>
        {item.title}
      </Text>
      <View
        style={item.select == 'true' ? styles.selectDivide : styles.Divide}
      />
    </TouchableOpacity>
  );
};

export default ItemCategory;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'baseline',
  },
  selectDivide: {
    height: 4,
    backgroundColor: COLORS.custom,
  },
  selectText: {
    margin: 10,
    fontWeight: 'bold',
    color: COLORS.custom,
  },
  Text: {
    margin: 10,
    color: 'gray',
  },
  Divide: {
    height: 4,
    backgroundColor: 'white',
  },
});
