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

export default function ProfileScreen({ navigation }) {
  const [usuario, setUsuario] = useState(null);
  const [totalFavoritos, setTotalFavoritos] = useState(0);
  const [totalComparacoes, setTotalComparacoes] = useState(0);
  const [carregando, setCarregando] = useState(true);

  // Busca os dados reais do usuário e suas estatísticas
  const carregarPerfil = useCallback(async () => {
    try {
      setCarregando(true);

      const usuarioId = await AsyncStorage.getItem(
        'usuarioLogado'
      );

      if (!usuarioId) {
        setUsuario(null);
        setTotalFavoritos(0);
        setTotalComparacoes(0);
        return;
      }

      const db = await SQLite.openDatabaseAsync(
        'garagepedia.db'
      );

      // Busca o usuário conectado
      const dadosUsuario = await db.getFirstAsync(
        `SELECT id, nome, email
         FROM usuarios
         WHERE id = ?`,
        Number(usuarioId)
      );

      setUsuario(dadosUsuario || null);

      // Conta os favoritos do usuário
      const favoritos = await db.getFirstAsync(
        `SELECT COUNT(*) AS total
         FROM favoritos
         WHERE usuario_id = ?`,
        Number(usuarioId)
      );

      setTotalFavoritos(favoritos.total);

      // Conta as comparações registradas
      const comparacoes = await db.getFirstAsync(
        `SELECT COUNT(*) AS total
         FROM comparacoes
         WHERE usuario_id = ?`,
        Number(usuarioId)
      );

      setTotalComparacoes(comparacoes.total);

    } catch (error) {
      console.error(
        'Erro ao carregar perfil:',
        error
      );

      Alert.alert(
        'Erro',
        'Não foi possível carregar os dados do perfil.'
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  // Atualiza os dados sempre que o perfil é aberto
  useFocusEffect(
    useCallback(() => {
      carregarPerfil();
    }, [carregarPerfil])
  );

  // Encerra a sessão do usuário
  function sairDaConta() {
    Alert.alert(
      'Sair da conta',
      'Deseja realmente sair da sua conta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(
                'usuarioLogado'
              );

              navigation.replace('Login');
            } catch (error) {
              console.error(
                'Erro ao sair da conta:',
                error
              );

              Alert.alert(
                'Erro',
                'Não foi possível encerrar a sessão.'
              );
            }
          },
        },
      ]
    );
  }

  // Mostra uma mensagem caso não exista usuário conectado
  if (!carregando && !usuario) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.emptyText}>
          Nenhum usuário conectado.
        </Text>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.replace('Login')}
        >
          <Text style={styles.loginButtonText}>
            Ir para o login
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>
          Meu Perfil
        </Text>
      </View>

      <View style={styles.profile}>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {usuario?.nome
              ? usuario.nome.charAt(0).toUpperCase()
              : '?'}
          </Text>
        </View>

        <Text style={styles.name}>
          {carregando
            ? 'Carregando...'
            : usuario?.nome}
        </Text>

        <Text style={styles.email}>
          {usuario?.email || ''}
        </Text>

      </View>

      <View style={styles.stats}>

        <View style={styles.stat}>
          <Text style={styles.statNumber}>
            {carregando ? '...' : totalFavoritos}
          </Text>

          <Text style={styles.statLabel}>
            Favoritos
          </Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.statNumber}>
            {carregando ? '...' : totalComparacoes}
          </Text>

          <Text style={styles.statLabel}>
            Comparações
          </Text>
        </View>

      </View>

      <View style={styles.menu}>

        <ProfileOption
          title="Editar Perfil"
          onPress={() => navigation.navigate('EditProfile')}
        />

        <ProfileOption
          title="Configurações"
          onPress={() => navigation.navigate('Settings')}
        />

      </View>

      <TouchableOpacity
        style={styles.logout}
        onPress={sairDaConta}
      >
        <Text style={styles.logoutText}>
          Sair da Conta
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

function ProfileOption({ title, onPress }) {
  return (
    <TouchableOpacity
      style={styles.option}
      onPress={onPress}
    >
      <Text style={styles.optionText}>
        {title}
      </Text>

      <Text style={styles.arrow}>
        ›
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
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

  profile: {
    alignItems: 'center',
    marginBottom: 25,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  avatarText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#111111',
  },

  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111111',
  },

  email: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },

  stats: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 18,
    marginBottom: 25,
  },

  stat: {
    flex: 1,
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111111',
  },

  statLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },

  menu: {
    marginBottom: 20,
  },

  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  optionText: {
    fontSize: 16,
    color: '#111111',
  },

  arrow: {
    fontSize: 25,
    color: '#888888',
  },

  logout: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 30,
  },

  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#CC3333',
  },

  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },

  loginButton: {
    marginTop: 20,
    backgroundColor: '#111111',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },

  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

});