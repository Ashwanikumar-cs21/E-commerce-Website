const cors = require("cors");
const express = require("express");
const path = require('path');
const mysql = require("mysql2");
const dotenv = require('dotenv');

app.use(cors());


dotenv.config({ path: './.env'});


const app = express();

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT
});



const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set('view engine', 'hbs');




db.connect( (error) => {
    if(error) {
        console.log(error)
    } else {
        console.log("mySql connected.....")
    }
})

//Define Routes
app.use('/', require('./routes/pages'));
app.use('/auth',require('./routes/auth'));
pp.use('/api', require('./routes/auth'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("server start");
})
