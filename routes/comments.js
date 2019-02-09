var express= require("express");
var router = express.Router();
var camps  = require("../models/campgrounds");
var Comment= require("../models/comments");

//*********************Comments Form ***************************
// Comment Route
//*********************Comments Form ***************************

router.get("/campgrounds/:id/comments/new",IsLoggedIn,function(req,res){
    // find a campground by id and render that in new template
    camps.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new",{campground:campground}); 
            // campground is render to new template
        }
    });
       
});

router.post("/campgrounds/:id/comments",IsLoggedIn,function(req,res){
    // look for campground Id
    camps.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{
             //create new comments
             // connect that to the campground
             // redirect it to the campground show page
             Comment.create(req.body.comment,function(err,comment){
                 if(err){
                     console.log(err);
                 }
                 else{
                     comment.author.id= req.user.id;
                     comment.author.username= req.user.username;
                     comment.save();
                     campground.comments.push(comment);
                      campground.save();
                    //   console.log(comment);
                    
                      res.redirect("/campgrounds/"+ campground._id);
                  }
             });
            
            
        }
    });
});


// edit comments
router.get("/campgrounds/:id/comments/:comments_id/edit",checkCommentsOwnership,function(req,res){
    Comment.findById(req.params.comments_id,function(err,foundComment){
       if(err){
           console.log(err);
       } 
       else{
           res.render("comments/edit",{campground_id:req.params.id,comment: foundComment});
       }
    });
    
});

// comments update routes

router.put("/campgrounds/:id/comments/:comments_id",function(req,res){
   Comment.findByIdAndUpdate(req.params.comments_id,req.body.comment,function(err,updatedComment){
       if(err){
           res.redirect("back");
       }
       else{
           req.flash("success","Comment Updated");
           res.redirect("/campgrounds/"+ req.params.id);
       }
   });
});

// delete comments

router.delete("/campgrounds/:id/comments/:comments_id",checkCommentsOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comments_id,function(err,DeleteComments){
       if(err){
           res.redirect("back");
       } 
       else{
           req.flash("success","Comment Deleted");
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

function IsLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please Login ");
    res.redirect("/login");
}





// check whether the user own the comments

function checkCommentsOwnership(req,res,next){
    
    if(req.isAuthenticated()){
        Comment.findById(req.params.comments_id,function(err,foundComment){
        if(err){
            req.flash("error","Not found");
            res.redirect("back");
        }
        else{
            // check whether user own comments or not
            if(foundComment.author.id.equals(req.user._id)){
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
        req.flash("error", "You need to be logged in");
         res.redirect("back");
    }
    
}

module.exports= router;