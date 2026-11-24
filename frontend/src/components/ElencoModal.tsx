import { useState, type SubmitEvent } from "react";
import type { Filme } from "../types/Filme";
import type { Ator } from "../types/Ator";
import type { ElencoItem } from "../types/Elenco";

interface ElencoModalProps {
  filme: Filme | null;
  atores: Ator[];
  elencoDoFilme: ElencoItem[];
  salvando: boolean;
  onAdicionar: (dados: {
    filme_id: number;
    ator_id: number;
    nome_personagem: string;
    e_protagonista: boolean;
  }) => Promise<void>;
  onRemover: (elencoId: number) => Promise<void>;
  onFechar: () => void;
}

export function ElencoModal({
  filme,
  atores,
  elencoDoFilme,
  salvando,
  onAdicionar,
  onRemover,
  onFechar,
}: ElencoModalProps) {
  const [atorId, setAtorId] = useState("");
  const [personagem, setPersonagem] = useState("");
  const [protagonista, setProtagonista] = useState(true);

  if (!filme) return null;

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!filme || !atorId || !personagem.trim() || salvando) return;

    await onAdicionar({
      filme_id: filme.id,
      ator_id: Number(atorId),
      nome_personagem: personagem.trim(),
      e_protagonista: protagonista,
    });

    setAtorId("");
    setPersonagem("");
    setProtagonista(true);
  }

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-amber-400">
              Elenco — {filme.titulo}
            </h2>
            <p className="text-xs text-zinc-400">
              Gerencie os atores e personagens deste filme
            </p>
          </div>
          <button
            type="button"
            onClick={onFechar}
            className="text-zinc-400 hover:text-zinc-200 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2.5 mb-6">
          {elencoDoFilme.length === 0 ? (
            <p className="text-sm text-zinc-500 bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-center">
              Nenhum ator vinculado a este filme ainda.
            </p>
          ) : (
            elencoDoFilme.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  {item.ator_foto ? (
                    <img
                      src={item.ator_foto}
                      alt={item.ator}
                      className="w-10 h-10 rounded-full object-cover border border-zinc-700"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-400 font-bold">
                      {item.ator.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-100 text-sm">
                        {item.ator}
                      </span>
                      {item.e_protagonista && (
                        <span className="bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
                          Protagonista
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400">
                      Personagem: <span className="text-zinc-300">{item.nome_personagem}</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRemover(item.id)}
                  disabled={salvando}
                  className="text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-2.5 py-1.5 rounded transition cursor-pointer disabled:opacity-50"
                >
                  Remover
                </button>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="border-t border-zinc-800 pt-4 space-y-3">
          <h3 className="text-sm font-semibold text-zinc-200">
            + Adicionar ator ao elenco
          </h3>

          {atores.length === 0 ? (
            <p className="text-xs text-amber-400/90">
              Cadastre um ator na aba "Atores" antes de vinculá-lo aqui.
            </p>
          ) : (
            <>
              <div>
                <select
                  required
                  value={atorId}
                  onChange={(e) => setAtorId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="">Selecione um ator...</option>
                  {atores.map((ator) => (
                    <option key={ator.id} value={ator.id}>
                      {ator.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <input
                  type="text"
                  required
                  placeholder="Nome do personagem (ex: Neo)"
                  value={personagem}
                  onChange={(e) => setPersonagem(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={protagonista}
                  onChange={(e) => setProtagonista(e.target.checked)}
                  className="accent-amber-500 w-4 h-4"
                />
                Papel protagonista
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onFechar}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium transition cursor-pointer"
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-sm font-semibold transition cursor-pointer disabled:opacity-50"
                >
                  {salvando ? "Adicionando..." : "Adicionar"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}