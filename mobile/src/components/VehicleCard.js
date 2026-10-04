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
      <View style={styles.header}>
        <Text style={styles.brand}>{brand}</Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {condition}
          </Text>
        </View>
      </View>

      <Text style={styles.model}>{model}</Text>

      <Text style={styles.info}>
        Ano {year}
      </Text>

      <View style={styles.divider} />

      <Text style={styles.price}>{price}</Text>

      <Text style={styles.location}>
        <Text style={styles.locationIcon}>● </Text>
        {location}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E4EAF1',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  brand: {
    fontSize: 13,
    fontWeight: '700',
    color: '#174A7E',
    textTransform: 'uppercase',
  },

  badge: {
    backgroundColor: '#EAF2FA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#174A7E',
  },

  model: {
    fontSize: 19,
    fontWeight: 'bold',
    marginTop: 12,
    color: '#172B42',
  },

  info: {
    fontSize: 13,
    color: '#7A8796',
    marginTop: 6,
  },

  divider: {
    height: 1,
    backgroundColor: '#EDF0F4',
    marginVertical: 14,
  },

  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#174A7E',
  },

  location: {
    fontSize: 13,
    color: '#7A8796',
    marginTop: 8,
  },

  locationIcon: {
    color: '#174A7E',
    fontSize: 10,
  },
});