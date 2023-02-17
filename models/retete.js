const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reteta = new Schema({
    tipAfectiune:{
      type : String,
      required:true
    },
    nume_medic : {
        type: String,
        required : true
    },
    prenume_medic : {
        type: String,
        required : true
    },
    medic_id:{
       type:Schema.Types.ObjectId,
       required: true
    },
    medicamentPrescris: {
        type : String,
        required : true
    },
    userID : {
        type : Schema.Types.ObjectId,
        ref : "User"

    }
},{ collection : 'retete' });
module.exports = mongoose.model('reteta', reteta);