import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsContext = createContext(null);

const TEMAS = {
  claro: {
    background: '#F2F5F9',
    card: '#FFFFFF',
    primary: '#174A7E',
    text: '#1D2939',
    secondary: '#667085',
    border: '#E0E6ED',
    input: '#F8FAFC',
    tabBar: '#FFFFFF',
  },

  escuro: {
    background: '#121821',
    card: '#1D2735',
    primary: '#6CA6E8',
    text: '#F2F4F7',
    secondary: '#AAB4C3',
    border: '#344054',
    input: '#263242',
    tabBar: '#1D2735',
  },
};

const TRADUCOES = {
  pt: {
    settings: 'Configurações',
    preferences: 'Preferências',
    darkMode: 'Modo escuro',
    language: 'Idioma',
    portuguese: 'Português',
    english: 'Inglês',
    about: 'Sobre o aplicativo',
    name: 'Nome',
    version: 'Versão',
    platform: 'Plataforma',
    description:
      'O GaragePedia permite pesquisar veículos, consultar informações da tabela FIPE, comparar modelos e salvar veículos favoritos.',
  },

  en: {
    settings: 'Settings',
    preferences: 'Preferences',
    darkMode: 'Dark mode',
    language: 'Language',
    portuguese: 'Portuguese',
    english: 'English',
    about: 'About the application',
    name: 'Name',
    version: 'Version',
    platform: 'Platform',
    description:
      'GaragePedia lets you search vehicles, check FIPE table information, compare models and save favorite vehicles.',
  },
};

export function SettingsProvider({ children }) {
  const [modoEscuro, setModoEscuro] = useState(false);
  const [idioma, setIdioma] = useState('pt');
  const [carregandoConfiguracoes, setCarregandoConfiguracoes] =
    useState(true);

  useEffect(() => {
    async function carregarConfiguracoes() {
      try {
        const temaSalvo = await AsyncStorage.getItem(
          'modoEscuro'
        );

        const idiomaSalvo = await AsyncStorage.getItem(
          'idiomaApp'
        );

        setModoEscuro(temaSalvo === 'true');

        if (idiomaSalvo === 'pt' || idiomaSalvo === 'en') {
          setIdioma(idiomaSalvo);
        }
      } catch (error) {
        console.error(
          'Erro ao carregar configurações:',
          error
        );
      } finally {
        setCarregandoConfiguracoes(false);
      }
    }

    carregarConfiguracoes();
  }, []);

  async function alternarTema() {
    const novoModo = !modoEscuro;

    setModoEscuro(novoModo);

    try {
      await AsyncStorage.setItem(
        'modoEscuro',
        String(novoModo)
      );
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  }

  async function alterarIdioma(novoIdioma) {
    if (novoIdioma !== 'pt' && novoIdioma !== 'en') {
      return;
    }

    setIdioma(novoIdioma);

    try {
      await AsyncStorage.setItem('idiomaApp', novoIdioma);
    } catch (error) {
      console.error('Erro ao salvar idioma:', error);
    }
  }

  const cores = modoEscuro ? TEMAS.escuro : TEMAS.claro;

  function traduzir(chave) {
    return TRADUCOES[idioma][chave] || chave;
  }

  return (
    <SettingsContext.Provider
      value={{
        modoEscuro,
        idioma,
        cores,
        traduzir,
        alternarTema,
        alterarIdioma,
        carregandoConfiguracoes,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const contexto = useContext(SettingsContext);

  if (!contexto) {
    throw new Error(
      'useSettings deve ser utilizado dentro de SettingsProvider.'
    );
  }

  return contexto;
}