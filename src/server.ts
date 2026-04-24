import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/teste', (req, res) => {
  res.json({ ok: true });
});

app.get('/api/corridas-agendadas', (req, res) => {
  res.json([]);
});

app.post('/api/corridas-agendadas', (req, res) => {
  console.log(req.body);
  res.json({ message: 'Agendado com sucesso' });
});

app.listen(3000, () => {
  console.log('Backend rodando na porta 3000');
});