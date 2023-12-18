import {StyleSheet} from 'react-native';
import COLORS from '../common/Color';

export default StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.custom,
    height: 50,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  screenOptions: {
    tabBarActiveTintColor: COLORS.custom,
    tabBarIndicatorStyle: {
      backgroundColor: COLORS.custom,
    },
    tabBarLabelStyle: {
      fontSize: 13,
      textTransform: 'none',
      fontWeight: '500',
    },
  },
});
