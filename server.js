const express = require('express');
const connectDB = require('./db'); // Importa a chave
// Variável Global para a conexão
let connection = null;



const app = express();
const PORT = 3000;

// Configurações (Middlewares)
app.use(express.json()); // Aprende a ler JSON
app.use(express.static('public')); // Serve o site (index.html)

// ROTA 1: LISTAR USUÁRIOS (READ)
app.get('/usuarios', async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM usuarios');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar usuários');
  }
});

// ROTA 2: CRIAR USUÁRIO (CREATE)
app.post('/usuarios', async (req, res) => {
  const { nome, email } = req.body; // Pega o que o frontend enviou
  try {
    // As '?' são substituídas pelos valores do array (segurança contra hackers)
    await connection.query('INSERT INTO usuarios (nome, email) VALUES (?, ?)', [nome, email]);
    res.status(201).send('Usuário criado com sucesso!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao criar usuário');
  }
});

// ROTA 3: DELETAR USUÁRIO (DELETE)
app.delete('/usuarios/:id', async (req, res) => {
  const { id } = req.params; // Pega o ID que veio na URL
  try {
    await connection.query('DELETE FROM usuarios WHERE id = ?', [id]);
    res.send('Usuário apagado!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao apagar');
  }
});



// A função que liga tudo
const startServer = async () => {
  try {
    // 1. Tenta abrir a despensa PRIMEIRO
    
    // Guardamos a conexão na variável global para usar nas rotas
    connection = await connectDB();

    // 2. Se deu certo, abre o restaurante para os clientes
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });

  } catch (error) {
    console.log('Falha ao iniciar o servidor');
  }
};

startServer();

