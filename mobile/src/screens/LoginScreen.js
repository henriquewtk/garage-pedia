import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

import { autenticarUsuario } from '../database/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  async function realizarLogin() {
  if (!email || !senha) {
    Alert.alert(
      'Atenção',
      'Preencha o e-mail e a senha.'
    );
    return;
  }

  try {
    const usuario = await autenticarUsuario(
      email,
      senha
    );

    if (!usuario) {
  Alert.alert(
    'Login inválido',
    'E-mail ou senha incorretos.'
  );
  return;
}

await AsyncStorage.setItem(
  'usuarioLogado',
  usuario.id.toString()
);

    navigation.replace('MainTabs');
  } catch (error) {
    console.error(
      'Erro ao realizar login:',
      error
    );

    Alert.alert(
      'Erro',
      'Não foi possível realizar o login.'
    );
  }
}

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          Bem-vindo de volta!
        </Text>

        <Text style={styles.subtitle}>
          Faça seu login
        </Text>
      </View>

      <Text style={styles.label}>
        E-mail
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        placeholderTextColor="#888888"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>
        Senha
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        placeholderTextColor="#888888"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity
        style={styles.forgotButton}
        onPress={() => console.log('Esqueceu a senha')}
      >
        <Text style={styles.forgotText}>
          Esqueceu a senha?
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={realizarLogin}
      >
        <Text style={styles.buttonText}>
          Entrar
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.registerText}>
          Não tem uma conta? Criar conta
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    marginTop: 80,
    marginBottom: 40,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#111111',
  },

  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 6,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 7,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 18,
  },

  forgotButton: {
    alignItems: 'flex-end',
    marginBottom: 25,
  },

  forgotText: {
    fontSize: 14,
    color: '#555555',
  },

  button: {
    height: 52,
    backgroundColor: '#111111',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  registerButton: {
    alignItems: 'center',
    marginTop: 22,
  },

  registerText: {
    fontSize: 14,
    color: '#555555',
  },
});