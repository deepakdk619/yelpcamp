var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");


//Display list of all campgrounds from DB
 router.get("/", function(req, res) {
     Campground.find({}, function(err, allCampgrounds) {
      if (err) {
       console.log(err);
      }
      else {
       res.render("campground/index",{campgrounds:allCampgrounds});
      }
     });
 });
 
 //Add new campground to DB
 router.post("/", middleware.isLoggedIn, function(req, res) {
     var name = req.body.name;
     var image = req.body.image;
     var desc = req.body.description;
     var author = {
       id: req.user._id,
       username: req.user.username
      }
     var newCampground = {name: name, image: image, description: desc, author: author};
     Campground.create(newCampground, function(err, newCampground) {
      if (err) {
       req.flash("error", "Something went wrong");
       console.log(err);
      }
      else {
       req.flash("success", "New Campground Added");
       //redirect to campgrounds
       res.redirect("/campgrounds");
      }
     });
 });
 
 //Form  to add new campground
 router.get("/new", middleware.isLoggedIn, function(req, res) {
     res.render("campground/new");
 });
 
 //SHOW page -- display more information about campground
 router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
      if (err) {
       console.log(err);
      }
      else {
       console.log(foundCampground);
       res.render("campground/show", {campground: foundCampground});
      }
   });
 });
 
 //EDIT Campground Route
 router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
   Campground.findById(req.params.id, function(err, foundCampground) {
      res.render("campground/edit", {campground: foundCampground})
   });
 });
 
 //UPDATE campground Route
 router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
   if (err) {
    req.flash("error", "Something went wrong");
    res.redirect("/campgrounds");
   } else {
    req.flash("success", "Campground Updated");
    res.redirect("/campgrounds/" + req.params.id);
   }
  });
 });
 
 //DELETE campground Route
 router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err) {
   if (err) {
    res.redirect("/campgrounds");
   } else {
    res.redirect("/campgrounds");
   }
  });
 });
 
 
 module.exports = router;