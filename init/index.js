const mongoose = require("mongoose");
const data = require("./data");
const Listing = require("../models/listings");

const MONGO_URL = "mongodb://127.0.0.1:27017/HomeHaven";
const PORT = 5000;
main()
  .then(() => {
    console.log("Databse Connected");
  })
  .catch(err => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDb = async () => {
  await Listing.deleteMany({});
  let updateData = data.map(obj => ({
    ...obj,
    owner: "69a5cbd664f02ee1c95677f5",
  }));
  let d = await Listing.insertMany(updateData);
  console.log(d[0]);
};
initDb();
