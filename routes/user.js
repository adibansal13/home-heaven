const User = require("../models/users.js");
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const ExpressError = require("../utils/ExpressError.js");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});
router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    let { username, email, password } = req.body;
    let user = new User({
      username: username,
      email: email,
    });
    let userRegister = await User.register(user, password);
    req.login(userRegister, err => {
      if (err) {
        return next();
      }
      req.flash("success", "Welcome to HomeHaven");
      res.redirect("/listings");
    });
  }),
);
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: "Username and password invalid",
  }),
  wrapAsync(async (req, res) => {
    req.flash("success", "Welcome! to HomeHaven");
    res.redirect("/listings");
  }),
);
router.get("/logout", async (req, res) => {
  req.logout(err => {
    if (err) {
      next(err);
    } else {
      req.flash("success", "You are logout");
      res.redirect("/listings");
    }
  });
});

module.exports = router;
