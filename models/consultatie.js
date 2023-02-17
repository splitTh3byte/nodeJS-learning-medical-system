const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const consultatie = new Schema({
    nume:{
      type : String,
      required:true
    },
    prenume : {
        type: String,
        required : true
    },
    nr_telefon : {
        type: String,
        required : true
    },
    email: {
        type : String,
        required : true
    },
    medic : {
        medic_id :{
        type :  Schema.Types.ObjectId,
        required: true
        },
        nume_medic : {
            type : String,
            required : true
        },
        prenume_medic : {
            type : String,
            required:true

        }
    },
    userID : {
        type : Schema.Types.ObjectId,
        ref : "User"

    },
    data : {
        type : Date,
        required : true,
        default : Date.now
    }
},{ collection : 'consultatii' });
module.exports = mongoose.model('consultatie', consultatie);