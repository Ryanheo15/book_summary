//INIT
let express = require("express");
let router = express.Router();

//MODELS
let bookModel = require("../models/bookModel.js");

//MIDDLEWARE
let middlewareObj = require("../middleware/middleware.js");

//ROUTES
//getting books main page
router.get("/books", middlewareObj.isLoggedIn, (req, res) => {
  bookModel.find({}, (err, books) => {
    if(err){
      console.log(err);
    }
    else {
      res.render("books.ejs", {books: books});
    }
  });
});

//getting books form page
router.get("/books/new", middlewareObj.isLoggedIn, (req, res) => {
  res.render("new_book.ejs");
});

//posting books data
router.post("/books", middlewareObj.isLoggedIn, (req, res) => {
  let user = {
    id: req.user.id,
    username: req.user.username
  };

  bookModel.create({
    title: req.body.title,
    author: req.body.author,
    image: req.body.image,
    description: req.body.description,
    user: user
  }, (err,book) => {
    if(err){
      console.log(err);
    }
    else {
      res.redirect("/books");
    }
  });
});

//Show
router.get("/books/:id", middlewareObj.isLoggedIn, (req, res) => {
  let id = req.params.id;

  bookModel.findById(id).populate("comments").exec((err,book) => {
    if(err){
      console.log(err);
    }
    else {
      res.render("show_book.ejs", {book: book});
    }
  })
});

//Edit form
router.get("/books/:id/edit", (req, res) => {
  let id = req.params.id;
  bookModel.findById(id, (err, book) => {
    if(err){
      console.log(err);
    }
    else {
      res.render("edit_book.ejs", {book: book});
    }
  });
});

//updating the data
router.put("/books/:id", (req, res) => {

  let id = req.params.id;

  bookModel.findByIdAndUpdate(id,{
    title: req.body.title,
    author: req.body.author,
    image: req.body.image,
    description: req.body.description
  },(err, book) => {
    if(err){
      console.log(err);
    }
    else {
      res.redirect("/books/" + id);
    }
  });
});

//deleting the content
router.delete("/books/:id", middlewareObj.bookAuthorization, (req, res) => {
  let id = req.params.id;

  bookModel.findByIdAndDelete(id, (err) => {
    if(err){
      console.log(err);
    }
    else {
      res.redirect("/books" );
    }
  })
});

module.exports = router;
