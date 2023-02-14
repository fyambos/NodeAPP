const { response } = require('express');
const express = require('express');
const matiereModel = require('../models/matiere');
let router = express.Router();

let matieres = [];


// POST method route, créer un objet matiere et le push dans matieres
router.post('/', async (request, response) => {
    //only get the name attribute in the body, not the rest
    const {label} = request.body;
  
    //gestion des erreurs
    if (label == "" || typeof label == "undefined") {
      return response.status(500).json({
        msg: "Vous devez donner un nom à votre matière"
      });
    }
  
    //try catch pour ajouter une matiere a la bdd
    try { 
      let matiere = await matiereModel.create({
        label
      });
      return response.status(200).json(matiere);
    } catch(error) {
      return response.status(500).json({
        msg: error
      });
    }
  });
     
  
  // GET method, accéder a la liste des matieres
  router.get('/', async (request, response) => {
    try {
      matieres = await matiereModel.find()
      /*
      // ancienne methode, réellement asynchrone, pendant l'attente le reste du code est exécuté, non pausé
      matiereModel.find({}).then(function (matieres) {
        response.status(200).json(matieres);
        });
      */
      return response.status(200).json(matieres);
    } catch(error) {
      return response.status(500).json({
        msg: error
      });
    }
  });
  
  // GET method, accéder a une matiere par un id
  router.get('/:id', async (request, response) => {
    //récupérer les matieres
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
      //get les matieres par l'id
      let matiere = await matiereModel.findOne({
        _id: id
      });
      if(matiere===null){
        response.status(500).json({
            "msg" : "Enregistrement non trouvé."
        });
      }
      else {
        return response.status(200).json(matiere);
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
          let matiere = await matiereModel.findOneAndUpdate({
              _id: id //element de recherche, pas forcément id
          }, {
            label, //elements modifiéss
          }, {
              new: true //pour avoir l'élement après mis à jour et non l'élement récupéré
          });
          response.status(200).json(matiere);
      } catch (e) {
          return response.status(500).json({
              "msg" : "Une erreur est survenue: " + e
          });
      }
  });
  
  // DELETE method, delete by id
  router.delete('/:id', async (request,response) => {
    const {id} = request.params;
    matiereModel.findByIdAndDelete({'_id':id}).then(function (matiere) {
  
    //return the updated class list:
    matiereModel.find({}).then(function (matieres) {
      response.status(200).json(matieres);
        });
  
    });
  });
  
  // HEAD method, à faire
  router.head('/:id', (request,response) => {
      const {id} = request.params;
      matiereModel.findById({'_id':id}).then(function (matiere) {
        response.status(200).json(matiere);
      });
    });
  
  // PATCH method, partial update
  router.patch('/:id', (request,response) => {
      const {id} = request.params;
      const {label} = request.body;
      matiereModel.findByIdAndUpdate({'_id':id}).then(function (matiere) {
        matiere.label = label;
        response.status(200).json(matiere);
      });
  });
  
module.exports = router