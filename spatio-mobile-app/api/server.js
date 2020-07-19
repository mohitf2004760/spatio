var express         =   require("express");
var app             =   express();
var bodyParser      =   require("body-parser");
var session         =   require('express-session');
var UserProfile     =   require("./models/userprofile");
var router          =   express.Router();
var multer          =   require('multer');
var nodemailer      =   require('nodemailer');
var mongoose        =   require('mongoose'); 
var cors	    =       require('cors');
var jwt = require('jsonwebtoken');
var atob = require('atob');

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
      console.log("inside passport:" + username);
      //console.log(UserProfile.find());
    UserProfile.findOne({userEmail:username}, function (err, user) {
        //console.log("passport use" + user);
        console.log("user:" + user);
        
      if (err) { 
          console.log("error mila:" + err);
          return done(err); }
      if (!user) {
          console.log("user nahin" + username);
        return done(null, false, { message: 'Incorrect username.' });
      }
      
     /* if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }*/
      console.log("great!" + user.userFullName);
      return done(null, user);
    });
  }
));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(session({secret:"garbage",resave:false,saveUninitialized:true}));
app.use(cors());
app.options('*',cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use(passport.initialize());

passport.serializeUser(function(user, done) {
  console.log("serializeUser" + user);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    console.log("deserializeUser:" + id);
  UserProfile.findById({_id:id}, function(err, user) {
      console.log("inside" +user) ;
    done(err, user);
  });
});

router.route("/login") 
   .post(
       function(req, res) {
           console.log("inside login");
  passport.authenticate('local',{ session: false }, function(err, user, info){
    var token;

    // If Passport throws/catches an error
    if (err) {
        console.log("passport error");
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if(user){
    console.log("user is found " + user.userFullName);
      token = user.generateJwt();
	//req.session.token = token;
    //console.log("tok:" + req.session.token);
    
      res.status(200);
      res.json({
        "token" : token,
        "userFullName" : user.userFullName,
        "userEmail" : user.userEmail,
        "userId":user.userId
      })
      ;
    } else {
      // If user is not found
      console.log("user not found");
      res.status(401).json(info);
    }
  })(req, res);

});


app.use('/',router);

app.listen(3002);

console.log("Spatio API : Listening to PORT 3002");