const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError =  require("../utils/ExpressError.js");
const {listingSchema , reviewSchema} = require("../schema.js");
const Listing =  require("../Models/Listing.js");

const multer = require("multer")

// // cloudconfig.js to access our file from cloudinary: 
const {storage} = require("../cloudconfig.js");

//initialize the multer:
const upload =  multer({storage});// jitni bhi files ai vo hamre cloud me save hone vali hai so ye jo 'uploads folder' hai ye temporary hai. dont worry 

// and in app.js me jitne bhi "/listing ke routes hai unhe copy and paste karo:" (Review ka Chod ke)

const{isLoggedin, isOwner} = require("../middleware.js");


// Controller folder ":
const listingController = require("../Controller/listings.js");

// Middleware to validate req body against joi schema (achhe se hopscotch se req send hone ke liye) for Listings
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    console.log(error);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');   // details bhi print karne hai error ki ()
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};



// router.route ka kamal (for index and create route:)




//1. Index Route: 
              
  router.get("/" , wrapAsync(listingController.index));



    
//3 new Route (iise hamen jaan buch kar "Show route ke upar likha cause "/new" ko browser "/:id" ki tarah treat karega toh problem hogi and error ayeha so isliye "/new" pahile and then "/:id" )
// -> Error:: Cast to ObjectId failed for value "new" (type string) at path "_id" for model "listing"  
router.get("/new" , isLoggedin , listingController.renderNewForm);


        
// 2. Show route
router.get("/:id" , wrapAsync(listingController.ShowListing));

 


//4 Create Route::
router.post("/" ,isLoggedin, upload.single("listing[image]") ,validateListing ,wrapAsync(listingController.createListing));

//    router.post("/" , upload.single('listing[image]') ,(req , res) => {
//     res.send(req.file);
//    })      


//5 Edit and Update route
 
// 5.1 Edit

router.get("/:id/edit" ,isLoggedin, isOwner,wrapAsync(listingController.renderEditForm))

// 5.2 Update

router.put("/:id" ,isLoggedin, isOwner, upload.single("listing[image]") ,validateListing ,wrapAsync(listingController.updateListing))


//6 Delete Route::
router.delete("/:id" , isLoggedin,isOwner,wrapAsync(listingController.destroyListing));


module.exports = router;