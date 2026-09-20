import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';

import VehicleCard from '../components/VehicleCard';

export default function FavoritesScreen() {
  return (
    <ScrollView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>Meus Favoritos</Text>
        <Text style={styles.subtitle}>
          Veículos que você salvou
        </Text>
      </View>

      <VehicleCard
        brand="Porsche"
        model="Taycan 4S"
        year="2022"
        condition="Zero Km"
        price="R$ 689.000"
        location="Rio de Janeiro - RJ"
      />

      <VehicleCard
        brand="BMW"
        model="i4 M50"
        year="2023"
        condition="8.500 km"
        price="R$ 429.900"
        location="São Bernardo - SP"
      />

      <VehicleCard
        brand="Tesla"
        model="Model 3 Long Range"
        year="2023"
        condition="Zero Km"
        price="R$ 319.900"
        location="São Paulo - SP"
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
    marginBottom: 25,
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
});
