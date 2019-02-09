var express                  = require("express"),
    app                      = express(),
    methodOverride           = require("method-override"),
    body                     = require("body-parser"), // to include in body parser
    mongoose                 = require("mongoose"),
    passport                 = require("passport"),
    flash                    = require("connect-flash"),
    LocalStrategy            = require("passport-local"),
    passportLocalMongoose    = require("passport-local-mongoose"),
    camps                    = require("./models/campgrounds"),
    User                     = require("./models/user"),
    Comment                  = require("./models/comments"),
    seedDb                   = require("./seeds");  // for comments
    
    
    // requiring routes
    
    var commentsRoutes       = require("./routes/comments"),
        campgroundRoutes     = require("./routes/campgrounds"),
        indexRoutes          = require("./routes/index");
    
    // seedDb();
    
    
mongoose.connect("mongodb://manoj:manoj123@ds117145.mlab.com:17145/manojdata");

app.use(body.urlencoded({extended: true}));

app.set("view engine","ejs");  // no ned to add ejs every time.
app.use(express.static("public"));  // for style sheet
app.use( methodOverride("_method"));  // for method override of PUT request since html does not support PUT req
app.use(flash());
 // passport configuration
 //***************************************************
app.use(require("express-session")({
    secret:"secret is remain secret",
    resave: false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));  // it will use plugin local and use authenticate method
passport.serializeUser(User.serializeUser()); //encrypt
passport.deserializeUser(User.deserializeUser()); //decrypt

//*******************passport configuration done *******************

// for login and signup button correct postions
// so that we do not required to pass CurrentUser in each routes.

app.use(function(req,res,next){
    res.locals.CurrentUser=req.user;
    res.locals.error= req.flash("error");
    res.locals.success= req.flash("success");
    next();
});

app.use(commentsRoutes);
app.use(campgroundRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT,process.env.IP,function(req,res){
   console.log("yelpCamp server is started!!!"); 
});
