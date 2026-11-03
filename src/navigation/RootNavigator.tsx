import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  CompanyFormScreen,
  PersonFormScreen,
  RegistrationDetailsScreen,
  SelectPersonTypeScreen,
  SplashScreen,
} from '../screens';
import type {RootStackParamList} from '../types';
import {colors} from '../theme';
import {MainTabs} from './MainTabs';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShadowVisible: false,
          headerTintColor: colors.primary,
          headerTitleStyle: {fontWeight: '700'},
          headerStyle: {backgroundColor: colors.background},
          contentStyle: {backgroundColor: colors.background},
        }}>
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SelectPersonType"
          component={SelectPersonTypeScreen}
          options={{title: 'Tipo de cadastro'}}
        />
        <Stack.Screen
          name="PersonForm"
          component={PersonFormScreen}
          options={{title: 'Cadastro PF'}}
        />
        <Stack.Screen
          name="CompanyForm"
          component={CompanyFormScreen}
          options={{title: 'Cadastro PJ'}}
        />
        <Stack.Screen
          name="RegistrationDetails"
          component={RegistrationDetailsScreen}
          options={{title: 'Detalhes'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
