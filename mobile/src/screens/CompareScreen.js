import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';

export default function CompareScreen() {
  return (
    <ScrollView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>Comparar</Text>
        <Text style={styles.subtitle}>
          Compare dois veículos
        </Text>
      </View>

      <View style={styles.vehicles}>

        <View style={styles.vehicle}>
          <Text style={styles.brand}>BYD</Text>
          <Text style={styles.model}>Seal AWD</Text>
          <Text style={styles.price}>R$ 296.800</Text>
        </View>

        <Text style={styles.vs}>VS</Text>

        <View style={styles.vehicle}>
          <Text style={styles.brand}>Tesla</Text>
          <Text style={styles.model}>Model Y LR</Text>
          <Text style={styles.price}>R$ 349.900</Text>
        </View>

      </View>

      <View style={styles.table}>

        <ComparisonRow
          title="Ano"
          value1="2023"
          value2="2023"
        />

        <ComparisonRow
          title="Quilometragem"
          value1="Zero Km"
          value2="12.400 km"
        />

        <ComparisonRow
          title="Potência"
          value1="531 cv"
          value2="347 cv"
        />

        <ComparisonRow
          title="Combustível"
          value1="Elétrico"
          value2="Elétrico"
        />

        <ComparisonRow
          title="Câmbio"
          value1="Automático"
          value2="Automático"
        />

      </View>

    </ScrollView>
  );
}

function ComparisonRow({ title, value1, value2 }) {
  return (
    <View style={styles.row}>

      <View style={styles.column}>
        <Text style={styles.value}>{value1}</Text>
      </View>

      <View style={styles.label}>
        <Text style={styles.labelText}>{title}</Text>
      </View>

      <View style={styles.column}>
        <Text style={styles.value}>{value2}</Text>
      </View>

    </View>
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

  vehicles: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },

  vehicle: {
    width: '42%',
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    padding: 15,
  },

  brand: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '600',
  },

  model: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111111',
    marginTop: 4,
  },

  price: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111111',
    marginTop: 10,
  },

  vs: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666666',
  },

  table: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 10,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
    paddingVertical: 16,
  },

  column: {
    flex: 1,
    alignItems: 'center',
  },

  label: {
    width: 90,
    alignItems: 'center',
  },

  labelText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '600',
  },

  value: {
    fontSize: 14,
    color: '#111111',
    fontWeight: '600',
  },
});