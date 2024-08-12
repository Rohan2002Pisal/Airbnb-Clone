
if(process.env.NODE_ENV != "production"){
  require("dotenv").config();  
}
console.log(process.env.SECRET);


const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError =  require("./utils/ExpressError.js");
const {listingSchema , reviewSchema} = require("./schema.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Models/user.js");



//Express-Router ka kamal
const listingsRoute = require("./Routes/listing.js");
const reviewsRoute = require("./Routes/review.js");
const userRoute = require("./Routes/user.js");
//////////////////////////////////////////////

const port = 8080;

const Listing =  require("./Models/Listing.js");
const Review = require("./Models/Reviews.js");
const { url } = require("inspector");
// const listing = require("./Models/Listing.js");

// database connectivity

const DBURL = process.env.ATLASDB_URL;
main().then(res =>{
    console.log("Connection is successful with DB");
}).catch(err => {
    console.log(err);
})


async function main(){ 
    await mongoose.connect(DBURL);// our new databse "wonderlust" // Cloud se connect hai (Mongo atlas se)
}

// for View files and ejs
app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));

// for public files
app.use(express.static(path.join(__dirname,"public")));

// for middleware for encoding
app.use(express.json());
app.use(express.urlencoded({extended : true})); // This is main.
app.use(methodOverride("_method"))
app.engine("ejs" , ejsmate);


const store = MongoStore.create({
  mongoUrl : DBURL,
  crypto:{
     secret : process.env.SECRET,
  },
  touchAfter : 24 * 3600
})

store.on( "error" , () => {
 console.log("Error on MongoStore" , err);
})

const sessionOption = {
  store,
  secret : process.env.SECRET,
  resave : false,
  saveUninitialized : true,
  cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxage : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true   // to prevent cross-site-scripting attack we use httpOnly.
  }
}




// Actual is here starting:
app.get("/" ,(req , res)=>{
  res.send("Connection is successful");
})


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize()); // jab koi req. ayaegi toh first passport initialize ho jayega.
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()))
// sare users local strategy ke through authenticate ho toh isko karneka tarika hai LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
// ek bar user ne login kiya toh use session ke andar stored(serialized) karna padega.

passport.deserializeUser(User.deserializeUser());
// so jab user session ko end karega toh session se user ko deserialzed karna padata hai.



// create middleware
 app.use((req , res , next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
 })


// app.get("/demoUser" , async(req , res) => {
//   let fakeUser = new User({
//     email : "rohanpisal50@gmail.com",
//     username : "Rohan"
//   })
//   let userreg = await User.register(fakeUser , "Rohan@48");  // register is also a static method
//   res.send(userreg);
// })



// Express Router ka kamal

 app.use("/listings" , listingsRoute) //(Upper iise Require kiya hai.)

 app.use("/listings/:id/reviews" ,reviewsRoute);

app.use("/" , userRoute);







 


//   // Adding listing schema values to the DB.

//   app.get("/testingListing" , async (req , res) =>{
//     let listingStuff = new Listing({   // so ye likhne se pahile listing ko import karo here.
      
//         title : "My new place of heaven",
//         Description : "Abba jabba dabba",
//         Price : 1200,
//         Location : "Kerla",
//         Country : "India"
//     })
    
//     await listingStuff.save();
//     console.log("sample was saved");
//     res.send("successful testing");
//   });


// 1. Index route ///////////////////////////////////////////////////////////////////////////////////////////////////
// app.get("/listings" , wrapAsync(async (req , res )=>{  
    // Listing.find({})
    // .then(res => { console.log(res) })
    // .catch(err =>{ console.log(err) })
    // isse Sara data console me print horaha hai ya nhai ye check hoga.

    // yaha datbase se sara data frontend me pass kar diya.
//     const allListings  = await Listing.find({});
//     res.render("./Listings/index.ejs" , {allListings});
// }));

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//3 new Route (iise hamen jaan buch kar "Show route ke upar likha cause "/new" ko browser "/:id" ki tarah treat karega toh problem hogi and error ayeha so isliye "/new" pahile and then "/:id" )
// app.get("/listings/new" , (req , res) => {
//     res.render("./Listings/new.ejs");
// })
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// 2. Show route////////////////////////////////////////////////////////////////////////////////////////////////////
// app.get("/listings/:id" , wrapAsync(async(req , res , next) =>{
//     let  {id} = req.params; // need to add urlencoded {extended : true}
//     const container1 = await Listing.findById(id).populate("reviews");
//     res.render("./Listings/show.ejs" , {container1});
// }))
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// Middleware to validate req body against joi schema (achhe se hopscotch se req send hone ke liye) for Listings//////////////////////
// const validateListing = (req, res, next) => {
//     const { error } = listingSchema.validate(req.body);
//     console.log(error);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',');   // details bhi print karne hai error ki ()
//         throw new ExpressError(400, msg);
//     } else {
//         next();
//     }
// };
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// Middleware to validate req body against joi schema (achhe se hopscotch se req send hone ke liye) for Reviews///////////////////

