import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
} from 'react-native';

import VehicleCard from '../components/VehicleCard';

export default function SearchScreen() {
  const [search, setSearch] = useState('');

  return (
    <ScrollView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>Pesquisa</Text>
        <Text style={styles.subtitle}>
          Encontre o veículo ideal para você
        </Text>
      </View>

      <TextInput
        style={styles.search}
        placeholder="Busque por marca ou modelo..."
        placeholderTextColor="#888"
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.resultHeader}>
        <Text style={styles.resultTitle}>
          Resultados encontrados
        </Text>

        <Text style={styles.order}>
          Menor preço
        </Text>
      </View>

      <VehicleCard
        brand="Tesla"
        model="Model Y Long Range"
        year="2023"
        condition="12.400 km"
        price="R$ 349.900"
        location="São Paulo - SP"
      />

      <VehicleCard
        brand="Tesla"
        model="Model Y Performance"
        year="2022"
        condition="24.000 km"
        price="R$ 389.000"
        location="Campinas - SP"
      />

      <VehicleCard
        brand="BYD"
        model="Seal AWD"
        year="2023"
        condition="Zero Km"
        price="R$ 296.800"
        location="São Paulo - SP"
      />

      <VehicleCard
        brand="BMW"
        model="i4 M50"
        year="2023"
        condition="8.500 km"
        price="R$ 429.900"
        location="São Bernardo - SP"
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

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111111',
  },

  subtitle: {
    fontSize: 15,
    color: '#666666',
    marginTop: 5,
  },

  search: {
    height: 50,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 25,
  },

  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  resultTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111111',
  },

  order: {
    fontSize: 13,
    color: '#666666',
  },
});
