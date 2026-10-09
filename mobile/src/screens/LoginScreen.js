import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { autenticarUsuario } from '../database/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AZUL = '#174A7E';
const FUNDO = '#F2F5F9';
const CINZA = '#667085';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function realizarLogin() {
    if (!email.trim() || !senha) {
      Alert.alert(
        'Atenção',
        'Preencha o e-mail e a senha.'
      );
      return;
    }

    try {
      setCarregando(true);

      const usuario = await autenticarUsuario(
        email.trim().toLowerCase(),
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
      console.error('Erro ao realizar login:', error);

      Alert.alert(
        'Erro',
        'Não foi possível realizar o login.'
      );
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
        <View style={styles.header}>
          <View style={styles.logo}>
            <Ionicons
              name="car-sport"
              size={42}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.brand}>GaragePedia</Text>

          <Text style={styles.title}>
            Bem-vindo de volta!
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>E-mail</Text>

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

          <Text style={styles.label}>Senha</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={CINZA}
            />

            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor="#98A2B3"
              secureTextEntry={!mostrarSenha}
              value={senha}
              onChangeText={setSenha}
              editable={!carregando}
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={realizarLogin}
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

          <TouchableOpacity
            style={styles.forgotButton}
            onPress={() =>
              Alert.alert(
                'Recuperação de senha',
                'A recuperação de senha ainda não está disponível.'
              )
            }
            disabled={carregando}
            activeOpacity={0.7}
          >
            <Text style={styles.forgotText}>
              Esqueceu a senha?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              carregando && styles.disabledButton,
            ]}
            onPress={realizarLogin}
            disabled={carregando}
            activeOpacity={0.8}
          >
            {carregando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.buttonText}>Entrar</Text>
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color="#FFFFFF"
                />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Não tem uma conta?
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              disabled={carregando}
              activeOpacity={0.7}
            >
              <Text style={styles.registerLink}>
                Criar conta
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
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 35,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: AZUL,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  brand: {
    fontSize: 17,
    fontWeight: 'bold',
    color: AZUL,
    marginBottom: 25,
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
    marginTop: 8,
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E7ECF2',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#344054',
    marginBottom: 8,
    marginTop: 14,
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
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: 15,
    marginBottom: 24,
  },
  forgotText: {
    color: AZUL,
    fontSize: 13,
    fontWeight: '600',
  },
  button: {
    minHeight: 52,
    backgroundColor: AZUL,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#E7ECF2',
    marginTop: 25,
    marginBottom: 20,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 5,
  },
  registerText: {
    fontSize: 14,
    color: CINZA,
  },
  registerLink: {
    fontSize: 14,
    color: AZUL,
    fontWeight: 'bold',
  },
  footer: {
    color: '#98A2B3',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 25,
  },
});