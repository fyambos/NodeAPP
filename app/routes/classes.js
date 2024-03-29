const { response } = require('express');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const classeModel = require('../models/classe');
const student = require('../models/student');
const studentModel = require('../models/student'); // Schema hasn't been registered for model \"student\".\nUse mongoose.model(name, schema)"

let router = express.Router();

let classes = [];

router.post('/add-student', async (request,response) => {
  try {
    const {studentId, classeId} = request.body;
    //todo, ne pas push si le student n'est pas inscrit dans la base, ne pas push si le student est déjà affecté  à une autre classe?? recup liste [] des classes findall et regarder si classId existe, et si studentId est present dans une des classes?
    const classe = await classeModel.findOne({
      _id: classeId
    });
    const student = await studentModel.findOne({
      _id: studentId
    });
    //verif si le student n'a pas déjà ete affecté à la classe
    if(classe.students.indexOf(studentId) === -1) {
      classe.students.push(studentId);
      await classe.save();
      await studentModel.findByIdAndUpdate(studentId, {
          classe:classeId
        }, {
          new: true
        });
      const populatedClasse = await classeModel.populate(classe, {
          path: "students",
          model: "Student"
        });
      
      await classe.save();
      return response.status(200).json(populatedClasse);
    } else {
      return response.status(400).json({
        error: "Le student "+student.firstname + " " + student.lastname +" à déjà été affecté à la classe " + classe.label
      });
    }
  }catch(error){
    console.log(error);
    return response.status(500).json({error: error.message});
  }
});



// POST method route, créer un objet classe et le push dans classes
router.post('/', async (request, response) => {
  //only get the name attribute in the body, not the rest
  const {label} = request.body;

  //gestion des erreurs
  if (label == "" || typeof label == "undefined") {
    return response.status(500).json({
      msg: "Vous devez donner un label à votre classe"
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
          "msg" : "La classe n'existe pas."
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
        response.status(200).json(classe);
    } catch (e) {
        return response.status(500).json({
            "msg" : "Une erreur est survenue: " + e
        });
    }
});

// DELETE method, delete by id
router.delete('/:id', async (request,response) => {
  const {id} = request.params;
  classeModel.findByIdAndDelete({'_id':id}).then(function (classe) {

  //return the updated class list:
  classeModel.find({}).then(function (classes) {
    response.status(200).json(classes);
      });

  });
});

// HEAD method, à faire
router.head('/:id', (request,response) => {
    const {id} = request.params;
    classeModel.findById({'_id':id}).then(function (classe) {
      response.status(200).json(classe);
    });
  });

// PATCH method, partial update
router.patch('/:id', (request,response) => {
    const {id} = request.params;
    const {label} = request.body;
    classeModel.findByIdAndUpdate({'_id':id}).then(function (classe) {
      classe.label = label;
      response.status(200).json(classe);
    });
});

module.exports = router