import { useState, useEffect, type SubmitEvent } from "react";
import { api } from "./services/api";
import type { Filme } from "./types/Filme";
import { FilmeCard } from "./components/FilmeCard";
import { FilmeModal } from "./components/FilmeModal";

function App() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [titulo, setTitulo] = useState("");
  const [sinopse, setSinopse] = useState("");
  const [nota_pessoal, setNota_pessoal] = useState("");
  const [modal_Aberto, setModal_Aberto] = useState<boolean>(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [busca, setBusca] = useState("");
  const [filtroNota, setFiltroNota] = useState("");

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
    setModal_Aberto(false);
  }

  async function handleExcluir(id: number) {
    await api.delete(`/filmes/${id}`);
    setFilmes(filmes.filter((filme) => filme.id !== id));
  }

  function handleSelecionarEdicao(filme: Filme) {
    setModal_Aberto(true);
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
    setModal_Aberto(false);
  }

  function handleAbrirNovoFilme() {
    setIdEditando(null);
    setTitulo("");
    setSinopse("");
    setNota_pessoal("");
    setModal_Aberto(true);
  }

  function handleFiltroNota(valor: string) {
    const padronizado = valor.replace(",", ".");

    if (padronizado === "") {
      setFiltroNota("");
      return;
    }

    if (!/^\d*\.?\d*$/.test(padronizado)) return;

    const numero = Number(padronizado);
    if (numero >= 0 && numero <= 10) {
      setFiltroNota(padronizado);
    }
  }

  const filmeFiltrado = filmes.filter((filme) => {
    const compararTitulo = filme.titulo
      .toLowerCase()
      .includes(busca.trim().toLowerCase());

    const notaFilme = Number(filme.nota_pessoal);
    const compararNota =
      filtroNota === "" ||
      (filtroNota.includes(".")
        ? notaFilme === Number(filtroNota)
        : Math.floor(notaFilme) === Number(filtroNota));

    return compararNota && compararTitulo;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-amber-400">
            Meus Filmes
          </h1>
          <button
            type="button"
            onClick={handleAbrirNovoFilme}
            className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold py-2.5 px-5 rounded-lg transition cursor-pointer"
          >
            + Novo Filme
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Digite o título do filme..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition"
          />

          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 focus-within:border-amber-500 transition">
            <input
              type="text"
              inputMode="decimal"
              placeholder="Nota (0 a 10)"
              value={filtroNota}
              onChange={(e) => handleFiltroNota(e.target.value)}
              className="w-28 bg-transparent text-zinc-100 placeholder-zinc-500 focus:outline-none"
            />
            {filtroNota !== "" && (
              <button
                type="button"
                onClick={() => setFiltroNota("")}
                className="text-xs text-zinc-400 hover:text-amber-400 cursor-pointer"
                title="Limpar filtro de nota"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filmeFiltrado.map((filme) => (
            <FilmeCard
              key={filme.id}
              filme={filme}
              onEditar={handleSelecionarEdicao}
              onExcluir={handleExcluir}
            />
          ))}
        </div>

        <FilmeModal
          aberto={modal_Aberto}
          idEditando={idEditando}
          titulo={titulo}
          sinopse={sinopse}
          nota_pessoal={nota_pessoal}
          onChangeTitulo={setTitulo}
          onChangeSinopse={setSinopse}
          onChangeNota={setNota_pessoal}
          onSalvar={handleSalvar}
          onFechar={handleCancelarEdicao}
        />
      </div>
    </div>
  );
}

export default App;