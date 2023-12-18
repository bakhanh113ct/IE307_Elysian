import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ItemSupport from '../components/itemSupport'
import { useTranslation } from 'react-i18next'

const Support = () => {
    const {t}=useTranslation()
    const data=[
    {
        icon:'phone',
        title:t('Tổng đài'),
        value:'02871087088',
        type:'phone'
    },
    {
        icon:'envelope',
        title:'Email',
        value:'info@gongcha.com.vn',
        type:'email'
    },
    {
        icon:'globe',
        title:'Website',
        value:'https://gongcha.com.vn/',
        type:'website'
    },
    {
        icon:'facebook-square',
        title:'Facebook',
        value:'facebook.com/GongChaVietnam',
        type:'facebook'
    },
    {
        icon:'instagram',
        title:'Instagram',
        value:'gongchavietnam',
        type:'instagram'
    },

]
  return (
    <View style={{flex:1, paddingTop:20}}>
      {
          data.map((e)=><ItemSupport item={e} key={e.icon}/>)
      }
    </View>
  )
}

export default Support

const styles = StyleSheet.create({})