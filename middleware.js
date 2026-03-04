module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "Please Login before creating");
    res.redirect("/login");
    return;
  }
  next();
};
