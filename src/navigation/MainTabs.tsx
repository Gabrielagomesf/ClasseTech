import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  DashboardScreen,
  RegistrationsScreen,
  SettingsScreen,
} from '../screens';
import type {MainTabParamList, RootStackParamList} from '../types';
import {colors, radius} from '../theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

function TabLabel({
  label,
  focused,
}: {
  label: string;
  focused: boolean;
}) {
  return (
    <Text
      style={{
        color: focused ? colors.primary : colors.textMuted,
        fontSize: 11,
        fontWeight: focused ? '700' : '500',
      }}>
      {label}
    </Text>
  );
}

function NewRegistrationPlaceholder() {
  return <View />;
}

export function MainTabs() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 68,
          paddingBottom: 10,
          paddingTop: 8,
        },
      }}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Início',
          tabBarIcon: ({focused}) => (
            <TabLabel label="⌂" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Registrations"
        component={RegistrationsScreen}
        options={{
          title: 'Cadastros',
          tabBarIcon: ({focused}) => (
            <TabLabel label="☰" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="NewRegistration"
        component={NewRegistrationPlaceholder}
        options={{
          title: 'Novo',
          tabBarIcon: () => (
            <View style={styles.addButton}>
              <Text style={styles.addLabel}>+</Text>
            </View>
          ),
          tabBarButton: props => (
            <Pressable
              {...props}
              onPress={() => navigation.navigate('SelectPersonType')}
              style={styles.addPressable}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Config',
          tabBarIcon: ({focused}) => (
            <TabLabel label="⚙" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  addPressable: {
    top: -12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addLabel: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '700',
    marginTop: -2,
  },
});
