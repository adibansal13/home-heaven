const express = require("express");
const router = express.Router();
const Listing = require("../models/listings.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingValidation } = require("../utils/schemaVal.js");
const ExpressError = require("../utils/ExpressError.js");

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
router.get(
  "/",
  wrapAsync(async (req, res) => {
    let allListing = await Listing.find({});
    res.render("listing/home.ejs", { allListing });
  }),
);

//New Listing
router.get("/new", (req, res) => {
  res.render("listing/new.ejs");
});
router.post(
  "/listings/new",
  validateListing,
  wrapAsync(async (req, res, next) => {
    await Listing.insertOne(req.body);
    res.redirect("/listings");
  }),
);

//Individual Listing
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    res.render("listing/show.ejs", { listing });
  }),
);

//Edit Lisitng
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listing/edit.ejs", { listing });
  }),
);

router.patch(
  "/:id/edit",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body });
    res.redirect(`/listings/${id}`);
  }),
);

//Delete Listing
router.delete(
  "/:id/delete",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  }),
);

module.exports = router;
