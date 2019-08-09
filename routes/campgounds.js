var express =require("express");
var router= express.Router({mergeParams:true});
var Campground=require("../models/campground");
var middleware =require("../middleware");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);


// Index -show all campgrounds

router.get("/",function(req,res){
    // res.render("campgrounds",{campgrounds:campgrounds});
    Campground.find({},function(err,camps){
        if(err){
            console.log("oh no,error!");
            console.log(err);
        }
        else{
            res.render("campgrounds/campgrounds",{campgrounds:camps,currentUser:req.user});
        }
    
    });
});


// New -show form to create new camground

router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new",{currentUser:req.user});
     });
 
 
 

//  // Create - add new campground to DB
    
//  router.post("/",middleware.isLoggedIn,function(req,res){
//       var name =req.body.name;
//       var price=req.body.price;
//      var image =req.body.image;
//      var desc= req.body.description;
//      var author ={
//          id:req.user._id,
//          username:req.user.username
//      }


//      var newCampground ={name: name ,price: price,image : image,description:desc,author:author}
//     //  campgrounds.push(newCampground);

    
// Campground.create( newCampground
// ,function(err,camp){
//     if(err){
//         console.log(err);

//     }
//     else{
        
//      res.redirect("/campgrounds");
//       //  console.log(camp);
//     }
// }
// )

//  });

router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    geocoder.geocode(req.body.location, function (err, data) {
      if (err || !data.length) {
        console.log(err);
        req.flash('error', 'Invalid address');
        return res.redirect('back');
      }
    //   console.log(data);
      var lat = data[0].latitude;
      var lng = data[0].longitude;
      var location = data[0].formattedAddress;
      var newCampground = {name: name, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
      // Create a new campground and save to DB
      Campground.create(newCampground, function(err, newlyCreated){
          if(err){
              console.log(err);
          } else {
              //redirect back to campgrounds page
              console.log(newlyCreated);
              res.redirect("/campgrounds");
          }
      });
    });
  });







//Show - shows more info about one campground

router.get("/:id",function (req,res) {
Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
    if(err){
        console.log(err);
    }
    else{
        console.log(foundCampground);
        res.render("campgrounds/show",{campground:foundCampground,currentUser:req.user});
    }
});

    
});



//Edit Campground route

router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
   
     Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            res.redirect("/campgrounds")
        }
        else{
             res.render("campgrounds/edit",{campground:foundCampground,currentUser:req.user});
            }
    });
}) 


   



// // Update Route

// router.put("/:id",function(req,res){
//     //find and update the correct campground
    
//     Campground.findByIdAndUpdate(req.params.id ,req.body.campground,function(err,updatedCampground){
//         if(err){
//             res.redirect("/campgrounds");
//         } else{
//             res.redirect("/campgrounds/"+req.params.id);
//         }

        
//     });
    
//     //redirect somewhere(show page)


// })


// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    geocoder.geocode(req.body.location, function (err, data) {
      if (err || !data.length) {
        req.flash('error', 'Invalid address');
        return res.redirect('back');
      }
      req.body.campground.lat = data[0].latitude;
      req.body.campground.lng = data[0].longitude;
      req.body.campground.location = data[0].formattedAddress;
  
      Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
          if(err){
              req.flash("error", err.message);
              res.redirect("back");
          } else {
              req.flash("success","Successfully Updated!");
              res.redirect("/campgrounds/" + campground._id);
          }
      });
    });
  });
  



// Destroy campground route

router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){

    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds");
        }
    })

})



// function checkCampgroundOwnership(req,res,next){
//     if(req.isAuthenticated()){
    

        
//         Campground.findById(req.params.id,function(err,foundCampground){
//             if(err){
//                 res.redirect("back");
//             }
//             else{
//                    // does user own the campground
    
//              if(foundCampground.author.id.equals(req.user._id)){
    
//                 next();
                
            
//             }
//             else{
//                 res.redirect("back");
//             }
//         }
//         });
    
//         }
//         else{
//             res.redirect("back");
//         }
             
    
// }


// function isLoggedIn(req,res,next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }








module.exports =router;