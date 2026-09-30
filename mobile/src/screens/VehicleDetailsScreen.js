import React, { useState } from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  adicionarFavorito,
  removerFavorito,
} from '../database/database';

export default function VehicleDetailsScreen({ route }) {
  const { veiculo } = route.params;

  const [abaSelecionada, setAbaSelecionada] =
    useState('sobre');

  const [favoritado, setFavoritado] =
    useState(false);

    async function alternarFavorito() {
  try {
    const usuarioId =
      await AsyncStorage.getItem('usuarioLogado');

    if (!usuarioId) {
      Alert.alert(
        'Atenção',
        'Usuário não identificado.'
      );
      return;
    }

    if (favoritado) {
      await removerFavorito(
        Number(usuarioId),
        veiculo.CodigoFipe
      );

      setFavoritado(false);

      Alert.alert(
        'Favorito removido',
        'Veículo removido dos favoritos.'
      );
    } else {
      await adicionarFavorito(
        Number(usuarioId),
        veiculo
      );

      setFavoritado(true);

      Alert.alert(
        'Favorito adicionado',
        'Veículo salvo nos favoritos.'
      );
    }
  } catch (error) {
    console.error(
      'Erro ao alterar favorito:',
      error
    );

    Alert.alert(
      'Erro',
      'Não foi possível alterar o favorito.'
    );
  }
}

  return (
    <ScrollView style={styles.container}>

      <View style={styles.header}>

        <Text style={styles.brand}>
          {veiculo.Marca}
        </Text>

        <Text style={styles.title}>
          {veiculo.Modelo}
        </Text>

        <Text style={styles.price}>
          {veiculo.Valor}
        </Text>

      </View>

      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={alternarFavorito}
      >
        <Text style={styles.favoriteText}>
          {favoritado
            ? '★ Remover dos favoritos'
            : '☆ Adicionar aos favoritos'}
        </Text>
      </TouchableOpacity>

      <View style={styles.mainInfo}>

        <View style={styles.info}>
          <Text style={styles.label}>
            Ano
          </Text>

          <Text style={styles.value}>
            {veiculo.AnoModelo}
          </Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.label}>
            Combustível
          </Text>

          <Text style={styles.value}>
            {veiculo.Combustivel}
          </Text>
        </View>

      </View>

      <View style={styles.tabs}>

        <TouchableOpacity
          style={[
            styles.tab,
            abaSelecionada === 'sobre' &&
              styles.tabAtiva,
          ]}
          onPress={() =>
            setAbaSelecionada('sobre')
          }
        >
          <Text
            style={[
              styles.tabText,
              abaSelecionada === 'sobre' &&
                styles.tabTextAtiva,
            ]}
          >
            Sobre
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            abaSelecionada === 'especificacoes' &&
              styles.tabAtiva,
          ]}
          onPress={() =>
            setAbaSelecionada(
              'especificacoes'
            )
          }
        >
          <Text
            style={[
              styles.tabText,
              abaSelecionada === 'especificacoes' &&
                styles.tabTextAtiva,
            ]}
          >
            Especificações
          </Text>
        </TouchableOpacity>

      </View>

      {abaSelecionada === 'sobre' && (
        <View style={styles.content}>

          <Text style={styles.sectionTitle}>
            Sobre o veículo
          </Text>

          <Text style={styles.description}>
            {veiculo.Marca}{' '}
            {veiculo.Modelo}, ano{' '}
            {veiculo.AnoModelo}.
          </Text>

          <Text style={styles.description}>
            Valor de referência segundo a
            tabela FIPE: {veiculo.Valor}.
          </Text>

        </View>
      )}

      {abaSelecionada === 'especificacoes' && (
        <View style={styles.content}>

          <Text style={styles.sectionTitle}>
            Especificações
          </Text>

          <View style={styles.spec}>
            <Text style={styles.specLabel}>
              Marca
            </Text>

            <Text style={styles.specValue}>
              {veiculo.Marca}
            </Text>
          </View>

          <View style={styles.spec}>
            <Text style={styles.specLabel}>
              Modelo
            </Text>

            <Text style={styles.specValue}>
              {veiculo.Modelo}
            </Text>
          </View>

          <View style={styles.spec}>
            <Text style={styles.specLabel}>
              Ano
            </Text>

            <Text style={styles.specValue}>
              {veiculo.AnoModelo}
            </Text>
          </View>

          <View style={styles.spec}>
            <Text style={styles.specLabel}>
              Combustível
            </Text>

            <Text style={styles.specValue}>
              {veiculo.Combustivel}
            </Text>
          </View>

          <View style={styles.spec}>
            <Text style={styles.specLabel}>
              Código FIPE
            </Text>

            <Text style={styles.specValue}>
              {veiculo.CodigoFipe}
            </Text>
          </View>

          <View style={styles.spec}>
            <Text style={styles.specLabel}>
              Mês de referência
            </Text>

            <Text style={styles.specValue}>
              {veiculo.MesReferencia}
            </Text>
          </View>

        </View>
      )}

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
    marginBottom: 25,
  },

  brand: {
    fontSize: 15,
    color: '#666666',
    fontWeight: '600',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111111',
    marginTop: 5,
  },

  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111111',
    marginTop: 12,
  },

  favoriteButton: {
    marginBottom: 25,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 10,
    alignItems: 'center',
  },

  favoriteText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222222',
  },

  mainInfo: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 18,
    marginBottom: 25,
  },

  info: {
    flex: 1,
  },

  label: {
    fontSize: 13,
    color: '#777777',
  },

  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
    marginTop: 4,
  },

  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    marginBottom: 25,
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
  },

  tabAtiva: {
    borderBottomWidth: 2,
    borderBottomColor: '#111111',
  },

  tabText: {
    fontSize: 15,
    color: '#777777',
  },

  tabTextAtiva: {
    color: '#111111',
    fontWeight: 'bold',
  },

  content: {
    marginBottom: 40,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#111111',
    marginBottom: 15,
  },

  description: {
    fontSize: 15,
    color: '#666666',
    lineHeight: 22,
    marginBottom: 12,
  },

  spec: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  specLabel: {
    fontSize: 15,
    color: '#666666',
  },

  specValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111111',
    maxWidth: '55%',
    textAlign: 'right',
  },

});