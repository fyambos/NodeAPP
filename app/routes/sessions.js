const { response } = require('express');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const sessionModel = require('../models/session');
const classeModel = require('../models/classe');
const matiereModel = require('../models/matiere'); 

let router = express.Router();

let sessions = [];

router.post('/', async (req, res) => {
    try {
        const { start, end, classeId, matiereId } = req.body;
        const classe = await classeModel.findById(classeId);
        const matiere = await matiereModel.findById(matiereId);

        if (!classe || !matiere) {
            return res.status(404).json({
                error: "La classe ou la matière n'existent pas"
            });
        }
        // todo https://www.mongodb.com/docs/manual/reference/operator/query/
        const conflitEDT = await sessionModel.find({
            classe: classeId,
            $or: [
                { start: { $gte: start, $lt: end } },
                { end: { $gt: start, $lte: end } },
                { start: { $lt: start }, end: { $gt: end } }
            ]
        });
        if (conflitEDT.length > 0) {
            return res.status(409).json({ error: "La classe a déjà une session en conflit avec l'horaire de cette nouvelle session" });
        }

        // creer la session
        const session = new sessionModel({
            start,
            end,
            classe: classeId,
            matiere: matiereId
        });
        await session.save();
        // populate pour classe/matiere
        const populatedSession = await sessionModel.populate(session, [
            { path: 'classe', model: 'Classe' },
            { path: 'matiere', model: 'Matiere' }
        ]);
        return res.status(200).json(populatedSession);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// GET method, accéder a la liste des sessions
router.get('/', async (request, response) => {
  try {
    sessions = await sessionModel.find()
    return response.status(200).json(sessions);
  } catch(error) {
    return response.status(500).json({
      msg: error
    });
  }
});

// GET method, accéder a une session par un id
router.get('/:id', async (request, response) => {
  //récupérer les sessions
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
    let session = await sessionModel.findOne({
      _id: id
    });
    if(session===null){
      response.status(500).json({
          "msg" : "La session n'existe pas."
      });
    }
    else {
      return response.status(200).json(session);
    }
  } catch (e) {
      return response.status(500).json({
          "msg" : "Une erreur est survenue: " + e
      });
  }
});


router.get('/current/:classId', async (req, res) => {
    //todo: verifications d'entrée de saisies
    try {
        const classId = req.params.classId;
        const currentDate = new Date();
        const currentSession = await sessionModel.findOne({
            classe: classId,
            start: { $lt: currentDate },
            end: { $gt: currentDate }
        })
        .populate("classe") 
        .populate("matiere");
        //populate pour pouvoir voir le contenu des classes et matieres de la session, et pas juste l'id
        //il y a une seule session (findOne) donc c'est lisible d'avoir toutes ces données
        if (!currentSession) {
            return res.status(404).json({
                error: "Il n'y a pas de session en cours pour cette classe.",
                currentDate: currentDate
            });
        }
        return res.status(200).json(currentSession);
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
});

router.get('/today/:classId', async (req, res) => {
  //todo: verifications d'entrée de saisies
  try {
      const classId = req.params.classId;
      const currentDate = new Date();
      const dayStart = new Date();
      dayStart.setUTCHours(0,0,0,0);

      const dayEnd = new Date();
      dayEnd.setUTCHours(23,59,59,999);
      const todaySessions = await sessionModel.find({
          classe: classId,
          start: { $lt: dayEnd },
          end: { $gt: dayStart }
      });
      if (!todaySessions) {
          return res.status(404).json({
              error: "Il n'y a pas de sessions aujourd'hui.",
              currentDate: currentDate,
              dayStart:dayStart,
              dayEnd:dayEnd
          });
      }
      return res.status(200).json({"results":todaySessions,"dayStart":dayStart,"dayEnd":dayEnd,"currentDate":currentDate});
  } catch (error) {
      return res.status(500).json({
          error: error.message
      });
  }
});

// PUT method, total update // a faire


// DELETE method, delete by id
router.delete('/:id', async (request,response) => {
  const {id} = request.params;
  sessionModel.findByIdAndDelete({'_id':id}).then(function (session) {

  //return the updated session list:
  sessionModel.find({}).then(function (sessions) {
    response.status(200).json(sessions);
      });

  });
});

// HEAD method, à faire

// PATCH method, partial update // a faire

module.exports = router