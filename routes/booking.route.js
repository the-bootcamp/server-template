const app = require("express");
const router = new app.Router();
const Session = require("../models/Session.model");
const Booking = require("../models/Booking.model");
const User = require("../models/User.model");

/**********************************
 *  POST - /booking/new
 ************************************/
router.post("/new", (req, res) => {
  console.log("/booking/new => ", req.headers.accesstoken);
  console.log("bookings/new: ", req.body);

  Session.findById({ _id: req.headers.accesstoken })
    .then((sessionFound) => {
      console.log(sessionFound.userId);
      Booking.create(req.body).then((newBooking) => {
        console.log("Booking created successfully: ", newBooking);
        return res
          .status(200)
          .json({ success: "Booking created successfully: ", newBooking });
      });
    })
    .catch((error) => console.log(error));
});

/**********************************
 *  GET - /booking/getCustomerBookings
 ************************************/
router.get("/getCustomerBookings/:bookingstatus", (req, res) => {
  console.log("/booking/getCustomerBookings => ", req.headers.accesstoken);
  console.log("bookings/getCustomerBookings: ", req.params.bookingstatus);

  const searchQuery =
    req.params.bookingstatus === "all" ? "" : req.params.bookingstatus;

  Session.findById({ _id: req.headers.accesstoken })
    .then((sessionFound) => {
      console.log(sessionFound.userId);
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

/**********************************
 *  GET - /booking/cancel
 ************************************/
router.delete("/cancel/:id", (req, res) => {
  console.log("/booking/cancel => ", req.headers);
  console.log("bookings/cancel: ", req.params.id);

  Session.findById({ _id: req.headers.accesstoken })
    .then((sessionFound) => {
      console.log(sessionFound.userId);
      Booking.findByIdAndUpdate(
        { _id: req.params.id },
        { bookingstatus: "cancel" },
        { new: true }
      ).then((updatedbooking) => {
        if (updatedbooking) {
          res
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
