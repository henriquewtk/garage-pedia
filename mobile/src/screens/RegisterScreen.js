import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cadastrarUsuario } from '../database/database';

const AZUL = '#174A7E';
const FUNDO = '#F2F5F9';
const CINZA = '#667085';

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function realizarCadastro() {
    if (
      !nome.trim() ||
      !email.trim() ||
      !senha ||
      !confirmarSenha
    ) {
      Alert.alert(
        'Atenção',
        'Preencha todos os campos obrigatórios.'
      );
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

    if (senha !== confirmarSenha) {
      Alert.alert(
        'Atenção',
        'As senhas não são iguais.'
      );
      return;
    }

    try {
      setCarregando(true);

      await cadastrarUsuario(
        nome.trim(),
        emailNormalizado,
        telefone.trim(),
        senha
      );

      Alert.alert(
        'Cadastro realizado!',
        'Sua conta foi criada com sucesso.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      if (
        String(error.message).toLowerCase().includes('unique')
      ) {
        Alert.alert(
          'E-mail já cadastrado',
          'Este e-mail já pertence a uma conta.'
        );
      } else {
        console.error('Erro ao cadastrar usuário:', error);

        Alert.alert(
          'Erro',
          'Não foi possível realizar o cadastro.'
        );
      }
    } finally {
      setCarregando(false);
    }
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
          <View style={styles.logo}>
            <Ionicons
              name="car-sport"
              size={38}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.brand}>GaragePedia</Text>

          <Text style={styles.title}>Criar conta</Text>

          <Text style={styles.subtitle}>
            Preencha seus dados para começar.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>
            Informações pessoais
          </Text>

          <Text style={styles.label}>Nome completo *</Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={20}
              color={CINZA}
            />
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome completo"
              placeholderTextColor="#98A2B3"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
              editable={!carregando}
              returnKeyType="next"
            />
          </View>

          <Text style={styles.label}>E-mail *</Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={CINZA}
            />
            <TextInput
              style={styles.input}
              placeholder="Digite seu e-mail"
              placeholderTextColor="#98A2B3"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              editable={!carregando}
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
              placeholder="Digite seu telefone"
              placeholderTextColor="#98A2B3"
              keyboardType="phone-pad"
              value={telefone}
              onChangeText={setTelefone}
              editable={!carregando}
              returnKeyType="next"
            />
          </View>

          <Text style={styles.label}>Senha *</Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={CINZA}
            />
            <TextInput
              style={styles.input}
              placeholder="Crie uma senha"
              placeholderTextColor="#98A2B3"
              secureTextEntry={!mostrarSenha}
              value={senha}
              onChangeText={setSenha}
              autoCapitalize="none"
              editable={!carregando}
              returnKeyType="next"
            />
            <TouchableOpacity
              onPress={() => setMostrarSenha(!mostrarSenha)}
              disabled={carregando}
              activeOpacity={0.7}
            >
              <Ionicons
                name={
                  mostrarSenha
                    ? 'eye-off-outline'
                    : 'eye-outline'
                }
                size={21}
                color={CINZA}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirmar senha *</Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color={CINZA}
            />
            <TextInput
              style={styles.input}
              placeholder="Digite a senha novamente"
              placeholderTextColor="#98A2B3"
              secureTextEntry={!mostrarConfirmacao}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              autoCapitalize="none"
              editable={!carregando}
              returnKeyType="done"
              onSubmitEditing={realizarCadastro}
            />
            <TouchableOpacity
              onPress={() =>
                setMostrarConfirmacao(!mostrarConfirmacao)
              }
              disabled={carregando}
              activeOpacity={0.7}
            >
              <Ionicons
                name={
                  mostrarConfirmacao
                    ? 'eye-off-outline'
                    : 'eye-outline'
                }
                size={21}
                color={CINZA}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.requiredInfo}>
            * Campos obrigatórios
          </Text>

          <TouchableOpacity
            style={[
              styles.button,
              carregando && styles.disabledButton,
            ]}
            onPress={realizarCadastro}
            disabled={carregando}
            activeOpacity={0.8}
          >
            {carregando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.buttonText}>
                  Criar minha conta
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color="#FFFFFF"
                />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              Já tem uma conta?
            </Text>

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              disabled={carregando}
              activeOpacity={0.7}
            >
              <Text style={styles.loginLink}>
                Entrar
              </Text>
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 35,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
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
    marginTop: 15,
    marginBottom: 25,
  },
  logo: {
    width: 66,
    height: 66,
    borderRadius: 20,
    backgroundColor: AZUL,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  brand: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AZUL,
    marginBottom: 20,
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: AZUL,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: CINZA,
    marginTop: 7,
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E7ECF2',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AZUL,
    marginTop: 8,
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#344054',
    marginTop: 16,
    marginBottom: 8,
  },
  inputContainer: {
    minHeight: 51,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E0E6ED',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 11,
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#1D2939',
  },
  requiredInfo: {
    fontSize: 12,
    color: CINZA,
    marginTop: 15,
  },
  button: {
    minHeight: 52,
    backgroundColor: AZUL,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 22,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 22,
  },
  loginText: {
    fontSize: 14,
    color: CINZA,
  },
  loginLink: {
    fontSize: 14,
    color: AZUL,
    fontWeight: 'bold',
  },
  footer: {
    color: '#98A2B3',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 22,
    lineHeight: 18,
  },
});