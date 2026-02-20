const express = require("express");
const app = express();
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listings");

//Database Connection
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

//Middlewares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.listen(PORT, () => {
  console.log("App is listening");
});

//Home listings
app.get("/listings", async (req, res) => {
  let allListing = await Listing.find({}).limit(5);
  res.render("listing/home.ejs", { allListing });
});

//Individual Listing
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  console.log(listing);
  res.redirect("/listings");
});

//Edit Lisitng
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  console.log(listing);
  res.render("listing/edit.ejs");
});

app.put("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  res.redirect(`/listings/${id}`);
});

//Delete Listing
app.delete("/listings/:id/delete", async (req, res) => {
  let { id } = req.params;
  res.redirect("/home.ejs");
});
