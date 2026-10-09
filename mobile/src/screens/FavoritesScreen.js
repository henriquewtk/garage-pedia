
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
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSettings } from '../context/SettingsContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import {
  listarFavoritos,
  removerFavorito,
} from '../database/database';

export default function FavoritesScreen() {
  const navigation = useNavigation();
  const { cores, idioma } = useSettings();
  const insets = useSafeAreaInsets();
  const styles = criarEstilos(cores);

  const t = (pt, en) => idioma === 'en' ? en : pt;

  const [favoritos, setFavoritos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const carregarFavoritos = useCallback(async () => {
    try {
      setCarregando(true);

      const usuarioId = await AsyncStorage.getItem('usuarioLogado');

      if (!usuarioId) {
        setFavoritos([]);
        return;
      }

      const dados = await listarFavoritos(Number(usuarioId));
      setFavoritos(dados);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);

      Alert.alert(
        t('Erro', 'Error'),
        t(
          'Não foi possível carregar os favoritos.',
          'Could not load favorites.'
        )
      );
    } finally {
      setCarregando(false);
    }
  }, [idioma]);

  useFocusEffect(
    useCallback(() => {
      carregarFavoritos();
    }, [carregarFavoritos])
  );

  function excluirFavorito(veiculo) {
    Alert.alert(
      t('Remover favorito', 'Remove favorite'),
      t(
        `Deseja remover ${veiculo.modelo} dos favoritos?`,
        `Do you want to remove ${veiculo.modelo} from favorites?`
      ),
      [
        {
          text: t('Cancelar', 'Cancel'),
          style: 'cancel',
        },
        {
          text: t('Remover', 'Remove'),
          style: 'destructive',
          onPress: async () => {
            try {
              const usuarioId = await AsyncStorage.getItem('usuarioLogado');

              if (!usuarioId) {
                Alert.alert(
                  t('Atenção', 'Attention'),
                  t('Usuário não identificado.', 'User not identified.')
                );
                return;
              }

              await removerFavorito(
                Number(usuarioId),
                veiculo.codigo_fipe
              );

              await carregarFavoritos();
            } catch (error) {
              console.error('Erro ao remover favorito:', error);

              Alert.alert(
                t('Erro', 'Error'),
                t(
                  'Não foi possível remover o veículo.',
                  'Could not remove the vehicle.'
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
      return t('Valor indisponível', 'Price unavailable');
    }

    if (typeof valor === 'number') {
      return valor.toLocaleString(
        idioma === 'en' ? 'en-US' : 'pt-BR',
        {
          style: 'currency',
          currency: 'BRL',
        }
      );
    }

    return valor;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: Math.max(insets.top, 16) + 16,
          paddingBottom: Math.max(insets.bottom, 20) + 24,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.title}>
            {t('Meus Favoritos', 'My Favorites')}
          </Text>
        </View>
      </View>

      {!carregando && favoritos.length > 0 && (
        <View style={styles.counterContainer}>
          <Text style={styles.counter}>
            {favoritos.length}{' '}
            {favoritos.length === 1
              ? t('veículo salvo', 'vehicle saved')
              : t('veículos salvos', 'vehicles saved')}
          </Text>
        </View>
      )}

      {carregando ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={cores.primary} />

          <Text style={styles.message}>
            {t('Carregando favoritos...', 'Loading favorites...')}
          </Text>
        </View>
      ) : favoritos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="heart-outline"
              size={42}
              color={cores.primary}
            />
          </View>

          <Text style={styles.emptyTitle}>
            {t('Nenhum favorito ainda', 'No favorites yet')}
          </Text>

          <Text style={styles.emptyText}>
            {t(
              'Pesquise um veículo e adicione-o aos favoritos para encontrá-lo aqui.',
              'Search for a vehicle and add it to your favorites to find it here.'
            )}
          </Text>
        </View>
      ) : (
        favoritos.map((veiculo) => (
          <TouchableOpacity
            key={veiculo.id ?? veiculo.codigo_fipe}
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => {
              navigation.navigate('VehicleDetails', {
                veiculo: {
                  Marca: veiculo.marca,
                  Modelo: veiculo.modelo,
                  AnoModelo: veiculo.ano,
                  Combustivel: veiculo.combustivel,
                  Valor: veiculo.valor,
                  CodigoFipe: veiculo.codigo_fipe,
                  MesReferencia: veiculo.mes_referencia,
                },
              });
            }}
            >

            <View style={styles.cardHeader}>
              <View style={styles.vehicleIcon}>
                <Ionicons
                  name="car-sport-outline"
                  size={27}
                  color={cores.primary}
                />
              </View>

              <View style={styles.vehicleInfo}>
                <Text style={styles.brand}>
                  {veiculo.marca}
                </Text>

                <Text style={styles.model}>
                  {veiculo.modelo}
                </Text>
              </View>

              <Ionicons
                name="heart"
                size={23}
                color={cores.primary}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <Ionicons
                  name="calendar-outline"
                  size={17}
                  color={cores.secondary}
                />

                <Text style={styles.details}>
                  {veiculo.ano ||
                    t('Ano não informado', 'Year not provided')}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Ionicons
                  name="speedometer-outline"
                  size={17}
                  color={cores.secondary}
                />

                <Text style={styles.details}>
                  {veiculo.combustivel ||
                    t('Combustível não informado', 'Fuel not provided')}
                </Text>
              </View>
            </View>

            <Text style={styles.priceLabel}>
              {t('Valor de referência', 'Reference price')}
            </Text>

            <Text style={styles.price}>
              {formatarValor(veiculo.valor)}
            </Text>

            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => excluirFavorito(veiculo)}
              activeOpacity={0.8}
            >
              <Ionicons
                name="heart-dislike-outline"
                size={18}
                color={cores.primary}
              />

              <Text style={styles.removeButtonText}>
                {t('Remover dos favoritos', 'Remove from favorites')}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))
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
      paddingBottom: 30,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 25,
      gap: 12,
    },

    headerInfo: {
      flex: 1,
    },

    title: {
      fontSize: 27,
      fontWeight: 'bold',
      color: cores.primary,
    },

    subtitle: {
      fontSize: 14,
      color: cores.secondary,
      marginTop: 6,
    },

    headerIcon: {
      width: 48,
      height: 48,
      borderRadius: 15,
      backgroundColor: cores.input,
      alignItems: 'center',
      justifyContent: 'center',
    },

    counterContainer: {
      marginBottom: 15,
    },

    counter: {
      fontSize: 14,
      color: cores.secondary,
      fontWeight: '600',
    },

    loadingContainer: {
      alignItems: 'center',
      marginTop: 65,
    },

    message: {
      fontSize: 14,
      color: cores.secondary,
      marginTop: 12,
    },

    emptyContainer: {
      alignItems: 'center',
      backgroundColor: cores.card,
      borderRadius: 18,
      paddingHorizontal: 25,
      paddingVertical: 40,
      marginTop: 15,
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
      marginBottom: 10,
    },

    emptyText: {
      fontSize: 14,
      color: cores.secondary,
      textAlign: 'center',
      lineHeight: 21,
    },

    card: {
      backgroundColor: cores.card,
      borderRadius: 18,
      padding: 18,
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
    },

    vehicleIcon: {
      width: 48,
      height: 48,
      borderRadius: 14,
      backgroundColor: cores.input,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },

    vehicleInfo: {
      flex: 1,
    },

    brand: {
      fontSize: 13,
      fontWeight: '600',
      color: cores.secondary,
      marginBottom: 3,
    },

    model: {
      fontSize: 17,
      fontWeight: 'bold',
      color: cores.text,
    },

    divider: {
      height: 1,
      backgroundColor: cores.border,
      marginVertical: 16,
    },

    detailsContainer: {
      gap: 11,
      marginBottom: 16,
    },

    detailItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },

    details: {
      flex: 1,
      fontSize: 13,
      color: cores.secondary,
    },

    priceLabel: {
      fontSize: 12,
      color: cores.secondary,
      marginBottom: 4,
    },

    price: {
      fontSize: 22,
      fontWeight: 'bold',
      color: cores.primary,
      marginBottom: 17,
    },

    removeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderWidth: 1,
      borderColor: cores.border,
      backgroundColor: cores.input,
      borderRadius: 11,
      paddingVertical: 12,
    },

    removeButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: cores.primary,
    },
  });
}