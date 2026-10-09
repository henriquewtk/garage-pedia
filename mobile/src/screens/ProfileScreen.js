
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSettings } from '../context/SettingsContext';

export default function ProfileScreen({ navigation }) {
  const { cores, idioma } = useSettings();
  const insets = useSafeAreaInsets();
  const styles = criarEstilos(cores);

  const t = (pt, en) => idioma === 'en' ? en : pt;

  const [usuario, setUsuario] = useState(null);
  const [totalFavoritos, setTotalFavoritos] = useState(0);
  const [totalComparacoes, setTotalComparacoes] = useState(0);
  const [carregando, setCarregando] = useState(true);

  const carregarPerfil = useCallback(async () => {
    try {
      setCarregando(true);

      const usuarioId = await AsyncStorage.getItem('usuarioLogado');

      if (!usuarioId) {
        setUsuario(null);
        setTotalFavoritos(0);
        setTotalComparacoes(0);
        return;
      }

      const db = await SQLite.openDatabaseAsync('garagepedia.db');

      const dadosUsuario = await db.getFirstAsync(
        `SELECT id, nome, email
         FROM usuarios
         WHERE id = ?`,
        Number(usuarioId)
      );

      setUsuario(dadosUsuario || null);

      const favoritos = await db.getFirstAsync(
        `SELECT COUNT(*) AS total
         FROM favoritos
         WHERE usuario_id = ?`,
        Number(usuarioId)
      );

      setTotalFavoritos(favoritos?.total ?? 0);

      const comparacoes = await db.getFirstAsync(
        `SELECT COUNT(*) AS total
         FROM comparacoes
         WHERE usuario_id = ?`,
        Number(usuarioId)
      );

      setTotalComparacoes(comparacoes?.total ?? 0);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);

      Alert.alert(
        t('Erro', 'Error'),
        t(
          'Não foi possível carregar os dados do perfil.',
          'Could not load profile information.'
        )
      );
    } finally {
      setCarregando(false);
    }
  }, [idioma]);

  useFocusEffect(
    useCallback(() => {
      carregarPerfil();
    }, [carregarPerfil])
  );

  function sairDaConta() {
    Alert.alert(
      t('Sair da conta', 'Log out'),
      t(
        'Deseja realmente sair da sua conta?',
        'Are you sure you want to log out?'
      ),
      [
        {
          text: t('Cancelar', 'Cancel'),
          style: 'cancel',
        },
        {
          text: t('Sair', 'Log out'),
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('usuarioLogado');
              navigation.replace('Login');
            } catch (error) {
              console.error('Erro ao sair da conta:', error);

              Alert.alert(
                t('Erro', 'Error'),
                t(
                  'Não foi possível encerrar a sessão.',
                  'Could not end the session.'
                )
              );
            }
          },
        },
      ]
    );
  }

  if (carregando && !usuario) {
    return (
      <View
        style={[
          styles.loadingContainer,
          {
            paddingTop: Math.max(insets.top, 16),
            paddingBottom: Math.max(insets.bottom, 20),
          },
        ]}
      >
        <ActivityIndicator size="large" color={cores.primary} />

        <Text style={styles.loadingText}>
          {t('Carregando perfil...', 'Loading profile...')}
        </Text>
      </View>
    );
  }

  if (!usuario) {
    return (
      <View
        style={[
          styles.loadingContainer,
          {
            paddingTop: Math.max(insets.top, 16),
            paddingBottom: Math.max(insets.bottom, 20),
          },
        ]}
      >
        <View style={styles.emptyIcon}>
          <Ionicons
            name="person-outline"
            size={35}
            color={cores.primary}
          />
        </View>

        <Text style={styles.emptyTitle}>
          {t('Nenhum usuário conectado', 'No user logged in')}
        </Text>

        <Text style={styles.emptyText}>
          {t(
            'Entre na sua conta para visualizar seu perfil.',
            'Log in to view your profile.'
          )}
        </Text>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.replace('Login')}
          activeOpacity={0.8}
        >
          <Text style={styles.loginButtonText}>
            {t('Ir para o login', 'Go to login')}
          </Text>
        </TouchableOpacity>
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
        <Text style={styles.title}>
          {t('Meu Perfil', 'My Profile')}
        </Text>

        <Text style={styles.subtitle}>
          {t(
            'Gerencie sua conta e acompanhe sua atividade.',
            'Manage your account and track your activity.'
          )}
        </Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {usuario.nome
              ? usuario.nome.charAt(0).toUpperCase()
              : '?'}
          </Text>
        </View>

        <Text style={styles.name}>{usuario.nome}</Text>

        <View style={styles.emailContainer}>
          <Ionicons
            name="mail-outline"
            size={16}
            color={cores.secondary}
          />

          <Text style={styles.email}>{usuario.email}</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {t('Minha atividade', 'My activity')}
        </Text>
      </View>

      <View style={styles.stats}>
        <TouchableOpacity
          style={styles.statCard}
          onPress={() => navigation.navigate('Favoritos')}
          activeOpacity={0.8}
        >
          <View style={styles.statIcon}>
            <Ionicons
              name="heart-outline"
              size={23}
              color={cores.primary}
            />
          </View>

          <Text style={styles.statNumber}>{totalFavoritos}</Text>

          <Text style={styles.statLabel}>
            {t('Favoritos', 'Favorites')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statCard}
          onPress={() => navigation.navigate('Comparar')}
          activeOpacity={0.8}
        >
          <View style={styles.statIcon}>
            <Ionicons
              name="git-compare-outline"
              size={23}
              color={cores.primary}
            />
          </View>

          <Text style={styles.statNumber}>{totalComparacoes}</Text>

          <Text style={styles.statLabel}>
            {t('Comparações', 'Comparisons')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {t('Conta e aplicativo', 'Account and app')}
        </Text>
      </View>

      <View style={styles.menu}>
        <ProfileOption
          cores={cores}
          styles={styles}
          icon="person-outline"
          title={t('Editar perfil', 'Edit profile')}
          subtitle={t(
            'Atualize seus dados pessoais',
            'Update your personal information'
          )}
          onPress={() => navigation.navigate('EditProfile')}
        />

        <View style={styles.divider} />

        <ProfileOption
          cores={cores}
          styles={styles}
          icon="settings-outline"
          title={t('Configurações', 'Settings')}
          subtitle={t(
            'Informações e opções do aplicativo',
            'App information and preferences'
          )}
          onPress={() => navigation.navigate('Settings')}
        />
      </View>

      <TouchableOpacity
        style={styles.logout}
        onPress={sairDaConta}
        activeOpacity={0.8}
      >
        <Ionicons
          name="log-out-outline"
          size={21}
          color="#C34444"
        />

        <Text style={styles.logoutText}>
          {t('Sair da conta', 'Log out')}
        </Text>
      </TouchableOpacity>

      <Text style={styles.version}>
        GaragePedia · {t('Versão', 'Version')} 1.0.0
      </Text>
    </ScrollView>
  );
}

