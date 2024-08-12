const mongoose = require("mongoose");

const initData = require("./data(listing ka data).js");

const Listing = require("../Models/Listing.js") // yada rahe ./ and ../ ka matlab same cd .. ke samna hi hota hai (ek bar piche jao).

// Database connection to mongoDB\
main().then(()=> {console.log("Connection is Successful with DB")})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


const initDB = async () => {
   await  Listing.deleteMany({});
   initData.data = initData.data.map((obj) => ({...obj , owner : "66ac94f7ac0beb930c906bad" }));
   await Listing.insertMany(initData.data) // initData ye apne aap me ek Object hai data.js ke andar and us object ke andar hame  a key data ko access karana hai 
   // ye initData.data isliye kiya cause "initData" ye yaha ka hai and "".data" ye "data.js" me hamen sampleListing ke itne sare Array Objects banaye hai uane { data : sampleListing } aise export kiya hai so (initData.data) se hame us key data ko access kar sakte hai.

   console.log("Data was initializd");
}                                   

initDB();
