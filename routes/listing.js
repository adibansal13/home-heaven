const express = require("express");
const router = express.Router();
const Listing = require("../models/listings.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingValidation } = require("../utils/schemaVal.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn } = require("../middleware.js");

//validate function for Schema
const validateListing = (req, res, next) => {
  let { error } = listingValidation.validate(req.body);
  if (error) {
    throw new ExpressError(404, error.details[0].message);
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
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listing/new.ejs");
});
router.post(
  "/new",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    await Listing.insertOne({ ...req.body, owner: req.user._id });
    req.flash("success", "New listing created");
    res.redirect("/listings");
  }),
);

//Individual Listing
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing doesn't exist!");
      res.redirect("/listings");
      return;
    }
    res.render("listing/show.ejs", { listing });
  }),
);

//Edit Lisitng
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing doesn't exist!");
      res.redirect("/listings");
      return;
    }
    res.render("listing/edit.ejs", { listing });
  }),
);

router.patch(
  "/:id/edit",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body });
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
  }),
);

//Delete Listing
router.delete(
  "/:id/delete",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing is Deleted");
    res.redirect("/listings");
  }),
);

module.exports = router;
