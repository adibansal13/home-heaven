const mongoose = require("mongoose");
const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk9DbYvo4HgYH-BVsdhDqM9mQPPZk2o2SrNA&s",
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      default: "India",
    },
  },
  { timestamps: true },
);

const Listing = mongoose.model("Listings", listingSchema);
module.exports = Listing;
