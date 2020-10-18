let express = require("express");
let router = express.Router();

//models
let commentModel = require("../models/commentModel.js");
let bookModel = require("../models/bookModel.js");

//middleware
let middlewareObj = require("../middleware/middleware.js");
//routes

//posting comment data
router.post("/books/:id/comments",(req, res) => {
  let id = req.params.id;
  let currentUser = req.user;

  bookModel.findById(id, (err, book) => {
    if(err){
      console.log(err);
    }
    else {
      commentModel.create({content: req.body.content}, (err, comment) => {
        if(err){
          console.log(err);
        }
        else {
          comment.author.username = currentUser.username;
          comment.author.id = currentUser._id;
          comment.save();
          book.comments.push(comment);
          book.save();
          res.redirect("/books/" + id  );
        }
      });
    }
  });
});

//deleting comment
router.delete("/books/:id/comments/:comment_id", middlewareObj.commentAuthorization, (req, res) => {
  let book_id = req.params.id;
  let comment_id = req.params.comment_id;
  console.log("blah");
  commentModel.findByIdAndDelete(comment_id, (err, book) => {
    if(err){
      console.log(err);
    }
    else {
      res.redirect("/books/" + book_id);
    }
  });
});

module.exports = router;
