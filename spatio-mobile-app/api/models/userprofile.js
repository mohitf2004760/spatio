var mongoose    =   require("mongoose");
var jwt = require('jsonwebtoken');
mongoose.connect('mongodb://127.0.0.1:27017/spatioDb');
// create instance of Schema
 var mongoSchema =   mongoose.Schema;
// create schema
var userProfleSchema  = new mongoSchema ({
    "userFullName":String,
    "userId":String,
    "userEmail":{ type: String, required: true, index: { unique: true } },
    //"userEmail" : String,
    "userPassword" : String
});

userProfleSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    userEmail: this.userEmail,
    userFullName: this.userFullName,
    exp: parseInt(expiry.getTime() / 1000),
  }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

// create model if not exists.
var UserProfile = mongoose.model('userprofile',userProfleSchema,'users'); //Third arg is name of collection in db spatioDb
module.exports = UserProfile;