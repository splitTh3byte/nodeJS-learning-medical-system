const express = require('express');

const authController = require('../controllers/users');
const adminController = require('../controllers/admin');
const medicController = require('../controllers/medic');
const auth = require('../middleware/is-auth');

const router = express.Router();



// get adaugare-consultatie
router.get('/adaugare-consultatie',auth,authController.getAddConsultatie);

//post adaugare consultatie.
router.post('/adaugare-consultatie',auth,authController.postAdaugaConsultatie);



//lista consultatiile mele 
router.get('/listare-consultatii',auth,authController.getConsultatiileMele);




//listare analize.
router.get('/listare-analize',auth,authController.getListaAnalize);







//user profile

router.get('/profile',auth,authController.getProfile);

router.post('/updateProfile',auth,authController.postEditProfile);




router.get('/',auth,authController.getIndex);

router.get('/contact',authController.getContact);
router.post('/contact',authController.postContact)



//get the login form 
router.get('/login', authController.getLogin);

//get singup form
router.get('/signup', authController.getSignup);


//signup post

router.post('/signup', authController.postSignup);

//admin 

router.post('/login',authController.postLogin);
//logout
router.get('/logout',authController.Logout);

router.get('/admin/listare-useri',auth,adminController.getUseri);


router.post('/deleteUser',auth,adminController.deleteUser);
router.post('/deleteAnaliza',auth,adminController.deleteAnaliza);
router.post('/editAnaliza',auth,adminController.editAnaliza);



// get form
router.get('/adauga-tip-analiza',auth,adminController.getAdaugaAnaliza);

//post action to add analysis
router.post('/adauga-tip-analiza',auth,adminController.postAdaugaAnaliza);





router.get('/adauga-utilizator',auth,adminController.getAddUser);
router.post('/adauga-utilizator',auth,adminController.postAddUser);





router.get('/lista-pacienti',auth,medicController.getListaPacienti);



router.get('/adauga-reteta',auth,medicController.getAdaugaReteta);

router.post('/adauga-reteta',auth,medicController.postAdaugaReteta);


//get retetele mele 
router.get('/retetele-mele',auth,authController.getReteteleMele);

router.get('/resetare-parola',authController.getResetParola);
router.post('/resetare-parola',authController.postResetParola);

router.get('/resetare-parola/:token', authController.getChangePassword);

router.post('/new-password', authController.postChangePassword);


//cart

router.get('/cart',auth,authController.getCart);
router.post('/cart',auth,authController.postCart);
router.post('/delete-cart-item', auth, authController.postCartDeleteProduct);

router.get('/checkout',auth,authController.getCheckout);


module.exports = router;
