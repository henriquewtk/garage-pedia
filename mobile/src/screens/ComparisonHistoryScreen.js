
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';

import { useSettings } from '../context/SettingsContext';

export default function ComparisonHistoryScreen({ navigation, route }) {
  const comparacaoSelecionada = route.params?.comparacao;

  const [comparacoes, setComparacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const { cores, idioma } = useSettings();
  const insets = useSafeAreaInsets();
  const styles = criarEstilos(cores);

  const t = (pt, en) => (idioma === 'en' ? en : pt);

  const carregarComparacoes = useCallback(async () => {
    try {
      setCarregando(true);

      const usuarioId = await AsyncStorage.getItem('usuarioLogado');

      if (!usuarioId) {
        setComparacoes([]);
        return;
      }

      const db = await SQLite.openDatabaseAsync('garagepedia.db');

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
        t('Erro', 'Error'),
        t(
          'Não foi possível carregar o histórico.',
          'Could not load the history.'
        )
      );
    } finally {
      setCarregando(false);
    }
  }, [idioma]);

  useFocusEffect(
    useCallback(() => {
      if (!comparacaoSelecionada) {
        carregarComparacoes();
      }
    }, [carregarComparacoes, comparacaoSelecionada])
  );

  async function excluirComparacao(comparacaoId) {
    Alert.alert(
      t('Excluir comparação', 'Delete comparison'),
      t(
        'Deseja remover esta comparação do histórico?',
        'Do you want to remove this comparison from the history?'
      ),
      [
        {
          text: t('Cancelar', 'Cancel'),
          style: 'cancel',
        },
        {
          text: t('Excluir', 'Delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              const usuarioId = await AsyncStorage.getItem('usuarioLogado');

              if (!usuarioId) {
                Alert.alert(
                  t('Atenção', 'Notice'),
                  t('Usuário não identificado.', 'User not identified.')
                );
                return;
              }

              const db = await SQLite.openDatabaseAsync('garagepedia.db');

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
                t('Erro', 'Error'),
                t(
                  'Não foi possível excluir a comparação.',
                  'Could not delete the comparison.'
                )
              );
            }
          },
        },
      ]
    );
  }

  function formatarValor(valor) {
    if (valor === null || valor === undefined || valor === '') {
      return null;
    }

    if (typeof valor === 'number') {
      return valor;
    }

    const texto = String(valor).trim();

    if (texto.includes('R$')) {
      const numero = Number(
        texto
          .replace(/[^\d,.-]/g, '')
          .replace(/\./g, '')
          .replace(',', '.')
      );

      return Number.isFinite(numero) ? numero : null;
    }

    const numero = Number(texto);
    return Number.isFinite(numero) ? numero : null;
  }

  
