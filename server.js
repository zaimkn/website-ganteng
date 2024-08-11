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
    console.log('Received request to /register'); // Log untuk debugging
    const { username, password } = req.body;
    console.log('Username:', username); // Log data yang diterima
    console.log('Password:', password); // Log data yang diterima
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Username sudah digunakan');
        }

        const user = new User({ username, password });
        await user.save();
        res.status(200).send('Registrasi berhasil');
    } catch (error) {
        console.error('Error:', error); // Log kesalahan
        res.status(500).send('Registrasi gagal');
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
