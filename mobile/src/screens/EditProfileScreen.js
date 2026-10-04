import React, {
  useState,
  useEffect,
} from 'react';

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import * as SQLite from 'expo-sqlite';

export default function EditProfileScreen({ navigation }) {
  const [usuarioId, setUsuarioId] = useState(null);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  // Carrega os dados atuais do usuário
  useEffect(() => {
    async function carregarUsuario() {
      try {
        const id = await AsyncStorage.getItem(
          'usuarioLogado'
        );

        if (!id) {
          Alert.alert(
            'Atenção',
            'Faça login para editar seu perfil.'
          );

          navigation.replace('Login');
          return;
        }

        const db = await SQLite.openDatabaseAsync(
          'garagepedia.db'
        );

        const usuario = await db.getFirstAsync(
          `SELECT id, nome, email, telefone
           FROM usuarios
           WHERE id = ?`,
          Number(id)
        );

        if (!usuario) {
          Alert.alert(
            'Erro',
            'Não foi possível encontrar seu usuário.'
          );

          navigation.goBack();
          return;
        }

        setUsuarioId(usuario.id);
        setNome(usuario.nome || '');
        setEmail(usuario.email || '');
        setTelefone(usuario.telefone || '');

      } catch (error) {
        console.error(
          'Erro ao carregar usuário:',
          error
        );

        Alert.alert(
          'Erro',
          'Não foi possível carregar seus dados.'
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarUsuario();
  }, [navigation]);

  // Salva as alterações no SQLite
  async function salvarAlteracoes() {
    if (!nome.trim() || !email.trim()) {
      Alert.alert(
        'Atenção',
        'Preencha o nome e o e-mail.'
      );
      return;
    }

    const emailNormalizado = email.trim().toLowerCase();

    const formatoEmail =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoEmail.test(emailNormalizado)) {
      Alert.alert(
        'E-mail inválido',
        'Informe um endereço de e-mail válido.'
      );
      return;
    }

    if (!usuarioId) {
      Alert.alert(
        'Erro',
        'Usuário não identificado.'
      );
      return;
    }

    try {
      setSalvando(true);

      const db = await SQLite.openDatabaseAsync(
        'garagepedia.db'
      );

      await db.runAsync(
        `UPDATE usuarios
         SET nome = ?,
             email = ?,
             telefone = ?
         WHERE id = ?`,
        nome.trim(),
        emailNormalizado,
        telefone.trim(),
        usuarioId
      );

      Alert.alert(
        'Perfil atualizado!',
        'Seus dados foram salvos com sucesso.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );

    } catch (error) {
      console.error(
        'Erro ao atualizar perfil:',
        error
      );

      if (
        String(error.message).toLowerCase().includes('unique')
      ) {
        Alert.alert(
          'E-mail já cadastrado',
          'Esse e-mail pertence a outra conta. Utilize outro endereço.'
        );
      } else {
        Alert.alert(
          'Erro',
          'Não foi possível atualizar seus dados.'
        );
      }
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>
          Carregando seus dados...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>
            ‹ Voltar
          </Text>
        </TouchableOpacity>

        <Text style={styles.title}>
          Editar Perfil
        </Text>

        <Text style={styles.subtitle}>
          Atualize suas informações pessoais.
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>
          Nome completo
        </Text>

        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Digite seu nome"
          placeholderTextColor="#999999"
          autoCapitalize="words"
          editable={!salvando}
        />

        <Text style={styles.label}>
          E-mail
        </Text>

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Digite seu e-mail"
          placeholderTextColor="#999999"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!salvando}
        />

        <Text style={styles.label}>
          Telefone
        </Text>

        <TextInput
          style={styles.input}
          value={telefone}
          onChangeText={setTelefone}
          placeholder="Digite seu telefone"
          placeholderTextColor="#999999"
          keyboardType="phone-pad"
          editable={!salvando}
        />

        <TouchableOpacity
          style={[
            styles.saveButton,
            salvando && styles.disabledButton,
          ]}
          onPress={salvarAlteracoes}
          disabled={salvando}
        >
          <Text style={styles.saveButtonText}>
            {salvando
              ? 'Salvando...'
              : 'Salvar alterações'}
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

  loading: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    fontSize: 15,
    color: '#666666',
  },

  header: {
    marginTop: 45,
    marginBottom: 30,
  },

  backText: {
    fontSize: 16,
    color: '#444444',
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111111',
  },

  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
  },

  form: {
    marginBottom: 30,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 8,
    marginTop: 18,
  },

  input: {
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: '#111111',
  },

  saveButton: {
    backgroundColor: '#111111',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 30,
  },

  disabledButton: {
    opacity: 0.6,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});