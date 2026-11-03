import React, {useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {
  errorCodes,
  isErrorWithCode,
  pick,
  types,
} from '@react-native-documents/picker';
import type {AttachedDocument, DocumentKind} from '../../types';
import {colors, radius, spacing, typography} from '../../theme';
import {persistDocument, deleteDocument} from '../../services/storage/documents';
import {showError} from '../../utils/alerts';
import {formatFileSize} from '../../utils/fileSize';
import {Button} from './Button';

const MAX_BYTES = 5 * 1024 * 1024;
const MAX_LABEL = formatFileSize(MAX_BYTES);

type Props = {
  title: string;
  kind: DocumentKind;
  required?: boolean;
  value?: AttachedDocument | null;
  onChange: (doc: AttachedDocument | null) => void;
};

function isImageMime(mimeType: string) {
  return mimeType.startsWith('image/');
}

export function DocumentPickerField({
  title,
  kind,
  required = false,
  value,
  onChange,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handlePick() {
    try {
      setLoading(true);
      const [file] = await pick({
        type: [types.pdf, types.images],
        allowMultiSelection: false,
      });

      if (!file) {
        return;
      }

      const size = Number(file.size ?? 0);
      if (size > MAX_BYTES) {
        showError(`O arquivo deve ter no máximo ${MAX_LABEL}.`);
        return;
      }

      if (value) {
        await deleteDocument(value.uri);
      }

      const saved = await persistDocument(
        file.uri,
        file.name ?? `documento_${kind}`,
        file.type ?? 'application/octet-stream',
        size,
        kind,
      );
      onChange(saved);
    } catch (err) {
      if (isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED) {
        return;
      }
      showError('Não foi possível anexar o arquivo.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove() {
    if (!value) {
      return;
    }
    await deleteDocument(value.uri);
    onChange(null);
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={typography.subtitle}>
          {title}
          {required ? <Text style={styles.asterisk}> *</Text> : null}
        </Text>
        <View style={styles.sizeBadge}>
          <Text style={styles.sizeBadgeText}>
            {value ? formatFileSize(value.size) : `máx. ${MAX_LABEL}`}
          </Text>
        </View>
      </View>

      <Text style={typography.caption}>PDF, JPG ou PNG</Text>

      <View style={[styles.preview, value && styles.previewFilled]}>
        {value && isImageMime(value.mimeType) ? (
          <Image source={{uri: value.uri}} style={styles.previewImage} />
        ) : (
          <View style={styles.previewPlaceholder}>
            <Text style={styles.previewIcon}>{value ? 'PDF' : 'IMG'}</Text>
            <Text style={styles.previewHint}>
              {value
                ? `${formatFileSize(value.size)} · anexado`
                : `Área da imagem · até ${MAX_LABEL}`}
            </Text>
          </View>
        )}
        {value ? (
          <View style={styles.sizeOverlay}>
            <Text style={styles.sizeOverlayText}>
              {formatFileSize(value.size)} / {MAX_LABEL}
            </Text>
          </View>
        ) : null}
      </View>

      {value ? (
        <View style={styles.fileRow}>
          <View style={styles.fileMeta}>
            <Text style={styles.fileName} numberOfLines={1}>
              {value.name}
            </Text>
            <Text style={styles.fileSize}>{formatFileSize(value.size)}</Text>
          </View>
          <Button title="Remover" variant="ghost" onPress={handleRemove} />
        </View>
      ) : (
        <Button
          title="Selecionar arquivo"
          variant="secondary"
          loading={loading}
          onPress={handlePick}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  asterisk: {
    color: colors.danger,
  },
  sizeBadge: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  sizeBadgeText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  preview: {
    height: 140,
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    backgroundColor: colors.inputBackground,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewFilled: {
    borderStyle: 'solid',
    borderColor: colors.success,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  previewPlaceholder: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  previewIcon: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  previewHint: {
    ...typography.caption,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  sizeOverlay: {
    position: 'absolute',
    right: spacing.sm,
    bottom: spacing.sm,
    backgroundColor: colors.overlay,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  sizeOverlayText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '600',
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  fileMeta: {
    flex: 1,
    gap: 2,
  },
  fileName: {
    color: colors.success,
    fontWeight: '600',
  },
  fileSize: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});
