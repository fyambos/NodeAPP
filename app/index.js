//import packages
const express = require('express');
const morgan = require('morgan');

//create express app
const app = express();

//use packages
app.use(morgan("dev"));
app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies using qs library

//import routes
const birdsRouter = require('./routes/birds');
const TestRouter = require('./routes/test');
const classesRouter = require('./routes/classes');

//use routes, this is the name they will have on localhost
app.use('/birds', birdsRouter);
app.use('/classetest', TestRouter);
app.use('/classes', classesRouter);

//exemple, créer une route / qui renvoie un message
app.get("/", (req, res) => {
  res.status(200).send('<h1>Hello World!</h1>');
});

//notre application va recevoir des requetes sur le port 4500.
//Listen() permet de voir ces requetes.
app.listen(4500, () => {
    console.log('Server is running on http://127.0.0.1:4500');
});