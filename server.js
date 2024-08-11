const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from 'public' folder
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

// Dummy users database
const users = { 'user': 'password' }; // Username: Password

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username] === password) {
        req.session.user = username;
        res.status(200).send('Login successful');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

// Comments endpoint
app.get('/comments', (req, res) => {
    // Retrieve comments from database or file
    // For simplicity, using an array here
    const comments = [
        { username: 'user1', comment: 'Great website!' },
        { username: 'user2', comment: 'Very informative.' }
    ];
    res.json(comments);
});

app.post('/comments', (req, res) => {
    if (!req.session.user) {
        return res.status(403).send('Unauthorized');
    }
    const { comment } = req.body;
    // Save comment to database
    // Here we just send a success response
    res.status(200).send('Comment added');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
