TRUNCATE TABLE elenco, atores, filmes RESTART IDENTITY;

-- Em seguida mantemos os seus INSERTs:
INSERT INTO filmes (titulo, ano_lancamento, genero, diretor, roteirista, premios, sinopse, nota)
VALUES(
  'Matrix',
   1999,
  'Ficção Científica',
  'Lana Wachowski',
  'Lana Wachowski',
  'Vencedor de 4 Oscars',
  'Um jovem programador descobre que a realidade é uma simulação',
  8.7
);

INSERT INTO atores (nome, data_nascimento, genero_atuacao, premio)
VALUES(
  'Keanu Reeves',
  '1964-09-02',
  'Ação',
  '1 Bambi Award'
);

INSERT INTO elenco (filme_id, ator_id, nome_personagem, e_protagonista)
VALUES(
  (SELECT id FROM filmes WHERE titulo = 'Matrix'),
  (SELECT id FROM atores WHERE nome = 'Keanu Reeves'),
  'Neo',
  true
);