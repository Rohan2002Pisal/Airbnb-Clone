//require mongoose
const mongoose = require("mongoose");

// So bar bar mongoose.Schema na likhna pade isliye ek variable me "mongoose.Schema" ise store karenge.
const Schema = mongoose.Schema;

// Import the Review model
const Review = require("./Reviews.js"); // Ensure the path is correct
const { required } = require("joi");

// sO START BUILDING THE SCEHMA 
     
 const listingSchema =  new Schema({
    title : {
        type : String,
        required : true
    },

    Description : {
        type : String,
        required : true
    },

    image : {
       
        // default : "Default Image",
        // set : v => v === "" ? "default image" : v,  // set : (value(from frontend)) = (value) === "" (kya empty String hai) ?(samapt) true(agar hai toh true vala karo) : false(else false vala karo)
     url :{type: String  , required : false},
     filename : {type : String , required : false}
       
    },

    Price : {
        type : Number,
        required : true
    },

    Location : {
        type : String,
        required : true
    },

    Country : {
        type : String,
        required : true
    },

    reviews : [
         {
             type : Schema.Types.ObjectId,
             ref : "Review"
         }
    ],

    owner :{
        type : Schema.Types.ObjectId,
        ref : "User",
    },


    // For Map: Geo-coding:
      
    geometry: {

        type :{  
        type : String,
        enum : ['Point'],
        required : true
        },
      
        coordinates : {
            type: [Number],
            required : true
        }

    }



 })


 // middleware calling Pre and Post (so yaha listing(ek hotel) ke delete hone ke bad database me se reviews bhi delete ho => i.e(ke baad yani POST))
 // so jab app.js me deleteListing call hoga toh tabhi ye middleware bhi call hoga.
 listingSchema.post("findOneAndDelete" , async(listing) => {
    await Review.deleteMany({_id : {$in : listing.reviews}});   // yaha "$in" means sare reviews ki list banegi and eksath delete hogi vo list.
 })

 // Now Schema toh create hogaya ab Model create karte hai
  
const listing = mongoose.model("listing" ,listingSchema);
module.exports = listing;