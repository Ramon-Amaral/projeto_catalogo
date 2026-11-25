# 🎬 Catálogo de Filmes

Aplicação full-stack para gerenciamento de catálogo de filmes, atores e elenco, combinando uma API REST em camadas com PostgreSQL, integração com as APIs externas **TMDB** e **OMDb** e uma interface web reativa em React.

🔗 **Aplicação no ar (Vercel):** https://projeto-catalogo-chi.vercel.app  
⚙️ **API em produção (Render):** https://projeto-catalogo-jtpf.onrender.com

---

## 🗂️ Estrutura do Projeto

```text
projeto_catalogo/
├── backend/
│   ├── db/migrations/       # Scripts SQL (01_schema.sql, 02_seed.sql, 03_queries.sql)
│   └── src/
│       ├── config/          # Pool de conexão com PostgreSQL (database.ts)
│       ├── controllers/     # Controladores de filmes, atores e elenco
│       ├── jobs/            # Cron job diário de notas do Rotten Tomatoes (syncRotten.job.ts)
│       ├── routes/          # Rotas REST (/filmes, /atores, /elencos)
│       ├── service/         # Regras de negócio e clientes das APIs TMDB e OMDb
│       └── server.ts        # Ponto de entrada do servidor Express
└── frontend/
    └── src/
        ├── components/      # FilmeCard, FilmeModal, AtorCard, AtorModal e ElencoModal
        ├── services/        # Cliente HTTP Axios (api.ts)
        ├── types/           # Tipagens TypeScript (Filme.ts, Ator.ts, Elenco.ts)
        └── App.tsx          # Tela principal, abas, filtros e sincronização de estado
```

---

## ✨ Funcionalidades

### Back-end (`/backend`)
- **API REST em Camadas:** Arquitetura separada em `Routes → Controllers → Services` com suporte completo a `GET`, `POST`, `PUT`, `PATCH` e `DELETE` para Filmes, Atores e Elenco.
- **Banco de Dados PostgreSQL:** Modelagem relacional entre `filmes`, `atores` e a tabela associativa `elenco` com chaves estrangeiras e exclusão em cascata (`ON DELETE CASCADE`).
- **Enriquecimento Automático via TMDB API (`tmdb.service.ts`):**
  - Busca automática de pôsteres para filmes e fotos de perfil, data de nascimento e gêneros predominantes da filmografia ao cadastrar ou editar atores.
  - **Vínculo Automático de Elenco:** Cruzamento automático entre os créditos cinematográficos do ator na TMDB (`movie_credits`) e os filmes já cadastrados no banco, preenchendo personagem e status de protagonista sem intervenção manual.
- **Integração com OMDb API e Cron Job (`omdb.service.ts` / `syncRotten.job.ts`):** Sincronização diária das avaliações do Rotten Tomatoes agendada às 03h00 via `node-cron`.

### Front-end (`/frontend`)
- **Gestão Completa de Filmes e Atores:** Navegação por abas com cadastro, listagem, edição em modal e exclusão com confirmação para ambas as entidades.
- **Gerenciamento de Elenco por Filme (`ElencoModal`):** Visualização dos atores vinculados com foto, personagem e badge de **Protagonista**, além de inclusão e remoção manual.
- **Busca e Filtragem Dinâmica:** Filtro combinado por título do filme ou nome de ator presente no elenco, somado ao filtro por nota pessoal (suporta faixa inteira, como `8` para notas de `8.0` a `8.9`, ou nota exata como `8.6`, normalizando vírgula e ponto).
- **Blindagem de UX:**
  - *Skeleton Loading* durante o carregamento inicial da API.
  - Sincronização silenciosa de estado após operações de escrita (sem necessidade de recarregar a página).
  - Alerta de erro de conexão com botão para tentar novamente.
  - *Empty States* contextuais para listas vazias ou buscas sem resultados.
  - Validação de formulários e bloqueio de envios duplicados durante requisições.

---

## 🛠️ Tecnologias

- **Back-end:** Node.js, Express 5, TypeScript, PostgreSQL (`pg`), `node-cron`, Axios
- **Front-end:** React 19, TypeScript, Vite, Tailwind CSS v4, Axios
- **APIs Externas & Infraestrutura:** TMDB API, OMDb API, Render (API) e Vercel (Front-end)

---

## 🔌 Endpoints da API

| Recurso | Métodos Disponíveis | Descrição |
| :--- | :--- | :--- |
| `/filmes` e `/filmes/:id` | `GET`, `POST`, `PUT`, `PATCH`, `DELETE` | Gerenciamento do catálogo de filmes, pôsteres e notas |
| `/atores` e `/atores/:id` | `GET`, `POST`, `PUT`, `PATCH`, `DELETE` | Gerenciamento de atores, dados da TMDB e vínculo automático de elenco |
| `/elencos` e `/el

## 📸 Demonstração

<img width="1439" height="899" alt="image" src="https://github.com/user-attachments/assets/5c833e58-bc3d-4666-9b68-252f2704c9b5" />
<img width="1439" height="899" alt="image" src="https://github.com/user-attachments/assets/546d135e-5785-4186-b4d6-aa730dde1d4f" />



