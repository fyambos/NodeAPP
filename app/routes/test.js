const express = require('express');
const { v4: uuidv4 } = require('uuid');

let router = express.Router();

let classes = [];

// POST method route, créer un objet classe et le push dans classes
router.post('/', (request, response) => {
  const {name} = request.body;
  //console.log(request.body);
  let classe = {
    id: uuidv4(),
    name
  };
  classes.push(classe);
  response.status(200).json(classe);
  });

// GET method, accéder a la liste des classes
router.get('/', (request, response) => {
  response.status(200).json(classes);
});

// GET method, accéder a une classe par un id
router.get('/:id', (request, response) => {
  console.log(request.query, request.params);
  const {id} = request.params;
  let classe = classes.find(item => item.id === id);
  response.status(200).json(classe);
});

// PUT method, POST but only once
router.put('/', (request, response) => {
    const {name} = request.body;
    //console.log(request.body);
    let classe = {
      id: uuidv4(),
      name
    };
    classes.push(classe);
    response.status(200).json(classe);
    });

// DELETE method, delete by an id
router.delete('/:id', (request, response) => {
    console.log(request.query, request.params);
    const {id} = request.params;
    let classe = classes.find(item => item.id === id);
    response.status(200).json(id);
  });

// HEAD method, check what GET will return
router.head('/:id', (request, response) => {
    console.log(request.query, request.params);
    const {id} = request.params;
    let classe = classes.find(item => item.id === id);
    response.status(200).json(classe);
  });

// PATCH method, partial update
router.patch('/:id', (request, response) => {
    console.log(request.query, request.params);
    const {id} = request.params;
    let classe = classes.find(item => item.id === id);

    response.status(200).json(classe);

    const {name} = request.body;
    classe[name] = name;

    response.status(200).json(classe);
    });

module.exports = router