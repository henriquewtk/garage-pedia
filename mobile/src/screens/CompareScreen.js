import React, {
  useState,
  useCallback,
} from 'react';

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import * as SQLite from 'expo-sqlite';

import { listarFavoritos } from '../database/database';

export default function CompareScreen({ navigation }) {
  const [veiculos, setVeiculos] = useState([]);
  const [veiculo1, setVeiculo1] = useState(null);
  const [veiculo2, setVeiculo2] = useState(null);

  const [selecionando, setSelecionando] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  // Carrega os veículos favoritos do usuário
  const carregarVeiculos = useCallback(async () => {
    try {
      setCarregando(true);

      const usuarioId = await AsyncStorage.getItem(
        'usuarioLogado'
      );

      if (!usuarioId) {
        setVeiculos([]);
        return;
      }

      const favoritos = await listarFavoritos(
        Number(usuarioId)
      );

      setVeiculos(favoritos);

    } catch (error) {
      console.error(
        'Erro ao carregar veículos:',
        error
      );

      Alert.alert(
        'Erro',
        'Não foi possível carregar os veículos favoritos.'
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarVeiculos();
    }, [carregarVeiculos])
  );

  // Seleciona um veículo para comparação
  function selecionarVeiculo(veiculo) {
    if (
      selecionando === 1 &&
      veiculo2 &&
      veiculo.id === veiculo2.id
    ) {
      Alert.alert(
        'Veículo já selecionado',
        'Escolha um veículo diferente do segundo.'
      );
      return;
    }

    if (
      selecionando === 2 &&
      veiculo1 &&
      veiculo.id === veiculo1.id
    ) {
      Alert.alert(
        'Veículo já selecionado',
        'Escolha um veículo diferente do primeiro.'
      );
      return;
    }

    if (selecionando === 1) {
      setVeiculo1(veiculo);
      setSelecionando(2);
    } else {
      setVeiculo2(veiculo);
    }
  }

  // Salva a comparação no SQLite
  async function salvarComparacao() {
  if (!veiculo1 || !veiculo2) {
    Alert.alert(
      'Atenção',
      'Selecione dois veículos para comparar.'
    );
    return;
  }

  if (
    veiculo1.codigo_fipe === veiculo2.codigo_fipe
  ) {
    Alert.alert(
      'Atenção',
      'Selecione dois veículos diferentes.'
    );
    return;
  }

  try {
    setSalvando(true);

    const usuarioId = await AsyncStorage.getItem(
      'usuarioLogado'
    );

    if (!usuarioId) {
      Alert.alert(
        'Atenção',
        'Faça login para salvar sua comparação.'
      );
      return;
    }

    const db = await SQLite.openDatabaseAsync(
      'garagepedia.db'
    );

    await db.runAsync(
      `INSERT INTO comparacoes (
        usuario_id,
        veiculo1_codigo_fipe,
        veiculo1_marca,
        veiculo1_modelo,
        veiculo1_ano,
        veiculo1_valor,
        veiculo1_combustivel,
        veiculo2_codigo_fipe,
        veiculo2_marca,
        veiculo2_modelo,
        veiculo2_ano,
        veiculo2_valor,
        veiculo2_combustivel,
        criado_em
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      Number(usuarioId),

      veiculo1.codigo_fipe,
      veiculo1.marca,
      veiculo1.modelo,
      veiculo1.ano,
      veiculo1.valor ?? null,
      veiculo1.combustivel ?? null,

      veiculo2.codigo_fipe,
      veiculo2.marca,
      veiculo2.modelo,
      veiculo2.ano,
      veiculo2.valor ?? null,
      veiculo2.combustivel ?? null,

      new Date().toISOString()
    );

    Alert.alert(
      'Comparação salva!',
      'A comparação foi registrada com sucesso.'
    );

  } catch (error) {
    console.error(
      'Erro ao salvar comparação:',
      error
    );

    Alert.alert(
      'Erro',
      'Não foi possível salvar a comparação.'
    );
  } finally {
    setSalvando(false);
  }
}

  // Exibe os dados dos veículos lado a lado
  function ComparisonRow({ title, value1, value2 }) {
    return (
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.value}>
            {value1 || 'Não informado'}
          </Text>
        </View>

        <View style={styles.label}>
          <Text style={styles.labelText}>
            {title}
          </Text>
        </View>

        <View style={styles.column}>
          <Text style={styles.value}>
            {value2 || 'Não informado'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>
          Comparar
        </Text>

        <Text style={styles.subtitle}>
          Compare dois veículos
        </Text>
      </View>

      <TouchableOpacity
    style={styles.historyButton}
    onPress={() => navigation.navigate('ComparisonHistory')}
  >
  <Text style={styles.historyButtonText}>
    Ver histórico de comparações
  </Text>
</TouchableOpacity>

      <Text style={styles.instruction}>
        Selecione dois veículos dos seus favoritos.
      </Text>

      <View style={styles.selectionButtons}>
        <TouchableOpacity
          style={[
            styles.selectionButton,
            selecionando === 1 && styles.selectedButton,
          ]}
          onPress={() => setSelecionando(1)}
        >
          <Text
            style={[
              styles.selectionButtonText,
              selecionando === 1 &&
                styles.selectedButtonText,
            ]}
          >
            Veículo 1
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.selectionButton,
            selecionando === 2 && styles.selectedButton,
          ]}
          onPress={() => setSelecionando(2)}
        >
          <Text
            style={[
              styles.selectionButtonText,
              selecionando === 2 &&
                styles.selectedButtonText,
            ]}
          >
            Veículo 2
          </Text>
        </TouchableOpacity>
      </View>

      {carregando ? (
        <Text style={styles.message}>
          Carregando veículos...
        </Text>
      ) : veiculos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            O senhor ainda não possui veículos favoritos.
          </Text>

          <Text style={styles.emptySubtext}>
            Pesquise veículos e adicione pelo menos dois
            aos favoritos para compará-los.
          </Text>
        </View>
      ) : (
        <View style={styles.vehicleList}>
          {veiculos.map((veiculo) => (
            <TouchableOpacity
              key={veiculo.id}
              style={[
                styles.vehicleOption,
                (
                  veiculo1?.id === veiculo.id ||
                  veiculo2?.id === veiculo.id
                ) && styles.vehicleOptionSelected,
              ]}
              onPress={() => selecionarVeiculo(veiculo)}
            >
              <Text style={styles.vehicleBrand}>
                {veiculo.marca}
              </Text>

              <Text style={styles.vehicleModel}>
                {veiculo.modelo}
              </Text>

              <Text style={styles.vehicleDetails}>
                Ano: {veiculo.ano}
              </Text>

              <Text style={styles.vehiclePrice}>
                {veiculo.valor || 'Valor indisponível'}
              </Text>

              {(veiculo1?.id === veiculo.id ||
                veiculo2?.id === veiculo.id) && (
                <Text style={styles.selectedLabel}>
                  ✓ Selecionado
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.vehicles}>

        <View style={styles.vehicle}>
          <Text style={styles.brand}>
            {veiculo1?.marca || 'Veículo 1'}
          </Text>

          <Text style={styles.model}>
            {veiculo1?.modelo || 'Não selecionado'}
          </Text>

          <Text style={styles.price}>
            {veiculo1?.valor || '—'}
          </Text>
        </View>

        <Text style={styles.vs}>VS</Text>

        <View style={styles.vehicle}>
          <Text style={styles.brand}>
            {veiculo2?.marca || 'Veículo 2'}
          </Text>

          <Text style={styles.model}>
            {veiculo2?.modelo || 'Não selecionado'}
          </Text>

          <Text style={styles.price}>
            {veiculo2?.valor || '—'}
          </Text>
        </View>

      </View>

      {veiculo1 && veiculo2 && (
        <View style={styles.table}>

          <ComparisonRow
            title="Ano"
            value1={String(veiculo1.ano)}
            value2={String(veiculo2.ano)}
          />

          <ComparisonRow
            title="Combustível"
            value1={veiculo1.combustivel}
            value2={veiculo2.combustivel}
          />

          <ComparisonRow
            title="Código FIPE"
            value1={veiculo1.codigo_fipe}
            value2={veiculo2.codigo_fipe}
          />

          <ComparisonRow
            title="Valor FIPE"
            value1={veiculo1.valor}
            value2={veiculo2.valor}
          />

        </View>
      )}

      <TouchableOpacity
        style={[
          styles.saveButton,
          (!veiculo1 || !veiculo2 || salvando) &&
            styles.disabledButton,
        ]}
        onPress={salvarComparacao}
        disabled={!veiculo1 || !veiculo2 || salvando}
      >
        <Text style={styles.saveButtonText}>
          {salvando
            ? 'Salvando...'
            : 'Salvar comparação'}
        </Text>
      </TouchableOpacity>

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

  instruction: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 15,
  },

  selectionButtons: {
    flexDirection: 'row',
    marginBottom: 15,
  },

  selectionButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 10,
    marginRight: 6,
  },

  selectedButton: {
    backgroundColor: '#111111',
    borderColor: '#111111',
  },

  selectionButtonText: {
    color: '#333333',
    fontWeight: '600',
  },

  selectedButtonText: {
    color: '#FFFFFF',
  },

  vehicleList: {
    marginBottom: 20,
  },

  vehicleOption: {
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },

  vehicleOptionSelected: {
    borderColor: '#111111',
    borderWidth: 2,
  },

  vehicleBrand: {
    fontSize: 13,
    color: '#666666',
  },

  vehicleModel: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111111',
    marginTop: 3,
  },

  vehicleDetails: {
    fontSize: 13,
    color: '#666666',
    marginTop: 5,
  },

  vehiclePrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111111',
    marginTop: 7,
  },

  selectedLabel: {
    color: '#222222',
    fontWeight: 'bold',
    marginTop: 8,
  },

  message: {
    textAlign: 'center',
    color: '#666666',
    padding: 20,
  },

  emptyContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },

  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222222',
    textAlign: 'center',
  },

  emptySubtext: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 21,
  },

  vehicles: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
  },

  vehicle: {
    width: '42%',
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    padding: 12,
  },

  brand: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '600',
  },

  model: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111111',
    marginTop: 5,
  },

  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111111',
    marginTop: 10,
  },

  vs: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#666666',
  },

  table: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 10,
    marginBottom: 20,
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
    width: 85,
    alignItems: 'center',
  },

  labelText: {
    fontSize: 11,
    color: '#666666',
    fontWeight: '600',
    textAlign: 'center',
  },

  value: {
    fontSize: 12,
    color: '#111111',
    fontWeight: '600',
    textAlign: 'center',
  },

  saveButton: {
    backgroundColor: '#111111',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 35,
  },

  disabledButton: {
    backgroundColor: '#999999',
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  historyButton: {
  backgroundColor: '#F5F5F5',
  borderWidth: 1,
  borderColor: '#DDDDDD',
  paddingVertical: 13,
  borderRadius: 10,
  alignItems: 'center',
  marginBottom: 20,
  },

  historyButtonText: {
  fontSize: 14,
  fontWeight: '600',
  color: '#111111',
  },

});