export async function getMarcasCarros() {
  try {
    const response = await fetch('https://parallelum.com.br/fipe/api/v1/carros/marcas');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar marcas da FIPE:', error);
    return [];
  }
}