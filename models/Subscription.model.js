// models/User.model.js

const { Schema, model } = require("mongoose");

const subscribeSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      // match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Subscriptions", subscribeSchema);
