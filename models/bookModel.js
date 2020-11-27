let mongoose = require("mongoose");

let bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true
  },
  oneLiner: {
    type:String,
    required: true
  },
  image: {
    type:Buffer
  },
  imagePath: {
    type: String
  },
  file: {
    type: Buffer
  },
  filePath: {
    type: String
  },
  description: {
    type: String,
    required: true
  },
  user: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  tags: [String],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }]
});

module.exports = mongoose.model("book", bookSchema);
