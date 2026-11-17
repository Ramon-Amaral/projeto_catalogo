import { useState, useEffect, type SubmitEvent } from "react";
import { api } from "./services/api";
import type { Filme } from "./types/Filme";

function App() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [titulo, setTitulo] = useState("");
  const [sinopse, setSinopse] = useState("");
  const [nota_pessoal, setNota_pessoal] = useState("");

  useEffect(() => {
    api.get("/filmes").then((response) => {
      setFilmes(response.data);
    });
  }, []);

  async function handleCadastrar(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const response = await api.post("/filmes", {
      titulo,
      sinopse,
      nota_pessoal: Number(nota_pessoal),
    });
    setFilmes([...filmes, response.data]);
    setTitulo("");
    setSinopse("");
    setNota_pessoal("");
  }

  return (
    <div>
      <h1>Catálogo de Filmes</h1>
      {filmes.map((filme) => (
        <div key={filme.id}>
          <h2>{filme.titulo}</h2>
          <p>{filme.diretor}</p>
          <p>{filme.ano_lancamento}</p>
        </div>
      ))}

      <form onSubmit={handleCadastrar}>
        <input
          type="text"
          placeholder="Título do Filme"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <input
          type="text"
          placeholder="Sinopse do Filme"
          value={sinopse}
          onChange={(e) => setSinopse(e.target.value)}
        />

        <input
          type="number"
          placeholder="Nota do filme"
          value={nota_pessoal}
          onChange={(e) => setNota_pessoal(e.target.value)}
        />

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default App;
