const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // Servir arquivos estáticos (HTML, CSS, JS)

//Conectar ao banco de dados SQLite
const db = new sqlite3.Database('users.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados SQLite');
  }
});

// Criar a tabela, caso ela não exista
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL
  )
`);


app.get('/users', (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.post('/users', (req, res) => {
  const { nome, email } = req.body;

 
  db.get('SELECT * FROM users WHERE nome = ? OR email = ?', [nome, email], (err, row) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao verificar o banco de dados.' });
    } else if (row) {
      res.status(400).json({ error: 'Nome ou e-mail já está cadastrado.' });
    } else {
      db.run(
        'INSERT INTO users (nome, email) VALUES (?, ?)',
        [nome, email],
        function (err) {
          if (err) {
            res.status(500).json({ error: 'Erro ao inserir no banco de dados.' });
          } else {
            res.status(201).json({ id: this.lastID, nome, email });
          }
        }
      );
    }
  });
});


// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
