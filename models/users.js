const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose").default;
const Review = require("./reviews");
const Listing = require("./listings");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
});

userSchema.plugin(passportLocalMongoose);

userSchema.post("findOneAndDelete", async function (user) {
  if (user) {
    await Listing.deleteMany({ _id: { $in: listing.reviews } });
  }
});

module.exports = mongoose.model("User", userSchema);
