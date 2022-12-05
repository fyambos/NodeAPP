// importer mongoose
const mongoose = require('mongoose')
// creer le Schema de l'entité
const classeSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
        //retirer les espaces avant et après dans une chaine
        trim: true
    },
    students: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }]
}, {
    //timestamps:
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

// renvoyer le modele crée à partir du Schema
module.exports = mongoose.model('Classe', classeSchema);