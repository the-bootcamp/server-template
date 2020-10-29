const app = require("express");
const router = new app.Router();
const Session = require("../models/Session.model");
const Booking = require("../models/Booking.model");
const User = require("../models/User.model");
const Cottage = require("../models/Cottage.model");

/**********************************
 *  POST - /booking/new
 ************************************/
router.post("/new", (req, res) => {
  console.log("/booking/new => ", req.headers.accesstoken);
  console.log("bookings/new: ", req.body);

  Session.findById({ _id: req.headers.accesstoken })
    .then((sessionFound) => {
      if (!sessionFound) {
        return res.status(200).json({ errorMessage: "session not updated " });
      }
      Booking.create(req.body).then((newBooking) => {
        return res
          .status(200)
          .json({ success: "Booking created successfully: ", newBooking });
      });
    })
    .catch((error) => console.log(error));
});

/************************************
 *  GET - /booking/getCustomerBookings
 ************************************/
router.get("/getCustomerBookings/:bookingstatus", (req, res) => {
  console.log("/booking/getCustomerBookings => ", req.headers.accesstoken);
  console.log("bookings/getCustomerBookings: ", req.params.bookingstatus);

  const searchQuery =
    req.params.bookingstatus === "all" ? "" : req.params.bookingstatus;

  Session.findById({ _id: req.headers.accesstoken })
    .then((sessionFound) => {
      if (!sessionFound) {
        return res.status(200).json({ errorMessage: "session not updated " });
      }
      Booking.find({
        $and: [
          { userId: sessionFound.userId },
          { bookingstatus: { $regex: searchQuery } },
        ],
      })
        .populate("cottageId")
        .then((bookingsList) => {
          if (bookingsList) {
            res
              .status(200)
              .json({ success: "Result of bookings", bookingsList });
          }
        });
    })
    .catch((error) => console.log(error));
});

/************************************
 *  GET - /booking/getBookingsByDate
 ************************************/
router.get("/searchOpenBookings", (req, res) => {
  console.log(req.headers);
  const { accesstoken, cottagenumber, category } = req.headers;
  const cottageNumber = parseInt(cottagenumber, 10);
  console.log("/booking/searchOpenBookings => ", typeof cottageNumber);

  Session.findById({ _id: accesstoken })
    .then((sessionFound) => {
      if (!sessionFound) {
        return res.status(200).json({ errorMessage: "session not updated " });
      }
      Cottage.find({ cottagetype: category }, { _id: 1 }).then((response) => {
        if (!response) {
          return res
            .status(200)
            .json({ errorMessage: "Invalid cottage category" });
        } else {
          const [{ _id: cottageId }] = response;
          Booking.find({
            $and: [{ cottageId }, { cottageNumber }, { bookingstatus: "open" }],
          }).then((bookingsFound) => {
            if (!bookingsFound) {
              return res
                .status(200)
                .json({ errorMessage: "There are no open bookings" });
            } else {
              // console.log(bookingsFound);
              return res
                .status(200)
                .json({ success: "Booking search Result", bookingsFound });
            }
          });
        }
      });
    })
    .catch((error) => console.log(error));
});

/**********************************
 *  GET - /booking/cancel
 ************************************/
router.delete("/cancel/:id", (req, res) => {
  console.log("/booking/cancel => ", req.headers);
  console.log("bookings/cancel: ", req.params.id);

  Session.findById({ _id: req.headers.accesstoken })
    .then((sessionFound) => {
      if (!sessionFound) {
        return res.status(200).json({ errorMessage: "session not updated " });
      }
      Booking.findByIdAndUpdate(
        { _id: req.params.id },
        { bookingstatus: "cancel" },
        { new: true }
      ).then((updatedbooking) => {
        if (updatedbooking) {
          return res
            .status(200)
            .json({ success: "Result of cancellation", updatedbooking });
        }
      });
    })
    .catch((error) => console.log(error));
});

/**
 */
module.exports = router;
