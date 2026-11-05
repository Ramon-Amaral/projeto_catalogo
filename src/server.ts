import express from 'express';
import filmesRoutes from './routes/filmes.routes.js'

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use('/filmes', filmesRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})