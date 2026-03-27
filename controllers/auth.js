const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.MYSQLHOST || "centerbeam.proxy.rlwy.net",
  user: process.env.MYSQLUSER || "root",
  password: process.env.MYSQLPASSWORD || "GeafpJBdeFsuuNXhEbihmkAxduQABIjX",
  database: process.env.MYSQLDATABASE || "railway",
  port: process.env.MYSQLPORT || 29551,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
  ssl: {
    rejectUnauthorized: false
  }
});

console.log("DB HOST:", process.env.MYSQLHOST);

// ================= LOGIN =================
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).render('login', { message: 'Email and password required' });

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {

    if (err) {
      console.error("LOGIN ERROR:", err);  
      return res.status(500).render('login', { message: err.message });
    }

    if (results.length === 0)
      return res.status(400).render('login', { message: 'User not found' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).render('login', { message: 'Incorrect password' });

    res.redirect('/auth/sell');
  });
};

// ================= REGISTER =================
exports.register = (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  if (!name || !email || !password || !passwordConfirm)
    return res.status(400).render('register', { message: 'All fields are required' });

  if (password !== passwordConfirm)
    return res.status(400).render('register', { message: 'Passwords do not match' });

  db.query('SELECT email FROM users WHERE email = ?', [email], async (err, results) => {

    if (err) {
      console.error("CHECK EMAIL ERROR:", err);  
      return res.status(500).render('register', { message: err.message });
    }

    if (results.length > 0)
      return res.status(400).render('register', { message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 8);

    db.query(
      'INSERT INTO users SET ?',
      { name, email, password: hashedPassword },
      (err) => {

        if (err) {
          console.error("INSERT ERROR:", err);  
          return res.status(500).render('register', { message: err.message });
        }

        console.log("User Registered Successfully");
        res.redirect('/login');
      }
    );
  });
};