const Listing = require("../Models/Listing.js");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding.js")
const MapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: MapToken });

// Index
module.exports.index = async (req , res )=>{
    const allListings  = await Listing.find({});
    res.render("./Listings/index.ejs" , {allListings});
}

//New

module.exports.renderNewForm =  (req , res) => {
    res.render("./Listings/new.ejs");  // chahe ./Listings likho ya "/Listings" likho automatically views folder me hi check hone vala hai isiliye both are correct.
}


//Show Route:
module.exports.ShowListing = async(req , res , next) =>{
    let  {id} = req.params; // need to add urlencoded {extended : true}
    const container1 = await Listing.findById(id).populate({path : "reviews" ,  // cause "reviews" ko Models/Listing,js e define kiya hai.
                                                                    populate : {path : "author"}
                                                                }
                                                                ).populate("owner");
    if(!container1){
        req.flash("error" , "Listing not found");
        res.redirect("/listings");
    }
  
    res.render("./Listings/show.ejs" , {container1});
}


// Create Route:
module.exports.createListing = async (req, res, next) => {


     // Geo-Coding:
   let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.Location,
    limit:1
  })
   .send();

   console.log(response.body.features[0].geometry);

    // Extract image information from the uploaded file
    let url = req.file.path;
    let filename = req.file.filename;

    // Extract listing details from the request body
    let { title, Description, Price, Location, Country } = req.body.listing;

    // Create a new Listing instance with the extracted data
    let newListing = new Listing({
        title,
        Description,
        image: { url }, // Use the image URL extracted from the file upload
        Price,
        Location,
        Country
    });

    // Assign the owner of the listing
    newListing.owner = req.user._id;
    newListing.image = { url, filename }; // Save image URL and filename


    // Geo-coding ke co-ordinates ke liy:
    newListing.geometry = response.body.features[0].geometry;


    // Save the new listing to the database
    let savedListing = await newListing.save();
    console.log(savedListing);

    // Set a success message and redirect
    req.flash("success", "New listing Added");
    res.redirect("/listings");
};

// Edite Route: 
module.exports.renderEditForm = async (req , res ,next) =>{
    let {id} = req.params;
    const list = await Listing.findById(id);

    if(!list){
        req.flash("error" , "Listing not found");
        res.redirect("/listings");
    }
    let originalImageUrl = list.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250/e_blur:20/")
   
    res.render("./Listings/edit.ejs" , {list ,  originalImageUrl});
}


// Update Route
module.exports.updateListing = async (req , res , next) =>{
    let {id} = req.params;
   
    let {title : newtitle ,  Description : newDescription , image : newImage , Price : newPrice , Location : newLocation , Country : newCountry} = req.body.listing;  

    let updatedList = await Listing.findByIdAndUpdate(id, {
        title: newtitle,
        Description: newDescription,
        image: newImage,
        Price: newPrice,
        Location: newLocation,
        Country: newCountry
    },{runValidators : true , new : true})

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    updatedList.image ={url , filename}
    await updatedList.save();
    }

    req.flash("success" , "Updated Listing")
    res.redirect(`/listings/${id}`); // show route par redirect hoga.(Usi id ke shoe route pR)


    // or itna sata likhnese acha
     // jo hame name="listing[name]" ye sabko lagay hai na use same rahko in edit.ejs me 
   

     // Or easy way rahthet than this much code

    //  let {id} = req.params;
    //  await Listing.findById(id , {...req.body.listing});
    //  res.redirect(`/listings/${id}`);
}



// Delete 
module.exports.destroyListing = async (req,res , next) =>{

    
    let {id} = req.params;
    const deletedList = await Listing.findByIdAndDelete(id);
   req.flash("success" , "Deleted Listing");
    res.redirect("/listings");
    
   
  }