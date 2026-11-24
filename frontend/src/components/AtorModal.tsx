import type { SubmitEvent } from "react";

interface AtorModalProps {
  aberto: boolean;
  idEditando: number | null;
  nome: string;
  dataNascimento: string;
  generoAtuacao: string;
  premio: string;
  salvando: boolean;
  onChangeNome: (valor: string) => void;
  onChangeDataNascimento: (valor: string) => void;
  onChangeGeneroAtuacao: (valor: string) => void;
  onChangePremio: (valor: string) => void;
  onSalvar: (e: SubmitEvent<HTMLFormElement>) => void;
  onFechar: () => void;
}

export function AtorModal({
  aberto,
  idEditando,
  nome,
  dataNascimento,
  generoAtuacao,
  premio,
  salvando,
  onChangeNome,
  onChangeDataNascimento,
  onChangeGeneroAtuacao,
  onChangePremio,
  onSalvar,
  onFechar,
}: AtorModalProps) {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-amber-400">
            {idEditando ? "Editar Ator" : "Novo Ator"}
          </h2>
          <button
            type="button"
            onClick={onFechar}
            disabled={salvando}
            className="text-zinc-400 hover:text-zinc-200 cursor-pointer"
          >
            ✕
          </button>
        </div>
        <p className="text-xs text-zinc-400 mb-5">
          Foto e data de nascimento são buscadas automaticamente na TMDB se deixadas em branco.
        </p>

        <form onSubmit={onSalvar} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Nome *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Keanu Reeves"
              value={nome}
              onChange={(e) => onChangeNome(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Data de Nascimento (opcional)
            </label>
            <input
              type="date"
              value={dataNascimento}
              onChange={(e) => onChangeDataNascimento(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Área / Gênero de Atuação (opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: Ação, Drama"
              value={generoAtuacao}
              onChange={(e) => onChangeGeneroAtuacao(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Prêmios (opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: Oscar de Melhor Ator"
              value={premio}
              onChange={(e) => onChangePremio(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onFechar}
              disabled={salvando}
              className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold transition cursor-pointer disabled:opacity-50"
            >
              {salvando ? "Salvando..." : idEditando ? "Salvar" : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}