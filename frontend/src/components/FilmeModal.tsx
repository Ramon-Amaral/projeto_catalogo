import type { SubmitEvent } from "react";

interface FilmeModalProps {
  aberto: boolean;
  idEditando: number | null;
  titulo: string;
  sinopse: string;
  nota_pessoal: string;
  salvando: boolean;
  onChangeTitulo: (valor: string) => void;
  onChangeSinopse: (valor: string) => void;
  onChangeNota: (valor: string) => void;
  onSalvar: (e: SubmitEvent<HTMLFormElement>) => void;
  onFechar: () => void;
}

export function FilmeModal({
  aberto,
  idEditando,
  titulo,
  sinopse,
  nota_pessoal,
  salvando,
  onChangeTitulo,
  onChangeSinopse,
  onChangeNota,
  onSalvar,
  onFechar,
}: FilmeModalProps) {
  if (!aberto) return null;

  const formularioValido = titulo.trim().length > 0 && nota_pessoal.trim().length > 0;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-amber-400">
            {idEditando ? "Editar Filme" : "Novo Filme"}
          </h2>
          <button
            type="button"
            onClick={onFechar}
            disabled={salvando}
            className="text-zinc-400 hover:text-zinc-100 disabled:opacity-50 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSalvar} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Título *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Interestelar"
              value={titulo}
              onChange={(e) => onChangeTitulo(e.target.value)}
              disabled={salvando}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Nota Pessoal (0 a 10) *
            </label>
            <input
              type="text"
              inputMode="decimal"
              required
              placeholder="Ex: 9.5"
              value={nota_pessoal}
              onChange={(e) => onChangeNota(e.target.value)}
              disabled={salvando}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Review
            </label>
            <textarea
              rows={3}
              placeholder="Escreva sua opinião ou comentário sobre o filme..."
              value={sinopse}
              onChange={(e) => onChangeSinopse(e.target.value)}
              disabled={salvando}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition resize-none disabled:opacity-60"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onFechar}
              disabled={salvando}
              className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium transition disabled:opacity-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando || !formularioValido}
              className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {salvando ? "Salvando..." : idEditando ? "Salvar Alterações" : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}