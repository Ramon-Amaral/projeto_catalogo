import type { SubmitEvent } from "react";


interface FilmeModalProps {
  aberto: boolean;
  idEditando: number | null
  titulo: string
  sinopse: string
  nota_pessoal: string
  onChangeTitulo: (valor:string) => void;
  onChangeSinopse: (valor:string) => void;
  onChangeNota: (valor: string) => void;
  onSalvar: (e: SubmitEvent<HTMLFormElement>) => void;
  onFechar: () => void;

}

export function FilmeModal ({aberto, idEditando, titulo, sinopse, nota_pessoal, onChangeTitulo, onChangeSinopse, onChangeNota, onFechar, onSalvar}: FilmeModalProps) {

  if (!aberto){
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-zinc-100">{idEditando ? "Editar Filme" : "Novo Filme"}</h2>

          <button type="button" className="text-zinc-400 hover:text-zinc-100 text-xl leading-none cursor-pointer transition" onClick={onFechar}>
          Fechar
          </button>
        </div>
        <form
          onSubmit={onSalvar}
          className="flex flex-col gap-4"
        >
          <input
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
            type="text"
            placeholder="Título do Filme"
            value={titulo}
            onChange={(e) => onChangeTitulo(e.target.value)}
            disabled={idEditando !== null}
          />

          <input
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            type="text"
            placeholder="Sinopse do Filme"
            value={sinopse}
            onChange={(e) => onChangeSinopse(e.target.value)}
          />

          <input
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            type="number"
            placeholder="Nota do filme"
            value={nota_pessoal}
            onChange={(e) => onChangeNota(e.target.value)}
          />

          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              className=" flex-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold py-2.5 px-6 rounded-lg transition cursor-pointer"
            >
              {idEditando ? "Salvar Alterações" : "Cadastrar"}
            </button>

            
              <button
                type="button"
                onClick={onFechar}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold py-2.5 px-6 rounded-lg transition cursor-pointer"
              >
                Cancelar
              </button>
            
          </div>
        </form>
      </div>

    </div>
  )

}