import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

export default function SettingsScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>‹ Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Configurações</Text>
        <Text style={styles.subtitle}>
          Informações e preferências do aplicativo.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre o aplicativo</Text>

        <View style={styles.item}>
          <Text style={styles.label}>Nome</Text>
          <Text style={styles.value}>GaragePedia</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Versão</Text>
          <Text style={styles.value}>1.0.0</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Plataforma</Text>
          <Text style={styles.value}>React Native</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre o GaragePedia</Text>

        <Text style={styles.description}>
          O GaragePedia permite pesquisar veículos, consultar informações
          da tabela FIPE, comparar modelos e salvar veículos favoritos.
        </Text>
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
  section: {
    marginBottom: 25,
    padding: 18,
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111111',
    marginBottom: 15,
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  label: {
    fontSize: 13,
    color: '#777777',
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    color: '#222222',
  },
  description: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 22,
  },
});