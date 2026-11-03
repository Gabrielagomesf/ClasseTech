export type SexOption =
  | 'feminino'
  | 'masculino'
  | 'outro'
  | 'prefiro_nao_informar';

export type EstablishmentType =
  | 'matriz'
  | 'filial'
  | 'unidade'
  | 'escritorio'
  | 'outro';

export type CatalogOption<T extends string = string> = {
  value: T;
  label: string;
  description?: string;
};

export const SEX_OPTIONS: CatalogOption<SexOption>[] = [
  {value: 'feminino', label: 'Feminino'},
  {value: 'masculino', label: 'Masculino'},
  {value: 'outro', label: 'Outro'},
  {
    value: 'prefiro_nao_informar',
    label: 'Prefiro não informar',
  },
];

export const CARGO_OPTIONS: CatalogOption[] = [
  {value: 'gestor_cadastros', label: 'Gestor(a) de cadastros'},
  {value: 'analista_cadastros', label: 'Analista de cadastros'},
  {value: 'assistente_administrativo', label: 'Assistente administrativo'},
  {value: 'socio_administrador', label: 'Sócio-administrador'},
  {value: 'diretor', label: 'Diretor(a)'},
  {value: 'procurador', label: 'Procurador(a)'},
  {value: 'representante_legal', label: 'Representante legal'},
  {value: 'contador', label: 'Contador(a)'},
  {value: 'advogado', label: 'Advogado(a)'},
  {value: 'rh', label: 'Recursos humanos'},
  {value: 'ti', label: 'Tecnologia da informação'},
  {value: 'outro', label: 'Outro'},
];

export const ESTABLISHMENT_TYPE_OPTIONS: CatalogOption<EstablishmentType>[] = [
  {
    value: 'matriz',
    label: 'Matriz',
    description: 'Sede principal da empresa',
  },
  {
    value: 'filial',
    label: 'Filial',
    description: 'Unidade vinculada à matriz',
  },
  {
    value: 'unidade',
    label: 'Unidade / loja',
    description: 'Ponto de atendimento ou operação',
  },
  {
    value: 'escritorio',
    label: 'Escritório administrativo',
    description: 'Escritório de apoio sem operação direta',
  },
  {value: 'outro', label: 'Outro', description: 'Classificação personalizada'},
];

export function getCatalogLabel<T extends string>(
  options: CatalogOption<T>[],
  value: string | undefined | null,
  fallback = '—',
): string {
  if (!value) {
    return fallback;
  }
  return options.find(option => option.value === value)?.label ?? value;
}

export function isCatalogValue<T extends string>(
  options: CatalogOption<T>[],
  value: string,
): value is T {
  return options.some(option => option.value === value);
}

export const CARGO_VALUES = new Set(CARGO_OPTIONS.map(option => option.value));
export const SEX_VALUES = new Set(SEX_OPTIONS.map(option => option.value));
export const ESTABLISHMENT_VALUES = new Set(
  ESTABLISHMENT_TYPE_OPTIONS.map(option => option.value),
);
