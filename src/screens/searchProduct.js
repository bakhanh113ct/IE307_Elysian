import { StyleSheet, Text, View,TextInput,FlatList } from 'react-native'
import React,{useState,useEffect,useRef} from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import COLORS from '../common/Color'
import { useNavigation, useRoute } from '@react-navigation/native'
import ItemProduct from '../components/itemProduct'
import { useTranslation } from 'react-i18next'
const SearchProduct = () => {
    const navigation=useNavigation();
    const router=useRoute();
    const [data,setData]=useState([])
    const inputRef = useRef();
    const {t}=useTranslation()
    function removeAccents(str) {
        var AccentsMap = [
          "aàảãáạăằẳẵắặâầẩẫấậ",
          "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
          "dđ", "DĐ",
          "eèẻẽéẹêềểễếệ",
          "EÈẺẼÉẸÊỀỂỄẾỆ",
          "iìỉĩíị",
          "IÌỈĨÍỊ",
          "oòỏõóọôồổỗốộơờởỡớợ",
          "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
          "uùủũúụưừửữứự",
          "UÙỦŨÚỤƯỪỬỮỨỰ",
          "yỳỷỹýỵ",
          "YỲỶỸÝỴ"    
        ];
        for (var i=0; i<AccentsMap.length; i++) {
          var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
          var char = AccentsMap[i][0];
          str = str.replace(re, char);
        }
        return str;
      }
    useEffect(()=>{
        inputRef.current.focus();
    },[])
    const search=(text)=>{
        if(text!=''){
            const temp=router.params.data.filter((e)=>e.name.toLowerCase().indexOf(text.toLowerCase())>-1)
            setData(temp)
        }
        else{
            setData([])
        }
    }
  return (
    <View style={{flex:1,backgroundColor:'white'}}>
      <View style={{height:65,alignItems:'center',justifyContent:'center',flexDirection:'row',marginHorizontal:16}}>
        <View style={{flexDirection:'row',alignItems:'center',height:40, backgroundColor:'#F5F5F5', borderRadius:5,width:'85%'}}>
            <Icon name='search-outline' size={24} style={{marginLeft:15}}/>
            <TextInput placeholder={t('Tìm kiếm')} style={{width:'88%'}} onChangeText={search} ref={inputRef}/>
        </View>
        <Text style={{width:'15%',paddingLeft:10,color:COLORS.custom}} onPress={()=>{navigation.goBack()}}>{t('Hủy')}</Text>
      </View>
      <View style={{height:0.7,backgroundColor:'#F5F5F5'}}/>
        <FlatList
        style={{marginTop:10}}
        data={data}
        renderItem={({item})=><ItemProduct topping={router.params.topping} size={router.params.size} item={item}/>}
        keyExtractor={item=>item+item.name}
        />
    </View>
  )
}

export default SearchProduct

const styles = StyleSheet.create({})