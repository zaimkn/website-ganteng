const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/User'); // Ganti dengan path yang sesuai jika berbeda

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json()); // Untuk JSON
app.use(bodyParser.urlencoded({ extended: true })); // Untuk URL-encoded

// Koneksi ke MongoDB
mongoose.connect('mongodb://localhost/yourdatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Username sudah digunakan');
        }

        const user = new User({ username, password });
        await user.save();
        res.status(200).send('Registrasi berhasil');
    } catch (error) {
        res.status(500).send('Registrasi gagal');
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password });
        if (!user) {
            return res.status(401).send('Username atau password salah');
        }
        res.status(200).send('Login berhasil');
    } catch (error) {
        res.status(500).send('Login gagal');
    }
});

app.post('/comments', async (req, res) => {
    const { comment } = req.body;
    try {
        // Simpan komentar ke database atau di memori untuk sementara
        // const newComment = new Comment({ text: comment });
        // await newComment.save();
        res.status(200).send('Komentar berhasil dikirim');
    } catch (error) {
        res.status(500).send('Gagal mengirim komentar');
    }
});

app.get('/comments', async (req, res) => {
    try {
        // Ambil komentar dari database atau memori
        // const comments = await Comment.find();
        const comments = ['Komentar 1', 'Komentar 2']; // Contoh komentar statis
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).send('Gagal mengambil komentar');
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
