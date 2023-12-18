import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {SharedElement} from 'react-navigation-shared-element';
import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native';
const {width, height} = Dimensions.get('window');
const Banner = ({route}) => {
  const item = route.params.item;
  const [text, setText] = useState();
  useEffect(() => {
    setText(item.content.replace(/\\n/g, '\n'));
  });
  const navigation=useNavigation()
  return (
    <View style={{flex: 1,backgroundColor:'white'}}>
      <SharedElement id={`${item.image}`}>
        <Image
          source={{uri: item.image}}
          style={{height: width / 2 + 50, width: width, resizeMode: 'stretch'}}
        />
      </SharedElement>

      <View style={{paddingHorizontal: 16}}>
        <Text style={{color: 'black', fontSize: 15,marginTop:10}}>{text}</Text>
      </View>
      <TouchableOpacity style={{height:30,width:30,borderRadius:15, backgroundColor:'white',position:'absolute',top:10,left:10,justifyContent:'center', alignItems:'center'}}
        onPress={()=>{navigation.goBack()}}>
        <Icon name='close-outline' size={24} color='gray'/>
      </TouchableOpacity>
    </View>
  );
};

Banner.sharedElements = ({route}) => {
  const {item} = route.params;
  return [
    {
      id: `${item.image}`,
      animation: 'move',
      resize: 'clip',
    },
  ];
};

export default Banner;

const styles = StyleSheet.create({});
