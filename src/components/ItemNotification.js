import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {SharedElement} from 'react-navigation-shared-element';
import {useNavigation} from '@react-navigation/native';
const ItemNotification = ({item}) => {
  const [time, setTime] = useState('10/2');
  const [isNew, setNew] = useState(item.isNew);
  const navigator = useNavigation();
  const convertTime = time => {
    const newTime = new Date(time * 1000);
    setTime(newTime.getDate() + '/' + newTime.getMonth());
    return newTime;
  };
  const updateDoc = async data => {
    await firestore()
      .collection('Users')
      .doc(auth().currentUser.uid)
      .update({Notifications: data})
      .then(() => {
        // console.log('changed')
      });
  };
  const UpdateNew = async () => {
    let data = {};
    await firestore()
      .collection('Users')
      .doc(auth().currentUser.uid)
      .onSnapshot(document => {
        Object.assign(data, document.data().Notifications);
        try {
          for (const [key, value] of Object.entries(
            document.data().Notifications,
          )) {
            if (item.id === key)
              if (value === true) {
                setNew(true);
              }
          }
        } catch (error) {}
      });
  };
  const SetIsNew = async () => {
    let data = {};
    await firestore()
      .collection('Users')
      .doc(auth().currentUser.uid)
      .onSnapshot(document => {
        Object.assign(data, document.data().Notifications);
        for (const [key, value] of Object.entries(
          document.data().Notifications,
        )) {
          // console.log(`${key}: ${value}`);
          if (item.id === key)
            if (value === true) {
              // console.log(item.id)
              // console.log(key)
              data[key] = false;
              // console.log(data)
              updateDoc(data);
              setNew(false);
            }
        }
        setNew(false);
      });
  };
  const Click = async () => {
    try {
      const banner = item.BannerID.trim();
      await firestore()
        .collection('Banners')
        .doc(banner)
        .get()
        .then(doc => {
          navigator.navigate('Banner', {item: doc.data()});
          // console.log(doc.data())
        });
    } catch (error) {
      console.log(error);
      navigator.navigate('Order');
    }
    SetIsNew();
  };
  const remove = async () => {
    await firestore()
      .collection('Users')
      .onSnapshot(query => {
        query.forEach(doc => {
          doc.ref.update({
            Notifications: firestore.FieldValue.delete(),
          });
        });
      });
  };

  useEffect(() => {
    UpdateNew();
    convertTime(item.date.seconds);
  }, []);

  return (
    <TouchableOpacity
      style={[styles.container]}
      activeOpacity={0.7}
      onPress={() => {
        // ItemClick();
        // console.log(item)
        // Click();
        // remove()
        Click();
      }}>
      <View style={{flex: 1}}>
        <SharedElement id={`${item.linkImage}`}>
          <Image
            style={styles.imageLeft}
            source={{
              uri:
                item.linkImage !== '' && item.linkImage !== undefined
                  ? item.linkImage
                  : 'https://firebasestorage.googleapis.com/v0/b/notification-314b0.appspot.com/o/image1%20-%20Copy.png?alt=media&token=adb16fcd-0104-41df-90d1-f795bc6be25f',
            }}
          />
        </SharedElement>
      </View>
      <View style={styles.body}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{item.title}</Text>
        </View>
        <Text style={{fontSize: 13}}>{item.body}</Text>
      </View>
      <View style={styles.containerRight}>
        <View style={styles.time}>
          <Text>{time}</Text>
        </View>
        {isNew && (
          <View style={styles.new}>
            <Icon name="circle" color={'#4FC4F5'} size={8} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ItemNotification;

const styles = StyleSheet.create({
  container: {
    height: 90,
    borderBottomWidth: 0.2,
    backgroundColor: 'white',
    borderColor: '#ccc',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 0.4,
    paddingHorizontal: 15,
  },
  imageLeft: {
    width: 60,
    height: 60,
    marginRight: 20,
  },
  body: {
    flexDirection: 'column',
    flex: 3,
    paddingLeft: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  title: {
    color: 'black',
    fontSize: 14,
    fontWeight: '500',
  },
  containerRight: {
    alignSelf: 'flex-start',
  },
  time: {
    paddingRight: 15,
    paddingTop: 15,
  },
  new: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginTop: -25,
  },
});
