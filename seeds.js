var mongoose    = require("mongoose"),
    camps       = require("./models/campgrounds"),
    Comment     = require("./models/comments");

var data = [
        {name       :"clouds hills",
         image      :"https://pixabay.com/get/e83db80d2cfd053ed1584d05fb1d4e97e07ee3d21cac104491f9c27ea2eab7ba_340.jpg",
         description:"blah blah blah.."
        },
        {name       :"segnite hills",
         image      :"https://images.pexels.com/photos/618848/pexels-photo-618848.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
         description:"blah blah blah.."
        },
        {name       :"layoal hills",
         image      :"https://images.pexels.com/photos/1309587/pexels-photo-1309587.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
         description:"blah blah blah.."
        },
        {name       :"senti hills",
         image      :"https://images.pexels.com/photos/216676/pexels-photo-216676.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
         description:"blah blah blah.."
        },
        
        ]
function seedDb(){
    // remove all campgrounds
    
    camps.remove({},function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log("removed");
    }
});
//*****************campgrounds remove all ****************

//************ created new campgrounds *******************
// add new campgrounds
 data.forEach(function(seed){
     camps.create(seed,function(err,campground){
         if(err){
             console.log(err);
         }
         else{
            Comment.create({
                    text    :"this is nyc place",
                    author  :"homer"
            },
            function(err,comment){
                if(err){
                    console.log(err);
                }
                else{
                    campground.comments.push(comment);
                    campground.save();
                    console.log("comments added");
                }
            });
         }
     });
 });
}

module.exports = seedDb;
