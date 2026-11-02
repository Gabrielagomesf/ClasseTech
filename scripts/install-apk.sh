#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> Subindo reverse da porta 3333 (API no celular via USB)"
adb reverse tcp:3333 tcp:3333 || true
adb reverse tcp:8081 tcp:8081 || true

echo "==> Garantindo host da API em 127.0.0.1 (adb reverse)"
node scripts/write-api-host.js 127.0.0.1 3333

echo "==> Gerando APK debug"
cd android
./gradlew assembleDebug
cd ..

APK="android/app/build/outputs/apk/debug/app-debug.apk"
echo "==> APK gerado em: $APK"

if adb get-state 1>/dev/null 2>&1; then
  echo "==> Instalando no aparelho"
  adb install -r "$APK"
  echo "==> Abrindo Cadastro+"
  adb shell monkey -p com.cadastroplus -c android.intent.category.LAUNCHER 1 >/dev/null 2>&1 || true
  echo "Pronto. Deixe a API rodando: npm run api"
else
  echo "Nenhum device ADB encontrado."
  echo "Instale manualmente o APK: $APK"
fi
