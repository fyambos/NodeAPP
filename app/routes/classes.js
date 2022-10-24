const express = require('express');
const { v4: uuidv4 } = require('uuid');

let router = express.Router();

// GET method, accéder a la liste des classes
router.get('/', (request, response) => {
  response.status(200).json(classes);
});

// GET method, accéder a une classe par un id
router.get('/:id', (request, response) => {
  console.log(request.query, request.params);
  const {id} = request.params
  let classe = classes.find(item => item.id === id);
  response.status(200).json(classe);
})




module.exports = router