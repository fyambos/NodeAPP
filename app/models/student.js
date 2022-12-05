// importer mongoose
const mongoose = require('mongoose');

// creer le Schema de l'entité
const studentSchema = new mongoose.Schema({
    firstname: {
        type: String,
        require: [true, 'Entrez un prénom'],
        trim: true
    },
    lastname: {
        type: String,
        require: [true, 'Entrez un nom'],
        trim: true
    },
    email: {
        type: String,
        require: true,
        trim: true
    
    },
    password: {
        type: String,
        require: true,
        trim: true
    },
    classe: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classe'
    }

}, {
    //timestamps:
    timestamps: {
        createdAt: 'created_at',
        updateAt: "update_at"
    }
});

// renvoyer le modele crée à partir du Schema
module.exports = mongoose.model('Student', studentSchema);