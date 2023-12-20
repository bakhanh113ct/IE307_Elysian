import OnGoing from '../screens/onGoing';
import WaiToConFirm from '../screens/waitToConfirm';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import styles from '../styles/View.TopTab.Nav';
import CancelledOrder from '../screens/cancelledOrder';
import CompletedOder from '../screens/completedOder';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

const Tab = createMaterialTopTabNavigator();

export default TopTabOrder = () => {
  const {t} = useTranslation();
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator screenOptions={styles.screenOptions}>
        <Tab.Screen name={t('Waiting')} component={WaiToConFirm} />
        <Tab.Screen name={t('Shipping')} component={OnGoing} />
        <Tab.Screen name={t('Cancelled')} component={CancelledOrder} />
        <Tab.Screen name={t('Completed')} component={CompletedOder} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
