const User = require("../Models/user.js");

// Signup page: (/Get")

module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup.ejs");
}

// SignUp page :: (/Post")

module.exports.SignUp = async(req , res) => {

    try{   // ise try and catch me isiliye dala cause "jab same username dalne ki koshissh ki toh pop-up message me show hoga ya error aayega "User is already exixted"
    let{username , email , password} = req.body;

    const newUser = new User({email , username});  // naye use ka eamil and username hoga

    const registerUser = await User.register(newUser , password) // and then vo register hoga with password.

    console.log(registerUser);

// --> so aise hi hame direct login hoga , (sign-up toh apne pahile hi kkiya hai so apko Sign-up and login ka option nahi dikhai dega.)
     req.login(registerUser , (err) => {
      if(err){
        return next(err);
      }
     })
//->>>
    req.flash("success" , "welcome to wonderlust");
    res.redirect("/listings");

    }
    catch(e){
        
    req.flash("error" , e.message);
    res.redirect("/signup");
    }
}



// Login page("/GET")
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}


// Login page ("/Post")

module.exports.Login =async(req, res) => {
    req.flash("success","Welcome to wanderlust!")
   
    let redirectUrl = res.locals.redirectUrl || "/listings";
  
    res.redirect(redirectUrl);
  
}   



// Logout page:
module.exports.Logout = (req, res) => {
    req.logout((err =>{  // so agar callback karte vakt "err" ayaega toh vo (err) me store hoga
      // req.logout() ye apne aap me callback leta hai , as a paramenter , callback means -> jaise hi user logout ho jaye vaise hi immediately jo kam hona chaiye vo callback ke andar likhenge.
      if(err){
        return next(err);
      }

      req.flash("success" ,"You are log out");
      res.redirect("/listings");
    }))
  }