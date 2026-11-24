import { useState, useEffect, type SubmitEvent } from "react";
import { api } from "./services/api";
import type { Filme } from "./types/Filme";
import type { Ator } from "./types/Ator";
import type { ElencoItem } from "./types/Elenco";
import { FilmeCard } from "./components/FilmeCard";
import { FilmeModal } from "./components/FilmeModal";
import { AtorCard } from "./components/AtorCard";
import { AtorModal } from "./components/AtorModal";
import { ElencoModal } from "./components/ElencoModal";

type AbaAtiva = "filmes" | "atores";

function App() {
  const [abaAtiva, setAbaAtiva] = useState<AbaAtiva>("filmes");

  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [titulo, setTitulo] = useState("");
  const [sinopse, setSinopse] = useState("");
  const [nota_pessoal, setNota_pessoal] = useState("");
  const [modalFilmeAberto, setModalFilmeAberto] = useState(false);
  const [idFilmeEditando, setIdFilmeEditando] = useState<number | null>(null);
  const [busca, setBusca] = useState("");
  const [filtroNota, setFiltroNota] = useState("");

  const [atores, setAtores] = useState<Ator[]>([]);
  const [nomeAtor, setNomeAtor] = useState("");
  const [dataNascimentoAtor, setDataNascimentoAtor] = useState("");
  const [generoAtor, setGeneroAtor] = useState("");
  const [premioAtor, setPremioAtor] = useState("");
  const [modalAtorAberto, setModalAtorAberto] = useState(false);
  const [idAtorEditando, setIdAtorEditando] = useState<number | null>(null);
  const [buscaAtor, setBuscaAtor] = useState("");

  const [elencos, setElencos] = useState<ElencoItem[]>([]);
  const [filmeElencoSelecionado, setFilmeElencoSelecionado] =
    useState<Filme | null>(null);

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [itemExcluindo, setItemExcluindo] = useState<{
    tipo: "filme" | "ator";
    id: number;
    nome: string;
  } | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  async function sincronizarEmSegundoPlano() {
    const [resFilmes, resAtores, resElencos] = await Promise.all([
      api.get("/filmes"),
      api.get("/atores"),
      api.get("/elencos"),
    ]);
    setFilmes(resFilmes.data);
    setAtores(resAtores.data);
    setElencos(resElencos.data);
  }

  async function carregarDados() {
    try {
      setCarregando(true);
      setErro("");
      await sincronizarEmSegundoPlano();
    } catch {
      setErro(
        "Não foi possível carregar os dados. Verifique se a API está rodando.",
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  async function handleSalvarFilme(e: SubmitEvent<HTMLFormElement>) {
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

      if (idFilmeEditando) {
        await api.put(`/filmes/${idFilmeEditando}`, {
          titulo: titulo.trim(),
          sinopse: sinopse.trim(),
          nota_pessoal: notaNumerica,
        });
        setIdFilmeEditando(null);
      } else {
        await api.post("/filmes", {
          titulo: titulo.trim(),
          sinopse: sinopse.trim(),
          nota_pessoal: notaNumerica,
        });
      }

      await sincronizarEmSegundoPlano();

      setTitulo("");
      setSinopse("");
      setNota_pessoal("");
      setModalFilmeAberto(false);
    } catch {
      setErro("Erro ao salvar o filme. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  function handleSelecionarEdicaoFilme(filme: Filme) {
    setIdFilmeEditando(filme.id);
    setTitulo(filme.titulo);
    setSinopse(filme.sinopse || "");
    setNota_pessoal(
      filme.nota_pessoal !== null && filme.nota_pessoal !== undefined
        ? String(filme.nota_pessoal)
        : "",
    );
    setModalFilmeAberto(true);
  }

  function handleAbrirNovoFilme() {
    setIdFilmeEditando(null);
    setTitulo("");
    setSinopse("");
    setNota_pessoal("");
    setModalFilmeAberto(true);
  }

  async function handleSalvarAtor(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (salvando || !nomeAtor.trim()) return;

    try {
      setSalvando(true);
      setErro("");

      const payload = {
        nome: nomeAtor.trim(),
        data_nascimento: dataNascimentoAtor || undefined,
        genero_atuacao: generoAtor.trim() || undefined,
        premio: premioAtor.trim() || undefined,
      };

      if (idAtorEditando) {
        await api.put(`/atores/${idAtorEditando}`, payload);
        setIdAtorEditando(null);
      } else {
        await api.post("/atores", payload);
      }

      await sincronizarEmSegundoPlano();

      setNomeAtor("");
      setDataNascimentoAtor("");
      setGeneroAtor("");
      setPremioAtor("");
      setModalAtorAberto(false);
    } catch {
      setErro("Erro ao salvar o ator. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  function handleSelecionarEdicaoAtor(ator: Ator) {
    setIdAtorEditando(ator.id);
    setNomeAtor(ator.nome);
    setDataNascimentoAtor(
      ator.data_nascimento ? ator.data_nascimento.slice(0, 10) : "",
    );
    setGeneroAtor(
      ator.genero_atuacao && ator.genero_atuacao !== "Atuação"
        ? ator.genero_atuacao
        : "",
    );
    setPremioAtor(ator.premio || "");
    setModalAtorAberto(true);
  }

  function handleAbrirNovoAtor() {
    setIdAtorEditando(null);
    setNomeAtor("");
    setDataNascimentoAtor("");
    setGeneroAtor("");
    setPremioAtor("");
    setModalAtorAberto(true);
  }

  async function handleAdicionarElenco(dados: {
    filme_id: number;
    ator_id: number;
    nome_personagem: string;
    e_protagonista: boolean;
  }) {
    try {
      setSalvando(true);
      setErro("");
      await api.post("/elencos", dados);
      const resElencos = await api.get("/elencos");
      setElencos(resElencos.data);
    } catch {
      setErro("Erro ao adicionar ator ao elenco.");
    } finally {
      setSalvando(false);
    }
  }

  async function handleRemoverElenco(elencoId: number) {
    try {
      setSalvando(true);
      setErro("");
      await api.delete(`/elencos/${elencoId}`);
      setElencos(elencos.filter((item) => item.id !== elencoId));
    } catch {
      setErro("Erro ao remover ator do elenco.");
    } finally {
      setSalvando(false);
    }
  }

  async function handleConfirmarExclusao() {
    if (!itemExcluindo || excluindo) return;

    try {
      setExcluindo(true);
      setErro("");

      if (itemExcluindo.tipo === "filme") {
        await api.delete(`/filmes/${itemExcluindo.id}`);
        setFilmes(filmes.filter((f) => f.id !== itemExcluindo.id));
        setElencos(elencos.filter((e) => e.filme_id !== itemExcluindo.id));
      } else {
        await api.delete(`/atores/${itemExcluindo.id}`);
        setAtores(atores.filter((a) => a.id !== itemExcluindo.id));
        setElencos(elencos.filter((e) => e.ator_id !== itemExcluindo.id));
      }

      setItemExcluindo(null);
    } catch {
      setErro("Erro ao excluir registro. Tente novamente.");
    } finally {
      setExcluindo(false);
    }
  }

  function validarEntradaNota(valor: string, setter: (v: string) => void) {
    const padronizado = valor.replace(",", ".");
    if (padronizado === "") {
      setter("");
      return;
    }
    if (!/^\d*\.?\d*$/.test(padronizado)) return;
    const numero = Number(padronizado);
    if (numero >= 0 && numero <= 10) setter(padronizado);
  }

  const filmeFiltrado = filmes.filter((filme) => {
    const termo = busca.trim().toLowerCase();
    const bateTitulo = filme.titulo.toLowerCase().includes(termo);
    const bateAtorNoElenco = elencos.some(
      (e) => e.filme_id === filme.id && e.ator.toLowerCase().includes(termo),
    );

    const notaFilme = Number(filme.nota_pessoal);
    const compararNota =
      filtroNota === "" ||
      (filtroNota.includes(".")
        ? notaFilme === Number(filtroNota)
        : Math.floor(notaFilme) === Number(filtroNota));

    return compararNota && (bateTitulo || bateAtorNoElenco);
  });

  const atorFiltrado = atores.filter((ator) =>
    ator.nome.toLowerCase().includes(buscaAtor.trim().toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-amber-400">
              Catálogo de Filmes
            </h1>
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={() => setAbaAtiva("filmes")}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  abaAtiva === "filmes"
                    ? "bg-amber-500 text-zinc-950"
                    : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
                }`}
              >
                Filmes ({filmes.length})
              </button>
              <button
                type="button"
                onClick={() => setAbaAtiva("atores")}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  abaAtiva === "atores"
                    ? "bg-amber-500 text-zinc-950"
                    : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
                }`}
              >
                Atores ({atores.length})
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={
              abaAtiva === "filmes" ? handleAbrirNovoFilme : handleAbrirNovoAtor
            }
            className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold py-2.5 px-5 rounded-lg transition cursor-pointer"
          >
            {abaAtiva === "filmes" ? "+ Novo Filme" : "+ Novo Ator"}
          </button>
        </div>

        {abaAtiva === "filmes" ? (
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <input
              type="text"
              placeholder="Busque por título do filme ou nome do ator..."
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
                onChange={(e) =>
                  validarEntradaNota(e.target.value, setFiltroNota)
                }
                className="w-28 bg-transparent text-zinc-100 placeholder-zinc-500 focus:outline-none"
              />
              {filtroNota !== "" && (
                <button
                  type="button"
                  onClick={() => setFiltroNota("")}
                  className="text-xs text-zinc-400 hover:text-amber-400 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <input
              type="text"
              placeholder="Buscar ator pelo nome..."
              value={buscaAtor}
              onChange={(e) => setBuscaAtor(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition"
            />
          </div>
        )}

        {erro && (
          <div className="bg-red-950/50 border border-red-800 text-red-200 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
            <span>{erro}</span>
            <button
              type="button"
              onClick={carregarDados}
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
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 h-48 animate-pulse"
              />
            ))}
          </div>
        ) : abaAtiva === "filmes" ? (
          filmeFiltrado.length === 0 ? (
            <div className="text-center py-16 bg-zinc-900/50 border border-zinc-800/80 rounded-xl">
              <p className="text-zinc-400 text-lg">Nenhum filme encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filmeFiltrado.map((filme) => (
                <FilmeCard
                  key={filme.id}
                  filme={filme}
                  totalElenco={
                    elencos.filter((e) => e.filme_id === filme.id).length
                  }
                  onAbrirElenco={setFilmeElencoSelecionado}
                  onEditar={handleSelecionarEdicaoFilme}
                  onExcluir={(id) =>
                    setItemExcluindo({ tipo: "filme", id, nome: filme.titulo })
                  }
                />
              ))}
            </div>
          )
        ) : atorFiltrado.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/50 border border-zinc-800/80 rounded-xl">
            <p className="text-zinc-400 text-lg mb-4">
              Nenhum ator encontrado.
            </p>
            <button
              type="button"
              onClick={handleAbrirNovoAtor}
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold py-2 px-4 rounded-lg transition cursor-pointer"
            >
              Cadastrar primeiro ator
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {atorFiltrado.map((ator) => (
              <AtorCard
                key={ator.id}
                ator={ator}
                onEditar={handleSelecionarEdicaoAtor}
                onExcluir={(id) =>
                  setItemExcluindo({ tipo: "ator", id, nome: ator.nome })
                }
              />
            ))}
          </div>
        )}

        <FilmeModal
          aberto={modalFilmeAberto}
          idEditando={idFilmeEditando}
          titulo={titulo}
          sinopse={sinopse}
          nota_pessoal={nota_pessoal}
          salvando={salvando}
          onChangeTitulo={setTitulo}
          onChangeSinopse={setSinopse}
          onChangeNota={(v) => validarEntradaNota(v, setNota_pessoal)}
          onSalvar={handleSalvarFilme}
          onFechar={() => !salvando && setModalFilmeAberto(false)}
        />

        <AtorModal
          aberto={modalAtorAberto}
          idEditando={idAtorEditando}
          nome={nomeAtor}
          dataNascimento={dataNascimentoAtor}
          generoAtuacao={generoAtor}
          premio={premioAtor}
          salvando={salvando}
          onChangeNome={setNomeAtor}
          onChangeDataNascimento={setDataNascimentoAtor}
          onChangeGeneroAtuacao={setGeneroAtor}
          onChangePremio={setPremioAtor}
          onSalvar={handleSalvarAtor}
          onFechar={() => !salvando && setModalAtorAberto(false)}
        />

        <ElencoModal
          filme={filmeElencoSelecionado}
          atores={atores}
          elencoDoFilme={
            filmeElencoSelecionado
              ? elencos.filter((e) => e.filme_id === filmeElencoSelecionado.id)
              : []
          }
          salvando={salvando}
          onAdicionar={handleAdicionarElenco}
          onRemover={handleRemoverElenco}
          onFechar={() => setFilmeElencoSelecionado(null)}
        />

        {itemExcluindo !== null && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-sm p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-zinc-100 mb-2">
                Excluir {itemExcluindo.tipo === "filme" ? "filme" : "ator"}?
              </h3>
              <p className="text-sm text-zinc-400 mb-6">
                Tem certeza que deseja excluir{" "}
                <strong className="text-zinc-200">{itemExcluindo.nome}</strong>?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setItemExcluindo(null)}
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
