DROP TABLE IF EXISTS elenco;
DROP TABLE IF EXISTS atores;
DROP TABLE IF EXIST filmes;

CREATE TABLE filmes (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(100) NOT NULL,
  ano_lancamento INTEGER NOT NULL,
  genero VARCHAR(50) NOT NULL,
  diretor VARCHAR(100) NOT NULL,
  roteirista VARCHAR(100) NOT NULL,
  premios VARCHAR(250),
  sinopse TEXT NOT NULL,
  nota DECIMAL(3,1) NOT NULL 
);

CREATE TABLE atores (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  data_nascimento DATE NOT NULL,
  genero_atuacao VARCHAR(50),
  premio VARCHAR(250)
);

CREATE TABLE elenco (
  id SERIAL PRIMARY KEY,
  filme_id INTEGER NOT NULL REFERENCES filmes(id) ON DELETE CASCADE,
  ator_id INTEGER NOT NULL REFERENCES atores(id) ON DELETE CASCADE,
  nome_personagem VARCHAR(100) NOT NULL,
  e_protagonista BOOLEAN NOT NULL
);