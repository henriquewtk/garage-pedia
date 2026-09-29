export async function getMarcasCarros() {
  try {
    const response = await fetch(
      'https://parallelum.com.br/fipe/api/v1/carros/marcas'
    );

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Erro ao buscar marcas da FIPE:', error);
    return [];
  }
}

export async function getModelosCarros(codigoMarca) {
  try {
    const response = await fetch(
      `https://parallelum.com.br/fipe/api/v1/carros/marcas/${codigoMarca}/modelos`
    );

    const data = await response.json();

    return data.modelos;
  } catch (error) {
    console.error('Erro ao buscar modelos da FIPE:', error);
    return [];
  }
}

export async function getAnosModelo(codigoMarca, codigoModelo) {
  try {
    const response = await fetch(
      `https://parallelum.com.br/fipe/api/v1/carros/marcas/${codigoMarca}/modelos/${codigoModelo}/anos`
    );

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Erro ao buscar anos da FIPE:', error);
    return [];
  }
}

export async function getDadosVeiculo(
  codigoMarca,
  codigoModelo,
  codigoAno
) {
  try {
    const response = await fetch(
      `https://parallelum.com.br/fipe/api/v1/carros/marcas/${codigoMarca}/modelos/${codigoModelo}/anos/${codigoAno}`
    );

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Erro ao buscar dados do veículo:', error);
    return null;
  }
}