// models/cottage.model.js

const { Schema, model } = require("mongoose");

const membershipSchema = new Schema(
  {
    cottagetype: {
      type: String,
      required: true,
      enum: ["standard", "classic", "superior"],
    },
    membership: {
      type: String,
      required: true,
      enum: ["silver", "gold", "platinum"],
    },
    daysfreestay: { type: Number },
    costperyear: { type: Number },
    validity: { type: Number },
    description: { type: String },
    amenities: [{ type: String }],
    imgurl: { type: String },
  },

  { timestamps: true }
);
const Membership = model("membership", membershipSchema);

module.exports = Membership;
