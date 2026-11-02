import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../types';
import {colors, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({navigation}: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('MainTabs');
    }, 1400);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoMark}>
        <Text style={styles.logoIcon}>+</Text>
      </View>
      <Text style={styles.brand}>Cadastro+</Text>
      <Text style={styles.tagline}>
        Gestão inteligente de cadastros de pessoas e empresas.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxxl,
  },
  logoMark: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  logoIcon: {
    color: colors.white,
    fontSize: 40,
    fontWeight: '700',
  },
  brand: {
    ...typography.hero,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  tagline: {
    ...typography.caption,
    color: '#BFDBFE',
    textAlign: 'center',
    lineHeight: 20,
  },
});
