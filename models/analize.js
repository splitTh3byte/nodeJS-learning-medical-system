const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Analize = new Schema({
     Categorie :{
         type : String,
         required :true
     },
     Nume : {

      type : String,
      required : true
   },

     Pret : {
        type : Number,
        required:true
     },
    
    
  
}, { collection : 'analize' });
module.exports = mongoose.model('Analize', Analize);