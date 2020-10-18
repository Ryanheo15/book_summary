//Init
let mongoose = require("mongoose");
let passportLocalMongoose = require("passport-local-mongoose");
let validator = require("validator");

let userSchema = new mongoose.Schema({
  firstName: {
    type:String,
    required: true,
    lowercase: true,
    trim: true,
    validate(value) {
      if(!validator.isAlpha(value)){
        throw new Error("Name is invalid");
      }
    }
  },
  firstName: {
    type:String,
    required: true,
    lowercase: true,
    trim: true,
    validate(value) {
      if(!validator.isAlpha(value)){
        throw new Error("Name is invalid");
      }
    }
  },
  image: {
    data: Buffer,
    contentType: String
  },
  username:{
    type:String,
    default: "anonymous",
    required: true
  },
  password: {
    type: String,
  }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
