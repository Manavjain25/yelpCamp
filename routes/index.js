var express =require("express");
var passport=require("passport");
var router= express.Router({mergeParams:true});
var User = require("../models/user");

//roote route
router.get("/",function(req,res){
    res.render("campgrounds/landing");
});


// show register form
router.get("/register", function(req, res){
    res.render("register", {page: 'register'}); 
 });
 
 //show login form
 router.get("/login", function(req, res){
    res.render("login", {page: 'login'}); 
 });

 //handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
           res.redirect("/campgrounds"); 
        });
    });
});



// handling login logic
router.post("/login",passport.authenticate("local",
{
    
successRedirect: "/campgrounds",
failureRedirect:"/login"
})
,function(req,res){
    req.flash("success","Welcome to YelpCamp "+ user.username);
})

//logout route

router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged you out");
    res.redirect("/campgrounds");
})



module.exports =router;