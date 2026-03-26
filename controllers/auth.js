const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const { error } = require('console');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});



const userId = 1; // Assume you have a user with ID 1

db.query('SELECT name, email FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
        console.error('Error fetching name and email from database:', err);
        // Handle the error appropriately
    } else {
        if (results.length > 0) {
            const userName = results[0].name;
            const userEmail = results[0].email;
            console.log('User name:', userName);
            console.log('Email:', userEmail);
            // Use the user name and email as needed
        } 
    }
});


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).render('login', {
                message: 'You need to provide both email and password'
            });
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Internal Server Error');
            }

            if (!results || results.length === 0 || !(await bcrypt.compare(password, results[0].password))) {
                // Incorrect email or password
                return res.status(400).json({
                    message: 'Incorrect email or password'
                });
            }
            return res.json({
                message: "Login successful",
                user: results[0]
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.register = async (req, res) => {
    const { name, email, password, passwordConfirm } = req.body;

    try {
        db.query('SELECT email FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length > 0) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    db.query(
        'INSERT INTO users SET ?',
        { name, email, password: hashedPassword },
        (err) => {
            if (err) return res.status(500).json({ error: err });

            return res.json({ message: "User registered successfully" });
        }
    );
});


    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};
