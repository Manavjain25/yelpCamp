
require('dotenv').config();

var express = require('express'),
    path =require('path'),
    app = express(),
    bodyParser = require("body-parser"),
    passport =require("passport"),
    LocalStrategy=require("passport-local"),
    request =require ('request'),
    mongoose = require("mongoose"),
    methodOverride=require("method-override",)
    Campground= require("./models/campground"),
    Comment   =require("./models/comment"),
    User =require("./models/user"),
    seedDB     =require("./seeds"),
    flash      = require('connect-flash');



    
// requiring routes

var commentRoutes =require("./routes/comments"),
    campgroundRoutes=require("./routes/campgounds"),
    indexRoutes =require("./routes/index");


// seedDB();

mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true});
app.use(express.static(__dirname + "/public"));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(flash());


// Passport Authentication

app.use(require("express-session")({
    secret:"Once again Rusty wins cutest dog! ",
    resave: false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})






// Campground.create({
//     name:"Salmon Greek",
//     image:"https://images.unsplash.com/photo-1455763916899-e8b50eca9967?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
//     description:"This is a must place to visit durnig vactaion.THe atmosphere is nice and cool "
// },function(err,camp){
//     if(err){
//         console.log(err);

//     }
//     else{
//         console.log(camp);
//     }
// }
// )  



app.use(indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);


app.listen(3009,()=>{
    console.log("server started");
});






