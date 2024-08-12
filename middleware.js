const Listing = require("./Models/Listing");
const Review = require("./Models/Reviews");


module.exports.isLoggedin = (req, res, next)=>{
 
        if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl; 
        //so user logged in nahi hai tab
        // req.session ke anadr hamne ek parameter create kiya (redirectUrl name ka) and uske andr req. ka originalUrl saved karaya
        // toh iise hoga ye ki sare ke saare "methods" and "middlewares" ke pass req.session ka asscess toh hai hi so jab bhi hame redirectUrl(parameter jo hamne create kiya hai in req.session me.) ki need hogi toh ham uuse access kar paayenge
        req.flash("error" , "Logged in first!");
       return res.redirect("/login");
        }

        next();
}


module.exports.saveRedirectUrl = (req, res , next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};



module.exports.isOwner = async(req, res, next) => {
    let {id} = req.params; // so jo "id" hai uska route hi (in listing.js) me update route ""/:id""
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error" , "You are not the owner of this listing");
      return  res.redirect(`/listings/${id}`);
     }
    next();
}


module.exports.isReviewAuthor = async(req, res, next) => {
    let {id,reviewID} = req.params; // so jo "id" hai uska route hi (in review.js) me ""/:reviewID""
    let review = await Review.findById(reviewID);
   
    if (!res.locals.currentUser) {
        req.flash("error", "You must be logged in to perform this action.");
        return res.redirect(`/listings/${id}`);
    }

    if (!review.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not the owner of this review");
        return res.redirect(`/listings/${id}`);
    }

    next();
}