const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/website-ganteng', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

app.use(express.static('public'));

// Rute Registrasi
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = new User({ username, password });
        await user.save();
        res.status(200).send('Registrasi berhasil');
    } catch (error) {
        res.status(500).send('Registrasi gagal');
    }
});

// Rute Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password });
        if (user) {
            req.session.user = user;
            res.status(200).send('Login berhasil');
        } else {
            res.status(401).send('Username atau password salah');
        }
    } catch (error) {
        res.status(500).send('Login gagal');
    }
});

// Rute untuk mendapatkan komentar (sederhana)
app.get('/comments', async (req, res) => {
    // Logika untuk mengambil komentar dari database
});

// Rute untuk menambahkan komentar (sederhana)
app.post('/comments', async (req, res) => {
    const { comment } = req.body;
    try {
        // Logika untuk menyimpan komentar ke database
        res.status(200).send('Komentar berhasil ditambahkan');
    } catch (error) {
        res.status(500).send('Gagal menambahkan komentar');
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
