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

/**
 */
module.exports = router;
