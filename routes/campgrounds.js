var express= require("express");
var router = express.Router();
var camps  =require("../models/campgrounds");


router.get("/campgrounds",function(req,res){
    camps.find({},function(err,allcamps){
          if(err){
              console.log("error");
          } 
          else{
              res.render("campgrounds/index",{campgrounds:allcamps});
          }
       });
 });
 
 // to create new campgrounds
 
 router.post("/campgrounds",IsLoggedIn,function(req,res){
   // to read the form data from body-parser
   var name= req.body.name;
   var image=req.body.image;
   var desc=req.body.description;
   var author={
                id     :req.user._id,
               username:req.user.username
   };
   var newCampground={name:name, image:image,description:desc,author:author};
   

  // create a new campground and save it to a DB
  camps.create(newCampground,function(err,newcamp){
     if(err){
         req.flash("error","error");
         console.log(err);
     } 
     else{
         // to redirect to the same page
        req.flash("success","Created successfully");
       res.redirect("/campgrounds");
     }
  });
   
   
});

// new campgrounds
router.get("/campgrounds/new",IsLoggedIn,function(req, res) {
    res.render("campgrounds/new.ejs");
});

// show page

router.get("/campgrounds/:id",function(req,res){
    camps.findById(req.params.id).populate("comments").exec(function(err,foundcamps){
        if(err){
            req.flash("error","error");
            console.log(err);
        }
        else{
            //   res.send("this will be show page soon");
            res.render("campgrounds/show",{campground:foundcamps});
        }
    });
});

// Edit campground route and authorization


router.get("/campgrounds/:id/edit",checkOwnership,function(req, res) {
     // find is logged in user or not
    // check whether user own campground or not
    //if not redirect it to somewhere
   
    camps.findById(req.params.id,function(err,foundCampground){
        if(err){
            req.flash("error","error");
            res.redirect("/campgrounds");
        }
        else{
            res.render("campgrounds/edit",{campgrounds:foundCampground});
        }
    });
   
});


//update routes

router.put("/campgrounds/:id",checkOwnership,function(req,res){
    // find the correct campground and update
    // redirect it to the show page
    
    camps.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            req.flash("error","Something gone Wrong");
            res.redirect("/campgrounds");
        }
        else{
            req.flash("success","Successfully Updated");
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
        });
        
// Destroy campground

router.delete("/campgrounds/:id",checkOwnership,function(req,res){
    // destroy the blog
    camps.findByIdAndRemove(req.params.id,function(err,deletecamp){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            // redirect to index
            // console.log(deletecamp);
            req.flash("success","Successfully Deleted");
            res.redirect("/campgrounds");
        }
    });
    
});

        




// is login or not

function IsLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please Login");
    res.redirect("/login");
}

// check user own Campground or not

function checkOwnership(req,res,next){
    
    if(req.isAuthenticated()){
        camps.findById(req.params.id,function(err,foundCampground){
        if(err){
            req.flash("error","Not found");
            res.redirect("back");
        }
        else{
            // check whether user own campground or not
            if(foundCampground.author.id.equals(req.user._id)){
            next();
    
            }
            else{
                req.flash("error","Not have permission to do that");
              res.redirect("back");
            }
            }
    });
   
        
    }
    else{
         req.flash("error","You need to be logged in");
         res.redirect("back");
    }
    
}

module.exports = router;