// importer mongoose
const mongoose = require('mongoose')
// creer le Schema de l'entité
const sessionSchema = new mongoose.Schema({
    start: {
        type: Date,
        default: Date.now
    },
    end: {
        type: Date,
        default: Date.now
    },
    matiere: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    classe: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classe'
    }
}, {
    //timestamps:
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

// renvoyer le modele crée à partir du Schema
module.exports = mongoose.model('Session', sessionSchema);