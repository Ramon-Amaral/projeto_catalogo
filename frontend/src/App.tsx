import { useState, useEffect } from "react";
import { api } from "./services/api";
import type { Filme } from "./types/Filme";

function App() {
  const [filmes, setFilmes] = useState<Filme[]>([]);

  useEffect(() => {
    api.get("/filmes").then((response) => {
      setFilmes(response.data);
    });
  }, []);

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
    </div>
  );
}

export default App;
