const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); 

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'views')));

const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');

app.use('/', loginRouter);
app.use('/', signupRouter);

app.listen(3000, () => {
  console.log('Server is running on port http://localhost:3000/signup');
});
