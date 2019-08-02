var express    = require("express"),  //line up your "="
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require ("./models/comment"),
    User = require("./models/user"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    seedDB = require("./seeds"); 

mongoose.connect("mongodb://localhost:27017/yelp_camp_v3", {useNewUrlParser: true});  
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
  
seedDB();

//PASSPORT CONFIG
app.use(require("express-session")({
  secret: "Once again Rusty wins cutest dog!",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initalize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Campground.create(
//   {
//     name: "Salmon Creek",
//     image: "https://cdn.pixabay.com/photo/2017/08/06/02/32/camp-2587926_960_720.jpg",
//     description: "This is a huge granite hill"
//   }, function(err, campground) {
//     if(err) {
//       console.log(err);
//     } else {
//       console.log("Newly Created Campground");
//       console.log(campground);
//     }
//   });


// var campgrounds = [
//   {name: "Salmon Creek", image: "https://cdn.pixabay.com/photo/2017/08/06/02/32/camp-2587926_960_720.jpg"},
//   {name: "Granite Hill", image: "http://www.sapminature.com/wp-content/uploads/2018/01/SapmiNatureCamp-3.jpg"},
//   {name: "Mountain Goat's Rest", image: "https://s-ec.bstatic.com/images/hotel/max1024x768/817/81754015.jpg"},
//   {name: "Salmon Creek", image: "https://cdn.pixabay.com/photo/2017/08/06/02/32/camp-2587926_960_720.jpg"},
//   {name: "Granite Hill", image: "http://www.sapminature.com/wp-content/uploads/2018/01/SapmiNatureCamp-3.jpg"},
//   {name: "Mountain Goat's Rest", image: "https://s-ec.bstatic.com/images/hotel/max1024x768/817/81754015.jpg"},
//   ]
  
app.get("/", function (req, res) {
  res.render("landing");
});

//INDEX
app.get("/campgrounds", function(req, res){
    // Get all Campgrounds from db
    Campground.find({}, function(err, allCampgrounds){
      if (err) {
        console.log("err");
      } else {
        res.render("campgrounds/index", {campgrounds: allCampgrounds});    
      };
    })
    
});

//CREATE - add new campground to DB 
app.post("/campgrounds", function (req, res){
  //get data from form and add to campgrounds array
  var name = req.body.name; //based off name in your form
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = {name:name, image: image, description: desc};
  // create a new campground and save to DB
  Campground.create(newCampground, function(err, newlyCreated){
    if (err){
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

//NEW - show form to create new campground & should be created first as to not interfere with /:id
app.get("/campgrounds/new", function(req, res){
  res.render("campgrounds/new.ejs");
});

//SHOW - individual pages
app.get("/campgrounds/:id", function (req, res){
  //find the campground with provided id
  Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground){
    if (err) {
      console.log(err);
    } else {
      console.log(foundCampground);
      //render show template with that campground
      res.render ("campgrounds/show", {campground: foundCampground});
    }
  });
});

//================== COMMENTS ROUTES (nested routes)
app.get("/campgrounds/:id/comments/new", function (req, res){
  //find campground by id
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", {campground: campground});
    }
  })
});

app.post("/campgrounds/:id/comments", function (req, res){
  //lookup campground using ID
  Campground.findById(req.params.id, function (err, campground){
    if(err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function (err, comment){
        if (err) {
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect('/campgrounds/' + campground._id);  
        }
      })
      //comment.c
    }
  });
  //create new comment
  //connect new comment to campground
  //redirect campground show page
});


app.listen(process.env.PORT, process.env.IP, function(){
  console.log("The YelpCamp Server has started")
});