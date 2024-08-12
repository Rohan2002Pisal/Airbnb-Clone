const Review = require("../Models/Reviews.js");
const Listing =  require("../Models/Listing.js");

// create Review

module.exports.createReview = async (req, res) => {
    
    let listing = await Listing.findById(req.params.id)  // so yaha listing ki id pass ki toh hame particular hotel dikhadega.

    let newReview = new Review(req.body.review);// so ye "review" hai hamra jo show.ejs me hamne review[rating] , review[comment] liha tha vo hai.(name hai.) (backend ke pass jayega)
    
    newReview.author = req.user._id; // (Review kw sath uska associated author bhi hona chahiye)check the author is he authenticated hai.(valid user hai(db me hai kya vo user))

    listing.reviews.push(newReview); // listing model me hamne reviews : [array] likha hai.
      
      await newReview.save();
      await listing.save();
      req.flash("success" , " Review Created")
      res.redirect(`/listings/${listing._id}`); // jo isis fn me "const listing variable me jo id store kar rahe ho vahi id hai."
  }


  // Delete Review
  module.exports.destroyReview = async (req , res) => {

    let {id , reviewID} = req.params;

    //1. To delete ID of review from listing model
     // review : [

     //   ]
      
    await Listing.findByIdAndUpdate(id ,{$pull : { reviews : reviewID}});


     // 2. Review model me se uss review ko delete karo.
     await Review.findByIdAndDelete(reviewID);
     req.flash("success" , " Review Deleted");
     res.redirect(`/listings/${id}`);
  }

  