function exibirValor(valor) {
  const numero = formatarValor(valor);

  if (numero === null) {
    return t('Não informado', 'Not available');
  }

  return numero.toLocaleString(
    idioma === 'en' ? 'en-US' : 'pt-BR',
    {
      style: 'currency',
      currency: 'BRL',
    }
  );
}

  function exibirData(data) {
    if (!data) {
      return t('Data não disponível', 'Date unavailable');
    }

    const dataConvertida = new Date(data);

    if (Number.isNaN(dataConvertida.getTime())) {
      return t('Data não disponível', 'Date unavailable');
    }

    return dataConvertida.toLocaleDateString(
      idioma === 'en' ? 'en-US' : 'pt-BR'
    );
  }

  function Veiculo({ numero, comparacao }) {
    const marca = comparacao[`veiculo${numero}_marca`];
    const modelo = comparacao[`veiculo${numero}_modelo`];
    const ano = comparacao[`veiculo${numero}_ano`];
    const codigo = comparacao[`veiculo${numero}_codigo_fipe`];
    const valor = comparacao[`veiculo${numero}_valor`];
    const combustivel = comparacao[`veiculo${numero}_combustivel`];

    return (
      <View style={styles.vehicleCard}>
        <View style={styles.vehicleIcon}>
          <Ionicons
            name="car-sport-outline"
            size={26}
            color={cores.primary}
          />
        </View>

        <Text style={styles.vehicleTitle}>
          {t('Veículo', 'Vehicle')} {numero}
        </Text>

        <Text style={styles.label}>{t('Marca', 'Make')}</Text>
        <Text style={styles.value}>
          {marca || t('Não informada', 'Not available')}
        </Text>

        <Text style={styles.label}>{t('Modelo', 'Model')}</Text>
        <Text style={styles.value}>
          {modelo || t('Não informado', 'Not available')}
        </Text>

        <Text style={styles.label}>{t('Ano', 'Year')}</Text>
        <Text style={styles.value}>
          {ano || t('Não informado', 'Not available')}
        </Text>

        <Text style={styles.label}>{t('Código FIPE', 'FIPE code')}</Text>
        <Text style={styles.value}>
          {codigo || t('Não informado', 'Not available')}
        </Text>

        <Text style={styles.label}>{t('Preço FIPE', 'FIPE price')}</Text>
        <Text style={styles.vehiclePrice}>{exibirValor(valor)}</Text>

        <Text style={styles.label}>{t('Combustível', 'Fuel')}</Text>
        <Text style={styles.value}>
          {combustivel || t('Não informado', 'Not available')}
        </Text>
      </View>
    );
  }

  const paddingSuperior = Math.max(insets.top, 12) + 12;

  if (comparacaoSelecionada) {
    const comparacao = comparacaoSelecionada;
    const valor1 = formatarValor(comparacao.veiculo1_valor);
    const valor2 = formatarValor(comparacao.veiculo2_valor);

    const valoresValidos = valor1 !== null && valor2 !== null;

    const diferenca = valoresValidos
      ? Math.abs(valor1 - valor2)
      : null;

    let textoMaisBarato = '';

    if (valoresValidos && valor1 !== valor2) {
      textoMaisBarato =
        valor1 < valor2
          ? comparacao.veiculo1_modelo
          : comparacao.veiculo2_modelo;
    }

    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingTop: paddingSuperior },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={cores.primary} />
          <Text style={styles.backText}>
            {t('Voltar ao histórico', 'Back to history')}
          </Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>
            {t('Comparação de veículos', 'Vehicle comparison')}
          </Text>
        </View>

        <View style={styles.comparison}>
          <Veiculo numero={1} comparacao={comparacao} />

          <View style={styles.vsContainer}>
            <Text style={styles.vs}>VS</Text>
          </View>

          <Veiculo numero={2} comparacao={comparacao} />
        </View>

        <View style={styles.priceComparison}>
          <View style={styles.priceIcon}>
            <Ionicons name="cash-outline" size={23} color={cores.primary} />
          </View>

          <Text style={styles.priceComparisonTitle}>
            {t('Diferença de preço', 'Price difference')}
          </Text>

          <Text style={styles.priceDifference}>
            {diferenca === null
              ? t('Valores FIPE indisponíveis', 'FIPE prices unavailable')
              : exibirValor(diferenca)}
          </Text>

          {valoresValidos && valor1 === valor2 && (
            <Text style={styles.comparisonNote}>
              {t(
                'Os dois veículos possuem o mesmo valor.',
                'Both vehicles have the same price.'
              )}
            </Text>
          )}

          {!!textoMaisBarato && (
            <View style={styles.cheaperContainer}>
              <Ionicons
                name="checkmark-circle-outline"
                size={18}
                color={cores.primary}
              />
              <Text style={styles.cheaperText}>
                {t('Menor valor:', 'Lower price:')} {textoMaisBarato}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.dateContainer}>
          <Ionicons
            name="calendar-outline"
            size={18}
            color={cores.secondary}
          />
          <Text style={styles.date}>
            {t('Comparação salva em:', 'Comparison saved on:')}{' '}
            {exibirData(comparacao.criado_em)}
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: paddingSuperior },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={20} color={cores.primary} />
        <Text style={styles.backText}>{t('Voltar', 'Back')}</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>
          {t('Histórico de Comparações', 'Comparison History')}
        </Text>
      </View>

      {carregando ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={cores.primary} />
          <Text style={styles.message}>
            {t('Carregando histórico...', 'Loading history...')}
          </Text>
        </View>
      ) : comparacoes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="git-compare-outline"
              size={42}
              color={cores.primary}
            />
          </View>

          <Text style={styles.emptyTitle}>
            {t('Nenhuma comparação salva', 'No saved comparisons')}
          </Text>

          <Text style={styles.emptyText}>
            {t(
              'Suas comparações salvas aparecerão aqui. Compare dois veículos para começar seu histórico.',
              'Your saved comparisons will appear here. Compare two vehicles to start your history.'
            )}
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Comparar')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="git-compare-outline"
              size={18}
              color="#FFFFFF"
            />
            <Text style={styles.primaryButtonText}>
              {t('Comparar veículos', 'Compare vehicles')}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.counter}>
            {comparacoes.length}{' '}
            {comparacoes.length === 1
              ? t('comparação salva', 'saved comparison')
              : t('comparações salvas', 'saved comparisons')}
          </Text>

          {comparacoes.map((comparacao) => (
            <View key={comparacao.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIcon}>
                  <Ionicons
                    name="git-compare-outline"
                    size={22}
                    color={cores.primary}
                  />
                </View>

                <View style={styles.cardHeaderInfo}>
                  <Text style={styles.cardTitle}>
                    {t('Comparação', 'Comparison')} #{comparacao.id}
                  </Text>
                  <Text style={styles.date}>
                    {exibirData(comparacao.criado_em)}
                  </Text>
                </View>
              </View>

              <View style={styles.vehicles}>
                <View style={styles.vehicle}>
                  <Text style={styles.brand}>
                    {comparacao.veiculo1_marca || '—'}
                  </Text>
                  <Text style={styles.model}>
                    {comparacao.veiculo1_modelo || '—'}
                  </Text>
                  <Text style={styles.year}>
                    {t('Ano', 'Year')} {comparacao.veiculo1_ano || '—'}
                  </Text>
                  <Text style={styles.listPrice}>
                    {exibirValor(comparacao.veiculo1_valor)}
                  </Text>
                </View>

                <View style={styles.vsBadge}>
                  <Text style={styles.vs}>VS</Text>
                </View>

                <View style={styles.vehicle}>
                  <Text style={styles.brand}>
                    {comparacao.veiculo2_marca || '—'}
                  </Text>
                  <Text style={styles.model}>
                    {comparacao.veiculo2_modelo || '—'}
                  </Text>
                  <Text style={styles.year}>
                    {t('Ano', 'Year')} {comparacao.veiculo2_ano || '—'}
                  </Text>
                  <Text style={styles.listPrice}>
                    {exibirValor(comparacao.veiculo2_valor)}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() =>
                  navigation.push('ComparisonHistory', { comparacao })
                }
                activeOpacity={0.8}
              >
                <Text style={styles.detailsButtonText}>
                  {t('Consultar comparação', 'View comparison')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => excluirComparacao(comparacao.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="trash-outline"
                  size={17}
                  color="#C0392B"
                />
                <Text style={styles.deleteButtonText}>
                  {t('Excluir do histórico', 'Delete from history')}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </>
      )}
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
      paddingBottom: 35,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: 8,
      marginBottom: 20,
    },
    backText: {
      fontSize: 14,
      color: cores.primary,
      fontWeight: '600',
    },
    header: {
      marginBottom: 25,
    },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      color: cores.text,
    },
    loadingContainer: {
      alignItems: 'center',
      marginTop: 50,
    },
    message: {
      color: cores.secondary,
      fontSize: 14,
      marginTop: 12,
    },
    emptyContainer: {
      alignItems: 'center',
      backgroundColor: cores.card,
      borderRadius: 18,
      padding: 25,
      marginTop: 10,
      borderWidth: 1,
      borderColor: cores.border,
    },
    emptyIcon: {
      width: 80,
      height: 80,
      borderRadius: 25,
      backgroundColor: cores.input,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    emptyTitle: {
      fontSize: 19,
      fontWeight: 'bold',
      color: cores.text,
      textAlign: 'center',
    },
    emptyText: {
      fontSize: 14,
      color: cores.secondary,
      textAlign: 'center',
      marginTop: 10,
      lineHeight: 21,
    },
    primaryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: cores.primary,
      paddingVertical: 13,
      paddingHorizontal: 18,
      borderRadius: 11,
      marginTop: 22,
      alignSelf: 'stretch',
    },
    primaryButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
    counter: {
      color: cores.secondary,
      fontSize: 13,
      fontWeight: '600',
      marginBottom: 14,
    },
    card: {
      backgroundColor: cores.card,
      borderRadius: 18,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: cores.border,
      elevation: 2,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 5,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 17,
    },
    cardIcon: {
      width: 44,
      height: 44,
      borderRadius: 13,
      backgroundColor: cores.input,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    cardHeaderInfo: {
      flex: 1,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: cores.text,
    },
    vehicles: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      backgroundColor: cores.input,
      borderRadius: 13,
      padding: 12,
      marginBottom: 16,
    },
    vehicle: {
      flex: 1,
      minWidth: 0,
    },
    brand: {
      fontSize: 12,
      color: cores.secondary,
      fontWeight: '600',
    },
    model: {
      fontSize: 14,
      fontWeight: 'bold',
      color: cores.text,
      marginTop: 5,
    },
    year: {
      fontSize: 12,
      color: cores.secondary,
      marginTop: 6,
    },
    listPrice: {
      fontSize: 12,
      color: cores.primary,
      fontWeight: 'bold',
      marginTop: 8,
    },
    vsBadge: {
      backgroundColor: cores.card,
      borderWidth: 1,
      borderColor: cores.border,
      borderRadius: 10,
      paddingHorizontal: 8,
      paddingVertical: 6,
      marginHorizontal: 8,
      alignSelf: 'center',
    },
    vs: {
      fontSize: 12,
      fontWeight: 'bold',
      color: cores.primary,
    },
    detailsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: cores.primary,
      paddingVertical: 13,
      borderRadius: 11,
    },
    detailsButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
    deleteButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      paddingVertical: 12,
      marginTop: 4,
    },
    deleteButtonText: {
      color: '#C0392B',
      fontSize: 13,
      fontWeight: '600',
    },
    comparison: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    vehicleCard: {
      flex: 1,
      minWidth: 0,
      backgroundColor: cores.card,
      borderRadius: 15,
      padding: 11,
      borderWidth: 1,
      borderColor: cores.border,
    },
    vehicleIcon: {
      width: 42,
      height: 42,
      borderRadius: 12,
      backgroundColor: cores.input,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    vehicleTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: cores.text,
    },
    label: {
      fontSize: 11,
      color: cores.secondary,
      marginTop: 12,
    },
    value: {
      fontSize: 12,
      fontWeight: '600',
      color: cores.text,
      marginTop: 4,
    },
    vsContainer: {
      justifyContent: 'center',
      alignSelf: 'center',
      paddingHorizontal: 6,
    },
    vehiclePrice: {
      fontSize: 13,
      fontWeight: 'bold',
      color: cores.primary,
      marginTop: 4,
    },
    priceComparison: {
      backgroundColor: cores.card,
      borderRadius: 16,
      padding: 18,
      marginTop: 20,
      borderWidth: 1,
      borderColor: cores.border,
    },
    priceIcon: {
      width: 42,
      height: 42,
      borderRadius: 12,
      backgroundColor: cores.input,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    priceComparisonTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: cores.text,
    },
    priceDifference: {
      fontSize: 21,
      fontWeight: 'bold',
      color: cores.primary,
      marginTop: 8,
    },
    comparisonNote: {
      fontSize: 13,
      color: cores.secondary,
      marginTop: 8,
    },
    cheaperContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      marginTop: 12,
    },
    cheaperText: {
      flex: 1,
      fontSize: 13,
      color: cores.primary,
      fontWeight: '600',
    },
    dateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 20,
      marginBottom: 12,
    },
    date: {
      fontSize: 12,
      color: cores.secondary,
    },
  });
}