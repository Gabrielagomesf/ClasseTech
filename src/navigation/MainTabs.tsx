import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AppIcon, type AppIconName} from '../components/ui/AppIcon';
import {useLayout} from '../hooks/useLayout';
import {
  DashboardScreen,
  DocumentsScreen,
  RegistrationsScreen,
  SettingsScreen,
} from '../screens';
import type {MainTabParamList, RootStackParamList} from '../types';
import {colors, radius} from '../theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

function TabIcon({
  icon,
  label,
  focused,
}: {
  icon: AppIconName;
  label: string;
  focused: boolean;
}) {
  const {isCompact, scaleFont} = useLayout();
  const color = focused ? colors.primary : colors.textMuted;

  return (
    <View style={[styles.tabItem, isCompact && styles.tabItemCompact]}>
      <AppIcon name={icon} size={isCompact ? 20 : 22} color={color} />
      <Text
        style={[
          styles.tabLabel,
          {
            color,
            fontWeight: focused ? '700' : '500',
            fontSize: scaleFont(isCompact ? 9 : 10),
          },
        ]}
        numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function NewRegistrationPlaceholder() {
  return <View />;
}

export function MainTabs() {
  const insets = useSafeAreaInsets();
  const {isCompact} = useLayout();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const bottomPad = Math.max(insets.bottom, 10);
  const tabBarHeight = (isCompact ? 56 : 62) + bottomPad;
  const addSize = isCompact ? 52 : 58;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: tabBarHeight,
          paddingBottom: bottomPad,
          paddingTop: 8,
          elevation: 16,
          shadowColor: colors.black,
          shadowOpacity: 0.1,
          shadowRadius: 12,
          shadowOffset: {width: 0, height: -4},
        },
      }}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Início',
          tabBarIcon: ({focused}) => (
            <TabIcon icon="home-outline" label="Início" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Registrations"
        component={RegistrationsScreen}
        options={{
          title: 'Cadastros',
          tabBarIcon: ({focused}) => (
            <TabIcon
              icon="format-list-bulleted"
              label="Cadastros"
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="NewRegistration"
        component={NewRegistrationPlaceholder}
        options={{
          title: 'Novo',
          tabBarIcon: () => (
            <View style={[styles.addButton, {width: addSize, height: addSize}]}>
              <AppIcon name="plus" size={28} color={colors.white} />
            </View>
          ),
          tabBarButton: props => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Novo cadastro"
              onPress={() => navigation.navigate('SelectPersonType')}
              style={[props.style, styles.addPressable]}>
              <View
                style={[styles.addButton, {width: addSize, height: addSize}]}>
                <AppIcon name="plus" size={28} color={colors.white} />
              </View>
            </Pressable>
          ),
        }}
      />
      <Tab.Screen
        name="Documents"
        component={DocumentsScreen}
        options={{
          title: 'Documentos',
          tabBarIcon: ({focused}) => (
            <TabIcon
              icon="file-document-outline"
              label="Documentos"
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Mais',
          tabBarIcon: ({focused}) => (
            <TabIcon icon="dots-horizontal" label="Mais" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    minWidth: 52,
    maxWidth: 72,
  },
  tabItemCompact: {
    minWidth: 44,
    maxWidth: 64,
  },
  tabLabel: {
    textAlign: 'center',
  },
  addPressable: {
    top: -18,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  addButton: {
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.surface,
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 6},
    elevation: 8,
  },
});
