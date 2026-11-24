import type { Filme } from "../types/Filme";

interface FilmeCardProps {
  filme: Filme;
  totalElenco: number;
  onAbrirElenco: (filme: Filme) => void;
  onEditar: (filme: Filme) => void;
  onExcluir: (id: number) => void;
}

export function FilmeCard({
  filme,
  totalElenco,
  onAbrirElenco,
  onEditar,
  onExcluir,
}: FilmeCardProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl flex flex-col justify-between gap-4">
      <div>
        {filme.poster_url ? (
          <img
            src={filme.poster_url}
            alt={`Pôster de ${filme.titulo}`}
            className="w-full aspect-2/3 object-cover rounded-lg mb-4"
          />
        ) : (
          <div className="w-full aspect-2/3 bg-zinc-950 border border-zinc-800 rounded-lg mb-4 flex items-center justify-center text-zinc-500 text-sm">
            Sem pôster
          </div>
        )}

        <h2 className="text-xl font-bold text-zinc-100 mb-1">{filme.titulo}</h2>
        <p className="text-sm text-zinc-400">{filme.diretor}</p>
        <p className="text-sm text-zinc-400">{filme.ano_lancamento}</p>

        {filme.sinopse && (
          <p className="text-sm text-zinc-300 mt-3 leading-relaxed">
            {filme.sinopse}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mt-3">
          {filme.nota_pessoal !== null && filme.nota_pessoal !== undefined && (
            <span className="inline-block bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold px-2.5 py-1 rounded-md">
              Nota: {filme.nota_pessoal}
            </span>
          )}

          <span className="inline-block bg-zinc-800 text-zinc-300 text-xs font-medium px-2.5 py-1 rounded-md">
            Elenco: {totalElenco}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <button
          type="button"
          className="w-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-sm font-semibold py-2 rounded-lg transition cursor-pointer"
          onClick={() => onAbrirElenco(filme)}
        >
          Gerenciar Elenco
        </button>

        <div className="flex gap-2">
          <button
            type="button"
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium py-2 rounded-lg transition cursor-pointer"
            onClick={() => onEditar(filme)}
          >
            Editar
          </button>

          <button
            type="button"
            className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-sm font-medium py-2 rounded-lg transition cursor-pointer"
            onClick={() => onExcluir(filme.id)}
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}