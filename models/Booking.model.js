// models/booking.model.js

const { Schema, model, Mongoose, SchemaType } = require("mongoose");

const bookingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    checkindate: { type: Date },
    checkoutdate: { type: Date },
    bookingdate: { type: Date, default: Date.now() },
    cottageId: { type: Schema.Types.ObjectId, ref: "cottages" },
    cottageNumber: { type: Number },
    adults: { type: Number },
    kids: { type: Number },
    bookingstatus: { type: String, enum: ["open", "close", "cancel"] },
  },
  { timestamps: true }
);
const Bookings = model("bookings", bookingSchema);

module.exports = Bookings;
