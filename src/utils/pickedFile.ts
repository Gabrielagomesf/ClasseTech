import {
  keepLocalCopy,
  type DocumentPickerResponse,
} from '@react-native-documents/picker';

type PickedFile = Pick<
  DocumentPickerResponse,
  'uri' | 'name' | 'isVirtual' | 'convertibleToMimeTypes'
>;

/**
 * Garante um caminho legível pelo RNFS (file://), copiando content:// no Android.
 */
export async function resolvePickedFileUri(file: PickedFile): Promise<string> {
  if (file.uri.startsWith('file://')) {
    return file.uri;
  }

  const fileName = file.name?.trim() || `arquivo_${Date.now()}`;
  const toCopy: Parameters<typeof keepLocalCopy>[0]['files'][0] = {
    uri: file.uri,
    fileName,
  };

  if (file.isVirtual && file.convertibleToMimeTypes?.[0]?.mimeType) {
    toCopy.convertVirtualFileToType = file.convertibleToMimeTypes[0].mimeType;
  }

  const [result] = await keepLocalCopy({
    files: [toCopy],
    destination: 'cachesDirectory',
  });

  if (result.status === 'success') {
    return result.localUri;
  }

  throw new Error(result.copyError ?? 'Não foi possível acessar o arquivo');
}
