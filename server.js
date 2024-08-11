const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

// Koneksi ke MongoDB (ganti dengan URL MongoDB kamu)
mongoose.connect('mongodb://localhost:27017/website-ganteng', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Model User
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Model Comment
const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    username: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Comment = mongoose.model('Comment', commentSchema);

// Routes

// Endpoint untuk pendaftaran pengguna
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = new User({ username, password });
        await user.save();
        res.status(200).send('Registrasi berhasil');
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).send('Username sudah terdaftar');
        } else {
            res.status(500).send('Gagal mendaftar');
        }
    }
});

// Endpoint untuk login pengguna
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

// Endpoint untuk mengirim komentar
app.post('/comments', async (req, res) => {
    const { comment, username } = req.body;
    try {
        const newComment = new Comment({ text: comment, username });
        await newComment.save();
        res.status(200).send('Komentar berhasil dikirim');
    } catch (error) {
        res.status(500).send('Gagal mengirim komentar');
    }
});

// Endpoint untuk mendapatkan komentar
app.get('/comments', async (req, res) => {
    try {
        const comments = await Comment.find();
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).send('Gagal mengambil komentar');
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
