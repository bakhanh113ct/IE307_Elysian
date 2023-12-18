import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import COLORS from '../common/Color'
import { useNavigation } from '@react-navigation/native'
const ItemAddress = ({item}) => {
  const navigation=useNavigation()
  const location=()=>{
    return item.ward+", "+item.district+", "+item.province
  }
  return (
    <TouchableOpacity style={{height:100, flexDirection:'row', marginVertical:8, alignItems:'center', paddingHorizontal:10, backgroundColor:'white'}}
        activeOpacity={1}
        onPress={()=>{navigation.push('DetailAddress',item)}}>
        <View style={{flex:0.9, height:80,}}>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <Text style={{fontSize:16, color:'black'}}>{item.name}</Text>
          {
              item.selected&&<Text style={{color:COLORS.custom, marginLeft:4}}>[mặc định]</Text>
          } 
      </View>
      <Text style={{marginTop:4}}>{item.phone}</Text>
      <Text>{item.detail}</Text>
      <Text numberOfLines={1}>{location()}</Text>
        </View>
      <View style={{flex:0.1, flexDirection:'column-reverse',alignItems:'center',height:80,}}>
        <Icon name='location-outline' size={24} style={{marginBottom:2}} color={COLORS.custom}/>
      </View>
    </TouchableOpacity>
  )
}

export default ItemAddress

const styles = StyleSheet.create({})