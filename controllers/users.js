const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const nodemail = require('nodemailer');
const stripe = require('stripe');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemail.createTransport(sendgridTransport({
  auth:{
     api_key:"sendGridKey"
  }

}));

var User = require('../models/users');
const Analize = require('../models/analize');
const reteta = require('../models/retete');
const consultatie = require('../models/consultatie');


exports.getIndex = (req, res, next) => {

    Analize
     .estimatedDocumentCount()
     .then(CountAnalize => {
        //  console.log(CountAnalize)
     
        consultatie
        .estimatedDocumentCount()
        .then(countConsultatii => {
          User
          .estimatedDocumentCount()
          .then(countUsers => {


    reteta
     .estimatedDocumentCount()
     .then(countReteta => {
        //  console.log(countUsers)
    
    res.render('index', {
    pageTitle: 'Index',
    profileName : req.session.User.username,
    role:req.session.User.role,
    countA : CountAnalize,
    countRetete : countReteta,
    userCount:countUsers,
    countConsultatii : countConsultatii
  });

  });
});
});


});

};

exports.getContact = (req, res, next) => {
  res.render('contact-me', {
    pageTitle: 'Contact ME !',
    Message : req.flash('info')
    
  });
};
exports.postContact = (req, res, next) => {
  
  console.log(req.body);


  return transporter.sendMail({
    replyTo: req.body.email,
    from: 'testnodejsapp95@gmail.com',
    to:"tutuianmihainarcis@gmail.com",
    subject: 'Info test !',
    html: req.body.message
  }).then(
      req.flash('info','Message was sent !!!'),
     res.redirect('/contact')
  ).catch(
    err =>{
      console.log(err)
    }
  );
  


};

