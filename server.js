const express = require("express");
const app = express();
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listings");
const Review = require("./models/reviews.js");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");
const { listingValidation } = require("./utils/schemaVal.js");

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
app.use(express.json());

app.listen(PORT, () => {
  console.log("App is listening");
});

//validate function for Schema
const validateListing = (req, res, next) => {
  let { error } = listingValidation.validate(req.body);
  if (error) {
    throw new ExpressError(404, error);
  } else {
    next();
  }
};

//Home listings
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    let allListing = await Listing.find({});
    res.render("listing/home.ejs", { allListing });
  }),
);

//New Listing
app.get("/listings/new", (req, res) => {
  res.render("listing/new.ejs");
});
app.post(
  "/listings/new",
  validateListing,
  wrapAsync(async (req, res, next) => {
    await Listing.insertOne(req.body);
    res.redirect("/listings");
  }),
);

//Individual Listing
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    res.render("listing/show.ejs", { listing });
  }),
);

//Edit Lisitng
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listing/edit.ejs", { listing });
  }),
);

app.patch(
  "/listings/:id/edit",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body });
    res.redirect(`/listings/${id}`);
  }),
);

//Delete Listing
app.delete(
  "/listings/:id/delete",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  }),
);

//Review
//add Review
app.post("/listings/:id/reviews", async (req, res) => {
  const newReview = await Review.insertOne(req.body);
  const listing = await Listing.findByIdAndUpdate(
    req.params.id,
    {
      $push: { reviews: newReview },
    },
    { new: true },
  );
  console.log(newReview);
  res.json(newReview);
});

app.delete("/listings/:id/reviews/:reviewId", async (req, res) => {
  let { id, reviewId } = req.params;
  console.log(req.params);
  let result = await Listing.findByIdAndUpdate(
    id,
    {
      $pull: { reviews: reviewId },
    },
    { new: true },
  );
  res.redirect(`/listings/${id}`);
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).send(message);
});
