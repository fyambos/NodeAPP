const { response } = require('express');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const presenceModel = require('../models/presence');
const sessionModel = require('../models/session');
const studentModel = require('../models/student'); 

let router = express.Router();

let presences = [];

router.post('/', async (req, res) => {
    try {
        const { sessionId, studentId } = req.body;
        const session = await sessionModel.findById(sessionId);
        const student = await studentModel.findById(studentId);

        if (!session || !student) {
            return res.status(404).json({
                error: "La session ou le student n'existent pas"
            });
        }
        // creer la presence
        const presence = new presenceModel({
            present: true,
            session: sessionId,
            student: studentId
        });
        await presence.save();
        // populate pour session/student
        const populatedSession = await presenceModel.populate(presence, [
            { path: 'session', model: 'Classe' },
            { path: 'student', model: 'Matiere' }
        ]);
        return res.status(200).json(populatedSession);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// GET method, accéder a la liste des presences
router.get('/', async (request, response) => {
  try {
    presences = await presenceModel.find()
    return response.status(200).json(presences);
  } catch(error) {
    return response.status(500).json({
      msg: error
    });
  }
});

// GET method, accéder a une presence par un id
router.get('/:id', async (request, response) => {
  //récupérer les presences
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
    let presence = await presenceModel.findOne({
      _id: id
    });
    if(presence===null){
      response.status(500).json({
          "msg" : "La presence n'existe pas."
      });
    }
    else {
      return response.status(200).json(presence);
    }
  } catch (e) {
      return response.status(500).json({
          "msg" : "Une erreur est survenue: " + e
      });
  }
});



// PUT method, total update // a faire


// DELETE method, delete by id
router.delete('/:id', async (request,response) => {
  const {id} = request.params;
  presenceModel.findByIdAndDelete({'_id':id}).then(function (presence) {

  //return the updated presence list:
  presenceModel.find({}).then(function (presences) {
    response.status(200).json(presences);
      });

  });
});

// HEAD method, à faire

// PATCH method, partial update // a faire

module.exports = router
