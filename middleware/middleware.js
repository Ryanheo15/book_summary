//Middleware
let middlewareObj = {};

//models
let bookModel = require("../models/bookModel.js");
let commentModel = require("../models/commentModel.js");

middlewareObj.isLoggedIn = function(req, res, next) {
  if(req.isAuthenticated()){
    next();
  }
  else {
    res.redirect("/login");
  }
}

middlewareObj.bookAuthorization = function(req, res, next) {
  let currentUser = req.user;
  let id = req.params.id;

  if(req.isAuthenticated()){
    bookModel.findById(id, (err, book) => {
      if(err){
        console.log(err);
        res.redirect("back");
      }
      else {
        if(currentUser && book.author.id.equals(currentUser.id)){
          next();
        }
        else {
          res.redirect("/back");
        }
      }
    });
  }
  else {
    res.redirect("/login");
  }
}

middlewareObj.commentAuthorization = function(req, res, next) {
  let currentUser = req.user;
  let commentId = req.params.comment_id;


  if(req.isAuthenticated()){
    commentModel.findById(commentId, (err, foundComment) => {
      if(err){
        console.log(err);
        res.redirect("back");
      }
      else {
        if(currentUser && foundComment.author.id.equals(currentUser.id)){
          next();
        }
        else {
          res.redirect("back");
        }
      }
    });
  }
  else {
    res.redirect("/login");
  }

}

//export
module.exports = middlewareObj;
