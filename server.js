const express = require("express");
const app = express();
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const User = require("./models/users.js");
const path = require("path");
const ejsMate = require("ejs-mate");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const users = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

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

app.use(
  session({
    resave: false,
    secret: "The Secret Key",
    saveUninitialized: false,
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  }),
);

app.use(flash());
app.use(passport.session());
app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(PORT, () => {
  console.log("App is listening at 5000");
});

app.use((req, res, next) => {
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  res.locals.currUser = req.user;
  next();
});
//Listings Route
app.use("/listings", listings);

//Review Route
app.use("/listings", reviews);
app.use("/", users);

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  req.flash("error", message);
  res.redirect(req.get("referer"));
});
