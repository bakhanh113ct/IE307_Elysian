import { StyleSheet, Text, View, ActivityIndicator, FlatList, RefreshControl } from 'react-native'
import React, { useState, useEffect } from 'react'
import fireauth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import ItemProduct from '../components/itemProduct'
import COLORS from '../common/Color'
const FavoriteProduct = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [size, setSize] = useState([]);
    const [topping, setTopping] = useState([]);
    const [refreshing, setRefreshing] = useState(false)
    const getFavoriteName = async () => {
        const data = []
        await firestore()
            .collection('Favorite')
            .where('userID', '==', fireauth().currentUser.uid)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    data.push(documentSnapshot.data().productID)
                });
            })
        return data
    }
    const getProduct = async (data) => {
        const product = []
        if (data.length > 0) {
            await firestore().
                collection('Products')
                .where('productID', 'in', data)
                .get()
                .then(querySnapshot => {
                    querySnapshot.forEach(documentSnapshot => {
                        product.push(documentSnapshot.data())
                    });
                })
        }
        setData(product)
    }
    const getTopping = async () => {
        const temp = []
        await firestore().
            collection('Toppings')
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    temp.push(documentSnapshot.data())
                });
            })
        setTopping(temp)
    }
    const getSize = async () => {
        const temp = []
        await firestore().
            collection('Sizes')
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    temp.push(documentSnapshot.data())
                });
            })
        setSize(temp)
    }
    const getData = async () => {
        const temp = await getFavoriteName()
        getProduct(temp)
        getSize()
        getTopping()
        setLoading(false)
    }
    const onRefresh = () => {
        setRefreshing(true)
        getData()
        setRefreshing(false)
    }
    useEffect(() => {
        getData()
    }, [])
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator color={COLORS.custom} />
            </View>
        )
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <FlatList
                style={{ marginTop: 6 }}
                data={data}
                renderItem={({ item }) => <ItemProduct item={item} topping={topping} size={size} />}
                keyExtractor={item => item + item.id}
                refreshControl={
                    <RefreshControl
                        colors={[COLORS.custom]}
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />
        </View>
    )
}

export default FavoriteProduct

const styles = StyleSheet.create({})