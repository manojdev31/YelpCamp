var mongoose = require("mongoose");

var campgroundsSchema = new mongoose.Schema({      // create Schema for database
    name       :String,
    image      :String,
    description:String,
    author     :{
        id:{
            type: mongoose.Schema.Types.ObjectId,
             ref : "User"
        },
        username:String
    },
    comments   :[                     // embedded the comments with campgrounds via object reffrences
                 {
                    type: mongoose.Schema.Types.ObjectId,
                    ref : "Comment"
                 }
                ]
});

module.exports = mongoose.model("camps",campgroundsSchema); // can acess db from var camps
