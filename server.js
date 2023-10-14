const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); 

class App {
  constructor() {
    this.app = express();
    this.configureMiddleware();
    this.configureRoutes();
  }

  configureMiddleware() {
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(express.static(path.join(__dirname, 'views')));
  }

  configureRoutes() {
    const loginRouter = require('./routes/login');
    const signupRouter = require('./routes/signup');

    this.app.use('/', loginRouter);
    this.app.use('/', signupRouter);
  }

  startServer(port) {
    this.app.listen(port, () => {
      console.log(`Server is running on port http://localhost:${port}/signup`);
    });
  }
}

const myApp = new App();
myApp.startServer(3000);
