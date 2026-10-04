import * as SQLite from 'expo-sqlite';

export async function inicializarBanco() {
  const db = await SQLite.openDatabaseAsync('garagepedia.db');

  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      telefone TEXT,
      senha TEXT NOT NULL,
      criado_em TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS favoritos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      codigo_fipe TEXT NOT NULL,
      marca TEXT NOT NULL,
      modelo TEXT NOT NULL,
      ano INTEGER NOT NULL,
      valor TEXT,
      combustivel TEXT,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON DELETE CASCADE,
      UNIQUE (usuario_id, codigo_fipe)
    );

    CREATE TABLE IF NOT EXISTS comparacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,

      veiculo1_codigo_fipe TEXT NOT NULL,
      veiculo1_marca TEXT NOT NULL,
      veiculo1_modelo TEXT NOT NULL,
      veiculo1_ano INTEGER NOT NULL,

      veiculo2_codigo_fipe TEXT NOT NULL,
      veiculo2_marca TEXT NOT NULL,
      veiculo2_modelo TEXT NOT NULL,
      veiculo2_ano INTEGER NOT NULL,

      criado_em TEXT NOT NULL,

      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON DELETE CASCADE
    );
  `);

    // Verifica e adiciona as novas colunas de preço e combustível
  const colunas = await db.getAllAsync(
    `PRAGMA table_info(comparacoes)`
  );

  const nomesColunas = colunas.map(
    (coluna) => coluna.name
  );

  if (!nomesColunas.includes('veiculo1_valor')) {
    await db.execAsync(
      'ALTER TABLE comparacoes ADD COLUMN veiculo1_valor TEXT'
    );
  }

  if (!nomesColunas.includes('veiculo1_combustivel')) {
    await db.execAsync(
      'ALTER TABLE comparacoes ADD COLUMN veiculo1_combustivel TEXT'
    );
  }

  if (!nomesColunas.includes('veiculo2_valor')) {
    await db.execAsync(
      'ALTER TABLE comparacoes ADD COLUMN veiculo2_valor TEXT'
    );
  }

  if (!nomesColunas.includes('veiculo2_combustivel')) {
    await db.execAsync(
      'ALTER TABLE comparacoes ADD COLUMN veiculo2_combustivel TEXT'
    );
  }

  return db;
}

export async function cadastrarUsuario(
  nome,
  email,
  telefone,
  senha
) {
  const db = await SQLite.openDatabaseAsync('garagepedia.db');

  const resultado = await db.runAsync(
    `INSERT INTO usuarios
      (nome, email, telefone, senha, criado_em)
     VALUES (?, ?, ?, ?, ?)`,
    nome,
    email,
    telefone,
    senha,
    new Date().toISOString()
  );

  return resultado.lastInsertRowId;
}

export async function listarUsuarios() {
  const db = await SQLite.openDatabaseAsync('garagepedia.db');

  const usuarios = await db.getAllAsync(
    'SELECT * FROM usuarios'
  );

  return usuarios;
}

export async function autenticarUsuario(email, senha) {
  const db = await SQLite.openDatabaseAsync('garagepedia.db');

  const usuario = await db.getFirstAsync(
    `SELECT * FROM usuarios
     WHERE email = ? AND senha = ?`,
    email,
    senha
  );

  return usuario;
}

export async function adicionarFavorito(
  usuarioId,
  veiculo
) {
  const db = await SQLite.openDatabaseAsync(
    'garagepedia.db'
  );

  await db.runAsync(
    `INSERT INTO favoritos
      (
        usuario_id,
        codigo_fipe,
        marca,
        modelo,
        ano,
        valor,
        combustivel
      )
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    usuarioId,
    veiculo.CodigoFipe,
    veiculo.Marca,
    veiculo.Modelo,
    veiculo.AnoModelo,
    veiculo.Valor,
    veiculo.Combustivel
  );
}

export async function listarFavoritos(usuarioId) {
  const db = await SQLite.openDatabaseAsync(
    'garagepedia.db'
  );

  const favoritos = await db.getAllAsync(
    `SELECT * FROM favoritos
     WHERE usuario_id = ?
     ORDER BY id DESC`,
    usuarioId
  );

  return favoritos;
}

export async function removerFavorito(
  usuarioId,
  codigoFipe
) {
  const db = await SQLite.openDatabaseAsync(
    'garagepedia.db'
  );

  await db.runAsync(
    `DELETE FROM favoritos
     WHERE usuario_id = ?
     AND codigo_fipe = ?`,
    usuarioId,
    codigoFipe
  );
}