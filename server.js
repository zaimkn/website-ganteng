const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Simulasi data pengguna (bisa diganti dengan database)
const users = { 'user1': 'password123' };

// Halaman login
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

// Proses login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username] === password) {
    req.session.user = username;
    res.status(200).send('Login successful');
  } else {
    res.status(401).send('Invalid credentials');
  }
});

// Proses komentar
app.post('/comments', (req, res) => {
  if (req.session.user) {
    // Simpan komentar ke database atau memori
    console.log(req.body.comment);
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
