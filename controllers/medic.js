var User = require('../models/users');
const Analize = require('../models/analize');
const reteta = require('../models/retete');
const consultatie = require('../models/consultatie');
const e = require('express');

exports.getListaPacienti = (req,res,next)=>{

  if(req.session.User.role!=='medic'){

    res.redirect('/');
  }else{

    User.find({role:"user"})
    .then(users => {

      res.render('listare-pacienti', {
        listaPacienti: users,
        profileName : req.session.User.username,
        pageTitle: 'Afiseaza toti pacientii',
        role:req.session.User.role
      });
    })
    .catch(err => {
      console.log(err);
    });
  }

  };
  exports.getAdaugaReteta = (req,res,next)=>{

    if(req.session.User.role!=='medic'){

      res.redirect('/');
    }else{

    User.find({role:"user"})
    .then(users => {

      res.render('adauga-reteta', {
        listaPacienti: users,
        profileName : req.session.User.username,
        pageTitle: 'Afiseaza pacientii',
        role:req.session.User.role,
        numeMedic: req.session.User.nume,
        prenumeMedic:  req.session.User.prenume,
        medic_id : req.session.User._id
      });
    })
    .catch(err => {
      console.log(err);
    });
  }

  };

  exports.postAdaugaReteta = (req, res, next) => {

    if(req.session.User.role!=='medic'){

      res.redirect('/');
    }else{
    const numeAfectiune = req.body.numeAfectiune;
    const medicament = req.body.medicament;
    const pacientID = req.body.pacientID;
    const retetaMedicala = new reteta({
      tipAfectiune : numeAfectiune,
      nume_medic : req.session.User.nume,
      prenume_medic: req.session.User.prenume,
      medic_id : req.session.User._id,
      medicamentPrescris:medicament,
        userID : pacientID

    });
    retetaMedicala
      .save()
      .then(result => {
        // console.log(result);
        console.log('Reteta Inregistrata');
        res.redirect('/');
      })
      .catch(err => {
        console.log(err);
      });
    }
  };