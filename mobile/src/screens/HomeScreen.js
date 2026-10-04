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
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';

import { getMarcasCarros } from '../services/fipeApi';

export default function HomeScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [marcas, setMarcas] = useState([]);
  const [carregandoMarcas, setCarregandoMarcas] = useState(true);

  useFocusEffect(
    useCallback(() => {
      async function carregarDados() {
        try {
          // Carregar o nome do usuário conectado
          const usuarioId = await AsyncStorage.getItem('usuarioLogado');

          if (usuarioId) {
            const db = await SQLite.openDatabaseAsync('garagepedia.db');

            const usuario = await db.getFirstAsync(
              'SELECT nome FROM usuarios WHERE id = ?',
              Number(usuarioId)
            );

            if (usuario) {
              setNome(usuario.nome);
            }
          }

          // Carregar marcas reais da API FIPE
          setCarregandoMarcas(true);

          const resultado = await getMarcasCarros();

          setMarcas(Array.isArray(resultado) ? resultado : []);
        } catch (error) {
          console.error('Erro ao carregar a Home:', error);
        } finally {
          setCarregandoMarcas(false);
        }
      }

      carregarDados();
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
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.welcome}>Olá, seja bem-vindo!</Text>

        <Text style={styles.name}>
          {nome || 'Motorista'}
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={abrirPesquisa}
      >
        <TextInput
          style={styles.search}
          placeholder="Busque por marca, modelo..."
          placeholderTextColor="#888888"
          editable={false}
          pointerEvents="none"
        />
      </TouchableOpacity>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Marcas populares
        </Text>

        <TouchableOpacity onPress={abrirPesquisa}>
          <Text style={styles.seeAll}>Ver todas</Text>
        </TouchableOpacity>
      </View>

      {carregandoMarcas ? (
        <ActivityIndicator
          size="large"
          color="#111111"
          style={styles.loading}
        />
      ) : marcasExibidas.length > 0 ? (
        <View style={styles.brands}>
          {marcasExibidas.map((marca) => (
            <TouchableOpacity
              key={marca.codigo}
              style={styles.brand}
              onPress={abrirPesquisa}
            >
              <Text style={styles.brandText}>
                {marca.nome}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text style={styles.message}>
          Não foi possível carregar as marcas.
          Acesse a pesquisa para tentar novamente.
        </Text>
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Consulte a tabela FIPE
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>
          Encontre seu próximo veículo
        </Text>

        <Text style={styles.infoDescription}>
          Pesquise carros por marca, modelo e ano.
          Consulte os valores da tabela FIPE e compare
          veículos para encontrar a melhor opção.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={abrirPesquisa}
        >
          <Text style={styles.buttonText}>
            Pesquisar veículos
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },

  header: {
    marginTop: 50,
    marginBottom: 20,
  },

  welcome: {
    fontSize: 16,
    color: '#666666',
  },

  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111111',
    marginTop: 4,
  },

  search: {
    height: 50,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 28,
    color: '#333333',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 5,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#111111',
  },

  seeAll: {
    fontSize: 14,
    color: '#555555',
  },

  brands: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 30,
  },

  brand: {
    width: '31%',
    minHeight: 65,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },

  brandText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#222222',
    textAlign: 'center',
  },

  loading: {
    marginVertical: 25,
  },

  message: {
    color: '#666666',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 30,
  },

  infoCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    padding: 20,
    marginBottom: 30,
  },

  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111111',
    marginBottom: 10,
  },

  infoDescription: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 22,
  },

  button: {
    backgroundColor: '#111111',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});