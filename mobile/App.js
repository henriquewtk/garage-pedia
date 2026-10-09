
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './src/navigation/AppNavigator';
import { inicializarBanco } from './src/database/database';

import {
  SettingsProvider,
  useSettings,
} from './src/context/SettingsContext';

function Aplicativo() {
  const { cores, modoEscuro, carregandoConfiguracoes } = useSettings();

  if (carregandoConfiguracoes) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: cores.background,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <StatusBar style={modoEscuro ? 'light' : 'dark'} />
        <ActivityIndicator size="large" color={cores.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: cores.background }}>
      <StatusBar
        style={modoEscuro ? 'light' : 'dark'}
        backgroundColor={cores.background}
      />
      <AppNavigator />
    </View>
  );
}

export default function App() {
  const [bancoInicializado, setBancoInicializado] = useState(false);

  useEffect(() => {
    async function iniciar() {
      try {
        await inicializarBanco();
      } catch (error) {
        console.error(
          'Erro ao inicializar banco de dados:',
          error
        );
      } finally {
        setBancoInicializado(true);
      }
    }

    iniciar();
  }, []);

  if (!bancoInicializado) {
    return (
      <SafeAreaProvider>
        <View
          style={{
            flex: 1,
            backgroundColor: '#F2F5F9',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size="large" color="#174A7E" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <Aplicativo />
      </SettingsProvider>
    </SafeAreaProvider>
  );
}