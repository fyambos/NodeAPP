const express = require('express');
const { v4: uuidv4 } = require('uuid');

let router = express.Router();

let classes = [];

// POST method route, créer un objet classe et le push dans classes
router.post('/', (request, response) => {
  //only get the name attribute in the body, not the rest
  const {name} = request.body;
  let classe = {
    id: uuidv4(),
    name
  };
  classes.push(classe);
  classes.push({id: uuidv4(),name:"java"});
  classes.push({id: uuidv4(),name:"web dev"});
  classes.push({id: uuidv4(),name:"web service"});
  classes.push({id: uuidv4(),name:"english"});
  classes.push({id: uuidv4(),name:"ios swift"});
  classes.push({id: uuidv4(),name:"maths"});
  response.status(200).json(classe);
  });

// GET method, accéder a la liste des classes
router.get('/', (request, response) => {
  response.status(200).json(classes);
});

// GET method, accéder a une classe par un id
router.get('/:id', (request, response) => {
  const {id} = request.params;
  let classe = classes.find(item => item.id === id); //( item => { return item.id === id; });
  response.status(200).json(classe);
});

// PUT method, total update
router.put('/:id', (request, response) => {
    const {id} = request.params;
    const {name} = request.body;
    let classe = classes.find(item => item.id === id); 
    classe.name = name;
    /*
     * 
     * classes = classes.filter(item => item.id != id);
     * classes.push(classe);
    */
    response.status(200).json(classe);
    });

// DELETE method, delete by an id
router.delete('/:id', (request, response) => {
  const {id} = request.params;
  classes = classes.filter(item => item.id != id);
  response.status(200).json(classes);
});

// HEAD method, check what GET will return
router.head('/:id', (request, response) => {
    const {id} = request.params;
    let classe = classes.find(item => item.id === id);
    response.status(200).json(classe);
  });

// PATCH method, partial update
router.patch('/:id', (request, response) => {
    //find the class the id in url
    const {id} = request.params;
    let classe = classes.find(item => item.id === id);
    //get the parameters to patch
    const {name,room} = request.body;
    //patch the parameters
    classe["name"] = name;
    classe["room"] = room;
    //delete the original id
    classes = classes.filter(item => item.id != id);
    //
    classes.push(classe);
    response.status(200).json(classes);
    });

module.exports = router