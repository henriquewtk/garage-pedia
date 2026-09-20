import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function VehicleCard({
  brand,
  model,
  year,
  condition,
  price,
  location,
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardBrand}>{brand}</Text>

      <Text style={styles.cardModel}>{model}</Text>

      <Text style={styles.cardInfo}>
        {year} • {condition}
      </Text>

      <Text style={styles.cardPrice}>{price}</Text>

      <Text style={styles.cardLocation}>{location}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },

  cardBrand: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '600',
  },

  cardModel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
    color: '#111111',
  },

  cardInfo: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
  },

  cardPrice: {
    fontSize: 19,
    fontWeight: 'bold',
    marginTop: 12,
    color: '#111111',
  },

  cardLocation: {
    fontSize: 13,
    color: '#777777',
    marginTop: 4,
  },
});