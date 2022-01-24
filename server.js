const path = require('path');
const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const exphbs = require('express-handlebars');
const session = require('express-session');
const helpers = require('./utils/helpers');

// This code sets up an Express.js session and connects the session to our Sequelize database.
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
  // hash based authentication code, secret property uses secret to sign session cookie 
  secret: process.env.DB_SECRET,
  // cookie object itself used by the session
  cookie: {},
  // Forces session to be saved back to sessionStore even if cookie hasnt been modified
  resave: false,
  // When you make a new session the session is saved as part of the store
  saveUninitialized: true,
  // Creates the connection with the DB, sets up session table, and allows sequelize to save the session into the db
  store: new SequelizeStore({
    db: sequelize
  })
};

const app = express();
const PORT = process.env.PORT || 3005;


const hbs = exphbs.create({ helpers });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Middleware so server can accept POST data
//
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sess));

// turn on routes
app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});


