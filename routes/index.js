var express= require("express");
var router = express.Router();
var passport= require("passport");
var User    = require("../models/user");

//landing page
router.get("/",function(req,res){
//   res.send("welcome to home page");
res.render("landing");
});


// Authentication routes

router.get("/register",function(req,res){
    res.render("register");
});

//**********SignUp Logic ********************

router.post("/register",function(req,res){
    var newUser = new User({username:req.body.username,email:req.body.email,mobile:req.body.mobile});
    User.register(newUser,req.body.password,function(err,user){
       if(err){
           req.flash("error",err.message);
           return res.redirect("register");
       } 
       
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Welcome to YelpCamp" + " " + user.username);
        res.redirect("/campgrounds");
        });
        });
    
        });

 //*****************Login form ***********************
 
router.get("/login",function(req,res){
    res.render("login");
});

// login logic

router.post("/login", passport.authenticate("local",{
        successRedirect:"/campgrounds",
        failureRedirect:"/login",
        }),
        function(req,res){
       
        });
//******************************

//****** Logout ***********

// logout
router.get("/logout",function(req,res){
   req.logout();
   req.flash("success","successfully logout");
   res.redirect("/");
});


// is loggedIn check whether logged in or not!!!

function IsLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Incorrect Username Or Password");
    res.redirect("/login");
}


module.exports = router;