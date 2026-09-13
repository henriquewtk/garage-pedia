import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import { getMarcasCarros } from '../services/fipeApi';

export default function MarcasScreen() {
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarMarcas() {
      const dados = await getMarcasCarros();
      setMarcas(dados);
      setLoading(false);
    }
    carregarMarcas();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>GaragePedia 🚗</Text>
        <Text style={styles.subtitle}>Selecione uma Marca (Tabela FIPE)</Text>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Carregando marcas...</Text>
        </View>
      ) : (
        <FlatList
          data={marcas}
          keyExtractor={(item) => item.code}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item} onPress={() => alert(`Clicou em: ${item.name}`)}>
              <Text style={styles.itemText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121214' },
  header: { padding: 20, backgroundColor: '#1e1e24', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#ffffff' },
  subtitle: { fontSize: 14, color: '#a0a0a5', marginTop: 4 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#ffffff' },
  item: { backgroundColor: '#202024', padding: 16, marginVertical: 6, marginHorizontal: 16, borderRadius: 8 },
  itemText: { fontSize: 16, color: '#e1e1e6', fontWeight: '500' },
});