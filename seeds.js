var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
        {
            name: "Cloud's rest",
            image: "https://images.unsplash.com/photo-1533597818151-d1071f26fe32?ixlib=rb-1.2.1&auto=format&fit=crop&w=774&q=80",
            description: "blah blah blah",
        } ,       
        {
            name: "Desert Mesa",
            image: "https://unsplash.com/photos/HAptaetENds",
            description: "blah blah blah",
        },
        {
            name: "Canyon Floor",
            image: "https://images.unsplash.com/photo-1494137319847-a9592a0e73ed?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1353&q=80",
            description: "blah blah blah",
        }
    ]

function seedDB(){
    Campground.remove({}, function (err){
       if (err) {
         console.log(err);
       } else {
        console.log("removed campgrounds!") 
       }
           //add campgrounds
        data.forEach(function(seed){ 
            Campground.create(seed, function(err, campground){
                if (err) {
                    console.log(err)
                } else {
                    console.log("added a campground");
                    //create a comment
                    Comment.create(
                        {
                            text: "This place is great, but I wish there was internet",
                            author: "Homer"
                        }, function (err, comment){
                            if(err) {
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("created new comment");
                            }

                        });
                }
            })
        })
    });

    //add a few comments
}

module.exports = seedDB;

//camogrounds with comments
//error driven development