const bcrypt = require('bcryptjs');
const mysql = require('mysql2');

// DB connection
const db = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000
});

// CONNECT DB
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("MySQL Connected");
  }
});


// ================= LOGIN =================
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password required",
    });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
      }

      if (results.length === 0) {
        return res.status(400).json({
          message: "User not found",
        });
      }

      const user = results[0];

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          message: "Incorrect password",
        });
      }

      // REMOVE PASSWORD from response
      delete user.password;

      return res.json({
        message: "Login successful",
        user,
      });
    }
  );
};


// ================= REGISTER =================
exports.register = (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  if (!name || !email || !password || !passwordConfirm) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  if (password !== passwordConfirm) {
    return res.status(400).json({
      message: "Passwords do not match",
    });
  }

  db.query(
    "SELECT email FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
      }

      if (results.length > 0) {
        return res.status(400).json({
          message: "Email already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 8);

      db.query(
        "INSERT INTO users SET ?",
        { name, email, password: hashedPassword },
        (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Insert error" });
          }

          return res.json({
            message: "User registered successfully",
          });
        }
      );
    }
  );
};