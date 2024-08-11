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

const User = mongoose.model('User', UserSchema);

app.use(bodyParser.json());
app.use(express.static('public')); // Folder tempat file HTML dan JS
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

// Middleware untuk memeriksa autentikasi
function checkAuth(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(403).send('Anda harus login untuk mengakses halaman ini');
    }
}

// Rute untuk halaman utama
app.get('/', checkAuth, (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Jalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
