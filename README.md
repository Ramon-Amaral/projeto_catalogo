# Catálogo de Filmes

Aplicação full-stack para gerenciamento de filmes, atores e elenco, estruturada com API REST em camadas, banco de dados PostgreSQL, integração com as APIs **OMDb** e **TMDB** e interface em React.

- **Aplicação em produção (Vercel):** https://projeto-catalogo-chi.vercel.app
- **API em produção (Render):** https://projeto-catalogo-jtpf.onrender.com

---

## Estrutura do Projeto

```text
projeto_catalogo/
├── backend/
│   ├── db/migrations/       # Scripts SQL (schema, seed, queries e alterações de colunas)
│   └── src/
│       ├── config/          # Pool de conexão com PostgreSQL (database.ts)
│       ├── controllers/     # Controladores de filmes, atores e elenco
│       ├── jobs/            # Sincronização de notas do Rotten Tomatoes (syncRotten.job.ts)
│       ├── routes/          # Rotas REST (/filmes, /atores, /elencos)
│       ├── service/         # Regras de negócio e clientes das APIs OMDb e TMDB
│       └── server.ts        # Configuração e inicialização do servidor Express
└── frontend/
    └── src/
        ├── components/      # FilmeCard, FilmeModal, AtorCard, AtorModal e ElencoModal
        ├── services/        # Cliente HTTP Axios (api.ts)
        ├── types/           # Tipagens TypeScript (Filme.ts, Ator.ts, Elenco.ts)
        └── App.tsx          # Tela principal, abas, filtros, ordenação e controle de estado
```

---

## Funcionalidades

### Back-end (`/backend`)
- **API REST em Camadas:** Separação entre `Routes → Controllers → Services` com suporte a `GET`, `POST`, `PUT`, `PATCH` e `DELETE` para Filmes, Atores e Elenco.
- **Modelagem Relacional no PostgreSQL:** Relacionamento N:N entre `filmes` e `atores` por meio da tabela associativa `elenco`, com chaves estrangeiras e exclusão em cascata (`ON DELETE CASCADE`).
- **Integração com OMDb API (`omdb.service.ts` / `syncRotten.job.ts`):**
  - Preenchimento automático de ano, gênero, diretor, roteirista, premiações, pôster e avaliação do Rotten Tomatoes no cadastro e na edição de filmes.
  - Rotina de sincronização via `node-cron` executada na inicialização do servidor e agendada diariamente às 03h00.
- **Enriquecimento e Vínculo Automático via TMDB API (`tmdb.service.ts` / `atores.service.ts`):**
  - Busca automática de foto de perfil, data de nascimento e cálculo dos dois gêneros mais frequentes na filmografia do ator.
  - Cruzamento entre os créditos cinematográficos da TMDB (`movie_credits`) e os filmes já cadastrados no banco, vinculando automaticamente personagem e status de protagonista no elenco.

### Front-end (`/frontend`)
- **Gerenciamento de Filmes, Atores e Elenco:** Navegação por abas com modais dedicados para cadastro, edição, vínculo de elenco e confirmação de exclusão.
- **Busca, Filtro e Ordenação Dinâmica:**
  - Busca combinada por título do filme ou nome de ator presente no elenco.
  - Filtro por nota pessoal com suporte a faixa inteira (ex.: `8` filtra notas de `8.0` a `8.9`) ou valor decimal exato (ex.: `8.6`), aceitando vírgula ou ponto.
  - Ordenação por mais recentes, ordem alfabética (A–Z), maior nota e menor nota.
- **Tratamento de Estado e UX:** *Skeleton loading* no carregamento inicial, sincronização silenciosa após operações de escrita, alertas de erro com opção de nova tentativa, estados vazios contextuais e bloqueio de envios duplicados.

---

## Tecnologias

- **Back-end:** Node.js, Express 5, TypeScript, PostgreSQL (`pg`), `node-cron`, Axios
- **Front-end:** React 19, TypeScript, Vite, Tailwind CSS v4, Axios
- **APIs e Deploy:** OMDb API, TMDB API, Render (API) e Vercel (Front-end)

---

## Endpoints da API

| Recurso | Métodos Disponíveis | Descrição |
| :--- | :--- | :--- |
| `/filmes` e `/filmes/:id` | `GET`, `POST`, `PUT`, `PATCH`, `DELETE` | CRUD de filmes com metadados, pôster e nota do Rotten Tomatoes |
| `/atores` e `/atores/:id` | `GET`, `POST`, `PUT`, `PATCH`, `DELETE` | CRUD de atores com dados da TMDB e vínculo automático de elenco |
| `/elencos` e `/elencos/:id` | `GET`, `POST`, `PUT`, `PATCH`, `DELETE` | Associação entre filmes, atores, personagens e protagonismo |

---

## Como Executar Localmente

1. **Banco de Dados:** Crie um banco no PostgreSQL e execute os scripts em `backend/db/migrations/` na ordem (`01_schema.sql` até `04_add_media_columns.sql`).
2. **Back-end:**
   ```bash
   cd backend
   cp .env.example .env
   npm install
   npm run dev
   ```
   *(Preencha as credenciais do PostgreSQL e as chaves `OMDB_API_KEY` e `TMDB_API_KEY` no arquivo `.env`.)*
3. **Front-end:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## Demonstração

<img width="1439" height="899" alt="image" src="https://github.com/user-attachments/assets/5c833e58-bc3d-4666-9b68-252f2704c9b5" />
<img width="1439" height="899" alt="image" src="https://github.com/user-attachments/assets/546d135e-5785-4186-b4d6-aa730dde1d4f" />