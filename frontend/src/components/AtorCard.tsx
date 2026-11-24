import type { Ator } from "../types/Ator";

interface AtorCardProps {
  ator: Ator;
  onEditar: (ator: Ator) => void;
  onExcluir: (id: number) => void;
}

export function AtorCard({ ator, onEditar, onExcluir }: AtorCardProps) {
  const dataFormatada = ator.data_nascimento
    ? new Date(ator.data_nascimento).toLocaleDateString("pt-BR", {
        timeZone: "UTC",
      })
    : null;

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl flex flex-col justify-between gap-4">
      <div>
        {ator.foto_url ? (
          <img
            src={ator.foto_url}
            alt={`Foto de ${ator.nome}`}
            className="w-full aspect-2/3 object-cover rounded-lg mb-4"
          />
        ) : (
          <div className="w-full aspect-2/3 bg-zinc-950 border border-zinc-800 rounded-lg mb-4 flex items-center justify-center text-zinc-500 text-sm">
            Sem foto
          </div>
        )}

        <h2 className="text-xl font-bold text-zinc-100 mb-1">{ator.nome}</h2>

        {dataFormatada && (
          <p className="text-sm text-zinc-400">Nascimento: {dataFormatada}</p>
        )}

        {ator.genero_atuacao && ator.genero_atuacao !== "Atuação" && (
          <p className="text-sm text-zinc-400">Gênero: {ator.genero_atuacao}</p>
        )}

        {ator.premio && (
          <span className="inline-block bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-medium px-2.5 py-1 rounded-md mt-3">
            {ator.premio}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onEditar(ator)}
          className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium py-2 rounded-lg transition cursor-pointer"
        >
          Editar
        </button>

        <button
          type="button"
          onClick={() => onExcluir(ator.id)}
          className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-sm font-medium py-2 rounded-lg transition cursor-pointer"
        >
          Excluir
        </button>
      </div>
    </div>
  );
}