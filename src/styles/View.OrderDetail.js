import {StyleSheet} from 'react-native';
import COLORS from '../common/Color';

export default StyleSheet.create({
  container: {
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  layout: {flexDirection: 'row', justifyContent: 'space-between'},
  textAction: {
    paddingStart: 20,
    paddingEnd: 20,
    padding: 7,
    color: 'white',
  },
});
