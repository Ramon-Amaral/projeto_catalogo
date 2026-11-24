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
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const [idExcluindo, setIdExcluindo] = useState<number | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  async function carregarFilmes() {
    try {
      setCarregando(true);
      setErro("");
      const response = await api.get("/filmes");
      setFilmes(response.data);
    } catch {
      setErro("Não foi possível carregar os filmes. Verifique se a API está rodando.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarFilmes();
  }, []);

  async function handleSalvar(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (salvando || !titulo.trim()) return;

    const notaNumerica = nota_pessoal === "" ? 0 : Number(nota_pessoal);
    if (Number.isNaN(notaNumerica) || notaNumerica < 0 || notaNumerica > 10) {
      setErro("A nota deve ser um número entre 0 e 10.");
      return;
    }

    try {
      setSalvando(true);
      setErro("");

      if (idEditando) {
        const response = await api.put(`/filmes/${idEditando}`, {
          titulo: titulo.trim(),
          sinopse: sinopse.trim(),
          nota_pessoal: notaNumerica,
        });

        setFilmes(
          filmes.map((filme) => (filme.id === idEditando ? response.data : filme))
        );
        setIdEditando(null);
      } else {
        const response = await api.post("/filmes", {
          titulo: titulo.trim(),
          sinopse: sinopse.trim(),
          nota_pessoal: notaNumerica,
        });
        setFilmes([...filmes, response.data]);
      }

      setTitulo("");
      setSinopse("");
      setNota_pessoal("");
      setModal_Aberto(false);
    } catch {
      setErro("Erro ao salvar o filme. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  function handleSolicitarExclusao(id: number) {
    setIdExcluindo(id);
  }

  async function handleConfirmarExclusao() {
    if (idExcluindo === null || excluindo) return;

    try {
      setExcluindo(true);
      setErro("");
      await api.delete(`/filmes/${idExcluindo}`);
      setFilmes(filmes.filter((filme) => filme.id !== idExcluindo));
      setIdExcluindo(null);
    } catch {
      setErro("Erro ao excluir o filme. Tente novamente.");
    } finally {
      setExcluindo(false);
    }
  }

  function handleSelecionarEdicao(filme: Filme) {
    setModal_Aberto(true);
    setIdEditando(filme.id);
    setTitulo(filme.titulo);
    setSinopse(filme.sinopse || "");
    setNota_pessoal(
      filme.nota_pessoal !== null && filme.nota_pessoal !== undefined
        ? String(filme.nota_pessoal)
        : ""
    );
  }

  function handleCancelarEdicao() {
    if (salvando) return;
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

  function validarEntradaNota(valor: string, setter: (v: string) => void) {
    const padronizado = valor.replace(",", ".");

    if (padronizado === "") {
      setter("");
      return;
    }

    if (!/^\d*\.?\d*$/.test(padronizado)) return;

    const numero = Number(padronizado);
    if (numero >= 0 && numero <= 10) {
      setter(padronizado);
    }
  }

  function handleFiltroNota(valor: string) {
    validarEntradaNota(valor, setFiltroNota);
  }

  function handleNotaModal(valor: string) {
    validarEntradaNota(valor, setNota_pessoal);
  }

  function limparFiltros() {
    setBusca("");
    setFiltroNota("");
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

  const filmeSelecionadoParaExcluir = filmes.find((f) => f.id === idExcluindo);

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

        {erro && (
          <div className="bg-red-950/50 border border-red-800 text-red-200 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
            <span>{erro}</span>
            <button
              type="button"
              onClick={carregarFilmes}
              className="bg-red-900 hover:bg-red-800 text-white text-sm font-medium px-3 py-1.5 rounded transition cursor-pointer"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {carregando ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 h-48 animate-pulse flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="h-6 bg-zinc-800 rounded w-3/4" />
                  <div className="h-4 bg-zinc-800 rounded w-full" />
                  <div className="h-4 bg-zinc-800 rounded w-5/6" />
                </div>
                <div className="h-8 bg-zinc-800 rounded w-24" />
              </div>
            ))}
          </div>
        ) : filmeFiltrado.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/50 border border-zinc-800/80 rounded-xl">
            {filmes.length === 0 ? (
              <>
                <p className="text-zinc-400 text-lg mb-4">
                  Você ainda não cadastrou nenhum filme.
                </p>
                <button
                  type="button"
                  onClick={handleAbrirNovoFilme}
                  className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold py-2 px-4 rounded-lg transition cursor-pointer"
                >
                  Cadastrar primeiro filme
                </button>
              </>
            ) : (
              <>
                <p className="text-zinc-400 text-lg mb-4">
                  Nenhum filme encontrado com esses filtros.
                </p>
                <button
                  type="button"
                  onClick={limparFiltros}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-medium py-2 px-4 rounded-lg transition cursor-pointer"
                >
                  Limpar filtros
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filmeFiltrado.map((filme) => (
              <FilmeCard
                key={filme.id}
                filme={filme}
                onEditar={handleSelecionarEdicao}
                onExcluir={handleSolicitarExclusao}
              />
            ))}
          </div>
        )}

        <FilmeModal
          aberto={modal_Aberto}
          idEditando={idEditando}
          titulo={titulo}
          sinopse={sinopse}
          nota_pessoal={nota_pessoal}
          salvando={salvando}
          onChangeTitulo={setTitulo}
          onChangeSinopse={setSinopse}
          onChangeNota={handleNotaModal}
          onSalvar={handleSalvar}
          onFechar={handleCancelarEdicao}
        />

        {idExcluindo !== null && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-sm p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-zinc-100 mb-2">
                Excluir filme?
              </h3>
              <p className="text-sm text-zinc-400 mb-6">
                Tem certeza que deseja excluir{" "}
                <strong className="text-zinc-200">
                  {filmeSelecionadoParaExcluir?.titulo}
                </strong>
                ? Essa ação não pode ser desfeita.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIdExcluindo(null)}
                  disabled={excluindo}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium transition cursor-pointer disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmarExclusao}
                  disabled={excluindo}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold transition cursor-pointer disabled:opacity-50"
                >
                  {excluindo ? "Excluindo..." : "Sim, excluir"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;