import {StyleSheet} from 'react-native';
import COLORS from '../common/Color';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  aroundContainer: {
    backgroundColor: 'white',
    marginTop: 15,
    padding: 20,
  },
  bold: {fontWeight: '500', color: 'black'},
  iconSize: {
    fontSize: 20,
  },
  textColor: {
    color: 'black',
  },
  btnContainer: {
    backgroundColor: COLORS.backgroundWeak,
    alignItems: 'center',
    borderRadius: 10,
    height: 25,
    justifyContent: 'center',
  },
  btnCompletePayment: {
    width: 100,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
  },
  addressContain: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  moreAddressContainer: {
    backgroundColor: 'white',
    paddingStart: 20,
    marginTop: 10,
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    flex: 1,
  },
  optionContainer: {
    width: '15%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginStart: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    flex: 1,
    borderRadius: 10,
  },
  hiddenItem: {
    flex: 1,
    marginTop: 5,
    alignItems: 'flex-end',
  },
  optionsText: {color: 'white', fontWeight: '500'},
  bottomPayment: {
    backgroundColor: COLORS.custom,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  totalItemContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingTop: 15,
    marginBottom: 15,
  },
  productPayment: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 10,
    borderColor: COLORS.custom,
  },
  discountText: {
    color: COLORS.custom,
  },
});
