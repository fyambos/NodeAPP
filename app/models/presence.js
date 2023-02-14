// importer mongoose
const mongoose = require('mongoose')
// creer le Schema de l'entité
const presenceSchema = new mongoose.Schema({
    present: {
        type: Boolean,
        default: false
    },
    student: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    session: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session'
    }
}, {
    //timestamps:
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

// renvoyer le modele crée à partir du Schema
module.exports = mongoose.model('Presence', presenceSchema);