SELECT
filmes.titulo,
atores.nome AS nome_ator,
elenco.nome_personagem,
elenco.e_protagonista
FROM elenco
INNER JOIN filmes ON elenco.filme_id = filmes.id
INNER JOIN atores ON elenco.ator_id = atores.id
