// models/User.model.js

const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, "Username is required."],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      // this match will disqualify all the emails with accidental empty spaces, missing dots in front of (.)com and the ones with no domain at all
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    address: {
      type: String,
    },
    phone: {
      type: Number,
    },
    userrole: {
      type: String,
      enum: ["manager", "customer", "admin"],
    },
    membership: {
      type: String,
      enum: ["silver", "gold", "platinum"],
    },
    // defaultcottage: {
    //   type: String,
    //   enum: ["standard", "classic", "superior"],
    // },
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
