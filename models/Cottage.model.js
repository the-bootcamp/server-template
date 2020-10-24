// models/cottage.model.js

const { Schema, model } = require("mongoose");

const cottageSchema = new Schema(
  {
    cottagetype: {
      type: String,
      required: true,
      enum: ["standard", "classic", "superior"],
    },
    cottageimages: { type: [] },
    costperday: { type: Number },
    description: { type: String },
    // totalcottages: [
    // {
    //   cottagenumber: { type: Number },
    //   // cottagestatus: {
    //   //   type: String,
    //   //   enum: ["full", "free", "disable"],
    //   // },
    // },
    // ],
    totalcottages: [{ type: Number }],
  },
  { timestamps: true }
);
const Cottage = model("cottages", cottageSchema);

module.exports = Cottage;
