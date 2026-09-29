import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import {
  getMarcasCarros,
  getModelosCarros,
  getAnosModelo,
  getDadosVeiculo,
} from '../services/fipeApi';

export default function SearchScreen({ navigation }) {
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [anos, setAnos] = useState([]);

  const [marcaSelecionada, setMarcaSelecionada] = useState(null);
  const [modeloSelecionado, setModeloSelecionado] = useState(null);

  const [busca, setBusca] = useState('');

  const [veiculoSelecionado, setVeiculoSelecionado] = useState(null);
  const [carregandoVeiculo, setCarregandoVeiculo] = useState(false);

  const [carregandoMarcas, setCarregandoMarcas] = useState(true);
  const [carregandoModelos, setCarregandoModelos] = useState(false);
  const [carregandoAnos, setCarregandoAnos] = useState(false);

  useEffect(() => {
    carregarMarcas();
  }, []);

  async function carregarMarcas() {
    const dados = await getMarcasCarros();

    setMarcas(dados);
    setCarregandoMarcas(false);
  }

  async function selecionarMarca(marca) {
    setMarcaSelecionada(marca);
    setModeloSelecionado(null);
    setModelos([]);
    setAnos([]);
    setBusca('');

    setCarregandoModelos(true);

    const dados = await getModelosCarros(marca.codigo);

    setModelos(dados);
    setCarregandoModelos(false);
  }

  async function selecionarAno(ano) {
  setCarregandoVeiculo(true);

  const dados = await getDadosVeiculo(
    marcaSelecionada.codigo,
    modeloSelecionado.codigo,
    ano.codigo
  );

  setCarregandoVeiculo(false);

  if (dados) {
    navigation.navigate('VehicleDetails', {
      veiculo: dados,
    });
  }
}

  async function selecionarModelo(modelo) {
    setModeloSelecionado(modelo);
    setAnos([]);
    setBusca('');

    setCarregandoAnos(true);

    const dados = await getAnosModelo(
      marcaSelecionada.codigo,
      modelo.codigo
    );

    setAnos(dados);
    setCarregandoAnos(false);
  }

  function voltarParaMarcas() {
    setMarcaSelecionada(null);
    setModeloSelecionado(null);
    setModelos([]);
    setAnos([]);
    setBusca('');
  }

  function voltarParaModelos() {
    setModeloSelecionado(null);
    setAnos([]);
    setBusca('');
  }

  const marcasFiltradas = marcas.filter((marca) =>
    marca.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const modelosFiltrados = modelos.filter((modelo) =>
    modelo.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>Pesquisa</Text>

        <Text style={styles.subtitle}>
          Encontre seu veículo
        </Text>
      </View>

      <TextInput
        style={styles.search}
        placeholder={
          modeloSelecionado
            ? 'Pesquise um ano...'
            : marcaSelecionada
            ? 'Pesquise um modelo...'
            : 'Pesquise uma marca...'
        }
        placeholderTextColor="#888"
        value={busca}
        onChangeText={setBusca}
      />

      {!marcaSelecionada && (
        <View>

          <Text style={styles.sectionTitle}>
            Marcas
          </Text>

          {carregandoMarcas ? (
            <ActivityIndicator size="large" />
          ) : (
            marcasFiltradas.map((marca) => (
              <TouchableOpacity
                key={marca.codigo}
                style={styles.item}
                onPress={() => selecionarMarca(marca)}
              >
                <Text style={styles.itemText}>
                  {marca.nome}
                </Text>

                <Text style={styles.arrow}>
                  ›
                </Text>
              </TouchableOpacity>
            ))
          )}

        </View>
      )}

      {marcaSelecionada && !modeloSelecionado && (
        <View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={voltarParaMarcas}
          >
            <Text style={styles.backText}>
              ← Voltar para marcas
            </Text>
          </TouchableOpacity>

          <Text style={styles.selectedTitle}>
            {marcaSelecionada.nome}
          </Text>

          <Text style={styles.sectionTitle}>
            Modelos
          </Text>

          {carregandoModelos ? (
            <ActivityIndicator size="large" />
          ) : (
            modelosFiltrados.map((modelo) => (
              <TouchableOpacity
                key={modelo.codigo}
                style={styles.item}
                onPress={() => selecionarModelo(modelo)}
              >
                <Text style={styles.itemText}>
                  {modelo.nome}
                </Text>

                <Text style={styles.arrow}>
                  ›
                </Text>
              </TouchableOpacity>
            ))
          )}

        </View>
      )}

      {marcaSelecionada && modeloSelecionado && (
        <View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={voltarParaModelos}
          >
            <Text style={styles.backText}>
              ← Voltar para modelos
            </Text>
          </TouchableOpacity>

          <Text style={styles.selectedTitle}>
            {modeloSelecionado.nome}
          </Text>

          <Text style={styles.sectionTitle}>
            Anos disponíveis
          </Text>

          {carregandoAnos ? (
            <ActivityIndicator size="large" />
          ) : (
            anos.map((ano) => (
              <TouchableOpacity
                key={ano.codigo}
                style={styles.item}
                onPress={() => selecionarAno(ano)}
              >
                <Text style={styles.itemText}>
                  {ano.nome}
                </Text>

                <Text style={styles.arrow}>
                  ›
                </Text>
              </TouchableOpacity>
            ))
          )}

        </View>
      )}

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

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111111',
    marginBottom: 15,
  },

  selectedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111111',
    marginBottom: 20,
  },

  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 17,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  itemText: {
    fontSize: 16,
    color: '#111111',
    flex: 1,
  },

  arrow: {
    fontSize: 24,
    color: '#888888',
  },

  backButton: {
    marginBottom: 20,
  },

  backText: {
    fontSize: 15,
    color: '#555555',
  },

});