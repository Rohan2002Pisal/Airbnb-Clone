
const mongoose = require("mongoose");
const Schema =  mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email : {
        type : String,
        required : true
    }
});

// So we dont need to define  1. usename and password here , cause (passport-local-mongoose) ye automatocally unhe hashed and create krta hai.

userSchema.plugin(passportLocalMongoose);
  // it will create usename , salting, hashing and hashpasswords for us.

module.exports = mongoose.model("User" , userSchema);