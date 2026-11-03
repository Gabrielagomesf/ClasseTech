import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AppIcon, type AppIconName} from '../ui/AppIcon';
import {Button} from '../ui/Button';
import {colors, radius, spacing, typography} from '../../theme';

type ToastVariant = 'success' | 'error' | 'warning' | 'info';

type ToastPayload = {
  id: number;
  variant: ToastVariant;
  title: string;
  message: string;
};

type ConfirmPayload = {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  destructive?: boolean;
  onConfirm: () => void;
};

type FeedbackContextValue = {
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  confirmAction: (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText?: string,
    cancelText?: string,
    destructive?: boolean,
  ) => void;
};

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

const VARIANT_META: Record<
  ToastVariant,
  {icon: AppIconName; accent: string; soft: string; defaultTitle: string}
> = {
  success: {
    icon: 'check-circle-outline',
    accent: colors.success,
    soft: colors.successSoft,
    defaultTitle: 'Sucesso',
  },
  error: {
    icon: 'alert-circle-outline',
    accent: colors.danger,
    soft: colors.dangerSoft,
    defaultTitle: 'Erro',
  },
  warning: {
    icon: 'alert-outline',
    accent: colors.warning,
    soft: colors.warningSoft,
    defaultTitle: 'Atenção',
  },
  info: {
    icon: 'information-outline',
    accent: colors.primary,
    soft: colors.primarySoft,
    defaultTitle: 'Informação',
  },
};

let externalApi: FeedbackContextValue | null = null;

export function getFeedbackApi(): FeedbackContextValue | null {
  return externalApi;
}

export function FeedbackProvider({children}: {children: React.ReactNode}) {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ToastPayload | null>(null);
  const [confirm, setConfirm] = useState<ConfirmPayload | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idRef = useRef(0);

  const dismissToast = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setToast(null);
  }, []);

  const pushToast = useCallback(
    (variant: ToastVariant, message: string, title?: string) => {
      const meta = VARIANT_META[variant];
      idRef.current += 1;
      setToast({
        id: idRef.current,
        variant,
        title: title ?? meta.defaultTitle,
        message,
      });
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(dismissToast, 3800);
    },
    [dismissToast],
  );

  const value = useMemo<FeedbackContextValue>(
    () => ({
      showSuccess: (message, title) => pushToast('success', message, title),
      showError: (message, title) => pushToast('error', message, title),
      showWarning: (message, title) => pushToast('warning', message, title),
      showInfo: (message, title) => pushToast('info', message, title),
      confirmAction: (
        title,
        message,
        onConfirm,
        confirmText = 'Confirmar',
        cancelText = 'Cancelar',
        destructive = false,
      ) => {
        setConfirm({
          title,
          message,
          confirmText,
          cancelText,
          destructive,
          onConfirm,
        });
      },
    }),
    [pushToast],
  );

  useEffect(() => {
    externalApi = value;
    return () => {
      externalApi = null;
      dismissToast();
    };
  }, [value, dismissToast]);

  const toastMeta = toast ? VARIANT_META[toast.variant] : null;

  return (
    <FeedbackContext.Provider value={value}>
      {children}

      {toast && toastMeta ? (
        <View
          pointerEvents="box-none"
          style={[styles.toastHost, {top: insets.top + spacing.sm}]}>
          <Pressable
            accessibilityRole="button"
            onPress={dismissToast}
            style={[
              styles.toast,
              {
                backgroundColor: toastMeta.soft,
                borderColor: toastMeta.accent,
              },
            ]}>
            <View
              style={[
                styles.toastIconWrap,
                {backgroundColor: toastMeta.accent},
              ]}>
              <AppIcon name={toastMeta.icon} size={22} color={colors.white} />
            </View>
            <View style={styles.toastText}>
              <Text style={styles.toastTitle}>{toast.title}</Text>
              <Text style={styles.toastMessage}>{toast.message}</Text>
            </View>
            <AppIcon name="close" size={18} color={colors.textMuted} />
          </Pressable>
        </View>
      ) : null}

      <Modal
        visible={confirm != null}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirm(null)}>
        <View style={styles.confirmBackdrop}>
          <View style={styles.confirmCard}>
            <View style={styles.confirmIcon}>
              <AppIcon
                name="alert-circle-outline"
                size={28}
                color={colors.warning}
              />
            </View>
            <Text style={styles.confirmTitle}>{confirm?.title}</Text>
            <Text style={styles.confirmMessage}>{confirm?.message}</Text>
            <View style={styles.confirmActions}>
              <Button
                title={confirm?.cancelText ?? 'Cancelar'}
                variant="secondary"
                onPress={() => setConfirm(null)}
                style={styles.confirmBtn}
              />
              <Button
                title={confirm?.confirmText ?? 'Confirmar'}
                variant="primary"
                onPress={() => {
                  const action = confirm?.onConfirm;
                  setConfirm(null);
                  action?.();
                }}
                style={
                  confirm?.destructive
                    ? [styles.confirmBtn, styles.confirmDestructive]
                    : styles.confirmBtn
                }
              />
            </View>
          </View>
        </View>
      </Modal>
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const ctx = useContext(FeedbackContext);
  if (!ctx) {
    throw new Error('useFeedback must be used within FeedbackProvider');
  }
  return ctx;
}

const styles = StyleSheet.create({
  toastHost: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 1000,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
    shadowColor: colors.black,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 4},
    elevation: 6,
  },
  toastIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastText: {
    flex: 1,
    gap: 2,
  },
  toastTitle: {
    ...typography.subtitle,
    fontSize: 15,
  },
  toastMessage: {
    ...typography.caption,
    lineHeight: 18,
  },
  confirmBackdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  confirmCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.sm,
    alignItems: 'center',
  },
  confirmIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.warningSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  confirmTitle: {
    ...typography.title,
    fontSize: 20,
    textAlign: 'center',
  },
  confirmMessage: {
    ...typography.caption,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  confirmActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
  },
  confirmBtn: {
    flex: 1,
  },
  confirmDestructive: {
    backgroundColor: colors.danger,
  },
});

