import { useState, useEffect, type SubmitEvent } from "react";
import { api } from "./services/api";
import type { Filme } from "./types/Filme";
import { FilmeCard } from "./components/FilmeCard";

function App() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [titulo, setTitulo] = useState("");
  const [sinopse, setSinopse] = useState("");
  const [nota_pessoal, setNota_pessoal] = useState("");
  const [idEditando, setIdEditando] = useState<number | null>(null);

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
      });

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

  async function handleExcluir(id: number) {
    await api.delete(`/filmes/${id}`);
    setFilmes(filmes.filter((filme) => filme.id !== id));
  }

  async function handleSelecionarEdicao(filme: Filme) {
    setIdEditando(filme.id);
    setTitulo(filme.titulo);
    setSinopse(filme.sinopse || "");
    setNota_pessoal(filme.nota_pessoal ? String(filme.nota_pessoal) : "");
  }

  function handleCancelarEdicao() {
    setIdEditando(null);
    setTitulo("");
    setSinopse("");
    setNota_pessoal("");
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-amber-400 mb-8">
          Catálogo de Filmes
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filmes.map((filme) => (
            <FilmeCard
              key={filme.id}
              filme={filme}
              onEditar={handleSelecionarEdicao}
              onExcluir={handleExcluir}
            />
          ))}
        </div>

       
      </div>
    </div>
  );
}

export default App;