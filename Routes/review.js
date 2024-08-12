const express = require("express");
const router = express.Router({mergeParams : true});  // to merge parent and child (devan-Ghevan chalu rakhne ke liye.)(req.params.id -> ye app.js me hi rah ja rahai hai and yaha nahi aa paa rahi hai islie unhe merge karna required hai.)
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError =  require("../utils/ExpressError.js");
const {listingSchema , reviewSchema} = require("../schema.js");
const Review = require("../Models/Reviews.js");
const Listing =  require("../Models/Listing.js");
const { isLoggedin, isReviewAuthor } = require("../middleware.js");

/// Controller folder:
const reviewController = require("../Controller/Reviews.js");


// Middleware to validate req body against joi schema (achhe se hopscotch se req send hone ke liye) for Reviews///////////////////

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    console.log(error);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');   // details bhi print karne hai error ki ()
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

// Review Route

 router.post("/" , isLoggedin ,validateReview ,wrapAsync(reviewController.createReview));


 // Review Delete Route

 router.delete("/:reviewID" , isReviewAuthor,isLoggedin,wrapAsync (reviewController.destroyReview));

  module.exports = router;