import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Input from '../components/input';
import SignIn from '../screens/SignIn'
import Vertify from '../screens/Vertify';
import Register from '../screens/Register';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
const SiginInNavigate = () => {
  return (
    <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false}}>
            <Stack.Screen name="SignIn" component={SignIn} />
            {/* <Stack.Screen name="Register" component={Register} /> */}
            <Stack.Screen name="Vertify" component={Vertify} />
          </Stack.Navigator>
        </NavigationContainer>
  )
}

export default SiginInNavigate

const styles = StyleSheet.create({})