exports.getLogin = (req, res, next) => {

  let isLoggedIn=req.session.User;

   if(isLoggedIn){
     res.redirect('/');
   }else{
    res.render('login', {
      
      pageTitle: 'Login Page ! Auth in order to get access',
      Message : req.flash('error')
     
    })
  }
  };

  exports.getSignup = (req, res, next) => {
    res.render('signup', {
      pageTitle: 'SignUP in order to use this application',
     
    });
  };





  exports.postSignup = (req, res, next) => {
    
      const nume=req.body.nume;
      const prenume=req.body.prenume;
      const username=req.body.username;
      //console.log(username);
      const password=req.body.password;
      const email = req.body.email;

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
              role : "user",
              profile:{
              CNP:"",
                afectiuni:""
              },
              cart: { items: [] }
            });
            return user.save();
          })
          .then(result => {
             console.log("User Adaugat");
            res.redirect('/login');
            return transporter.sendMail({
              replyTo: email,
              from: 'testnodejsapp95@gmail.com',
              to:email,
              subject: 'Userul a fost creat !!',
              html: '<h1>You successfully signed up!</h1>'
            });
          })
          .catch(err => {
            console.log(err);
          });

        
      };
      exports.postLogin = (req, res, next) => {
        const username = req.body.username;
        const password = req.body.password;
        User.findOne({ username: username })
        .then(user => {
          
          // console.log(user);
          if (!user) {
            req.flash('error','Invalid email or password');
           console.log("Userul nu exista");
            return res.redirect('/login');
          }

          bcrypt
            .compare(password, user.password)

            .then(matchingPassword => {
              if (matchingPassword) {
                req.session.loginStats = true;
                req.session.User = user;
                // req.session.cart=true;
                return req.session.save(sessionError => {
                  // console.log(sessionError);
                  res.redirect('/');
                });
              }
              req.flash('error','Invalid email or password');
              res.redirect('/login');
            })
            .catch(loginError => {
              console.log(loginError);
              req.flash('error','Invalid email or password');
              res.redirect('/login');
            });
        })
        .catch(err => console.log(err));
    };


    exports.Logout = (req, res, next) => {
      req.session.destroy(DestroyError => {
        res.redirect('/login');
      });
    };
    
    exports.getListaAnalize = (req,res,next)=>{

      

      Analize.find()
      .then(analize => {

       
      //  console.log(analize);
        res.render('listare-analize', {
          listaAnalize: analize,
          profileName : req.session.User.username,
          pageTitle: 'Afiseaza toate analizele disponibile',
          role:req.session.User.role
        });
      })
      .catch(err => {
        console.log(err);
      });


    };
    exports.getAddConsultatie= (req, res, next) => {


      User.find({role:"medic"})
      .then(users => {
  
        res.render('adauga-consultatie', {
          listaMedici: users,
          profileName : req.session.User.username,
          pageTitle: 'Afiseaza pacientii',
          role:req.session.User.role,
        });
      })
      .catch(err => {
        console.log(err);
      });
  
      
    };
    exports.postAdaugaConsultatie = (req, res, next) => {
     
     
      const nume = req.body.nume;
      const prenume = req.body.prenume;
      const telefon = req.body.telefon;
      const email = req.body.email;
      const medicID=req.body.medicID;
      const data = req.body.date;
      const nume_medic = req.body.nume_medic;
      const prenume_medic = req.body.prenume_medic;


      
      const consultatia = new consultatie({
        nume:nume,
        prenume:prenume,
        nr_telefon:telefon,
        email : email,
        medic:{
          medic_id : medicID,
          nume_medic:nume_medic,
          prenume_medic:prenume_medic,
        },
       userID : req.session.User._id,
        data : data
});
      consultatia
        .save()
        .then(result => {
          // console.log(result);
          console.log('Consultatie  Inregistrata');
          res.redirect('/listare-consultatii');
        })
        .catch(err => {
          console.log(err);
        });
    };


    exports.getConsultatiileMele = (req,res,next)=>{

      

      consultatie.find({userID:req.session.User._id})
      .then(consultatii => {


  
    
  
        res.render('consultatiile-mele', {
          listaConsultatii: consultatii,
          profileName : req.session.User.username,
          pageTitle: 'Afiseaza consultatiile mele  (useR)',
          role:req.session.User.role
        });
      })
      .catch(err => {
        console.log(err);
      });
  
  
    };



    exports.getProfile = (req,res,next)=>{


      console.log(req.session.User);

       
      //  console.log(analize);
        res.render('getProfile', {
          profileName : req.session.User.username,
          pageTitle: 'Profil',
          role : req.session.User.role,
          userInfo : req.session.User
        });
  


    };

    exports.postEditProfile = (req, res, next) => {
      const username =req.session.User.username;
      const nume = req.body.nume;
      const prenume = req.body.prenume;
      const email = req.body.email;
      const CNP = req.body.cnp;
      const afectiuni = req.body.afectiuni;
      req.session.User.username=username;
      req.session.User.nume=nume;
      req.session.User.prenume= prenume;
      req.session.User.email=email;
      req.session.User.profile.CNP=CNP;
      req.session.User.profile.afectiuni=afectiuni;


      User.findOne({username:username})
        .then(user => {

          
          user.username = username;
          user.prenume = prenume;
          user.nume = nume;
          user.email = email;
          user.profile.CNP = CNP;
          user.profile.afectiuni=afectiuni;
          return user.save();
        })
        .then(result => {
          console.log('UPDATED Profile !');
          res.redirect('/profile');
        })
        .catch(err => console.log(err));
    };

    exports.getAdmin = (req, res, next) => {
      res.render('index', {
        pageTitle: 'Admin Index Page',
        profileName : req.session.User.username,
        role : req.session.User.role
        
      });
    };

   
  

  exports.getReteteleMele = (req,res,next)=>{

      

    reteta.find({userID:req.session.User._id})
    .then(retete => {


  

      res.render('retetele-mele', {
        listaRetete: retete,
        profileName : req.session.User.username,
        pageTitle: 'Afiseaza retetele mele (useR)',
        role:req.session.User.role
      });
    })
    .catch(err => {
      console.log(err);
    });


  };
  exports.getResetParola = (req, res, next) => {
    res.render('reset-password', {
      pageTitle: 'Resetare Parola',
      
    });
  };

  exports.postResetParola = (req, res, next) => {



    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        console.log(err);
        return res.redirect('/resetare-parola');
      }
      const token = buffer.toString('hex');
      User.findOne({ email:req.body.email})
        .then(user => {
          if (!user) {
            req.flash('error', 'No account with that email found.');
            return res.redirect('/resetare-parola');
          }
          user.resetToken = token;
          user.resetTokenExpiration = Date.now() + 3600000;
          return user.save();
        })
        .then(result => {
          res.redirect('/');
          transporter.sendMail({
            replyTo: req.body.email,
            from: 'testnodejsapp95@gmail.com',
            subject: "RESET PASSWORD FOR THE APP",
            to:req.body.email,
            html: `
              <p>You requested a password reset</p>
              <p>Click this <a href="http://codeflow.ro:3000/resetare-parola/${token}">link</a> to set a new password.</p>
            `
          });
        })
        .catch(err => {
          console.log(err);
        });
    });
  };

  exports.getChangePassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
      .then(user => {
        let message = req.flash('error');
        if (message.length > 0) {
          message = message[0];
        } else {
          message = null;
        }
        res.render('new-password', {
         
          errorMessage: message,
          userId: user._id.toString(),
          passwordToken: token
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
  
  exports.postChangePassword = (req, res, next) => {
    const newPassword = req.body.password;

    


    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;
  
    User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId
    })
      .then(user => {
        resetUser = user;
        return bcrypt.hash(newPassword, 12);
      })
      .then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
      })
      .then(result => {
        res.redirect('/login');
      })
      .catch(err => {
        console.log(err);
      });
  };

  exports.getCart = (req, res, next) => {
   
    req.user
      .populate('cart.items.productId')
      .execPopulate()
      .then(user => {
        const products = user.cart.items;
        let total = 0;
        products.forEach(p => {
          total += p.quantity * p.productId.Pret;
        }),
        res.render('cart', {
          profileName : req.session.User.username,
        pageTitle: 'Cart',
        role : req.session.User.role,
        userInfo : req.session.User,
          products: products,
          totalCart : total
          

        });
      })
      .catch(err => console.log(err));
  };
  
  exports.postCart = (req, res, next) => {
    const prodId = req.body.idAnaliza;

    Analize.findById(prodId)
      .then(product => {
      
        return req.user.addToCart(product);
      })
      .then(result => {
        console.log(result);
        res.redirect('/cart');
      });
  };
  
  exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
      .removeFromCart(prodId)
      .then(result => {
        res.redirect('/cart');
      })
      .catch(err => console.log(err));
  };

  exports.getCheckout = (req, res, next) => {

    res.render('checkout', {
      profileName : req.session.User.username,
        pageTitle: 'Cart',
        role : req.session.User.role,
        userInfo : req.session.User,
      
    });
  };


  /////////////////////////////////// THIS PART IS UNDER DEVELOPMENT //////////////////////////////


  // exports.getCheckout = (req, res, next) => {
  //   let products;
  //   let total = 0;
  //   req.user
  //     .populate('cart.items.productId')
  //     .execPopulate()
  //     .then(user => {
  //       products = user.cart.items;
  //       total = 0;
  //       products.forEach(p => {
  //         total += p.quantity * p.productId.price;
  //       });
  
  //       return stripe.checkout.sessions.create({
  //         payment_method_types: ['card'],
  //         line_items: products.map(p => {
  //           return {
  //             name: "",
  //             description: "",
  //             amount: "",
  //             currency: 'RON',
  //             quantity: ""
  //           };
  //         }),
  //         success_url: req.protocol + '://' + req.get('host') + '/checkout/success', // => http://localhost:3000
  //         cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
  //       });
  //     })
  //     .then(session => {
  //       res.render('checkout', {
  //         pageTitle: 'Checkout',
  //         productsInCart: products,
  //         totalCart: total,
  //         sessionId: session.id
  //       });
  //     })
  //     .catch(err => {
  //       const error = new Error(err);
  //       error.httpStatusCode = 500;
  //       return next(error);
  //     });
  // };
