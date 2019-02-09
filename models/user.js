var mongoose                = require("mongoose");
var passportLocalMongoose   = require("passport-local-mongoose");


var UserSchema = mongoose.Schema({
    username:String,
    password:String,
    email   :String,
    mobile  :String
});

UserSchema.plugin(passportLocalMongoose); 
// it takes the package passport-local-mongoose and gives all its functions

module.exports = mongoose.model("User",UserSchema);

