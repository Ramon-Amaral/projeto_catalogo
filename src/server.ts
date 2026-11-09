import express from 'express';
import filmesRoutes from './routes/filmes.routes.js'
import elencoRoutes from './routes/elenco.routes.js'
import atoresRoutes from './routes/atores.routes.js'


const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json());

app.use(filmesRoutes);
app.use(atoresRoutes);
app.use(elencoRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})