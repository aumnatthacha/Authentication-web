const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const session = require('express-session');
const path = require('path'); // Add the path module

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

// Configure session management
router.use(session({
  secret: 'natthacha-secret-key', // Change this to a secure secret
  resave: false,
  saveUninitialized: true
}));

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Create a route to display the login form
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/login.html')); // Correct file path
});

// Create a route to handle the login POST request
router.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Query the database to check if the username and password match
  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  con.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error("Error querying database: " + err.message);
      res.send("Error occurred while logging in. Please try again.");
    } else {
      if (results.length === 1) {
        console.log("Login Successful");

        // Set user as authenticated in the session
        req.session.isAuthenticated = true;
        req.session.username = username;
        req.session.authorities = results[0].authorities;
        
        res.redirect('/dashboard');
      } else {
        console.log("Login Failed");
        res.send("Invalid username or password. Please try again.");
      }
    }
  });
});

// Example of an authorized route
router.get('/dashboard', isAuthenticated, (req, res) => {
  const authorities = req.session.authorities;

  if (authorities === 'admin') {
    res.sendFile(path.join(__dirname, '../views/admin.html')); // Correct file path
  } else if (authorities === 'user') {
    res.sendFile(path.join(__dirname, '../views/user.html')); // Correct file path
  } else {
    res.send('Unknown user role');
  }
});

// Create a logout route
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;
