const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const validator = require("validator");

// Define the User Schema
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    unique: [true, "This username is already taken."],
    match: [/^[a-zA-Z0-9]+$/, "Your username cannot contain special characters"], // This regex allows only alphanumeric characters
    required: true,
  },
  email: {
    type: String,
    required: [true, "A valid email is required."],
    unique: [true, "This email is already associated with an account."],
    validate: {
      validator: validator.isEmail,
      message: "{VALUE} is not a valid email",
      isAsync: false,
    },
  },
  phone: {
    type: String,
    required: false,
  },
  bio: {
    type: String,
    required: false,
  },
  campus: {
    type: String,
    required: true,
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  // no password needed automatically generated by passport local mongoose plugin
  // the plugin also handles hashing and creating of the field
});

// plugin for passport-local-mongoose 
UserSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',  // This tells passport-local-mongoose to use 'email' instead of 'username'
}); 
  
// export userschema 
module.exports = mongoose.model("User", UserSchema); 