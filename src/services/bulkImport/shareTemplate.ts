import * as RNFS from '@dr.pogodin/react-native-fs';
import {Platform, Share} from 'react-native';
import type {PersonType} from '../../types';
import {showError} from '../../utils/alerts';
import {buildTemplateCsv} from './csvTemplates';

export async function shareBulkTemplate(type: PersonType): Promise<void> {
  try {
    const fileName =
      type === 'PF' ? 'modelo_cadastro_pf.csv' : 'modelo_cadastro_pj.csv';
    const dir =
      Platform.OS === 'android'
        ? RNFS.DownloadDirectoryPath
        : RNFS.DocumentDirectoryPath;
    const path = `${dir}/${fileName}`;
    await RNFS.writeFile(path, buildTemplateCsv(type), 'utf8');
    await Share.share({
      title: fileName,
      message:
        type === 'PF'
          ? 'Modelo CSV para cadastro em massa de Pessoa Física (CPF).'
          : 'Modelo CSV para cadastro em massa de Pessoa Jurídica (CNPJ).',
      url: Platform.OS === 'ios' ? path : `file://${path}`,
    });
  } catch {
    showError('Não foi possível gerar o modelo. Tente novamente.');
  }
}
