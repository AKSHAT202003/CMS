/* Importing Different Modules */
const { globalVariables } = require('./config/configuration');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const hbs = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload');
const passport = require('passport');
const { mongoDbUrl, PORT } = require('./config/configuration');
const { selectOption } = require('./config/customFunctions');

// Initialize express
const app = express();

// Configure Mongoose to Connect to MongoDB
mongoose.connect(mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB Connected Successfully.");
  })
  .catch(err => {
    console.error("Database connection failed.", err);
  });

/* Configure express */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

/* Flash and Session */
app.use(session({
  secret: 'anysecret',
  saveUninitialized: true,
  resave: true
}));
app.use(flash());

/* Initialize Passport */
app.use(passport.initialize());
app.use(passport.session());

/* Use Global Variables */
app.use(globalVariables);

/* File Upload Middleware */
app.use(fileUpload());

/* Setup View Engine To Use Handlebars */
app.engine('handlebars', hbs.engine({
  defaultLayout: 'default',
  helpers: { select: selectOption },
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

/* Method Override Middleware */
app.use(methodOverride('_method'));

/* Routes */
const defaultRoutes = require('./routes/defaultRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/', defaultRoutes);
app.use('/admin', adminRoutes);

/* Start The Server */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
