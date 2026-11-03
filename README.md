# Cadastro+

Aplicativo Android (React Native) para cadastro de Pessoa Física e Pessoa Jurídica, com API de validação.

Documentação completa do produto e da arquitetura: **[docs/DOCUMENTACAO.md](docs/DOCUMENTACAO.md)**.

## Stack

- React Native CLI + TypeScript
- React Navigation
- SQLite (persistência local)
- Express + Zod (API de validação)
- BrasilAPI (CEP e CNPJ, via backend)

## Estrutura

```text
CadastroPlus/
├── android/
├── backend/     # API
├── src/         # App
├── App.tsx
└── package.json
```

## API

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/health` | Status |
| POST | `/api/validations/person/step/:step` | Valida etapa PF |
| POST | `/api/validations/company/step/:step` | Valida etapa PJ |
| POST | `/api/validations/unique-document` | Unicidade CPF/CNPJ |
| GET | `/api/lookups/cep/:cep` | Consulta CEP |
| GET | `/api/lookups/cnpj/:cnpj` | Consulta CNPJ |

## Desenvolvimento

```bash
# API
cd backend
npm install
npm run dev

# App
cd ..
npm install
npm start
npm run android
```

URL da API em release: `src/config/api.ts` (`PRODUCTION_API_URL`).

## Build APK

```bash
cd android
./gradlew assembleRelease
```

Saída: `android/app/build/outputs/apk/release/`

## Testes

```bash
npm test
cd backend && npm test
```
