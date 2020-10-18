//INIT
let express = require("express");
let router = express.Router();
let passport = require("passport");

//models
let userModel = require("../models/userModel.js");

//ROUTES
router.get("/", (req, res) => {
  res.render("landing.ejs");
});

router.get("/register", (req, res) => {
  res.render("register.ejs");
});

router.post("/register", (req,res) => {
  userModel.register(new userModel({firstName: req.body.first, lastName: req.body.last, username: req.body.username, image: req.body.image}), req.body.password, (err, user) => {
    if(err){
      res.redirect("back");
      console.log(err);
    }
    else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/books");
      });
    }
  });
});

router.get("/login", (req, res) => {
  res.render("login.ejs");
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/books",
    failureRedirect: "/login"
}), (req, res) => {
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/messages", (req, res) => {
  res.render("messages.ejs");
});



router.get("*", (req, res) => {
  res.send("Error page");
});

module.exports = router;
