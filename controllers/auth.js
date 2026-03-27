const bcrypt = require('bcryptjs');
const mysql = require('mysql2');

const db = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).render('login', { message: 'Email and password required' });

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).render('login', { message: 'Server error' });

    if (results.length === 0)
      return res.status(400).render('login', { message: 'User not found' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).render('login', { message: 'Incorrect password' });

    res.redirect('/auth/sell');
  });
};

exports.register = (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  if (!name || !email || !password || !passwordConfirm)
    return res.status(400).render('register', { message: 'All fields are required' });

  if (password !== passwordConfirm)
    return res.status(400).render('register', { message: 'Passwords do not match' });

  db.query('SELECT email FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).render('register', { message: 'Server error' });

    if (results.length > 0)
      return res.status(400).render('register', { message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 8);

    db.query('INSERT INTO users SET ?', { name, email, password: hashedPassword }, (err) => {
      if (err) return res.status(500).render('register', { message: 'Registration failed' });
      res.redirect('/login');
    });
  });
};
