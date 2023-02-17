const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orders = new Schema({
    product:{
      type : String,
      required:true
    },
    quantity:{
      type : Number,
      required:true
    },
    price:{
      type : Number,
      required:true
    },
},{ collection : 'orders' });
module.exports = mongoose.model('orders', orders);