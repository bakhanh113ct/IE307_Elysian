import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React,{useState} from 'react'
import COLORS from '../common/Color'
import NumberFormat from 'react-number-format';
const ButtonGroup = ({ size, onSelect, item }) => {
    const[selected,setSelected]=useState(0);
    
    const onClick=(index)=>{
        setSelected(index)
        onSelect(size[index])
    }

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center',marginHorizontal:25 }}>
            {size.map((item1, index) => {
                return (
                    <TouchableOpacity style={{...styles.container,backgroundColor:index==selected?'#BC945D':'#F2E9DE'}} key={index} onPress={()=>onClick(index)}>
                        <Text style={{ fontSize: 18, color: index==selected?'white':'black', fontWeight: 'bold', alignSelf:'center',flex:6, marginTop:5}}>{item1.name}</Text>
                        <View style={{backgroundColor:index==selected?'#513628':'#E5DBCF',flex:4, borderBottomLeftRadius:10,borderBottomRightRadius:10, alignItems:'center', justifyContent:'center'}}>
                        <NumberFormat
                            value={parseInt(item1.price)+parseInt(item.price)}
                            displayType="text"
                            thousandSeparator
                            suffix='đ'
                            renderText={(value) => <Text style={{fontWeight:'bold',color:index==selected?'white':'black', fontSize:14}}>{value}</Text>}
                        />
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    )
}

export default ButtonGroup

const styles = StyleSheet.create({
    container: {
        height: 55,
        margin: 10,
        borderRadius: 10,
        flex:10
    }
})