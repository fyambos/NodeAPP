const express = require('express');
const studentModel = require('../models/student');
let router = express.Router();

// POST method, enregistrer un student en bdd
router.post('/', async (req,res) => {
    const {firstname, lastname} = req.body;
    if (typeof firstname === 'undefined' || typeof lastname === 'undefined') {
        return res.status(500).json({
            "msg" : "Vous devez entrer un nom et un prénom."
        });
    }
    else if (firstname.length < 2 || lastname.length < 2 || firstname.length > 50 || lastname.length > 50) {
        return res.status(500).json({
            "msg" : "Le nom et le prénom doivent respectivement faire entre 2 et 50 caractères."
        });
    }
    else {
        try {
            //await allows the function to wait for the return of a request (here wait till student is completed)
            //the post method needs to be an async function. 
            let student = await studentModel.create({
                firstname,
                lastname
            });

            return res.status(200).json(student);
            
        } catch (e) {
            return res.status(500).json({
                "msg" : "Une erreur est survenue: " + e
            });
        }
    }
});

// GET method, accéder a la liste des students
router.get('/', async (req,res) => {
    studentModel.find({}).then(function (students) {
    res.status(200).json(students);
    });
});

// GET method, accéder a un student par un id
router.get('/:id', async (req,res) => {
    const {id} = req.params;
    //verifier que l'id est au bon format
    if((typeof id==='string' && id.length === 24) || typeof id==='number'){
        try {
            //get l'enregistrement par l'id
            studentModel.findById({'_id':id}).then(function (student) {
                // si non trouvé, renvoyer msg
                if(student===null){
                    res.status(500).json({
                        "msg" : "Enregistrement non trouvé."
                    });
                }
                // si trouvé, renvoyer enregistrement
                else {
                    res.status(200).json(student);
                }
            });
        } catch (e) {
            return res.status(500).json({
                "msg" : "Une erreur est survenue: " + e
            });
        }
    }
    else {
        return res.status(500).json({
            "msg" : "Format ID incorrect. L'ID est une chaîne de 24 caractères où un entier."
        });
    }
});

// DELETE method, delete by id
router.delete('/:id', async (req,res) => {
    const {id} = req.params;
    studentModel.findByIdAndDelete({'_id':id}).then(function (student) {

    //return the updated student list:
    studentModel.find({}).then(function (students) {
        res.status(200).json(students);
        });

    });
});

// PUT method, update whole object by id
router.put('/:id', (req,res) => {
    const {id} = req.params;
    const {firstname, lastname} = req.body;
    studentModel.findByIdAndUpdate({'_id':id}).then(function (student) {
      student.firstname = firstname;
      student.lastname = lastname;
    res.status(200).json(student);
    });

    /*
    let student = studentModel.find(item => item.id === id); 
    student.name = name;
    studentModel = studentModel.filter(item => item.id != id);
    studentModel.push(student);
    res.status(200).json(studentModel);
    */
   
});

// PATCH method, update partial object by id
router.patch('/:id', (req,res) => {
    const {id} = req.params;
    const {lastname} = req.body;
    studentModel.findByIdAndUpdate({'_id':id}).then(function (student) {
      student.lastname = lastname;
    res.status(200).json(student);
    });
});

module.exports = router;