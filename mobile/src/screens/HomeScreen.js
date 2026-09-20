import React from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
} from 'react-native';

import VehicleCard from '../components/VehicleCard';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.welcome}>Olá, Bem-vindo</Text>
        <Text style={styles.name}>Lucas Silva</Text>
      </View>

      <TextInput
        style={styles.search}
        placeholder="Busque por marca, modelo..."
        placeholderTextColor="#888"
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Marcas Populares</Text>
        <Text style={styles.seeAll}>Ver todas</Text>
      </View>

      <View style={styles.brands}>
        <View style={styles.brand}>
          <Text style={styles.brandText}>Toyota</Text>
        </View>

        <View style={styles.brand}>
          <Text style={styles.brandText}>Honda</Text>
        </View>

        <View style={styles.brand}>
          <Text style={styles.brandText}>BMW</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Ofertas em Destaque</Text>
        <Text style={styles.seeAll}>Ver mais</Text>
      </View>

      <VehicleCard
        brand="Tesla"
        model="Model 3 Long Range"
        year="2023"
        condition="Zero Km"
        price="R$ 319.900"
        location="São Paulo - SP"
      />

      <VehicleCard
        brand="Porsche"
        model="Taycan 4S"
        year="2022"
        condition="Zero Km"
        price="R$ 689.000"
        location="Rio de Janeiro - RJ"
      />

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
    marginTop: 50,
    marginBottom: 20,
  },

  welcome: {
    fontSize: 16,
    color: '#666666',
  },

  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111111',
    marginTop: 4,
  },

  search: {
    height: 50,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 28,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#111111',
  },

  seeAll: {
    fontSize: 14,
    color: '#555555',
  },

  brands: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 30,
  },

  brand: {
    flex: 1,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  brandText: {
    fontSize: 15,
    fontWeight: '600',
  },
});