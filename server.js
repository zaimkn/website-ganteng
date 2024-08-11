const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const app = express();
const port = 3000;

// Koneksi ke MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

const CommentSchema = new mongoose.Schema({
    username: String,
    text: String
});

const User = mongoose.model('User', UserSchema);
const Comment = mongoose.model('Comment', CommentSchema);

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true
}));

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

// Rute Logout
app.post('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).send('Logout berhasil');
});

// Middleware untuk memeriksa autentikasi
function checkAuth(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(403).send('Anda harus login untuk mengakses halaman ini');
    }
}

// Rute untuk mendapatkan komentar
app.get('/comments', async (req, res) => {
    try {
        const comments = await Comment.find();
        res.json(comments);
    } catch (error) {
        res.status(500).send('Gagal mengambil komentar');
    }
});

// Rute untuk menambahkan komentar
app.post('/comments', checkAuth, async (req, res) => {
    const { text } = req.body;
    try {
        const comment = new Comment({ username: req.session.user.username, text });
        await comment.save();
        res.status(200).send('Komentar berhasil ditambahkan');
    } catch (error) {
        res.status(500).send('Gagal menambahkan komentar');
    }
});

// Rute untuk halaman utama
app.get('/', checkAuth, (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Jalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
