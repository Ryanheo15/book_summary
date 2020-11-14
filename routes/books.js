//INIT
let express = require("express");
let router = express.Router();
let multer = require("multer");
let sharp = require("sharp");

//Multer configuration
const imgUpload = multer({
  fileFilter(req, file, cb){
      if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
        throw new Error("Not the correct image type");
      }
      else {
        //passes in undefined error and a true meaning it acepts file
        cb(undefined, true);
      }
  }
});

const fileUpload = multer({
  fileFilter(req,file, cb){
    if(!file.originalname.match(/\.(pdf|doc|docx|xls|xlsx|txt)$/)){
      throw new Errow("Not the correct file type");
    }
    else {
      cb(undefined, true);
    }
  }
});

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
router.post("/books", middlewareObj.isLoggedIn, imgUpload.single("image"), fileUpload.single("file"), async (req, res) => {
  let user = {
    id: req.user.id,
    username: req.user.username
  };

  let bookImage = req.file.buffer;

  bookModel.create({
    title: req.body.title,
    author: req.body.author,
    image: bookImage,
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
