
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';

import { getMarcasCarros } from '../services/fipeApi';
import { useSettings } from '../context/SettingsContext';

export default function HomeScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [marcas, setMarcas] = useState([]);
  const [carregandoMarcas, setCarregandoMarcas] = useState(true);

  const { cores, idioma } = useSettings();
  const insets = useSafeAreaInsets();
  const styles = criarEstilos(cores);

  const t = (pt, en) => (idioma === 'en' ? en : pt);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function carregarDados() {
        try {
          const usuarioId = await AsyncStorage.getItem('usuarioLogado');

          if (usuarioId) {
            const db = await SQLite.openDatabaseAsync('garagepedia.db');

            const usuario = await db.getFirstAsync(
              'SELECT nome FROM usuarios WHERE id = ?',
              Number(usuarioId)
            );

            if (ativo) {
              setNome(usuario?.nome || '');
            }
          } else if (ativo) {
            setNome('');
          }

          if (ativo) {
            setCarregandoMarcas(true);
          }

          const resultado = await getMarcasCarros();

          if (ativo) {
            setMarcas(Array.isArray(resultado) ? resultado : []);
          }
        } catch (error) {
          console.error('Erro ao carregar a Home:', error);
        } finally {
          if (ativo) {
            setCarregandoMarcas(false);
          }
        }
      }

      carregarDados();

      return () => {
        ativo = false;
      };
    }, [])
  );

  const marcasPopulares = [
    'Toyota',
    'Honda',
    'BMW',
    'Chevrolet',
    'Fiat',
    'Volkswagen',
  ];

  const marcasExibidas = marcas.filter((marca) =>
    marcasPopulares.some(
      (nomeMarca) =>
        nomeMarca.toLowerCase() === marca.nome.toLowerCase()
    )
  );

  function abrirPesquisa() {
    navigation.navigate('Pesquisa');
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: Math.max(insets.top, 12) + 12 },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcome}>
            {t('Olá, seja bem-vindo!', 'Hello, welcome!')}
          </Text>

          <Text style={styles.name}>
            {nome || t('Motorista', 'Driver')}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.searchContainer}
        activeOpacity={0.8}
        onPress={abrirPesquisa}
      >
        <Ionicons
          name="search-outline"
          size={21}
          color={cores.secondary}
        />

        <TextInput
          style={styles.search}
          placeholder={t(
            'Busque por marca, modelo...',
            'Search by make, model...'
          )}
          placeholderTextColor={cores.secondary}
          editable={false}
          pointerEvents="none"
        />

        <Ionicons
          name="options-outline"
          size={21}
          color={cores.primary}
        />
      </TouchableOpacity>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {t('Marcas populares', 'Popular brands')}
        </Text>

        <TouchableOpacity onPress={abrirPesquisa}>
          <Text style={styles.seeAll}>
            {t('Ver todas', 'See all')}
          </Text>
        </TouchableOpacity>
      </View>

      {carregandoMarcas ? (
        <ActivityIndicator
          size="large"
          color={cores.primary}
          style={styles.loading}
        />
      ) : marcasExibidas.length > 0 ? (
        <View style={styles.brands}>
          {marcasExibidas.map((marca) => (
            <TouchableOpacity
              key={marca.codigo}
              style={styles.brand}
              activeOpacity={0.75}
              onPress={abrirPesquisa}
            >
              <View style={styles.brandIcon}>
                <Ionicons
                  name="car-sport-outline"
                  size={25}
                  color={cores.primary}
                />
              </View>

              <Text style={styles.brandText}>
                {marca.nome}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text style={styles.message}>
          {t(
            'Não foi possível carregar as marcas. Acesse a pesquisa para tentar novamente.',
            'Could not load brands. Open Search to try again.'
          )}
        </Text>
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {t('Consulte a tabela FIPE', 'Check the FIPE table')}
        </Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoIcon}>
          <Ionicons
            name="car-sport"
            size={30}
            color={cores.primary}
          />
        </View>

        <Text style={styles.infoTitle}>
          {t(
            'Encontre seu próximo veículo',
            'Find your next vehicle'
          )}
        </Text>

        <Text style={styles.infoDescription}>
          {t(
            'Pesquise carros por marca, modelo e ano. Consulte os valores da tabela FIPE e compare veículos para encontrar a melhor opção.',
            'Search for cars by make, model and year. Check FIPE table prices and compare vehicles to find the best option.'
          )}
        </Text>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={abrirPesquisa}
        >
          <Text style={styles.buttonText}>
            {t('Pesquisar veículos', 'Search vehicles')}
          </Text>

          <Ionicons
            name="arrow-forward"
            size={18}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function criarEstilos(cores) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: cores.background,
    },

    content: {
      paddingHorizontal: 20,
      paddingBottom: 25,
    },

    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 25,
    },

    welcomeContainer: {
      flex: 1,
      paddingRight: 12,
    },

    welcome: {
      fontSize: 15,
      color: cores.secondary,
    },

    name: {
      fontSize: 25,
      fontWeight: 'bold',
      color: cores.primary,
      marginTop: 5,
    },

    profileIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: cores.input,
      borderWidth: 1,
      borderColor: cores.border,
      alignItems: 'center',
      justifyContent: 'center',
    },

    searchContainer: {
      height: 54,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: cores.card,
      borderWidth: 1,
      borderColor: cores.border,
      borderRadius: 14,
      paddingHorizontal: 14,
      marginBottom: 30,
    },

    search: {
      flex: 1,
      paddingHorizontal: 10,
      fontSize: 14,
      color: cores.text,
    },

    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
      marginTop: 3,
    },

    sectionTitle: {
      flex: 1,
      fontSize: 18,
      fontWeight: 'bold',
      color: cores.text,
      marginRight: 8,
    },

    seeAll: {
      fontSize: 13,
      fontWeight: '600',
      color: cores.primary,
    },

    brands: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 28,
    },

    brand: {
      width: '31%',
      minHeight: 100,
      backgroundColor: cores.card,
      borderWidth: 1,
      borderColor: cores.border,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 4,
    },

    brandIcon: {
      width: 45,
      height: 45,
      borderRadius: 23,
      backgroundColor: cores.input,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 9,
    },

    brandText: {
      fontSize: 12,
      fontWeight: '600',
      color: cores.text,
      textAlign: 'center',
    },

    loading: {
      marginVertical: 25,
    },

    message: {
      color: cores.secondary,
      fontSize: 14,
      lineHeight: 21,
      marginBottom: 28,
    },

    infoCard: {
      backgroundColor: cores.card,
      borderWidth: 1,
      borderColor: cores.border,
      borderRadius: 18,
      padding: 20,
      marginBottom: 20,
    },

    infoIcon: {
      width: 54,
      height: 54,
      borderRadius: 15,
      backgroundColor: cores.input,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 15,
    },

    infoTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: cores.text,
      marginBottom: 10,
    },

    infoDescription: {
      fontSize: 14,
      color: cores.secondary,
      lineHeight: 22,
    },

    button: {
      flexDirection: 'row',
      backgroundColor: cores.primary,
      borderRadius: 12,
      paddingVertical: 15,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      marginTop: 20,
    },

    buttonText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: 'bold',
    },
  });
}