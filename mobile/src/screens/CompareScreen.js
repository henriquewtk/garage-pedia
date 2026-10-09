
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

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';
import { useSettings } from '../context/SettingsContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { listarFavoritos } from '../database/database';

export default function CompareScreen({ navigation }) {
  const { cores, idioma } = useSettings();
  const insets = useSafeAreaInsets();
  const styles = criarEstilos(cores);

  const t = (pt, en) => idioma === 'en' ? en : pt;

  const [veiculos, setVeiculos] = useState([]);
  const [veiculo1, setVeiculo1] = useState(null);
  const [veiculo2, setVeiculo2] = useState(null);
  const [selecionando, setSelecionando] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const carregarVeiculos = useCallback(async () => {
    try {
      setCarregando(true);

      const usuarioId = await AsyncStorage.getItem('usuarioLogado');

      if (!usuarioId) {
        setVeiculos([]);
        return;
      }

      const favoritos = await listarFavoritos(Number(usuarioId));
      setVeiculos(favoritos);
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
      Alert.alert(
        t('Erro', 'Error'),
        t(
          'Não foi possível carregar os veículos favoritos.',
          'Could not load favorite vehicles.'
        )
      );
    } finally {
      setCarregando(false);
    }
  }, [idioma]);

  useFocusEffect(
    useCallback(() => {
      carregarVeiculos();
    }, [carregarVeiculos])
  );

  function selecionarVeiculo(veiculo) {
    if (
      selecionando === 1 &&
      veiculo2 &&
      veiculo.codigo_fipe === veiculo2.codigo_fipe
    ) {
      Alert.alert(
        t('Veículo já selecionado', 'Vehicle already selected'),
        t(
          'Escolha um veículo diferente do segundo.',
          'Choose a vehicle different from the second one.'
        )
      );
      return;
    }

    if (
      selecionando === 2 &&
      veiculo1 &&
      veiculo.codigo_fipe === veiculo1.codigo_fipe
    ) {
      Alert.alert(
        t('Veículo já selecionado', 'Vehicle already selected'),
        t(
          'Escolha um veículo diferente do primeiro.',
          'Choose a vehicle different from the first one.'
        )
      );
      return;
    }

    if (selecionando === 1) {
      setVeiculo1(veiculo);
      setSelecionando(2);
    } else {
      setVeiculo2(veiculo);
    }
  }

  async function salvarComparacao() {
    if (!veiculo1 || !veiculo2) {
      Alert.alert(
        t('Atenção', 'Attention'),
        t(
          'Selecione dois veículos para comparar.',
          'Select two vehicles to compare.'
        )
      );
      return;
    }

    if (veiculo1.codigo_fipe === veiculo2.codigo_fipe) {
      Alert.alert(
        t('Atenção', 'Attention'),
        t(
          'Selecione dois veículos diferentes.',
          'Select two different vehicles.'
        )
      );
      return;
    }

    try {
      setSalvando(true);

      const usuarioId = await AsyncStorage.getItem('usuarioLogado');

      if (!usuarioId) {
        Alert.alert(
          t('Atenção', 'Attention'),
          t(
            'Faça login para salvar sua comparação.',
            'Log in to save your comparison.'
          )
        );
        return;
      }

      const db = await SQLite.openDatabaseAsync('garagepedia.db');

      await db.runAsync(
        `INSERT INTO comparacoes (
          usuario_id,
          veiculo1_codigo_fipe,
          veiculo1_marca,
          veiculo1_modelo,
          veiculo1_ano,
          veiculo1_valor,
          veiculo1_combustivel,
          veiculo2_codigo_fipe,
          veiculo2_marca,
          veiculo2_modelo,
          veiculo2_ano,
          veiculo2_valor,
          veiculo2_combustivel,
          criado_em
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        Number(usuarioId),
        veiculo1.codigo_fipe,
        veiculo1.marca,
        veiculo1.modelo,
        veiculo1.ano,
        veiculo1.valor ?? null,
        veiculo1.combustivel ?? null,
        veiculo2.codigo_fipe,
        veiculo2.marca,
        veiculo2.modelo,
        veiculo2.ano,
        veiculo2.valor ?? null,
        veiculo2.combustivel ?? null,
        new Date().toISOString()
      );

      Alert.alert(
        t('Comparação salva!', 'Comparison saved!'),
        t(
          'A comparação foi registrada com sucesso.',
          'The comparison was saved successfully.'
        )
      );
    } catch (error) {
      console.error('Erro ao salvar comparação:', error);
      Alert.alert(
        t('Erro', 'Error'),
        t(
          'Não foi possível salvar a comparação.',
          'Could not save the comparison.'
        )
      );
    } finally {
      setSalvando(false);
    }
  }

  function ComparisonRow({ title, value1, value2 }) {
    return (
      <View style={styles.comparisonRow}>
        <View style={styles.comparisonColumn}>
          <Text style={styles.comparisonValue}>
            {value1 || t('Não informado', 'Not provided')}
          </Text>
        </View>

        <View style={styles.comparisonLabel}>
          <Text style={styles.comparisonLabelText}>{title}</Text>
        </View>

        <View style={styles.comparisonColumn}>
          <Text style={styles.comparisonValue}>
            {value2 || t('Não informado', 'Not provided')}
          </Text>
        </View>
      </View>
    );
  }

  function renderVeiculoSelecionado(veiculo, numero) {
    const primeiro = numero === 1;

    return (
      <View style={styles.vehicleSummary}>
        <View style={styles.summaryIcon}>
          <Ionicons
            name="car-sport-outline"
            size={25}
            color={cores.primary}
          />
        </View>

        <Text style={styles.summaryLabel}>
          {t('Veículo', 'Vehicle')} {numero}
        </Text>

        <Text style={styles.summaryBrand}>
          {veiculo?.marca || t('Aguardando seleção', 'Waiting for selection')}
        </Text>

        <Text style={styles.summaryModel}>
          {veiculo?.modelo || t('Escolha um favorito', 'Choose a favorite')}
        </Text>

        <Text style={styles.summaryPrice}>
          {veiculo?.valor || '—'}
        </Text>

        {veiculo && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => {
              if (primeiro) {
                setVeiculo1(null);
                setSelecionando(1);
              } else {
                setVeiculo2(null);
                setSelecionando(2);
              }
            }}
          >
            <Ionicons
              name="close-circle-outline"
              size={16}
              color="#D65A5A"
            />
            <Text style={styles.removeText}>
              {t('Remover', 'Remove')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.scrollContent,
        {
          paddingTop: Math.max(insets.top, 16) + 16,
          paddingBottom: Math.max(insets.bottom, 20) + 24,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          {t('Comparar veículos', 'Compare vehicles')}
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {t('Escolha os veículos', 'Choose vehicles')}
        </Text>
      </View>

      <View style={styles.selectionButtons}>
        {[1, 2].map((numero) => {
          const ativo = selecionando === numero;
          const veiculo = numero === 1 ? veiculo1 : veiculo2;

          return (
            <TouchableOpacity
              key={numero}
              style={[
                styles.selectionButton,
                ativo && styles.selectedButton,
              ]}
              onPress={() => setSelecionando(numero)}
            >
              <Ionicons
                name="car-outline"
                size={19}
                color={ativo ? '#FFFFFF' : cores.primary}
              />

              <Text
                style={[
                  styles.selectionButtonText,
                  ativo && styles.selectedButtonText,
                ]}
              >
                {t('Veículo', 'Vehicle')} {numero}
              </Text>

              {veiculo && (
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={ativo ? '#FFFFFF' : '#26845B'}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.instructionCard}>
        <Ionicons
          name="information-circle-outline"
          size={21}
          color={cores.primary}
        />

        <Text style={styles.instructionText}>
          {selecionando === 1
            ? t(
                'Escolha o primeiro veículo na lista abaixo.',
                'Choose the first vehicle from the list below.'
              )
            : t(
                'Agora escolha o segundo veículo.',
                'Now choose the second vehicle.'
              )}
        </Text>
      </View>

      {carregando ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={cores.primary} />
          <Text style={styles.message}>
            {t('Carregando seus favoritos...', 'Loading your favorites...')}
          </Text>
        </View>
      ) : veiculos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="heart-outline"
              size={34}
              color={cores.primary}
            />
          </View>

          <Text style={styles.emptyTitle}>
            {t('Nenhum favorito encontrado', 'No favorites found')}
          </Text>

          <Text style={styles.emptyText}>
            {t(
              'Pesquise veículos e adicione pelo menos dois aos favoritos para compará-los.',
              'Search for vehicles and add at least two to your favorites to compare them.'
            )}
          </Text>

          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => navigation.navigate('Pesquisa')}
          >
            <Ionicons name="search-outline" size={18} color="#FFFFFF" />
            <Text style={styles.searchButtonText}>
              {t('Pesquisar veículos', 'Search vehicles')}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.vehicleList}>
          {veiculos.map((veiculo) => {
            const selecionado1 =
              veiculo1?.codigo_fipe === veiculo.codigo_fipe;
            const selecionado2 =
              veiculo2?.codigo_fipe === veiculo.codigo_fipe;
            const selecionado = selecionado1 || selecionado2;

            return (
              <TouchableOpacity
                key={veiculo.id ?? veiculo.codigo_fipe}
                style={[
                  styles.vehicleOption,
                  selecionado && styles.vehicleOptionSelected,
                ]}
                onPress={() => selecionarVeiculo(veiculo)}
                activeOpacity={0.8}
              >
                <View style={styles.optionIcon}>
                  <Ionicons
                    name="car-sport-outline"
                    size={25}
                    color={cores.primary}
                  />
                </View>

                <View style={styles.optionInfo}>
                  <Text style={styles.vehicleBrand}>{veiculo.marca}</Text>
                  <Text style={styles.vehicleModel}>{veiculo.modelo}</Text>
                  <Text style={styles.vehicleDetails}>
                    {t('Ano', 'Year')}: {veiculo.ano}
                  </Text>
                  <Text style={styles.vehiclePrice}>
                    {veiculo.valor ||
                      t('Valor indisponível', 'Price unavailable')}
                  </Text>
                </View>

                <View style={styles.optionStatus}>
                  {selecionado ? (
                    <>
                      <Ionicons
                        name="checkmark-circle"
                        size={25}
                        color={cores.primary}
                      />
                      <Text style={styles.selectedLabel}>
                        {t('Veículo', 'Vehicle')}{' '}
                        {selecionado1 ? '1' : '2'}
                      </Text>
                    </>
                  ) : (
                    <Ionicons
                      name="add-circle-outline"
                      size={25}
                      color={cores.primary}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {t('Resumo da comparação', 'Comparison summary')}
        </Text>
      </View>

      <View style={styles.vehicles}>
        {renderVeiculoSelecionado(veiculo1, 1)}

        <View style={styles.vsContainer}>
          <Text style={styles.vs}>VS</Text>
        </View>

        {renderVeiculoSelecionado(veiculo2, 2)}
      </View>

      {veiculo1 && veiculo2 && (
        <View style={styles.comparisonSection}>
          <Text style={styles.sectionTitle}>
            {t('Comparação de dados', 'Data comparison')}
          </Text>

          <View style={styles.table}>
            <ComparisonRow
              title={t('Ano', 'Year')}
              value1={String(veiculo1.ano)}
              value2={String(veiculo2.ano)}
            />

            <ComparisonRow
              title={t('Combustível', 'Fuel')}
              value1={veiculo1.combustivel}
              value2={veiculo2.combustivel}
            />

            <ComparisonRow
              title="Código FIPE"
              value1={veiculo1.codigo_fipe}
              value2={veiculo2.codigo_fipe}
            />

            <ComparisonRow
              title={t('Valor FIPE', 'FIPE value')}
              value1={veiculo1.valor}
              value2={veiculo2.valor}
            />
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.saveButton,
          (!veiculo1 || !veiculo2 || salvando) && styles.disabledButton,
        ]}
        onPress={salvarComparacao}
        disabled={!veiculo1 || !veiculo2 || salvando}
        activeOpacity={0.8}
      >
        {salvando ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Ionicons name="save-outline" size={20} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>
              {t('Salvar comparação', 'Save comparison')}
            </Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => navigation.navigate('ComparisonHistory')}
        activeOpacity={0.8}
      >
        <View style={styles.historyIcon}>
          <Ionicons
            name="time-outline"
            size={21}
            color={cores.primary}
          />
        </View>

        <View style={styles.historyTextContainer}>
          <Text style={styles.historyTitle}>
            {t('Histórico de comparações', 'Comparison history')}
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color={cores.secondary}
        />
      </TouchableOpacity>
    </ScrollView>
  );
}

function criarEstilos(cores) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: cores.background,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: 35,
    },
    header: {
      marginTop: 15,
      marginBottom: 22,
    },
    title: {
      fontSize: 27,
      fontWeight: 'bold',
      color: cores.primary,
    },
    sectionHeader: {
      marginBottom: 13,
    },
    sectionTitle: {
      fontSize: 19,
      fontWeight: 'bold',
      color: cores.primary,
    },
    selectionButtons: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 13,
    },
    selectionButton: {
      flex: 1,
      minHeight: 50,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 7,
      paddingHorizontal: 8,
      paddingVertical: 12,
      backgroundColor: cores.card,
      borderWidth: 1,
      borderColor: cores.border,
      borderRadius: 12,
    },
    selectedButton: {
      backgroundColor: cores.primary,
      borderColor: cores.primary,
    },
    selectionButtonText: {
      fontSize: 13,
      fontWeight: '700',
      color: cores.primary,
    },
    selectedButtonText: {
      color: '#FFFFFF',
    },
    instructionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9,
      backgroundColor: cores.input,
      borderWidth: 1,
      borderColor: cores.border,
      borderRadius: 12,
      padding: 13,
      marginBottom: 15,
    },
    instructionText: {
      flex: 1,
      fontSize: 13,
      color: cores.text,
      lineHeight: 19,
    },
    loadingContainer: {
      alignItems: 'center',
      padding: 25,
    },
    message: {
      textAlign: 'center',
      color: cores.secondary,
      marginTop: 12,
    },
    emptyContainer: {
      backgroundColor: cores.card,
      borderRadius: 16,
      padding: 22,
      alignItems: 'center',
      marginBottom: 22,
    },
    emptyIcon: {
      width: 65,
      height: 65,
      borderRadius: 22,
      backgroundColor: cores.input,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14,
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: cores.text,
      textAlign: 'center',
    },
    emptyText: {
      fontSize: 13,
      color: cores.secondary,
      textAlign: 'center',
      lineHeight: 20,
      marginTop: 8,
    },
    searchButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: cores.primary,
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 11,
      marginTop: 18,
    },
    searchButtonText: {
      fontSize: 13,
      color: '#FFFFFF',
      fontWeight: '700',
    },
    vehicleList: {
      marginBottom: 25,
    },
    vehicleOption: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: cores.card,
      borderWidth: 1,
      borderColor: cores.border,
      borderRadius: 15,
      padding: 14,
      marginBottom: 11,
      gap: 12,
    },
    vehicleOptionSelected: {
      borderColor: cores.primary,
      backgroundColor: cores.input,
      borderWidth: 1.5,
    },
    optionIcon: {
      width: 46,
      height: 46,
      borderRadius: 14,
      backgroundColor: cores.input,
      alignItems: 'center',
      justifyContent: 'center',
    },
    optionInfo: {
      flex: 1,
    },
    vehicleBrand: {
      fontSize: 12,
      color: cores.secondary,
      fontWeight: '600',
    },
    vehicleModel: {
      fontSize: 15,
      fontWeight: 'bold',
      color: cores.text,
      marginTop: 3,
    },
    vehicleDetails: {
      fontSize: 12,
      color: cores.secondary,
      marginTop: 5,
    },
    vehiclePrice: {
      fontSize: 14,
      fontWeight: 'bold',
      color: cores.primary,
      marginTop: 6,
    },
    optionStatus: {
      alignItems: 'center',
      justifyContent: 'center',
      maxWidth: 70,
    },
    selectedLabel: {
      color: cores.primary,
      fontSize: 10,
      fontWeight: '700',
      marginTop: 4,
      textAlign: 'center',
    },
    vehicles: {
      flexDirection: 'row',
      alignItems: 'stretch',
      marginTop: 5,
      marginBottom: 25,
    },
    vehicleSummary: {
      flex: 1,
      backgroundColor: cores.card,
      borderColor: cores.border,
      borderWidth: 1,
      borderRadius: 15,
      padding: 12,
      alignItems: 'flex-start',
      elevation: 1,
      shadowColor: '#000000',
      shadowOpacity: 0.04,
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 1 },
    },
    summaryIcon: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor: cores.input,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    },
    summaryLabel: {
      fontSize: 11,
      color: cores.secondary,
      fontWeight: '600',
    },
    summaryBrand: {
      fontSize: 12,
      fontWeight: '600',
      color: cores.primary,
      marginTop: 7,
    },
    summaryModel: {
      fontSize: 13,
      fontWeight: 'bold',
      color: cores.text,
      marginTop: 4,
    },
    summaryPrice: {
      fontSize: 13,
      fontWeight: 'bold',
      color: cores.primary,
      marginTop: 10,
    },
    removeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 12,
    },
    removeText: {
      fontSize: 11,
      fontWeight: '600',
      color: '#D65A5A',
    },
    vsContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 8,
    },
    vs: {
      fontSize: 12,
      fontWeight: 'bold',
      color: cores.primary,
      backgroundColor: cores.input,
      overflow: 'hidden',
      borderRadius: 20,
      paddingHorizontal: 8,
      paddingVertical: 7,
    },
    comparisonSection: {
      marginBottom: 20,
    },
    table: {
      backgroundColor: cores.card,
      borderColor: cores.border,
      borderWidth: 1,
      borderRadius: 15,
      paddingHorizontal: 10,
      paddingVertical: 3,
      marginTop: 13,
    },
    comparisonRow: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: cores.border,
      paddingVertical: 15,
    },
    comparisonColumn: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: 3,
    },
    comparisonLabel: {
      width: 78,
      alignItems: 'center',
      paddingHorizontal: 2,
    },
    comparisonLabelText: {
      fontSize: 11,
      color: cores.secondary,
      fontWeight: '700',
      textAlign: 'center',
    },
    comparisonValue: {
      fontSize: 11,
      color: cores.text,
      fontWeight: '600',
      textAlign: 'center',
    },
    saveButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 9,
      backgroundColor: cores.primary,
      paddingVertical: 16,
      borderRadius: 13,
      marginTop: 5,
      marginBottom: 12,
    },
    disabledButton: {
      backgroundColor: cores.secondary,
      opacity: 0.7,
    },
    saveButtonText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: 'bold',
    },
    historyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: cores.card,
      borderRadius: 15,
      padding: 15,
      marginTop: 5,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: cores.border,
      elevation: 2,
      shadowColor: '#000000',
      shadowOpacity: 0.04,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },
    historyIcon: {
      width: 43,
      height: 43,
      borderRadius: 13,
      backgroundColor: cores.input,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    historyTextContainer: {
      flex: 1,
    },
    historyTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: cores.text,
    },
  });
}