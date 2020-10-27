// models/booking.model.js

const { Schema, model, Mongoose, SchemaType } = require("mongoose");

const bookingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    checkindate: { type: Date, required: [true, "Check-In date is mandatory"] },
    checkoutdate: {
      type: Date,
      required: [true, "Check-Out date is mandatory"],
    },
    bookingdate: { type: Date, default: Date.now() },
    cottageId: { type: Schema.Types.ObjectId, ref: "cottages" },
    cottageNumber: { type: Number },
    // adults: { type: Number },
    // kids: { type: Number },
    bookingstatus: {
      type: String,
      default: "open",
      enum: ["open", "close", "cancel"],
    },
  },
  { timestamps: true }
);
const Bookings = model("bookings", bookingSchema);

module.exports = Bookings;
