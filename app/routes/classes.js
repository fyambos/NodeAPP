const { response } = require('express');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const classeModel = require('../models/classes');

let router = express.Router();

let classes = [];

// POST method route, créer un objet classe et le push dans classes
router.post('/', async (request, response) => {
  //only get the name attribute in the body, not the rest
  const {label} = request.body;

  //gestion des erreurs
  if (label == "" || typeof label == "undefined") {
    return response.status(500).json({
      msg: "Vous devez donner un nom à votre classe"
    });
  }

  //try catch pour ajouter une classe a la bdd
  try { 
    let classe = await classeModel.create({
      label
    });
    return response.status(200).json(classe);
  } catch(error) {
    return response.status(500).json({
      msg: error
    });
  }
});
   

// GET method, accéder a la liste des classes
router.get('/', async (request, response) => {
  try {
    classes = await classeModel.find()
    /*
    // ancienne methode, réellement asynchrone, pendant l'attente le reste du code est exécuté, non pausé
    classeModel.find({}).then(function (classes) {
      response.status(200).json(classes);
      });
    */
    return response.status(200).json(classes);
  } catch(error) {
    return response.status(500).json({
      msg: error
    });
  }
});

// GET method, accéder a une classe par un id
router.get('/:id', async (request, response) => {
  //récupérer les classes
  const {id} = request.params;
  //verifier qu'un id est entré
  if (id == "" || typeof id == "undefined") {
    return response.status(500).json({
      msg: "Vous devez entrer un id"
    });
  }
  //verifier que l'id est au bon format
  if (typeof id!='string' && id.length != 24 && typeof id!='number') {
    return response.status(500).json({
      msg : "Format ID incorrect. L'ID est une chaîne de 24 caractères où un entier."
    });
  }
  try {
    //get l'enregistrement par l'id
    let classe = await classeModel.findOne({
      _id: id
    });
    if(classe===null){
      response.status(500).json({
          "msg" : "Enregistrement non trouvé."
      });
    }
    else {
      return response.status(200).json(classe);
    }
  } catch (e) {
      return response.status(500).json({
          "msg" : "Une erreur est survenue: " + e
      });
  }
});

// PUT method, total update
router.put('/:id', async (request, response) => {
    const {id} = request.params;
    const {label} = request.body;
    try {
        let classe = await classeModel.findOneAndUpdate({
            _id: id //element de recherche, pas forcément id
        }, {
          label, //elements modifiéss
        }, {
            new: true //pour avoir l'élement après mis à jour et non l'élement récupéré
        });
        res.status(200).json(classe);
    } catch (e) {
        return response.status(500).json({
            "msg" : "Une erreur est survenue: " + e
        });
    }
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