import React, { useState, useCallback } from 'react';

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  listarFavoritos,
  removerFavorito,
} from '../database/database';

export default function FavoritesScreen() {
  const [favoritos, setFavoritos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Carrega os favoritos do usuário conectado
  const carregarFavoritos = useCallback(async () => {
    try {
      setCarregando(true);

      const usuarioId =
        await AsyncStorage.getItem('usuarioLogado');

      if (!usuarioId) {
        setFavoritos([]);
        return;
      }

      const dados = await listarFavoritos(
        Number(usuarioId)
      );

      setFavoritos(dados);
    } catch (error) {
      console.error(
        'Erro ao carregar favoritos:',
        error
      );

      Alert.alert(
        'Erro',
        'Não foi possível carregar os favoritos.'
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  // Atualiza a lista sempre que a tela recebe foco
  useFocusEffect(
    useCallback(() => {
      carregarFavoritos();
    }, [carregarFavoritos])
  );

  // Remove um veículo dos favoritos
  async function excluirFavorito(veiculo) {
    Alert.alert(
      'Remover favorito',
      `Deseja remover ${veiculo.modelo} dos favoritos?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Remover',
          style: 'destructive',

          onPress: async () => {
            try {
              const usuarioId =
                await AsyncStorage.getItem(
                  'usuarioLogado'
                );

              if (!usuarioId) {
                Alert.alert(
                  'Atenção',
                  'Usuário não identificado.'
                );
                return;
              }

              await removerFavorito(
                Number(usuarioId),
                veiculo.codigo_fipe
              );

              await carregarFavoritos();

            } catch (error) {
              console.error(
                'Erro ao remover favorito:',
                error
              );

              Alert.alert(
                'Erro',
                'Não foi possível remover o veículo.'
              );
            }
          },
        },
      ]
    );
  }

  return (
    <ScrollView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>
          Meus Favoritos
        </Text>

        <Text style={styles.subtitle}>
          Veículos que você salvou
        </Text>
      </View>

      {carregando ? (
        <Text style={styles.message}>
          Carregando favoritos...
        </Text>
      ) : favoritos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            Nenhum favorito ainda
          </Text>

          <Text style={styles.emptyText}>
            Pesquise um veículo e adicione-o
            aos seus favoritos para encontrá-lo aqui.
          </Text>
        </View>
      ) : (
        favoritos.map((veiculo) => (
          <View
            key={veiculo.id}
            style={styles.card}
          >
            <View style={styles.vehicleInfo}>
              <Text style={styles.brand}>
                {veiculo.marca}
              </Text>

              <Text style={styles.model}>
                {veiculo.modelo}
              </Text>

              <Text style={styles.details}>
                Ano: {veiculo.ano}
              </Text>

              <Text style={styles.details}>
                Combustível: {veiculo.combustivel}
              </Text>

              <Text style={styles.price}>
                {veiculo.valor || 'Valor indisponível'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => excluirFavorito(veiculo)}
            >
              <Text style={styles.removeButtonText}>
                ★ Remover dos favoritos
              </Text>
            </TouchableOpacity>
          </View>
        ))
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

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111111',
  },

  subtitle: {
    fontSize: 15,
    color: '#666666',
    marginTop: 5,
  },

  message: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    marginTop: 30,
  },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 15,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 10,
    textAlign: 'center',
  },

  emptyText: {
    fontSize: 15,
    color: '#777777',
    textAlign: 'center',
    lineHeight: 22,
  },

  card: {
    backgroundColor: '#F7F7F7',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },

  vehicleInfo: {
    marginBottom: 15,
  },

  brand: {
    fontSize: 14,
    color: '#777777',
    fontWeight: '600',
  },

  model: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111111',
    marginTop: 4,
  },

  details: {
    fontSize: 14,
    color: '#666666',
    marginTop: 6,
  },

  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111111',
    marginTop: 12,
  },

  removeButton: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: 'center',
  },

  removeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
});