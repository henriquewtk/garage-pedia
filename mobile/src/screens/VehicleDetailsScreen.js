
import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSettings } from '../context/SettingsContext';

import {
  adicionarFavorito,
  removerFavorito,
  listarFavoritos,
} from '../database/database';

export default function VehicleDetailsScreen({ route }) {
  const { veiculo } = route.params;

  const { cores, idioma } = useSettings();
  const insets = useSafeAreaInsets();
  const styles = criarEstilos(cores);

  const t = (pt, en) => idioma === 'en' ? en : pt;

  const [abaSelecionada, setAbaSelecionada] = useState('sobre');
  const [favoritado, setFavoritado] = useState(false);
  const [carregandoFavorito, setCarregandoFavorito] = useState(true);
  const [alterandoFavorito, setAlterandoFavorito] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function verificarFavorito() {
      try {
        const usuarioId = await AsyncStorage.getItem('usuarioLogado');

        if (!usuarioId) {
          if (ativo) setFavoritado(false);
          return;
        }

        const favoritos = await listarFavoritos(Number(usuarioId));

        if (ativo) {
          setFavoritado(
            favoritos.some(
              (item) => item.codigo_fipe === veiculo.CodigoFipe
            )
          );
        }
      } catch (error) {
        console.error('Erro ao verificar favorito:', error);
        Alert.alert(
          t('Erro', 'Error'),
          t(
            'Não foi possível consultar os favoritos.',
            'Could not check favorites.'
          )
        );
      } finally {
        if (ativo) setCarregandoFavorito(false);
      }
    }

    verificarFavorito();

    return () => {
      ativo = false;
    };
  }, [veiculo.CodigoFipe, idioma]);

  async function alternarFavorito() {
    if (alterandoFavorito || carregandoFavorito) return;

    setAlterandoFavorito(true);

    try {
      const usuarioId = await AsyncStorage.getItem('usuarioLogado');

      if (!usuarioId) {
        Alert.alert(
          t('Atenção', 'Attention'),
          t(
            'Faça login para salvar seus favoritos.',
            'Log in to save your favorites.'
          )
        );
        return;
      }

      if (favoritado) {
        await removerFavorito(Number(usuarioId), veiculo.CodigoFipe);
        setFavoritado(false);

        Alert.alert(
          t('Favorito removido', 'Favorite removed'),
          t(
            'Veículo removido dos favoritos.',
            'Vehicle removed from favorites.'
          )
        );
      } else {
        await adicionarFavorito(Number(usuarioId), veiculo);
        setFavoritado(true);

        Alert.alert(
          t('Favorito adicionado', 'Favorite added'),
          t(
            'Veículo salvo nos favoritos.',
            'Vehicle saved to favorites.'
          )
        );
      }
    } catch (error) {
      console.error('Erro ao alterar favorito:', error);

      Alert.alert(
        t('Erro', 'Error'),
        t(
          'Não foi possível alterar o favorito.',
          'Could not update the favorite.'
        )
      );
    } finally {
      setAlterandoFavorito(false);
    }
  }

  function renderEspecificacao(rotulo, valor, icone) {
    return (
      <View style={styles.spec} key={rotulo}>
        <View style={styles.specInfo}>
          <View style={styles.specIcon}>
            <Ionicons name={icone} size={19} color={cores.primary} />
          </View>

          <Text style={styles.specLabel}>{rotulo}</Text>
        </View>

        <Text style={styles.specValue}>
          {valor || t('Não informado', 'Not provided')}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.scrollContent,
        {
          paddingTop: Math.max(insets.top, 16) + 12,
          paddingBottom: Math.max(insets.bottom, 20) + 24,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons
            name="car-sport"
            size={34}
            color={cores.primary}
          />
        </View>

        <Text style={styles.brand}>{veiculo.Marca}</Text>
        <Text style={styles.title}>{veiculo.Modelo}</Text>
      </View>

      <View style={styles.priceCard}>
        <Text style={styles.priceLabel}>
          {t('Valor de referência FIPE', 'FIPE reference price')}
        </Text>

        <Text style={styles.price}>{veiculo.Valor}</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.favoriteButton,
          favoritado && styles.favoriteButtonActive,
          (carregandoFavorito || alterandoFavorito) &&
            styles.favoriteButtonDisabled,
        ]}
        onPress={alternarFavorito}
        disabled={carregandoFavorito || alterandoFavorito}
        activeOpacity={0.8}
      >
        {carregandoFavorito || alterandoFavorito ? (
          <ActivityIndicator
            color={favoritado ? '#FFFFFF' : cores.primary}
          />
        ) : (
          <>
            <Ionicons
              name={favoritado ? 'heart' : 'heart-outline'}
              size={21}
              color={favoritado ? '#FFFFFF' : cores.primary}
            />

            <Text
              style={[
                styles.favoriteText,
                favoritado && styles.favoriteTextActive,
              ]}
            >
              {favoritado
                ? t('Remover dos favoritos', 'Remove from favorites')
                : t('Adicionar aos favoritos', 'Add to favorites')}
            </Text>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.mainInfo}>
        <View style={styles.info}>
          <View style={styles.infoIcon}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color={cores.primary}
            />
          </View>

          <Text style={styles.label}>{t('Ano-modelo', 'Model year')}</Text>
          <Text style={styles.value}>
            {veiculo.AnoModelo || t('Não informado', 'Not provided')}
          </Text>
        </View>

        <View style={styles.infoDivider} />

        <View style={styles.info}>
          <View style={styles.infoIcon}>
            <Ionicons
              name="water-outline"
              size={20}
              color={cores.primary}
            />
          </View>

          <Text style={styles.label}>{t('Combustível', 'Fuel')}</Text>
          <Text style={styles.value}>
            {veiculo.Combustivel || t('Não informado', 'Not provided')}
          </Text>
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tab,
            abaSelecionada === 'sobre' && styles.tabAtiva,
          ]}
          onPress={() => setAbaSelecionada('sobre')}
        >
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={
              abaSelecionada === 'sobre'
                ? cores.primary
                : cores.secondary
            }
          />

          <Text
            style={[
              styles.tabText,
              abaSelecionada === 'sobre' && styles.tabTextAtiva,
            ]}
          >
            {t('Sobre', 'About')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            abaSelecionada === 'especificacoes' && styles.tabAtiva,
          ]}
          onPress={() => setAbaSelecionada('especificacoes')}
        >
          <Ionicons
            name="list-outline"
            size={18}
            color={
              abaSelecionada === 'especificacoes'
                ? cores.primary
                : cores.secondary
            }
          />

          <Text
            style={[
              styles.tabText,
              abaSelecionada === 'especificacoes' && styles.tabTextAtiva,
            ]}
          >
            {t('Especificações', 'Specifications')}
          </Text>
        </TouchableOpacity>
      </View>

      {abaSelecionada === 'sobre' && (
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>
            {t('Sobre o veículo', 'About the vehicle')}
          </Text>

          <Text style={styles.description}>
            {t(
              'Confira as informações de referência do veículo selecionado.',
              'Check the reference information for the selected vehicle.'
            )}
          </Text>

          <View style={styles.aboutCard}>
            <Ionicons
              name="car-outline"
              size={24}
              color={cores.primary}
            />

            <View style={styles.aboutTextContainer}>
              <Text style={styles.aboutTitle}>
                {veiculo.Marca} {veiculo.Modelo}
              </Text>

              <Text style={styles.aboutDescription}>
                {t('Modelo ', 'Model ')}
                {veiculo.AnoModelo}
                {t(', com valor de referência de ', ', with a reference price of ')}
                {veiculo.Valor}
                {t(
                  ', conforme a consulta da tabela FIPE.',
                  ', according to the FIPE table.'
                )}
              </Text>
            </View>
          </View>

          <View style={styles.referenceCard}>
            <Ionicons
              name="calendar-clear-outline"
              size={20}
              color={cores.primary}
            />

            <View style={styles.referenceTextContainer}>
              <Text style={styles.referenceLabel}>
                {t('Mês de referência', 'Reference month')}
              </Text>

              <Text style={styles.referenceValue}>
                {veiculo.MesReferencia ||
                  t('Não informado', 'Not provided')}
              </Text>
            </View>
          </View>
        </View>
      )}

      {abaSelecionada === 'especificacoes' && (
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>
            {t('Especificações', 'Specifications')}
          </Text>

          <View style={styles.specCard}>
            {renderEspecificacao(
              t('Marca', 'Brand'),
              veiculo.Marca,
              'business-outline'
            )}

            {renderEspecificacao(
              t('Modelo', 'Model'),
              veiculo.Modelo,
              'car-outline'
            )}

            {renderEspecificacao(
              t('Ano-modelo', 'Model year'),
              veiculo.AnoModelo,
              'calendar-outline'
            )}

            {renderEspecificacao(
              t('Combustível', 'Fuel'),
              veiculo.Combustivel,
              'water-outline'
            )}

            {renderEspecificacao(
              t('Código FIPE', 'FIPE code'),
              veiculo.CodigoFipe,
              'barcode-outline'
            )}

            {renderEspecificacao(
              t('Mês de referência', 'Reference month'),
              veiculo.MesReferencia,
              'calendar-clear-outline'
            )}
          </View>
        </View>
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

    scrollContent: {
      paddingHorizontal: 20,
    },

    header: {
      alignItems: 'center',
      marginBottom: 22,
    },

    headerIcon: {
      width: 70,
      height: 70,
      borderRadius: 22,
      backgroundColor: cores.input,
      borderWidth: 1,
      borderColor: cores.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 15,
    },

    brand: {
      fontSize: 15,
      color: cores.secondary,
      fontWeight: '600',
    },

    title: {
      fontSize: 25,
      fontWeight: 'bold',
      color: cores.primary,
      textAlign: 'center',
      marginTop: 5,
    },

    priceCard: {
      backgroundColor: cores.card,
      borderRadius: 18,
      padding: 20,
      marginBottom: 14,
      elevation: 2,
      shadowColor: '#000000',
      shadowOpacity: 0.05,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 2 },
    },

    priceLabel: {
      fontSize: 14,
      color: cores.secondary,
    },

    price: {
      fontSize: 27,
      fontWeight: 'bold',
      color: cores.primary,
      marginTop: 7,
    },

    priceFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
      gap: 6,
    },

    priceFooterText: {
      fontSize: 12,
      color: cores.secondary,
    },

    favoriteButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 9,
      backgroundColor: cores.card,
      borderWidth: 1,
      borderColor: cores.border,
      borderRadius: 14,
      paddingVertical: 14,
      marginBottom: 18,
    },

    favoriteButtonActive: {
      backgroundColor: cores.primary,
      borderColor: cores.primary,
    },

    favoriteButtonDisabled: {
      opacity: 0.7,
    },

    favoriteText: {
      fontSize: 14,
      fontWeight: '700',
      color: cores.primary,
    },

    favoriteTextActive: {
      color: '#FFFFFF',
    },

    mainInfo: {
      flexDirection: 'row',
      backgroundColor: cores.card,
      borderRadius: 18,
      padding: 18,
      marginBottom: 24,
      elevation: 1,
      shadowColor: '#000000',
      shadowOpacity: 0.04,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },

    info: {
      flex: 1,
      alignItems: 'center',
    },

    infoIcon: {
      width: 40,
      height: 40,
      borderRadius: 13,
      backgroundColor: cores.input,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 9,
    },

    infoDivider: {
      width: 1,
      backgroundColor: cores.border,
      marginHorizontal: 12,
    },

    label: {
      fontSize: 12,
      color: cores.secondary,
      textAlign: 'center',
    },

    value: {
      fontSize: 15,
      fontWeight: '700',
      color: cores.text,
      marginTop: 5,
      textAlign: 'center',
    },

    tabs: {
      flexDirection: 'row',
      backgroundColor: cores.input,
      borderRadius: 13,
      padding: 4,
      marginBottom: 20,
    },

    tab: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      paddingVertical: 12,
      paddingHorizontal: 4,
      borderRadius: 10,
    },

    tabAtiva: {
      backgroundColor: cores.card,
      elevation: 2,
    },

    tabText: {
      fontSize: 13,
      color: cores.secondary,
      fontWeight: '500',
    },

    tabTextAtiva: {
      color: cores.primary,
      fontWeight: '700',
    },

    content: {
      marginBottom: 20,
    },

    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: cores.primary,
      marginBottom: 8,
    },

    description: {
      fontSize: 14,
      color: cores.secondary,
      lineHeight: 21,
      marginBottom: 16,
    },

    aboutCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: cores.card,
      borderRadius: 16,
      padding: 17,
      gap: 13,
      marginBottom: 13,
    },

    aboutTextContainer: {
      flex: 1,
    },

    aboutTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: cores.text,
      marginBottom: 7,
    },

    aboutDescription: {
      fontSize: 13,
      color: cores.secondary,
      lineHeight: 20,
    },

    referenceCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: cores.card,
      borderRadius: 15,
      padding: 17,
      gap: 12,
    },

    referenceTextContainer: {
      flex: 1,
    },

    referenceLabel: {
      fontSize: 12,
      color: cores.secondary,
    },

    referenceValue: {
      fontSize: 14,
      fontWeight: '700',
      color: cores.text,
      marginTop: 4,
    },

    specCard: {
      backgroundColor: cores.card,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 4,
    },

    spec: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: cores.border,
      gap: 12,
    },

    specInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: 9,
    },

    specIcon: {
      width: 32,
      height: 32,
      borderRadius: 10,
      backgroundColor: cores.input,
      alignItems: 'center',
      justifyContent: 'center',
    },

    specLabel: {
      fontSize: 13,
      color: cores.secondary,
      flexShrink: 1,
    },

    specValue: {
      fontSize: 13,
      fontWeight: '600',
      color: cores.text,
      maxWidth: '53%',
      textAlign: 'right',
    },
  });
}