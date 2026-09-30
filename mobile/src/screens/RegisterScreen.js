import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

import { cadastrarUsuario } from '../database/database';

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  async function realizarCadastro() {
    if (!nome || !email || !senha || !confirmarSenha) {
      Alert.alert(
        'Atenção',
        'Preencha todos os campos obrigatórios.'
      );
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert(
        'Atenção',
        'As senhas não são iguais.'
      );
      return;
    }

    try {
      await cadastrarUsuario(
        nome,
        email,
        telefone,
        senha
      );

      Alert.alert(
        'Cadastro realizado',
        'Sua conta foi criada com sucesso.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      if (error.message.includes('UNIQUE')) {
        Alert.alert(
          'Atenção',
          'Este e-mail já está cadastrado.'
        );
      } else {
        console.error(
          'Erro ao cadastrar usuário:',
          error
        );

        Alert.alert(
          'Erro',
          'Não foi possível realizar o cadastro.'
        );
      }
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.title}>Criar Conta</Text>

        <Text style={styles.subtitle}>
          Cadastre-se no GaragePedia
        </Text>
      </View>

      <Text style={styles.label}>
        Nome completo
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu nome completo"
        placeholderTextColor="#888888"
        value={nome}
        onChangeText={setNome}
      />

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
        Telefone
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu telefone"
        placeholderTextColor="#888888"
        keyboardType="phone-pad"
        value={telefone}
        onChangeText={setTelefone}
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

      <Text style={styles.label}>
        Confirmar senha
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Confirme sua senha"
        placeholderTextColor="#888888"
        secureTextEntry
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={realizarCadastro}
      >
        <Text style={styles.buttonText}>
          Cadastrar
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.loginText}>
          Já tem uma conta? Entrar
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
    marginTop: 60,
    marginBottom: 35,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#111111',
  },

  subtitle: {
    fontSize: 15,
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

  button: {
    height: 52,
    backgroundColor: '#111111',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  loginButton: {
    alignItems: 'center',
    marginTop: 22,
  },

  loginText: {
    fontSize: 14,
    color: '#555555',
  },
});