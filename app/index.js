//import packages
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
var cookieParser = require('cookie-parser');

//create express app
const app = express();

//use packages
app.use(morgan("dev"));
app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies using qs library
app.use(cookieParser());
app.use(session({
  secret: 'Secret12',
  //saveUninitialized: true,
  //cookie: { 
  //  secure: true
  //}
}));

//connect to mongoose
//mongoose.connect('mongodb://root:root@mongo:27017/b3?authSource=admin', {
mongoose.connect(process.env.MONGO_URL, {
useNewUrlParser: true
}, (error) => { 
  if (error) {
    console.log(error) 
  }
  else {
    console.log('BD connect!')
  } 
})

//import routes
const birdsRouter = require('./routes/birds');
const TestRouter = require('./routes/test');
const classesRouter = require('./routes/classes');
const studentRouter = require('./routes/students');

//use routes, this is the name they will have on localhost
app.use('/birds', birdsRouter);
app.use('/classetest', TestRouter);
app.use('/classes', classesRouter);
app.use('/students', studentRouter);

//exemple, créer une route / qui renvoie un message
app.get("/", (req, res) => {
  message = '<h1>Hello World!</h1>'
  message = message + '<p><a href="/birds">Birds</a></p>'
  message = message + '<p><a href="/classetest">Classes (Test)</a></p>'
  message = message + '<p><a href="/classes">Classes (ToDo)</a></p>'
  message = message + '<p><a href="/students">Etudiants</a></p>'
  res.status(200).send(message);
});

//notre application va recevoir des requetes sur le port 4500.
//Listen() permet de voir ces requetes.
app.listen(4500, () => {
    console.log('Server is running on http://127.0.0.1:4500');
});

