const express = require("express");
const router = express.Router();
const User = require("../Models/user.js");
const wrapAsync = require("../utils/wrapAsync.js"); 
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

// Controller folder:
const userController = require("../Controller/Users.js");

// Sign-UP:

router.get("/signup" , userController.renderSignUpForm);

router.post("/signup" , wrapAsync(userController.SignUp));




/// Login

router.get("/login" , userController.renderLoginForm);
                                                          // its a middlewaree :
                                                         // database me vo usename exist hi nahi karta hai bhai.(so ek falsh message bhejo.)
                                                        //  |                     |
router.post("/login" , saveRedirectUrl ,passport.authenticate("local" , {failureRedirect : "/login", failureFlash : true}) , userController.Login)

 



// logout::
 
  router.get("/logout" , userController.Logout);
module.exports = router;