const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const User = require('./models/users');


app.set('view engine', 'ejs');
app.set('views', 'views');
const AuthRoutes = require('./routes/auth');

const mongoose = require('mongoose');


app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, 'public')));


const store = new MongoDBStore({
   uri:"mongodb://user:password@host:27017/MedicalSystem?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false",
   collection: 'sessions'
 });


app.use(
   session({
     secret: 'textSuperSecret',
     resave: false,
     saveUninitialized: false,
     store : store
   })
 );
 app.use((req, res, next) => {
   if (!req.session.User) {
     return next();
   }
   User.findById(req.session.User._id)
     .then(user => {
       req.user = user;
       next();
     })
     .catch(err => console.log(err));
 });

 app.use(flash());
app.use(AuthRoutes);


mongoose.connect('mongodb://user:password@host:27017/MedicalSystem?authSource=admin', {useNewUrlParser: true,useUnifiedTopology: true }).then(
result=>{
   var server = app.listen(8000,'89.33.25.156',  () => {
      var host = server.address().address
      var port = server.address().port
      
      console.log(" Medical Systems listening at port " + port)
   });
}

).catch(err=>{
   console.log("Error");
});
