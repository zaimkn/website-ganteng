const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/website-ganteng', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// User and Comment schemas
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const commentSchema = new mongoose.Schema({
  text: String,
  user: String,
  date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Comment = mongoose.model('Comment', commentSchema);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Serve the main page
app.get('/', (req, res) => {
  if (req.session.user) {
    res.sendFile(__dirname + '/public/index.html');
  } else {
    res.redirect('/login');
  }
});

// Serve login page
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

// Serve register page
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/public/register.html');
});

// Register a new user
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).send('User registered');
  } catch (err) {
    res.status(500).send('Error registering user');
  }
});

// Login a user
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.user = username;
    res.status(200).send('Login successful');
  } else {
    res.status(401).send('Invalid credentials');
  }
});

// Logout a user
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send('Error logging out');
    res.redirect('/login');
  });
});

// Handle comments
app.post('/comments', async (req, res) => {
  if (req.session.user) {
    const { comment } = req.body;
    const newComment = new Comment({ text: comment, user: req.session.user });
    await newComment.save();
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Get comments
app.get('/comments', async (req, res) => {
  const comments = await Comment.find();
  res.json({ comments });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
