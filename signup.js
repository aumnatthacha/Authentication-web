// signup.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql');


const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb"
});

con.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database");
});

// Create a route to display the signup form
router.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/views/signup.html');
});

// 

// Create a route to retrieve all user data as JSON
router.get('/admin/data', (req, res) => {
  const sql = "SELECT username, authorities, password FROM users";

  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error retrieving data: " + err.message);
      res.status(500).json({ error: "Error occurred while retrieving data." });
    } else {
      console.log("Data retrieved successfully");
      res.json(result);
    }
  });
});

// Create a route to handle the signup POST request
router.post('/signup', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const authorities = req.body.authorities;

  const sql = "INSERT INTO users (username, password, authorities) VALUES (?, ?, ?)";

  con.query(sql, [username, password,authorities], (err, result) => {
    if (err) {
      console.error("Error inserting data: " + err.message);
      res.send("Error occurred while signing up. Please try again.");
    } else {
      console.log("Signup Complete");
      // res.send("Signup Successful!");
      res.sendFile(__dirname + '/views/signup_success.html');
    }
  });
});

module.exports = router;
