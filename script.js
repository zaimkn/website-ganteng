const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

// Dummy users database
const users = { 'user': 'password' }; // Change this to your actual users database

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username] === password) {
        req.session.user = username;
        console.log(`User ${username} logged in`);
        res.status(200).send('Login successful');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

// Comments endpoint
let comments = []; // Temporary storage for comments

app.get('/comments', (req, res) => {
    res.json(comments);
});

app.post('/comments', (req, res) => {
    if (!req.session.user) {
        console.log('Unauthorized comment attempt');
        return res.status(403).send('Unauthorized');
    }
    const { comment } = req.body;
    comments.push({ username: req.session.user, comment });
    console.log(`Comment added by ${req.session.user}: ${comment}`);
    res.status(200).send('Comment added');
});

// Check login status
app.get('/login/check', (req, res) => {
    if (req.session.user) {
        res.status(200).send('User is logged in');
    } else {
        res.status(403).send('Unauthorized');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
