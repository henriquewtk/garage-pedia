
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
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  getMarcasCarros,
  getModelosCarros,
  getAnosModelo,
  getDadosVeiculo,
} from '../services/fipeApi';

import { useSettings } from '../context/SettingsContext';

export default function SearchScreen({ navigation }) {
  const { cores, idioma } = useSettings();
  const insets = useSafeAreaInsets();
  const styles = criarEstilos(cores);

  const textos = idioma === 'en'
    ? {
        title: 'Vehicle search',
        searchMake: 'Search for a make...',
        searchModel: 'Search for a model...',
        searchYear: 'Search for a year...',
        makes: 'Makes',
        found: 'found',
        loadingMakes: 'Loading makes...',
        loadingModels: 'Loading models...',
        loadingYears: 'Loading years...',
        noMake: 'No makes found.',
        noModel: 'No models found.',
        noYear: 'No years found.',
        errorMakes: 'Could not load makes.',
        errorModels: 'Could not load models.',
        errorYears: 'Could not load years.',
        selectedMake: 'SELECTED MAKE',
        selectedVehicle: 'SELECTED VEHICLE',
        availableModels: 'Available models',
        modelYear: 'Model year',
        backMakes: 'Back to makes',
        backModels: 'Back to models',
        vehicleError: 'Could not retrieve vehicle information.',
        vehicleFailure: 'Failed to retrieve vehicle. Please try again.',
        loadingVehicle: 'Loading vehicle information...',
      }
    : {
        title: 'Pesquisa de veículos',
        searchMake: 'Pesquise uma marca...',
        searchModel: 'Pesquise um modelo...',
        searchYear: 'Pesquise um ano...',
        makes: 'Marcas',
        found: 'encontradas',
        loadingMakes: 'Carregando marcas...',
        loadingModels: 'Carregando modelos...',
        loadingYears: 'Carregando anos...',
        noMake: 'Nenhuma marca encontrada.',
        noModel: 'Nenhum modelo encontrado.',
        noYear: 'Nenhum ano encontrado.',
        errorMakes: 'Não foi possível carregar as marcas.',
        errorModels: 'Não foi possível carregar os modelos.',
        errorYears: 'Não foi possível carregar os anos.',
        selectedMake: 'MARCA SELECIONADA',
        selectedVehicle: 'VEÍCULO SELECIONADO',
        availableModels: 'Modelos disponíveis',
        modelYear: 'Ano do modelo',
        backMakes: 'Voltar para marcas',
        backModels: 'Voltar para modelos',
        vehicleError: 'Não foi possível obter os dados deste veículo.',
        vehicleFailure: 'Falha ao consultar o veículo. Tente novamente.',
        loadingVehicle: 'Buscando informações do veículo...',
      };

  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [anos, setAnos] = useState([]);

  const [marcaSelecionada, setMarcaSelecionada] = useState(null);
  const [modeloSelecionado, setModeloSelecionado] = useState(null);
  const [busca, setBusca] = useState('');

  const [carregandoMarcas, setCarregandoMarcas] = useState(true);
  const [carregandoModelos, setCarregandoModelos] = useState(false);
  const [carregandoAnos, setCarregandoAnos] = useState(false);
  const [carregandoVeiculo, setCarregandoVeiculo] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarMarcas();
  }, []);

  async function carregarMarcas() {
    try {
      setErro('');
      const dados = await getMarcasCarros();
      setMarcas(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error('Erro ao carregar marcas:', error);
      setErro(textos.errorMakes);
    } finally {
      setCarregandoMarcas(false);
    }
  }

  async function selecionarMarca(marca) {
    setMarcaSelecionada(marca);
    setModeloSelecionado(null);
    setModelos([]);
    setAnos([]);
    setBusca('');
    setErro('');
    setCarregandoModelos(true);

    try {
      const dados = await getModelosCarros(marca.codigo);
      setModelos(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error('Erro ao carregar modelos:', error);
      setErro(textos.errorModels);
    } finally {
      setCarregandoModelos(false);
    }
  }

  async function selecionarModelo(modelo) {
    setModeloSelecionado(modelo);
    setAnos([]);
    setBusca('');
    setErro('');
    setCarregandoAnos(true);

    try {
      const dados = await getAnosModelo(
        marcaSelecionada.codigo,
        modelo.codigo
      );
      setAnos(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error('Erro ao carregar anos:', error);
      setErro(textos.errorYears);
    } finally {
      setCarregandoAnos(false);
    }
  }

  async function selecionarAno(ano) {
    setCarregandoVeiculo(true);
    setErro('');

    try {
      const dados = await getDadosVeiculo(
        marcaSelecionada.codigo,
        modeloSelecionado.codigo,
        ano.codigo
      );

      if (dados) {
        navigation.navigate('VehicleDetails', {
          veiculo: dados,
        });
      } else {
        setErro(textos.vehicleError);
      }
    } catch (error) {
      console.error('Erro ao consultar veículo:', error);
      setErro(textos.vehicleFailure);
    } finally {
      setCarregandoVeiculo(false);
    }
  }

  function voltarParaMarcas() {
    setMarcaSelecionada(null);
    setModeloSelecionado(null);
    setModelos([]);
    setAnos([]);
    setBusca('');
    setErro('');
  }

  function voltarParaModelos() {
    setModeloSelecionado(null);
    setAnos([]);
    setBusca('');
    setErro('');
  }

  const marcasFiltradas = marcas.filter((marca) =>
    marca.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const modelosFiltrados = modelos.filter((modelo) =>
    modelo.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const anosFiltrados = anos.filter((ano) =>
    ano.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const placeholder = modeloSelecionado
    ? textos.searchYear
    : marcaSelecionada
    ? textos.searchModel
    : textos.searchMake;

  function renderLista(dados, aoSelecionar) {
    return dados.map((item) => (
      <TouchableOpacity
        key={item.codigo}
        style={styles.item}
        activeOpacity={0.75}
        disabled={carregandoVeiculo}
        onPress={() => aoSelecionar(item)}
      >
        <View style={styles.itemIcon}>
          <Ionicons
            name="car-outline"
            size={22}
            color={cores.primary}
          />
        </View>

        <Text style={styles.itemText}>{item.nome}</Text>

        <Ionicons
          name="chevron-forward"
          size={20}
          color={cores.primary}
        />
      </TouchableOpacity>
    ));
  }

  function renderCarregamento(mensagem) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={cores.primary} />
        <Text style={styles.loadingText}>{mensagem}</Text>
      </View>
    );
  }

  function renderVazio(mensagem) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="search-outline"
          size={30}
          color={cores.secondary}
        />
        <Text style={styles.emptyText}>{mensagem}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
      styles.content,
      { paddingTop: Math.max(insets.top, 16) + 16 },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{textos.title}</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={21}
          color={cores.secondary}
        />

        <TextInput
          style={styles.search}
          placeholder={placeholder}
          placeholderTextColor={cores.secondary}
          value={busca}
          onChangeText={setBusca}
          autoCapitalize="none"
        />

        {busca.length > 0 && (
          <TouchableOpacity onPress={() => setBusca('')}>
            <Ionicons
              name="close-circle"
              size={20}
              color={cores.secondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {!marcaSelecionada && (
        <View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{textos.makes}</Text>
            <Text style={styles.counter}>
              {marcasFiltradas.length} {textos.found}
            </Text>
          </View>

          {carregandoMarcas
            ? renderCarregamento(textos.loadingMakes)
            : marcasFiltradas.length === 0
            ? renderVazio(erro || textos.noMake)
            : renderLista(marcasFiltradas, selecionarMarca)}
        </View>
      )}

      {marcaSelecionada && !modeloSelecionado && (
        <View>
          <TouchableOpacity
            style={styles.backButton}
            onPress={voltarParaMarcas}
          >
            <Ionicons
              name="arrow-back"
              size={19}
              color={cores.primary}
            />
            <Text style={styles.backText}>{textos.backMakes}</Text>
          </TouchableOpacity>

          <View style={styles.selectedCard}>
            <Text style={styles.selectedLabel}>
              {textos.selectedMake}
            </Text>
            <Text style={styles.selectedTitle}>
              {marcaSelecionada.nome}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>
            {textos.availableModels}
          </Text>

          {carregandoModelos
            ? renderCarregamento(textos.loadingModels)
            : erro
            ? renderVazio(erro)
            : modelosFiltrados.length === 0
            ? renderVazio(textos.noModel)
            : renderLista(modelosFiltrados, selecionarModelo)}
        </View>
      )}

      {marcaSelecionada && modeloSelecionado && (
        <View>
          <TouchableOpacity
            style={styles.backButton}
            onPress={voltarParaModelos}
          >
            <Ionicons
              name="arrow-back"
              size={19}
              color={cores.primary}
            />
            <Text style={styles.backText}>{textos.backModels}</Text>
          </TouchableOpacity>

          <View style={styles.selectedCard}>
            <Text style={styles.selectedLabel}>
              {textos.selectedVehicle}
            </Text>
            <Text style={styles.selectedTitle}>
              {marcaSelecionada.nome}
            </Text>
            <Text style={styles.selectedModel}>
              {modeloSelecionado.nome}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>{textos.modelYear}</Text>

          {carregandoAnos
            ? renderCarregamento(textos.loadingYears)
            : erro
            ? renderVazio(erro)
            : anosFiltrados.length === 0
            ? renderVazio(textos.noYear)
            : renderLista(anosFiltrados, selecionarAno)}
        </View>
      )}

      {carregandoVeiculo && (
        <View style={styles.vehicleLoading}>
          <ActivityIndicator size="large" color={cores.primary} />
          <Text style={styles.loadingText}>
            {textos.loadingVehicle}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

function criarEstilos(cores) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: cores.background,
    },

    content: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 30,
    },

    header: {
      marginBottom: 24,
    },

    title: {
      fontSize: 27,
      fontWeight: 'bold',
      color: cores.primary,
    },

    searchContainer: {
      minHeight: 54,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: cores.card,
      borderWidth: 1,
      borderColor: cores.border,
      borderRadius: 14,
      paddingHorizontal: 14,
      marginBottom: 27,
    },

    search: {
      flex: 1,
      paddingHorizontal: 10,
      paddingVertical: 12,
      fontSize: 14,
      color: cores.text,
    },

    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 13,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: cores.text,
      marginBottom: 13,
    },

    counter: {
      fontSize: 12,
      color: cores.secondary,
    },

    item: {
      minHeight: 66,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: cores.card,
      borderWidth: 1,
      borderColor: cores.border,
      borderRadius: 13,
      paddingHorizontal: 13,
      paddingVertical: 10,
      marginBottom: 10,
    },

    itemIcon: {
      width: 42,
      height: 42,
      borderRadius: 12,
      backgroundColor: cores.input,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },

    itemText: {
      flex: 1,
      fontSize: 15,
      fontWeight: '600',
      color: cores.text,
      marginRight: 8,
    },

    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      paddingVertical: 10,
      marginBottom: 13,
    },

    backText: {
      fontSize: 14,
      fontWeight: '600',
      color: cores.primary,
      marginLeft: 7,
    },

    selectedCard: {
      backgroundColor: cores.card,
      borderWidth: 1,
      borderColor: cores.border,
      borderRadius: 15,
      padding: 17,
      marginBottom: 23,
    },

    selectedLabel: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.8,
      color: cores.secondary,
      marginBottom: 7,
    },

    selectedTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: cores.primary,
    },

    selectedModel: {
      fontSize: 15,
      color: cores.secondary,
      marginTop: 5,
    },

    loading: {
      alignItems: 'center',
      paddingVertical: 35,
    },

    loadingText: {
      fontSize: 14,
      color: cores.secondary,
      marginTop: 12,
      textAlign: 'center',
    },

    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: cores.card,
      borderWidth: 1,
      borderColor: cores.border,
      borderRadius: 14,
      padding: 25,
      marginBottom: 15,
    },

    emptyText: {
      fontSize: 14,
      color: cores.secondary,
      textAlign: 'center',
      marginTop: 10,
      lineHeight: 21,
    },

    vehicleLoading: {
      alignItems: 'center',
      paddingVertical: 25,
      marginTop: 10,
    },
  });
}