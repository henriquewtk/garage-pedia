#!/usr/bin/env bash
# Instala o APK no emulador, abre o app e verifica se a tela de login aparece.
# Salva screenshot, hierarquia da UI e logcat em ./smoke para diagnóstico.
set -u
PKG=br.edu.unirv.garagepedia
APK=$(ls apk/*.apk | head -1)
mkdir -p smoke

echo "Instalando $APK"
adb install -r "$APK" || exit 1
adb logcat -c
adb shell monkey -p "$PKG" -c android.intent.category.LAUNCHER 1

OK=0
for i in $(seq 1 30); do
  sleep 3
  adb shell uiautomator dump /sdcard/ui.xml >/dev/null 2>&1
  adb pull /sdcard/ui.xml smoke/ui.xml >/dev/null 2>&1
  if grep -q 'text="Entrar"' smoke/ui.xml 2>/dev/null; then OK=1; break; fi
done

adb exec-out screencap -p > smoke/screen.png
adb logcat -d > smoke/logcat.txt

echo "===== Processo do app ====="
adb shell pidof "$PKG" || echo "PROCESSO NAO ESTA RODANDO"
echo "===== Logcat (erros / React Native / Expo) ====="
grep -E "AndroidRuntime|FATAL|ReactNativeJS|ReactNative|Expo|expo|SoLoader|UnsatisfiedLink|libc  |DEBUG   |$PKG" smoke/logcat.txt | grep -v "^--------- beginning" | tail -150

if [ "$OK" = 1 ]; then
  echo "SMOKE TEST OK: tela de login exibida."
else
  echo "SMOKE TEST FALHOU: tela de login nao apareceu em 90s."
  exit 1
fi
