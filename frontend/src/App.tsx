import { useState, useEffect, type SubmitEvent } from "react";
import { api } from "./services/api";
import type { Filme } from "./types/Filme";

function App() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [titulo, setTitulo] = useState("");
  const [sinopse, setSinopse] = useState("");
  const [nota_pessoal, setNota_pessoal] = useState("");
  const [idEditando, setIdEditando] = useState <number | null>(null);

  useEffect(() => {
    api.get("/filmes").then((response) => {
      setFilmes(response.data);
    });
  }, []);

  async function handleSalvar(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
   if (idEditando) {
    const response = await api.put(`/filmes/${idEditando}`, {
      titulo,
      sinopse,
      nota_pessoal: Number(nota_pessoal),
    })

    setFilmes(
      filmes.map((filme) => (filme.id === idEditando ? response.data : filme))
  );
  setIdEditando(null);
    } else {

    const response = await api.post("/filmes", {
      titulo,
      sinopse,
      nota_pessoal: Number(nota_pessoal),
    });
    setFilmes([...filmes, response.data]);
   }
    setTitulo("");
    setSinopse("");
    setNota_pessoal("");
  }

  async function handleExcluir(id:number) {
    await api.delete(`/filmes/${id}`)
    setFilmes(filmes.filter((filme) => filme.id !== id))
     }
    
    async function handleSelecionarEdicao (filme: Filme) {
      setIdEditando(filme.id)
      setTitulo(filme.titulo)
      setSinopse(filme.sinopse || "")
      setNota_pessoal(filme.nota_pessoal ? String(filme.nota_pessoal) : "")

   

  }
  return (
    <div>
      <h1>Catálogo de Filmes</h1>
      {filmes.map((filme) => (
        <div key={filme.id}>
          <h2>{filme.titulo}</h2>
          <p>{filme.diretor}</p>
          <p>{filme.ano_lancamento}</p>

          <button type="button" onClick={() => handleExcluir(filme.id)}>
            Excluir
          </button>

          <button type="button" onClick={() => handleSelecionarEdicao(filme)}>
            Editar
          </button>
        </div>
      ))}

      <form onSubmit={handleSalvar}>
        <input
          type="text"
          placeholder="Título do Filme"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          disabled={idEditando !== null}
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

        <button type="submit">{idEditando? "Salvar Alterações" : "Cadastrar"}</button>
      </form>
    </div>
  );
}

export default App;
