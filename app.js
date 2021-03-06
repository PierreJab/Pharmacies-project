require('dotenv').config()

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const session      = require('express-session');
const MongoStore   = require('connect-mongo')(session);
const passportSetup = require('./passport/setup');
const flash        = require('flash');


mongoose.Promise = Promise;
mongoose
  // .connect('mongodb://localhost/lab-passport-roles', {useMongoClient: true})
  .connect(process.env.MONGODB_URI ? process.env.MONGODB_URI : 'mongodb://localhost/lab-passport-roles')
  .then(() => {
    console.log('Connected to Mongo!' + process.env.MONGODB_URI || 'mongodb://localhost/lab-passport-roles')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(session({
  secret: "secret different for every app",
  saveUninitialized: true,
  resave: true,
  // store session data in MongoDB (otherwise we are logged out constantly)
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));
app.use(flash());

// must come after session
passportSetup(app);


// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';



const index = require('./routes/index');
app.use('/', index);

const authRouter = require('./routes/auth-router');
app.use('/', authRouter);

const adminRouter = require('./routes/admin-router');
app.use('/', adminRouter);

// const loggedRouter = require('./routes/logged-router');
// app.use('/', loggedRouter);

const mapsRouter = require('./routes/maps-router');
app.use('/', mapsRouter);

const pharmaciesRouter = require('./routes/pharmacies-router');
app.use('/', pharmaciesRouter);

module.exports = app;
