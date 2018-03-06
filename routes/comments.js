var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//==================//
 // COMMENT ROUTE
 //==================//
 router.get("/new", middleware.isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground) {
   if (err) {
    console.log(err);
   } else {
    res.render("comment/new", {campground: foundCampground});
   }   
  });
 });
 
 
 router.post("/", middleware.isLoggedIn, function(req, res) {
  Comment.create(req.body.campground, function(err, comment) {
   if (err) {
    console.log(err);
   } else {
    Campground.findById(req.params.id, function(err, campground) {
     if (err) {
      console.log(err);
     } else {
      comment.author.id = req.user._id;
      comment.author.username = req.user.username;
      comment.save();
      campground.comments.push(comment);
      campground.save(function(err) {
       if (err) {
        req.flash("error", "Something went wrong");
        console.log(err);
       } else {
        req.flash("success", "Comment added");
        res.redirect("/campgrounds/" + campground._id);
       }
      });
     }
    });
   }
  });
 });
 
 //Coments EDIT Route
 router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
  Comment.findById(req.params.comment_id, function(err, foundComment) {
   if (err) {
    req.flash("error", "Something went wrong");
    res.redirect("back");
   } else {
    res.render("comment/edit", {campground_id: req.params.id, comment: foundComment});
   }
  });
 });
 
 //Comment UPDATE
 router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
  console.log(req.body.comment);
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
   if (err) {
    req.flash("error", "Something went wrong");
    res.redirect("back");
   } else {
    req.flash("success", "Comment Updated");
    res.redirect("/campgrounds/" + req.params.id);
   }
  });
 });
 
 
 //Comment DESTROY
 router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
   if (err) {
    req.flash("error", "Something went wrong");
    res.redirect("back");
   } else {
    req.flash("success", "Comment Deleted");
    res.redirect("/campgrounds/" + req.params.id);
   }
  });
 });
 
 
 
 module.exports = router;