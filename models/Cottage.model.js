// models/cottage.model.js

const { Schema, model } = require("mongoose");

const cottageSchema = new Schema(
  {
    cottagetype: {
      type: String,
      required: true,
      enum: ["standard", "classic", "superior"],
    },
    // membership: {
    //   type: String,
    //   required: true,
    //   enum: ["silver", "gold", "platinum"],
    // },
    cottageimages: [{ type: String }],
    costperday: { type: Number },
    description: { type: String },
    totalcottages: [{ type: Number }],
    facilities: [{ type: String }],
  },
  { timestamps: true }
);
const Cottage = model("cottages", cottageSchema);

module.exports = Cottage;