// const validateReview = (req, res, next) => {
//     const { error } = reviewSchema.validate(req.body);
//     console.log(error);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',');   // details bhi print karne hai error ki ()
//         throw new ExpressError(400, msg);
//     } else {
//         next();
//     }
// };

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//4 Create Route::///////////////////////////////////////////////////////////////////////////////////////////////////////////
// app.post("/listings" , validateListing ,wrapAsync(async (req,res,next) =>{  **

      
    //  let result = listingSchema.validate(req.body);
    //  console.log(result);
                                                            // isi ko hi alag se define kiya hai.
    //  if(result.error){
    //     throw new ExpressError(404 , result.error);
    //  }

    // let  {title , Description , image , Price ,Location ,Country } = req.body.listing;   **
    
    // let newListing = new Listing({   **
    //      title,
    //    Description,
    //     image : {
    //         url : image.url,   // same for filename
    //     },
    //    Price,
    //   Location,
    //     Country 
    // })

// sAVE THE cHAT TO THE dATABASE

// await newListing
//  .save()
//  .then((res) =>{
//   console.log("chat is saved");     // Ise extra try and catch se somethig went wrong wala message print nahi ho rah tha(middleware (custome error handling (part 1 (c) .)))
//  })
//  .catch((err) => {
//   console.log(err);
//  })

// await newListing.save();   **

// res.redirect("/listings");   **


   

 // for less code you can write: (just in new.ejs you have to add name="listing[title]" same for all and for image me filename and url ke liye -> name="listing[image][url]"  and for name="listing[image][filename]");


//  let listingData = req.body.listing; // This is based on your input names
//  let newListing = new Listing(listingData);
//  await newListing.save();
//  res.redirect("/listings"); // Redirect or handle the response as neede
  
     // Or:: 

      
// let newListing = new Listing(req.body.listing);
    // await newListing.save();
    // res.redirect("/listings");


// }));  **

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//5 Edit and Update route ////////////////////////////////////////////////////////////////////////////////////////////////////
 
// 5.1 Edit

// app.get("/listings/:id/edit" , wrapAsync(async (req , res ,next) =>{  **
//     let {id} = req.params;  **
//     const list = await Listing.findById(id); **
   
//     res.render("./Listings/edit.ejs" , {list}); **
// }))

// 5.2 Update

// app.put("/listings/:id" , validateListing ,wrapAsync(async (req , res , next) =>{ **
//     let {id} = req.params;  **
    
//     let {title : newtitle ,  Description : newDescription , image : newImage , Price : newPrice , Location : newLocation , Country : newCountry} = req.body.listing;   **
  

//     let updatedList = await Listing.findByIdAndUpdate(id, { **
//         title: newtitle,
//         Description: newDescription,
//         image: newImage,
//         Price: newPrice,
//         Location: newLocation,
//         Country: newCountry
//     },{runValidators : true , new : true})


//     console.log(updatedList); **
   
//     res.redirect(`/listings/${id}`);   **  // show route par redirect hoga.(Usi id ke shoe route pR)


    // or itna sata likhnese acha
     // jo hame name="listing[name]" ye sabko lagay hai na use same rahko in edit.ejs me 
   

     // Or easy way rahthet than this much code

    //  let {id} = req.params;
    //  await Listing.findById(id , {...req.body.listing});
    //  res.redirect(`/listings/${id}`);

// })) **
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//6 Delete Route::////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   app.delete("/listings/:id" , wrapAsync(async (req,res , next) =>{

    
//     let {id} = req.params;
//     const deletedList = await Listing.findByIdAndDelete(id);
   
//     res.redirect("/listings");
    
   
//   }))
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////









/////////////////////////////////////////////////////////////////// Review vala Section start ////////////////////////////////////////////////////////////////////////////////


  //1. Route for Review///////////////////////////////////////////////////////////////////////////////////

//   app.post("/listings/:id/reviews" , validateReview ,wrapAsync( async (req, res) => {
//     console.log(req.body);
//     let listing = await Listing.findById(req.params.id)  // so yaha listing ki id pass ki toh hame particular hotel dikhadega.

//     let newReview = new Review(req.body.review);// so ye "review" hai hamra jo show.ejs me hamne review[rating] , review[comment] liha tha vo hai.(name hai.) (backend ke pass jayega)
//     console.log(newReview);
//       listing.reviews.push(newReview); // listing model me hamne reviews : [array] likha hai.
      
//       await newReview.save();
//       await listing.save();

//       res.redirect(`/listings/${listing._id}`); // jo isis fn me "const listing variable me jo id store kar rahe ho vahi id hai."
//   }))


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//2. delete review route//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//   app.delete("/listings/:id/reviews/:reviewID" , wrapAsync (async (req , res) => {

//     let {id , reviewID} = req.params;

//     //1. To delete ID of review from listing model
//      // review : [

//      //   ]
      
//     await Listing.findByIdAndUpdate(id ,{$pull : { reviews : reviewID}});


//      // 2. Review model me se uss review ko delete karo.
//      await Review.findByIdAndDelete(reviewID);

//      res.redirect(`/listings/${id}`);
//   }))
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  // middleware for Wrong routes
   
  app.all("*" , (req , res , next) =>{
    next(new ExpressError(404 , "Page not found"));
  });


  // middleware:
    app.use((err, req, res, next) =>{
       let {status=500 , message="Somethig went wrong"} = err;
       console.log(err);
       res.status(status).render("error.ejs", {message});
    })
   
    


app.listen(port , (req , res) =>{
    console.log("App is Listening");
})
