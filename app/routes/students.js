const express = require('express');
const studentModel = require('../models/student');
let router = express.Router();
const bcrypt = require('bcrypt');

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


// Route Register

router.post('/register',  async(req, res) => {

    const {email, email_cfg, password, password_cfg, firstname, lastname} = req.body;

    if((typeof email === 'undefined' || email.trim() === "") || (typeof password === 'undefined' & password.trim() === "" )){

        return(res.status(500).json({
            msg: "Il faut remplir tous le champs !"
        }))
    }

    if(email !== email_cfg || password !== password_cfg){

        return(res.status(500).json({
            msg: "Les confirmations ne sont pas exactes !"
        }))
    }

    try{

        let existeStudent = await studentModel.findOne({email});

        if(existeStudent){
        
            return res.status(500).json({
                msg: "L'utilisateur existe deja "
            })
        }

        let student = await studentModel.create({

            email: email.trim(),
            password: bcrypt.hashSync(password.trim(), 10),
            firstname: typeof firstname !== 'undefined' ? firstname.trim() : "",
            lastname: typeof lastname !== 'undefined' ? lastname.trim() : "",
        });
    
        return(res.status(200).json(student));
    }catch(error){
        console.log(error);
        return res.status(500).json({
            msg: "Une erreur est survenue"
        })
    }
});


// Route Login

router.post('/login',  async(req, res) => {

    const {email, password} = req.body;

    if((typeof email === 'undefined' || email.trim() === "") || (typeof password === 'undefined' & password.trim() === "" )){

        return(res.status(400).json({
            msg: "Mauvaise requête, il faut remplir tous les champs !"
        }))
    }
    
    try{

        let existeStudent = await studentModel.findOne({email: email.trim()});

        if(!existeStudent){
        
            return res.status(401).json({
                msg: "Erreur d'authentification, identifiant ou mot de passe incorrect!"
            });
        }

       let  compare = bcrypt.compareSync(password.trim(), existeStudent.password );

       if(!compare){
            return res.status(401).json({
                msg: "Erreur d'authentification, identifiant ou mot de passe incorrect!"
            });
       }

       return res.status(200).json(existeStudent);
    }catch(error){

        return res(500).json({
            msg: error
        })
    }

});


router.get('/me', async (request, response) => {
    //afin de récup le student a jour (info changées telles que classe, email, etc, on refais la requete à chaque access à /me)
    try {
        let student = await studentModel.findOne({email: request.session.student.email.trim()});
    } catch (e) {
        return res.status(500).json({
            "msg" : "Une erreur est survenue: " + e
        });
    }
    request.session.student = student;
    return response.status(200).json(request.session.student);
});

router.post('/logout', (req, res) => {
    req.session.student = null;
    res.json({ message: "Logout successful." });
  });

// GET method, accéder a un student par un id
router.get('/:id', async (req,res) => {
    const {id} = req.params;
    //verifier que l'id est au bon format
    if((typeof id==='string' && id.length === 24) || typeof id==='number'){
        try {
            //get l'enregistrement par l'id
            studentModel.findById({'_id':id}).populate("classe").then(function (student) {
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
router.put('/:id', async (req,res) => {
    const {id} = req.params;
    const {firstname, lastname} = req.body;
    try {
        let student = await studentModel.findOneAndUpdate({
            _id: id //element de recherche, pas forcément id
        }, {
            firstname, //elements modifiéss
            lastname
        }, {
            new: true //pour avoir l'élement après mis à jour et non l'élement récupéré
        });
        
        res.status(200).json(student);
    } catch (e) {
        return res.status(500).json({
            "msg" : "Une erreur est survenue: " + e
        });
    }
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