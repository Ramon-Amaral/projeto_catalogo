# 🎬 Catálogo de Filmes

Aplicação full-stack para gerenciamento de catálogo de filmes, atores e elenco, combinando uma API REST em camadas com PostgreSQL, integração externa com a OMDb API e uma interface web reativa em React.

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
│       ├── service/         # Regras de negócio e cliente da OMDb API (omdb.service.ts)
│       └── server.ts        # Ponto de entrada do servidor Express
└── frontend/
    └── src/
        ├── components/      # Componentes de interface (FilmeCard e FilmeModal)
        ├── services/        # Cliente HTTP Axios (api.ts)
        ├── types/           # Tipagens TypeScript (Filme.ts)
        └── App.tsx          # Tela principal, filtros e estados de UX
```

## ✨ Funcionalidades

### Back-end (`/backend`)
- **API REST em Camadas:** Arquitetura separada em `Routes → Controllers → Services` com suporte completo a `GET`, `POST`, `PUT`, `PATCH` e `DELETE` para **Filmes**, **Atores** e **Elenco**.
- **Banco de Dados PostgreSQL:** Modelagem relacional com chaves estrangeiras e exclusão em cascata (`ON DELETE CASCADE`) definida via scripts SQL em `backend/db/migrations/`.
- **Integração com OMDb API e Cron Job:** Busca automática de avaliações do Rotten Tomatoes via OMDb API (`omdb.service.ts`), agendada diariamente às 03h00 com `node-cron` (`syncRotten.job.ts`).

### Front-end (`/frontend`)
- **CRUD Completo de Filmes:** Cadastro, listagem, edição em modal e exclusão com modal de confirmação.
- **Busca e Filtragem Dinâmica:** Filtro combinado por título e por nota pessoal (suporta faixa inteira, como `8` para notas `8.0` a `8.9`, ou nota exata como `8.6`, normalizando vírgula e ponto).
- **Blindagem de UX:**
  - *Skeleton Loading* durante o carregamento inicial da API.
  - Alerta de erro de conexão com botão para tentar novamente sem recarregar a página.
  - *Empty States* contextuais para catálogo vazio ou busca sem resultados.
  - Validação de formulário e bloqueio de envios duplicados durante requisições.

## 🛠️ Tecnologias

- **Back-end:** Node.js, Express 5, TypeScript, PostgreSQL (`pg`), `node-cron`, Axios
- **Front-end:** React 19, TypeScript, Vite, Tailwind CSS v4, Axios

## 🔌 Endpoints da API

| Recurso | Métodos Disponíveis | Descrição |
| :--- | :--- | :--- |
| `/filmes` e `/filmes/:id` | `GET`, `POST`, `PUT`, `PATCH`, `DELETE` | Gerenciamento do catálogo de filmes e notas |
| `/atores` e `/atores/:id` | `GET`, `POST`, `PUT`, `PATCH`, `DELETE` | Gerenciamento de atores e premiações |
| `/elencos` e `/elencos/:id` | `GET`, `POST`, `PUT`, `PATCH`, `DELETE` | Relacionamento entre filmes, atores e personagens |

## 🚀 Como executar o projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/Ramon-Amaral/projeto_catalogo.git
cd projeto_catalogo
```

### 2. Configurar e iniciar o Back-end
1. Acesse a pasta `backend/` e instale as dependências:
```bash
cd backend
npm install
```

2. Crie um arquivo `.env` na pasta `backend/` com as variáveis de conexão do PostgreSQL e a chave da OMDb API:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=nome_do_banco
OMDB_API_KEY=sua_chave_omdb
```

3. Execute os scripts `01_schema.sql` e `02_seed.sql` (localizados em `backend/db/migrations/`) no seu banco PostgreSQL para criar as tabelas e popular os dados iniciais.

4. Inicie o servidor em modo de desenvolvimento:
```bash
npm run dev
```

### 3. Configurar e iniciar o Front-end
1. Em outro terminal, acesse a pasta `frontend/` e instale as dependências:
```bash
cd frontend
npm install
```

2. Inicie a aplicação (por padrão, o cliente Axios em `src/services/api.ts` consome `http://localhost:3000`):
```bash
npm run dev
```

## 📸 Demonstração

<img width="1439" height="893" alt="image" src="https://github.com/user-attachments/assets/68ac2467-114d-4981-9624-eedb7027dc8b" />
