var User = require('../models/users');
const Analize = require('../models/analize');
const reteta = require('../models/retete');
const consultatie = require('../models/consultatie');



exports.getUseri = (req,res,next)=>{

      

    User.find()
    .then(users => {

      if(req.session.User.role!=='admin'){

        res.redirect('/');
      }else{

     
      res.render('listare-useri', {
        listaUseri: users,
        profileName : req.session.User.username,
        pageTitle: 'Afiseaza toate analizele disponibile',
        role:req.session.User.role
      });
    }
    })
    .catch(err => {
      console.log(err);
    });


  };
  exports.deleteUser= (req,res,next) => {


    if(req.session.User.role!=='admin'){

      res.redirect('/');
    }else{

    const userId = req.body.id;
    User.findByIdAndRemove(userId)
      .then(() => {
        console.log('Users Deleted');
        res.redirect('/');
      })
      .catch(err => console.log(err));

    }
  }

  exports.deleteAnaliza = (req,res,next) => {

    if(req.session.User.role!=='admin'){

      res.redirect('/');
    }else{

    const idAnaliza = req.body.id;
    Analize.findByIdAndRemove(idAnaliza)
      .then(() => {
        console.log('Analiza a fost Stearsa');
        res.redirect('/listare-analize');
      })
      .catch(err => console.log(err));
    }
  }
  exports.editAnaliza = (req, res, next) => {


    if(req.session.User.role!=='admin'){

      res.redirect('/');
    }else{
  
    const idAnaliza = req.body.analizaid;

    
    const pret =req.body.pret;


    Analize.findById(idAnaliza)
      .then(analiza => {
        
      analiza.Pret = pret;

        
        return analiza.save();

       
      })
      .then(result => {
        console.log('UPDATED Price !');
        res.redirect('/listare-analize');
      })
      .catch(err => console.log(err));
    }
};

exports.getAdaugaAnaliza= (req, res, next) => {
  if(req.session.User.role!=='admin'){

    res.redirect('/');
  }else{
    res.render('adauga-tip-analiza', {
      pageTitle: 'Adauga Analiza',
      role: req.session.User.role,
      profileName : req.session.User.username,
      
    });
  }
  };
  exports.postAdaugaAnaliza = (req, res, next) => {

    if(req.session.User.role!=='admin'){

      res.redirect('/');
    }else{
    const nume = req.body.nume;
    const categorie = req.body.categorie;
    const pret = req.body.pret;
    const analiza = new Analize({
      Categorie: categorie,
      Nume: nume,
      Pret: pret
    });
    analiza
      .save()
      .then(result => {
        // console.log(result);
        console.log('Analiza Inregistrata');
        res.redirect('/listare-analize');
      })
      .catch(err => {
        console.log(err);
      });
    }
  };
  exports.postAddUser = (req, res, next) => {

    if(req.session.User.role!=='admin'){

      res.redirect('/');
    }else{
    
    const nume=req.body.nume;
    const prenume=req.body.prenume;
    const username=req.body.username;
    //console.log(username);
    const password=req.body.password;
    const tipUser = req.body.tipUser;
    const email = req.body.email;
  
    console.log(req.body);
  
  
  
    User.findOne({ username: username })
        .then(userDuplicate => {
          if (userDuplicate) {
            return res.redirect('/signup');
          }
          return bcrypt.hash(password, 12);
        })
        .then(hashedPassword => {
          const user = new User({
            nume: nume,
            prenume: prenume,
            username : username,
            password: hashedPassword,
            email:email,
            role : tipUser,
            profile:{
              CNP:"",
              afectiuni:""
            }
          });
          return user.save();
        })
        .then(result => {
          console.log("User Adaugat");
          res.redirect('/admin/listare-useri/');
        })
        .catch(err => {
          console.log(err);
        });
  
      }
      
    };
    exports.getAddUser= (req, res, next) => {

      if(req.session.User.role!=='admin'){

        res.redirect('/');
      }else{
        res.render('adaugare-utilizator', {
          pageTitle: 'Adauga Utilizator',
        role: req.session.User.role,
        profileName : req.session.User.username,
          
        });
      }
      };