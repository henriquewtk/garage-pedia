import React, {
  useState,
  useCallback,
} from 'react';

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

import * as SQLite from 'expo-sqlite';

export default function ComparisonHistoryScreen({
  navigation,
  route,
}) {
  // Se receber uma comparação, mostra os detalhes.
  // Caso contrário, mostra a lista do histórico.
  const comparacaoSelecionada = route.params?.comparacao;

  const [comparacoes, setComparacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const carregarComparacoes = useCallback(async () => {
    try {
      setCarregando(true);

      const usuarioId = await AsyncStorage.getItem(
        'usuarioLogado'
      );

      if (!usuarioId) {
        setComparacoes([]);
        return;
      }

      const db = await SQLite.openDatabaseAsync(
        'garagepedia.db'
      );

      const dados = await db.getAllAsync(
        `SELECT *
         FROM comparacoes
         WHERE usuario_id = ?
         ORDER BY id DESC`,
        Number(usuarioId)
      );

      setComparacoes(dados);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);

      Alert.alert(
        'Erro',
        'Não foi possível carregar o histórico.'
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!comparacaoSelecionada) {
        carregarComparacoes();
      }
    }, [carregarComparacoes, comparacaoSelecionada])
  );

  async function excluirComparacao(comparacaoId) {
    Alert.alert(
      'Excluir comparação',
      'Deseja remover esta comparação do histórico?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const usuarioId = await AsyncStorage.getItem(
                'usuarioLogado'
              );

              if (!usuarioId) {
                Alert.alert(
                  'Atenção',
                  'Usuário não identificado.'
                );
                return;
              }

              const db = await SQLite.openDatabaseAsync(
                'garagepedia.db'
              );

              await db.runAsync(
                `DELETE FROM comparacoes
                 WHERE id = ?
                 AND usuario_id = ?`,
                comparacaoId,
                Number(usuarioId)
              );

              await carregarComparacoes();
            } catch (error) {
              console.error('Erro ao excluir comparação:', error);

              Alert.alert(
                'Erro',
                'Não foi possível excluir a comparação.'
              );
            }
          },
        },
      ]
    );
  }

  // TELA DE DETALHES DA COMPARAÇÃO
  if (comparacaoSelecionada) {
    const comparacao = comparacaoSelecionada;

    function Veiculo({ numero }) {
      const marca = comparacao[`veiculo${numero}_marca`];
      const modelo = comparacao[`veiculo${numero}_modelo`];
      const ano = comparacao[`veiculo${numero}_ano`];
      const codigo = comparacao[`veiculo${numero}_codigo_fipe`];

      return (
        <View style={styles.vehicleCard}>
          <Text style={styles.vehicleTitle}>
            Veículo {numero}
          </Text>

          <Text style={styles.label}>Marca</Text>
          <Text style={styles.value}>{marca}</Text>

          <Text style={styles.label}>Modelo</Text>
          <Text style={styles.value}>{modelo}</Text>

          <Text style={styles.label}>Ano</Text>
          <Text style={styles.value}>{ano}</Text>

          <Text style={styles.label}>Código FIPE</Text>
          <Text style={styles.value}>{codigo}</Text>
          <Text style={styles.label}>Preço FIPE</Text>

            <Text style={styles.price}>
            {comparacao[`veiculo${numero}_valor`] || 'Não informado'}
            </Text>

            <Text style={styles.label}>Combustível</Text>

            <Text style={styles.value}>
            {comparacao[`veiculo${numero}_combustivel`] || 'Não informado'}
            </Text>
            </View>
      );
    }

    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>‹ Voltar ao histórico</Text>
          </TouchableOpacity>

          <Text style={styles.title}>
            Comparação de veículos
          </Text>

          <Text style={styles.subtitle}>
            Confira os dados dos veículos selecionados.
          </Text>
        </View>

        <View style={styles.comparison}>
          <Veiculo numero={1} />

          <View style={styles.vsContainer}>
            <Text style={styles.vs}>VS</Text>
          </View>

          <Veiculo numero={2} />
        </View>
        
        <View style={styles.priceComparison}>
  <Text style={styles.priceComparisonTitle}>
    Diferença de preço
  </Text>

  <Text style={styles.priceDifference}>
    {(() => {
      const valor1 = Number(
        String(comparacao.veiculo1_valor || '')
          .replace(/[^\d,]/g, '')
          .replace(',', '.')
      );

      const valor2 = Number(
        String(comparacao.veiculo2_valor || '')
          .replace(/[^\d,]/g, '')
          .replace(',', '.')
      );

      if (!valor1 || !valor2) {
        return 'Valores FIPE indisponíveis';
      }

      return Math.abs(valor1 - valor2).toLocaleString(
        'pt-BR',
        {
          style: 'currency',
          currency: 'BRL',
        }
      );
    })()}
  </Text>

  {(() => {
    const valor1 = Number(
      String(comparacao.veiculo1_valor || '')
        .replace(/[^\d,]/g, '')
        .replace(',', '.')
    );

    const valor2 = Number(
      String(comparacao.veiculo2_valor || '')
        .replace(/[^\d,]/g, '')
        .replace(',', '.')
    );

    if (!valor1 || !valor2 || valor1 === valor2) {
      return null;
    }

    const maisBarato = valor1 < valor2
      ? comparacao.veiculo1_modelo
      : comparacao.veiculo2_modelo;

    return (
      <Text style={styles.cheaperText}>
        Veículo mais barato: {maisBarato}
      </Text>
    );
  })()}
</View>

        <Text style={styles.date}>
          Comparação salva em:{' '}
          {comparacao.criado_em
            ? new Date(comparacao.criado_em).toLocaleDateString('pt-BR')
            : 'Data não disponível'}
        </Text>
      </ScrollView>
    );
  }

  // TELA PRINCIPAL DO HISTÓRICO
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>‹ Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>
          Histórico de Comparações
        </Text>

        <Text style={styles.subtitle}>
          Consulte suas comparações salvas.
        </Text>
      </View>

      {carregando ? (
        <Text style={styles.message}>
          Carregando histórico...
        </Text>
      ) : comparacoes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            Nenhuma comparação salva
          </Text>

          <Text style={styles.emptyText}>
            Suas comparações salvas aparecerão aqui.
          </Text>
        </View>
      ) : (
        comparacoes.map((comparacao) => (
          <View
            key={comparacao.id}
            style={styles.card}
          >
            <Text style={styles.cardTitle}>
              Comparação #{comparacao.id}
            </Text>

            <View style={styles.vehicles}>
              <View style={styles.vehicle}>
                <Text style={styles.brand}>
                  {comparacao.veiculo1_marca}
                </Text>

                <Text style={styles.model}>
                  {comparacao.veiculo1_modelo}
                </Text>

                <Text style={styles.year}>
                  Ano {comparacao.veiculo1_ano}
                </Text>
              </View>

              <Text style={styles.vs}>VS</Text>

              <View style={styles.vehicle}>
                <Text style={styles.brand}>
                  {comparacao.veiculo2_marca}
                </Text>

                <Text style={styles.model}>
                  {comparacao.veiculo2_modelo}
                </Text>

                <Text style={styles.year}>
                  Ano {comparacao.veiculo2_ano}
                </Text>
              </View>
            </View>

            <Text style={styles.date}>
              Salva em:{' '}
              {comparacao.criado_em
                ? new Date(comparacao.criado_em).toLocaleDateString('pt-BR')
                : 'Data não disponível'}
            </Text>

            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() =>
                navigation.push('ComparisonHistory', {
                  comparacao,
                })
              }
            >
              <Text style={styles.detailsButtonText}>
                Consultar comparação
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => excluirComparacao(comparacao.id)}
            >
              <Text style={styles.deleteButtonText}>
                Excluir do histórico
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
    marginTop: 45,
    marginBottom: 25,
  },

  backButton: {
    marginBottom: 18,
  },

  backText: {
    fontSize: 16,
    color: '#444444',
    marginBottom: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111111',
  },

  subtitle: {
    fontSize: 15,
    color: '#666666',
    marginTop: 5,
  },

  message: {
    textAlign: 'center',
    color: '#666666',
    marginTop: 30,
  },

  emptyContainer: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 25,
    borderRadius: 14,
    marginTop: 15,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
    textAlign: 'center',
  },

  emptyText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 21,
  },

  card: {
    backgroundColor: '#F7F7F7',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111111',
    marginBottom: 15,
  },

  vehicles: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  vehicle: {
    width: '42%',
  },

  brand: {
    fontSize: 13,
    color: '#666666',
  },

  model: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111111',
    marginTop: 4,
  },

  year: {
    fontSize: 13,
    color: '#666666',
    marginTop: 5,
  },

  vs: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#666666',
  },

  date: {
    fontSize: 12,
    color: '#777777',
    marginTop: 18,
    marginBottom: 12,
  },

  detailsButton: {
    backgroundColor: '#111111',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  detailsButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  deleteButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 5,
  },

  deleteButtonText: {
    color: '#CC3333',
    fontSize: 14,
    fontWeight: '600',
  },

  comparison: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  vehicleCard: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },

  vehicleTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111111',
    marginBottom: 8,
  },

  label: {
    fontSize: 11,
    color: '#777777',
    marginTop: 12,
  },

  value: {
    fontSize: 13,
    fontWeight: '600',
    color: '#222222',
    marginTop: 4,
  },

  vsContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 6,
  },

  price: {
  fontSize: 15,
  fontWeight: 'bold',
  color: '#16803C',
  marginTop: 4,
  },
  priceComparison: {
  backgroundColor: '#F0F8F1',
  borderRadius: 12,
  padding: 16,
  marginTop: 20,
  borderWidth: 1,
  borderColor: '#D5EAD8',
},

priceComparisonTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#222222',
},

priceDifference: {
  fontSize: 22,
  fontWeight: 'bold',
  color: '#16803C',
  marginTop: 8,
},

cheaperText: {
  fontSize: 14,
  color: '#16803C',
  marginTop: 8,
  fontWeight: '600',
},
});