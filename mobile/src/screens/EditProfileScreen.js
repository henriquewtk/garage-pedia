import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';

const AZUL = '#174A7E';
const FUNDO = '#F2F5F9';
const CINZA = '#667085';

export default function EditProfileScreen({ navigation }) {
  const [usuarioId, setUsuarioId] = useState(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function carregarUsuario() {
      try {
        const id = await AsyncStorage.getItem('usuarioLogado');

        if (!id) {
          Alert.alert(
            'Atenção',
            'Faça login para editar seu perfil.'
          );
          navigation.replace('Login');
          return;
        }

        const db = await SQLite.openDatabaseAsync('garagepedia.db');

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
        console.error('Erro ao carregar usuário:', error);
        Alert.alert('Erro', 'Não foi possível carregar seus dados.');
      } finally {
        setCarregando(false);
      }
    }

    carregarUsuario();
  }, [navigation]);

  async function salvarAlteracoes() {
    if (!nome.trim() || !email.trim()) {
      Alert.alert('Atenção', 'Preencha o nome e o e-mail.');
      return;
    }

    const emailNormalizado = email.trim().toLowerCase();
    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoEmail.test(emailNormalizado)) {
      Alert.alert(
        'E-mail inválido',
        'Informe um endereço de e-mail válido.'
      );
      return;
    }

    if (!usuarioId) {
      Alert.alert('Erro', 'Usuário não identificado.');
      return;
    }

    try {
      setSalvando(true);

      const db = await SQLite.openDatabaseAsync('garagepedia.db');

      await db.runAsync(
        `UPDATE usuarios
         SET nome = ?, email = ?, telefone = ?
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
      console.error('Erro ao atualizar perfil:', error);

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
        <ActivityIndicator size="large" color={AZUL} />
        <Text style={styles.loadingText}>
          Carregando seus dados...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={21} color={AZUL} />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="person-outline" size={30} color={AZUL} />
          </View>

          <Text style={styles.title}>Editar perfil</Text>
          <Text style={styles.subtitle}>
            Mantenha suas informações pessoais atualizadas.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>
            Informações pessoais
          </Text>

          <Text style={styles.label}>Nome completo</Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={20}
              color={CINZA}
            />
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Digite seu nome"
              placeholderTextColor="#98A2B3"
              autoCapitalize="words"
              editable={!salvando}
              returnKeyType="next"
            />
          </View>

          <Text style={styles.label}>E-mail</Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={CINZA}
            />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Digite seu e-mail"
              placeholderTextColor="#98A2B3"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!salvando}
              returnKeyType="next"
            />
          </View>

          <Text style={styles.label}>Telefone</Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name="call-outline"
              size={20}
              color={CINZA}
            />
            <TextInput
              style={styles.input}
              value={telefone}
              onChangeText={setTelefone}
              placeholder="Digite seu telefone"
              placeholderTextColor="#98A2B3"
              keyboardType="phone-pad"
              editable={!salvando}
              returnKeyType="done"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.saveButton,
              salvando && styles.disabledButton,
            ]}
            onPress={salvarAlteracoes}
            disabled={salvando}
            activeOpacity={0.8}
          >
            {salvando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={21}
                  color="#FFFFFF"
                />
                <Text style={styles.saveButtonText}>
                  Salvar alterações
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: FUNDO,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  loading: {
    flex: 1,
    backgroundColor: FUNDO,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: CINZA,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 25,
    paddingVertical: 8,
    paddingRight: 12,
  },
  backText: {
    color: AZUL,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 28,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E1EBF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: AZUL,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: CINZA,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 8,
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E7ECF2',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: AZUL,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#344054',
    marginTop: 18,
    marginBottom: 8,
  },
  inputContainer: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E0E6ED',
    borderRadius: 12,
    paddingHorizontal: 13,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 15,
    color: '#1D2939',
  },
  saveButton: {
    backgroundColor: AZUL,
    minHeight: 52,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    gap: 9,
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  footerText: {
    color: '#98A2B3',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 18,
    lineHeight: 18,
  },
});