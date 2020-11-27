//INIT
let express = require("express");
let router = express.Router();
let multer = require("multer");
let sharp = require("sharp");

//Multer configuration
const upload = multer({
  //dest: 'uploads/',
  fileFilter(req, file, cb){
      if(file.originalname.match(/\.(jpg|jpeg|png)$/)){
        cb(undefined, true);
      }
      else if(file.originalname.match(/\.(pdf|doc|docx|xls|xlsx|txt)$/)){
        cb(undefined, true);
      }
      else {
        throw new Error("Not the correct type");
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
let uploadMiddleware = upload.fields([{name: "image", maxCount: 1},{name : "file", maxCount: 1}]);

router.post("/books", middlewareObj.isLoggedIn, uploadMiddleware, async (req, res) => {
  let user = {
    id: req.user.id,
    username: req.user.username
  };

  let bookImage;
  let bookFile;
  if(req.files.image){
    bookImage = req.files.image[0].buffer;
  }

  if(req.files.file){
    bookFile = req.files.file[0].buffer;
  }
  /*
  //CLEAN up paths and how they shoud be stored
  let bookImagePath = req.files.image[0].path;
  let bookFilePath = req.files.file[0].path;
  */
  console.log(bookImage);
  bookModel.create({
    title: req.body.title,
    author: req.body.author,
    oneLiner: req.body.oneLiner,
    image: bookImage,
    file: bookFile,
    /*
    imgPath: bookImagePath,
    filePath: bookFilePath,
    */
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
