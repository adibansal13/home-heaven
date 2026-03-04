const express = require("express");
const router = express.Router();
const Review = require("../models/reviews.js");
const Listing = require("../models/listings.js");
const wrapAsync = require("../utils/wrapAsync");
const { reviewValidation } = require("../utils/schemaVal.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn } = require("../middleware.js");

const validateReview = (req, res, next) => {
  let { error } = reviewValidation.validate(req.body);
  if (error) {
    throw new ExpressError(404, error.details[0].message);
  } else {
    next();
  }
};

//add Review
router.post(
  "/:id/reviews",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = await Review.create({
      ...req.body,
      author: req.user._id,
    });
    listing.reviews.push(newReview);
    await listing.save();
    req.flash("success", "Review is added");
    res.redirect(`/listings/${req.params.id}/`);
  }),
);

router.delete(
  "/:id/reviews/:reviewId",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    console.log(req.params);
    let result = await Listing.findByIdAndUpdate(
      id,
      {
        $pull: { reviews: reviewId },
      },
      { new: true },
    );
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
  }),
);

module.exports = router;
