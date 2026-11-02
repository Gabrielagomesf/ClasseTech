# Cadastro+

Aplicativo Android para cadastro e gestão de pessoas físicas e jurídicas.

Desenvolvido como teste técnico para a vaga de Desenvolvedor Mobile na **ClasseTech**.

---

## O que o app faz

Com o Cadastro+ é possível:

- cadastrar **Pessoa Física** e **Pessoa Jurídica**
- consultar **CNPJ** e preencher dados automaticamente (BrasilAPI)
- consultar **CEP** e preencher endereço automaticamente
- validar CPF e CNPJ (incluindo dígitos verificadores)
- impedir cadastros duplicados
- anexar documentos (PDF, JPG e PNG)
- acompanhar se a documentação está completa ou pendente
- buscar, filtrar, editar e excluir registros
- usar o app **offline** para cadastros já salvos localmente

Não há login e não há backend. Tudo fica no aparelho, em SQLite e na área privada de arquivos do aplicativo.

---

## Telas principais

| Tela | Função |
|---|---|
| Início | Dashboard com totais e últimos cadastros |
| Cadastros | Lista, busca e filtros |
| Novo | Escolha entre PF e PJ |
| Configurações | Sobre o app, privacidade e limpeza local |
| Detalhes | Visualização, documentos e exclusão |

### Fluxo PF
1. Dados pessoais  
2. Endereço (com busca por CEP)  
3. Documentos  

### Fluxo PJ
1. Dados da empresa (com consulta de CNPJ) + endereço  
2. Representante legal  
3. Documentos  

---

## Stack

- React Native CLI (sem Expo)
- TypeScript
- React Navigation
- React Hook Form + Zod
- SQLite (`react-native-nitro-sqlite`)
- Axios + BrasilAPI
- Document Picker + File System

---

## Como rodar

### Requisitos

- Node.js 22+
- JDK 17 (recomendado para build Android)
- Android Studio / SDK
- Aparelho físico com USB debugging **ou** emulador

### Instalação

```bash
cd CadastroPlus
npm install
```

### Desenvolvimento

```bash
npm start
npm run android
```

Se a porta `8081` estiver ocupada:

```bash
npx react-native start --port 8088
npm run android -- --port 8088
```

### Testes

```bash
npm test
```

### Gerar APK (release)

```bash
cd android
./gradlew assembleRelease
```

O arquivo fica em:

`android/app/build/outputs/apk/release/app-release.apk`

> Na primeira build de release pode ser necessário configurar uma keystore própria. Para avaliação rápida, o APK de debug também pode ser gerado com `./gradlew assembleDebug`.

---

## Dados de teste sugeridos

Use apenas dados fictícios.

**CPF válido (exemplo):** `529.982.247-25`  
**CNPJ válido (exemplo):** `04.252.011/0001-10`  
**CEP (exemplo):** `01310-100`

Para testar a consulta de CNPJ/CEP, o aparelho precisa de internet.  
Os cadastros, a listagem e a edição funcionam normalmente offline.

---

## Validações implementadas

- CPF com dígitos verificadores
- CNPJ com dígitos verificadores (incluindo preparação para formato alfanumérico)
- E-mail
- Telefone brasileiro
- Data de nascimento
- Campos obrigatórios por etapa
- Duplicidade de CPF/CNPJ
- Tamanho máximo de documento: **5 MB**

---

## Documentos

### Pessoa Física
- Documento de identificação (obrigatório)
- Comprovante de residência (obrigatório)
- Documento complementar (opcional)

### Pessoa Jurídica
- Cartão CNPJ
- Contrato social
- Documento do representante
- Comprovante de endereço

Os arquivos ficam na pasta privada do app e são removidos junto com o cadastro.

---

## Decisões técnicas

1. **Sem autenticação** — o escopo do teste não pede multi-usuário nem servidor.
2. **Persistência local** — SQLite para registros e storage interno para arquivos.
3. **BrasilAPI** — usada para CNPJ e CEP, com fallback para preenchimento manual se a rede falhar.
4. **CPF sem consulta externa** — apenas validação local e checagem de duplicidade, por privacidade.
5. **Formulários em etapas** — melhora a leitura e reduz erro de preenchimento.
6. **Máscara de CPF/CNPJ nas listagens** — evita exposição desnecessária do documento completo.

---

## Estrutura do projeto

```text
CadastroPlus/
├── android/
├── src/
│   ├── components/      # UI reutilizável
│   ├── screens/         # Telas
│   ├── navigation/      # Tabs e stack
│   ├── services/        # API, banco e arquivos
│   ├── repositories/    # Acesso aos cadastros
│   ├── context/         # Estado global dos registros
│   ├── hooks/           # CEP / CNPJ
│   ├── schemas/         # Validação Zod
│   ├── theme/           # Cores e tipografia
│   ├── types/
│   └── utils/
├── App.tsx
├── package.json
└── README.md
```

---

## Observações para avaliação

- O app foi pensado para rodar no celular do avaliador sem depender de servidor local.
- Consultas externas (CNPJ/CEP) exigem internet; o restante do fluxo é local.
- Em Configurações há opção para limpar os dados salvos no aparelho.
- Recomenda-se testar PF e PJ com documentos de exemplo (não use dados reais).

---

## Contato / entrega

Projeto: **Cadastro+**  
Plataforma: Android  
Entrega: código-fonte + APK (quando gerado)
