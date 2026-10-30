TRUNCATE TABLE elenco, atores, filmes RESTART IDENTITY;

INSERT INTO filmes (titulo, ano_lancamento, genero, diretor, roteirista, premios, sinopse, nota) VALUES
  ('Matrix', 1999, 'Ficção Científica', 'Lana Wachowski', 'Lana Wachowski', 'Vencedor de 4 Oscars', 'Um jovem programador descobre que a realidade é uma simulação.', 8.7),
  ('O Cavaleiro das Trevas', 2008, 'Ação', 'Christopher Nolan', 'Christopher Nolan', 'Vencedor de 2 Oscars', 'Batman combate o caos instalado pelo Coringa em Gotham City.', 9.0),
  ('A Origem', 2010, 'Ficção Científica', 'Christopher Nolan', 'Christopher Nolan', 'Vencedor de 4 Oscars', 'Um ladrão rouba segredos corporativos usando tecnologia de compartilhamento de sonhos.', 8.8),
  ('Oppenheimer', 2023, 'Biografia', 'Christopher Nolan', 'Christopher Nolan', 'Vencedor de 7 Oscars', 'A história do físico J. Robert Oppenheimer e o desenvolvimento da bomba atômica.', 8.9),
  ('John Wick', 2014, 'Ação', 'Chad Stahelski', 'Derek Kolstad', 'Nenhum Oscar', 'Um ex-assassino de aluguel sai da aposentadoria para se vingar.', 7.4),
  ('Interstellar', 2014, 'Ficção Científica', 'Christopher Nolan', 'Jonathan Nolan', 'Vencedor de 1 Oscar', 'Uma equipe de exploradores viaja através de um buraco de minhoca no espaço.', 8.7),
  ('Pulp Fiction', 1994, 'Crime', 'Quentin Tarantino', 'Quentin Tarantino', 'Vencedor de 1 Oscar', 'As vidas de dois assassinos da máfia e um boxeador se entrelaçam.', 8.9);

INSERT INTO atores (nome, data_nascimento, genero_atuacao, premio) VALUES
  ('Keanu Reeves', '1964-09-02', 'Ação', '1 Bambi Award'),
  ('Christian Bale', '1974-01-30', 'Drama/Ação', 'Vencedor de 1 Oscar'),
  ('Leonardo DiCaprio', '1974-11-11', 'Drama', 'Vencedor de 1 Oscar'),
  ('Cillian Murphy', '1976-05-25', 'Drama', 'Vencedor de 1 Oscar'),
  ('Anne Hathaway', '1982-11-12', 'Drama/Comédia', 'Vencedora de 1 Oscar'),
  ('Samuel L. Jackson', '1948-12-21', 'Ação/Drama', 'Oscar Honorário'),
  ('Joseph Gordon-Levitt', '1981-02-17', 'Drama/Ação', 'Nenhum Oscar'),
  ('Tom Hardy', '1977-09-15', 'Ação', 'Indicado ao Oscar'),
  ('Florence Pugh', '1996-01-03', 'Drama', 'Indicada ao Oscar'),
  ('Elliot Page', '1987-02-21', 'Drama', 'Indicado ao Oscar');

INSERT INTO elenco (filme_id, ator_id, nome_personagem, e_protagonista) VALUES

  ((SELECT id FROM filmes WHERE titulo = 'Matrix'), (SELECT id FROM atores WHERE nome = 'Keanu Reeves'), 'Neo', true),


  ((SELECT id FROM filmes WHERE titulo = 'John Wick'), (SELECT id FROM atores WHERE nome = 'Keanu Reeves'), 'John Wick', true),


  ((SELECT id FROM filmes WHERE titulo = 'O Cavaleiro das Trevas'), (SELECT id FROM atores WHERE nome = 'Christian Bale'), 'Bruce Wayne / Batman', true),
  ((SELECT id FROM filmes WHERE titulo = 'O Cavaleiro das Trevas'), (SELECT id FROM atores WHERE nome = 'Cillian Murphy'), 'Jonathan Crane / Espantalho', false),
  ((SELECT id FROM filmes WHERE titulo = 'O Cavaleiro das Trevas'), (SELECT id FROM atores WHERE nome = 'Anne Hathaway'), 'Selina Kyle / Mulher-Gato', false),
  ((SELECT id FROM filmes WHERE titulo = 'O Cavaleiro das Trevas'), (SELECT id FROM atores WHERE nome = 'Joseph Gordon-Levitt'), 'John Blake', false),


  ((SELECT id FROM filmes WHERE titulo = 'A Origem'), (SELECT id FROM atores WHERE nome = 'Leonardo DiCaprio'), 'Dom Cobb', true),
  ((SELECT id FROM filmes WHERE titulo = 'A Origem'), (SELECT id FROM atores WHERE nome = 'Joseph Gordon-Levitt'), 'Arthur', false),
  ((SELECT id FROM filmes WHERE titulo = 'A Origem'), (SELECT id FROM atores WHERE nome = 'Elliot Page'), 'Ariadne', false),
  ((SELECT id FROM filmes WHERE titulo = 'A Origem'), (SELECT id FROM atores WHERE nome = 'Tom Hardy'), 'Eames', false),
  ((SELECT id FROM filmes WHERE titulo = 'A Origem'), (SELECT id FROM atores WHERE nome = 'Cillian Murphy'), 'Robert Fischer', false),

  ((SELECT id FROM filmes WHERE titulo = 'Oppenheimer'), (SELECT id FROM atores WHERE nome = 'Cillian Murphy'), 'J. Robert Oppenheimer', true),
  ((SELECT id FROM filmes WHERE titulo = 'Oppenheimer'), (SELECT id FROM atores WHERE nome = 'Florence Pugh'), 'Jean Tatlock', false),


  ((SELECT id FROM filmes WHERE titulo = 'Interstellar'), (SELECT id FROM atores WHERE nome = 'Anne Hathaway'), 'Amelia Brand', true),

  ((SELECT id FROM filmes WHERE titulo = 'Pulp Fiction'), (SELECT id FROM atores WHERE nome = 'Samuel L. Jackson'), 'Jules Winnfield', true);

