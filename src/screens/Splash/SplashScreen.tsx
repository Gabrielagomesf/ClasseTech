import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppIcon} from '../../components';
import {useLayout} from '../../hooks/useLayout';
import type {RootStackParamList} from '../../types';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({navigation}: Props) {
  const {scaleFont, width} = useLayout();
  const logoSize = Math.min(96, Math.max(72, width * 0.22));

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('MainTabs');
    }, 1600);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.gradientTop} />
      <View style={styles.gradientBottom} />
      <View style={styles.content}>
        <View
          style={[
            styles.logoMark,
            {width: logoSize, height: logoSize, borderRadius: logoSize * 0.28},
          ]}>
          <AppIcon name="account" size={logoSize * 0.42} color={colors.primary} />
          <View style={styles.logoPlus}>
            <AppIcon name="plus" size={14} color={colors.white} />
          </View>
        </View>
        <Text style={[styles.brand, {fontSize: scaleFont(30)}]}>Cadastro+</Text>
        <Text style={[styles.tagline, {fontSize: scaleFont(14)}]}>
          Gestão inteligente de cadastros de pessoas e empresas.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientTop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.primary,
    opacity: 0.35,
  },
  gradientBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '45%',
    backgroundColor: colors.primaryDark,
    opacity: 0.9,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: spacing.xxxl,
    zIndex: 1,
    maxWidth: 420,
  },
  logoMark: {
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  logoPlus: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.white,
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
    lineHeight: 22,
  },
});