function ProfileOption({ cores, styles, icon, title, subtitle, onPress }) {
  return (
    <TouchableOpacity
      style={styles.option}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.optionIcon}>
        <Ionicons
          name={icon}
          size={22}
          color={cores.primary}
        />
      </View>

      <View style={styles.optionInfo}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionSubtitle}>{subtitle}</Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color={cores.secondary}
      />
    </TouchableOpacity>
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

    loadingContainer: {
      flex: 1,
      backgroundColor: cores.background,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 25,
    },

    loadingText: {
      color: cores.secondary,
      fontSize: 14,
      marginTop: 12,
    },

    header: {
      marginBottom: 22,
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
      lineHeight: 20,
    },

    profileCard: {
      backgroundColor: cores.card,
      borderRadius: 18,
      padding: 22,
      alignItems: 'center',
      marginBottom: 25,
      elevation: 2,
      shadowColor: '#000000',
      shadowOpacity: 0.04,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 2 },
    },

    avatar: {
      width: 82,
      height: 82,
      borderRadius: 41,
      backgroundColor: cores.input,
      borderWidth: 2,
      borderColor: cores.border,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 13,
    },

    avatarText: {
      fontSize: 32,
      fontWeight: 'bold',
      color: cores.primary,
    },

    name: {
      fontSize: 21,
      fontWeight: 'bold',
      color: cores.text,
      textAlign: 'center',
    },

    emailContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      marginTop: 7,
    },

    email: {
      fontSize: 13,
      color: cores.secondary,
      flexShrink: 1,
    },

    sectionHeader: {
      marginBottom: 13,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: cores.primary,
    },

    stats: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 25,
    },

    statCard: {
      flex: 1,
      backgroundColor: cores.card,
      borderRadius: 15,
      paddingVertical: 18,
      paddingHorizontal: 10,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: cores.border,
    },

    statIcon: {
      width: 45,
      height: 45,
      borderRadius: 14,
      backgroundColor: cores.input,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    },

    statNumber: {
      fontSize: 23,
      fontWeight: 'bold',
      color: cores.primary,
    },

    statLabel: {
      fontSize: 12,
      color: cores.secondary,
      marginTop: 4,
    },

    menu: {
      backgroundColor: cores.card,
      borderRadius: 15,
      paddingHorizontal: 14,
      marginBottom: 18,
      borderWidth: 1,
      borderColor: cores.border,
    },

    option: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      gap: 12,
    },

    optionIcon: {
      width: 43,
      height: 43,
      borderRadius: 13,
      backgroundColor: cores.input,
      alignItems: 'center',
      justifyContent: 'center',
    },

    optionInfo: {
      flex: 1,
    },

    optionTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: cores.text,
    },

    optionSubtitle: {
      fontSize: 12,
      color: cores.secondary,
      marginTop: 4,
    },

    divider: {
      height: 1,
      backgroundColor: cores.border,
      marginLeft: 55,
    },

    logout: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 9,
      backgroundColor: cores.card,
      borderWidth: 1,
      borderColor: '#C3444440',
      borderRadius: 13,
      paddingVertical: 15,
      marginTop: 2,
    },

    logoutText: {
      fontSize: 14,
      fontWeight: '700',
      color: '#C34444',
    },

    version: {
      textAlign: 'center',
      fontSize: 12,
      color: cores.secondary,
      marginTop: 20,
    },

    emptyIcon: {
      width: 65,
      height: 65,
      borderRadius: 22,
      backgroundColor: cores.input,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 15,
    },

    emptyTitle: {
      fontSize: 17,
      fontWeight: 'bold',
      color: cores.primary,
      textAlign: 'center',
    },

    emptyText: {
      fontSize: 14,
      color: cores.secondary,
      textAlign: 'center',
      marginTop: 8,
      lineHeight: 21,
    },

    loginButton: {
      marginTop: 20,
      backgroundColor: cores.primary,
      paddingVertical: 13,
      paddingHorizontal: 25,
      borderRadius: 11,
    },

    loginButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '700',
    },
  });
}