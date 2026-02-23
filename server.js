const express = require("express");
const app = express();
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listings");
const ejsMate = require("ejs-mate");

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
app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log("App is listening");
});

//Home listings
app.get("/listings", async (req, res) => {
  let allListing = await Listing.find({});
  res.render("listing/home.ejs", { allListing });
});

//New Listing
app.get("/listings/new", (req, res) => {
  res.render("listing/new.ejs");
});
app.post("/listings/new", async (req, res) => {
  await Listing.insertOne(req.body);
  res.redirect("/listings");
});

//Individual Listing
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("listing/show.ejs", { listing });
});

//Edit Lisitng
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("listing/edit.ejs", { listing });
});

app.patch("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body });
  res.redirect(`/listings/${id}`);
});

//Delete Listing
app.delete("/listings/:id/delete", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});
