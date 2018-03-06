var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//Landing Page
 router.get("/", function(req, res) {
     res.render("landing");
 }); 
 
 //show register form
 router.get("/register", function(req, res) {
  res.render("register");
 });
 
 // handle signup logic
 router.post("/register", function(req, res) {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user) {
   if (err) {
    console.log(err);
    req.flash("error", err.message);
    return res.redirect("register");
   }
   passport.authenticate("local")(req, res, function() {
    req.flash("success", "Successfully Registered! Nice to Meet you <b>" + user.username + "</b>");
    res.redirect("/campgrounds");
   });
  });
 });
 
 //render login form
 router.get("/login", function(req, res) {
  res.render("login");
 });
 //login logic
 router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }), function(req, res) {
 });
 
 //Logout
 router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "Logged you out");
  res.redirect("/campgrounds");
 });
 
 
 module.exports = router;