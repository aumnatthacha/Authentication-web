const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const session = require('express-session');

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
  res.sendFile(__dirname + '/views/login.html');
});

// Create a route to handle the login POST request
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
        req.session.authorities = results[0].authorities; // เปลี่ยนเป็น authorities
        
        res.redirect('/dashboard'); // เด้งไปยังหน้า dashboard
      } else {
        console.log("Login Failed");
        res.send("Invalid username or password. Please try again.");
      }
    }
  });
});

// Example of an authorized route
// Example of an authorized route
router.get('/dashboard', isAuthenticated, (req, res) => {
  const authorities = req.session.authorities; // เปลี่ยนเป็น authorities ใน session ตอน login

  if (authorities === 'admin') { // เปลี่ยน userRole เป็น authorities
    res.sendFile(__dirname + '/views/admin.html');
  } else if (authorities === 'user') { // เปลี่ยน userRole เป็น authorities
    res.sendFile(__dirname + '/views/user.html');
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
