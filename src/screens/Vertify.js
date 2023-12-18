import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import firestore from '@react-native-firebase/firestore';
import COLORS from '../common/Color';
import {signOut} from '../utils/Auth';
import Icon from 'react-native-vector-icons/Ionicons';
import RNOtpVerify from 'react-native-otp-verify';
import {useTranslation} from 'react-i18next';
const Vertify = ({
  navigation,
  confirm,
  isSocial = 0,
  setHasPhone,
  phoneNumber,
  setConfirm,
}) => {
  // const [phoneNumber, setPhoneNumber] = useState('0396891589');
  const [timetoResend, setTimetoResend] = useState('3:00');
  const [code, setCode] = useState('');
  const [user, setUser] = useState(null);
  const [isPress, setIsPress] = useState(false);
  const {t} = useTranslation();
  async function confirmCode() {
    try {
      // console.log(confirm);
      await confirm.confirm(code);
      // console.log('success');
    } catch (error) {
      console.log('Invalid code.');
    }
  }
  async function confirmCodewithSocical() {
    try {
      const credential = auth.PhoneAuthProvider.credential(
        confirm.verificationId,
        code,
      );
      let userData = await auth().currentUser.linkWithCredential(credential);
      setUser(userData.user);
      setHasPhone(true);
      UpdateUser();
    } catch (error) {
      if (error.code == 'auth/invalid-verification-code') {
        console.log('Invalid code.');
      } else {
        console.log(error);
        // if(error == 'auth/unknown] User has already been linked to the given provider')
        //   setHasPhone(true)
      }
    }
  }
  const UpdateUser = async () => {
    const user = auth().currentUser;
    let userInfo;
    userInfo = {phoneNumber: user.phoneNumber, name: user.displayName};
    await firestore()
      .collection('Users')
      .doc(auth().currentUser.uid)
      .set(userInfo)
      .then(() => {
        // console.log('added');
      });
  };
  const otpHandler = message => {
    try {
      const ootp = /(\d{6})/g.exec(message)[1];
      setCode(ootp);
      RNOtpVerify.removeListener();
    } catch (error) {}
  };
  useEffect(() => {
    RNOtpVerify.getHash().then().catch(console.log);
    RNOtpVerify.getOtp()
      .then(p => RNOtpVerify.addListener(otpHandler))
      .catch(p => console.log(p));
    if (code === '') setIsPress(false);
    else setIsPress(true);
    return RNOtpVerify.removeListener();
  }, [code]);
  // if(profileUpdated)
  return (
    <View style={styles.container}>
      <View style={{alignItems: 'flex-end', marginTop: 10, marginRight: -10}}>
        <Icon
          name="close-circle-outline"
          size={35}
          onPress={() => setConfirm(null)}
        />
      </View>
      <View style={styles.header}>
        <Text style={styles.txtHeader}>{t('Confirm OTP')}</Text>
        <Text style={styles.txtNoti}>
          {t('A 6-digit verification code has been sent to the phone number')}{' '}
          {phoneNumber}
        </Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.txtNoti}>{t('Enter code to continue')}</Text>
        <OTPInputView
          style={{width: '100%', height: 100}}
          pinCount={6}
          code={code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
          onCodeChanged={code => {
            setCode(code);
          }}
          autoFocusOnLoad={false}
          codeInputFieldStyle={styles.underlineStyleBase}
          codeInputHighlightStyle={styles.underlineStyleHighLighted}
          onCodeFilled={code => {
            console.log(`Code is ${code}, you are good to go!`);
          }}
        />
        {/* <Text style={styles.txtNoti}>
          Không nhận được mã Gửi lại ({timetoResend})
        </Text> */}
        <TouchableOpacity
          style={[
            styles.btnLogin,
            {backgroundColor: !isPress ? '#ccc' : COLORS.custom},
          ]}
          onPress={() => {
            if (isSocial === 1) confirmCodewithSocical();
            else confirmCode();
          }}>
          <Text style={{alignSelf: 'center', fontSize: 17, color: 'white'}}>
            {t('Confirm')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Vertify;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
  },
  body: {
    flex: 2,
    justifyContent: 'flex-start',
  },
  txtHeader: {
    fontSize: 25,
    alignSelf: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  txtNoti: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 15,
    paddingHorizontal: 10,
  },
  //otp-input
  borderStyleBase: {
    width: 30,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: '#03DAC6',
  },

  underlineStyleBase: {
    // width: 30,
    // height: 45,
    borderWidth: 1,
    borderBottomWidth: 1,
    borderRadius: 5,
    color: 'black',
  },

  underlineStyleHighLighted: {
    borderColor: '#03DAC6',
  },
  //

  btnLogin: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    flex: 1,
    // backgroundColor: COLORS.custom,
    height: 46,
    justifyContent: 'center',
    borderRadius: 10,
  },
});
