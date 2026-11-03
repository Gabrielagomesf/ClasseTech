import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  AppIcon,
  Button,
  Card,
  FormField,
  ResponsiveColumns,
  Screen,
  SelectField,
} from '../../components';
import {
  CARGO_OPTIONS,
  SEX_OPTIONS,
  type SexOption,
} from '../../constants/catalog';
import {useUserProfile} from '../../context/UserProfileContext';
import {useRegistrations} from '../../context/RegistrationsContext';
import {useLayout} from '../../hooks/useLayout';
import {API_BASE_URL} from '../../config/api';
import {checkApiHealth} from '../../services/api/validationApi';
import {colors, spacing, typography} from '../../theme';
import {confirmAction, showError, showSuccess} from '../../utils/alerts';

export function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const {isTablet, scaleFont} = useLayout();
  const {clearLocalData, stats, refresh} = useRegistrations();
  const {profile, save: saveProfile, initials, hasProfile} = useUserProfile();
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [email, setEmail] = useState(profile.email);
  const [jobTitle, setJobTitle] = useState(profile.jobTitle);
  const [sexo, setSexo] = useState<SexOption | ''>(profile.sexo);
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>(
    {},
  );
  const [savingProfile, setSavingProfile] = useState(false);
  const [apiStatus, setApiStatus] = useState('Verificando...');
  const [apiOk, setApiOk] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    setDisplayName(profile.displayName);
    setEmail(profile.email);
    setJobTitle(profile.jobTitle);
    setSexo(profile.sexo);
  }, [profile]);

  const runHealthCheck = React.useCallback(async () => {
    setChecking(true);
    const result = await checkApiHealth();
    setApiOk(result.ok);
    setApiStatus(result.message);
    setChecking(false);
  }, []);

  useEffect(() => {
    runHealthCheck();
  }, [runHealthCheck]);

  async function handleSaveProfile() {
    setSavingProfile(true);
    setProfileErrors({});
    const result = await saveProfile({
      displayName,
      email,
      jobTitle,
      sexo,
      updatedAt: profile.updatedAt,
    });
    setSavingProfile(false);
    if (!result.ok) {
      setProfileErrors(result.errors);
      showError('Revise os dados do perfil.');
      return;
    }
    showSuccess('Perfil atualizado.');
  }

  return (
    <Screen
      scroll
      contentStyle={{paddingBottom: spacing.xxxl + Math.max(insets.bottom, 8)}}>
      <Text style={[typography.title, {fontSize: scaleFont(24)}]}>Mais</Text>
      <Text style={[typography.caption, styles.subtitle]}>
        Seu perfil, preferências e informações do app.
      </Text>

      <Card style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            {hasProfile ? (
              <Text style={styles.avatarText}>{initials}</Text>
            ) : (
              <AppIcon name="account-outline" size={28} color={colors.primary} />
            )}
          </View>
          <View style={styles.profileIntro}>
            <Text style={typography.subtitle}>Meu perfil</Text>
            <Text style={typography.caption}>
              Nome e contato usados no início e atalhos do app.
            </Text>
          </View>
        </View>

        <FormField
          label="Nome completo"
          required
          value={displayName}
          onChangeText={setDisplayName}
          autoCapitalize="words"
          placeholder="Ex.: Gabriela Silva"
          error={profileErrors.displayName}
        />
        <FormField
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="email@exemplo.com"
          error={profileErrors.email}
        />
        <SelectField
          label="Cargo / função"
          required
          value={jobTitle}
          options={CARGO_OPTIONS}
          onChange={setJobTitle}
          placeholder="Selecione seu cargo"
          error={profileErrors.jobTitle}
        />
        <SelectField
          label="Sexo"
          value={sexo}
          options={SEX_OPTIONS}
          onChange={value => setSexo(value)}
          placeholder="Selecione (opcional)"
          error={profileErrors.sexo}
          hint="Usado apenas no seu perfil local."
        />
        <Button
          title="Salvar perfil"
          loading={savingProfile}
          onPress={handleSaveProfile}
        />
      </Card>

      <ResponsiveColumns tabletColumns={isTablet ? 2 : 1}>
        <Card style={styles.card}>
          <Text style={typography.subtitle}>Cadastro+</Text>
          <Text style={typography.caption}>
            Gestão de cadastros PF e PJ com documentos locais, consultas
            CEP/CNPJ e validações pela API ClasseTech.
          </Text>
          <Text style={[typography.caption, styles.metaLine]}>Versão 1.0.0</Text>
        </Card>

        <Card style={styles.card}>
          <Text style={typography.subtitle}>Conexão com a API</Text>
          <Text style={typography.caption} numberOfLines={2}>
            {API_BASE_URL}
          </Text>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.dot,
                {
                  backgroundColor:
                    apiOk == null
                      ? colors.textMuted
                      : apiOk
                        ? colors.success
                        : colors.warning,
                },
              ]}
            />
            <Text style={typography.caption}>{apiStatus}</Text>
          </View>
          <Button
            title="Testar conexão"
            variant="secondary"
            loading={checking}
            onPress={runHealthCheck}
          />
        </Card>

        <Card style={styles.card}>
          <Text style={typography.subtitle}>Armazenamento local</Text>
          <Text style={typography.caption}>
            {stats.total} cadastro(s) · {stats.pf} PF · {stats.pj} PJ ·{' '}
            {stats.pending} pendência(s)
          </Text>
          <Text style={typography.caption}>
            Dados e documentos ficam só neste aparelho (SQLite + arquivos
            privados).
          </Text>
          <Button
            title="Atualizar lista"
            variant="ghost"
            onPress={() => refresh({})}
          />
        </Card>

        <Card style={styles.card}>
          <Text style={typography.subtitle}>Privacidade</Text>
          <Text style={typography.caption}>
            CPF e CNPJ aparecem parcialmente ocultos nas listagens. Documentos
            são removidos junto com o cadastro. Não há login nem sincronização
            em nuvem dos registros.
          </Text>
        </Card>
      </ResponsiveColumns>

      <Button
        title="Limpar dados locais"
        variant="secondary"
        onPress={() =>
          confirmAction(
            'Limpar dados?',
            'Todos os cadastros e documentos deste aparelho serão removidos. O perfil será mantido.',
            async () => {
              try {
                await clearLocalData();
                showSuccess('Dados locais removidos.');
              } catch {
                showError('Não foi possível limpar os dados.');
              }
            },
            'Limpar',
          )
        }
      />

      <View style={styles.meta}>
        <Text style={[typography.caption, {color: colors.textMuted}]}>
          ClasseTech · teste técnico mobile
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  profileCard: {
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 18,
  },
  profileIntro: {
    flex: 1,
    gap: 2,
  },
  card: {
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  metaLine: {
    marginTop: spacing.xs,
    color: colors.textMuted,
  },
  meta: {
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
    gap: spacing.xs,
  },
});
