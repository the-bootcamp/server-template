const app = require("express");
const router = new app.Router();
const Session = require("../models/Session.model");
const Booking = require("../models/Booking.model");
const User = require("../models/User.model");
const Cottage = require("../models/Cottage.model");
const { fixTheDate, sendBookingConfirmation, sendEmail } = require("../utils");

/**********************************
 *  POST - /booking/new
 ************************************/
router.post("/new", (req, res) => {
  console.log("/booking/new => ", req.headers.accesstoken);
  console.log("bookings/new: ", req.body);

  req.body.checkindate = fixTheDate(req.body.checkindate);
  req.body.checkoutdate = fixTheDate(req.body.checkoutdate);

  console.log("bookings/new: ", typeof req.body.checkindate);

  const newBooking = {
    ...req.body,
    checkindate: new Date(req.body.checkindate),
    checkoutdate: new Date(req.body.checkoutdate),
  };
  Session.findById({ _id: req.headers.accesstoken })
    .then((sessionFound) => {
      if (!sessionFound) {
        return res.status(200).json({ errorMessage: "session not active " });
      }
      // get user info
      User.findById({ _id: sessionFound.userId }).then((userInfo) => {
        Booking.create(newBooking).then((newBooking) => {
          Cottage.findById({ _id: newBooking.cottageId }).then(
            (cottageinfo) => {
              const htmlContent = sendBookingConfirmation(
                newBooking,
                cottageinfo,
                userInfo
              );
              sendEmail(htmlContent);
              return res.status(200).json({
                success: "Booking created successfully: ",
                newBooking,
                cottageinfo,
              });
            }
          );
        });
      });
    })
    .catch((error) => console.log(error));
});

/************************************
 *  GET - /booking/getCustomerBookings
 ************************************/
router.get("/getCustomerBookings/:bookingstatus", (req, res) => {
  // console.log("/booking/getCustomerBookings => ", req.headers.accesstoken);
  // console.log("bookings/getCustomerBookings: ", req.params.bookingstatus);

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
 *  GET - /booking/searchOpenBookings
 ************************************/
router.get("/searchOpenBookings", (req, res) => {
  // console.log("/booking/searchOpenBookings => ", req.headers);
  const { accesstoken, cottagenumber, category } = req.headers;
  const cottageNumber = parseInt(cottagenumber, 10);

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
          })
            .populate("cottageId")
            .then((bookingsFound) => {
              if (!bookingsFound) {
                return res
                  .status(200)
                  .json({ errorMessage: "There are no open bookings" });
              } else {
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
 *  DELETE - /booking/cancel
 ************************************/
// router.delete("/cancel/:id", (req, res) => {
//   console.log("/booking/cancel => ", req.headers);
//   console.log("bookings/cancel: ", req.params.id);

//   Session.findById({ _id: req.headers.accesstoken })
//     .then((sessionFound) => {
//       if (!sessionFound) {
//         return res.status(200).json({ errorMessage: "session not updated " });
//       }
//       Booking.findByIdAndUpdate(
//         { _id: req.params.id },
//         { bookingstatus: "cancel" },
//         { new: true }
//       ).then((updatedbooking) => {
//         if (updatedbooking) {
//           return res
//             .status(200)
//             .json({ success: "Result of cancellation", updatedbooking });
//         }
//       });
//     })
//     .catch((error) => console.log(error));
// });

/**********************************
 *  POST - /booking/cancel
 ************************************/
router.post("/changeStatus/:id", (req, res) => {
  console.log("/booking/changeStatus => ", req.headers.accesstoken);
  console.log("bookings/changeStatus: ", req.params.id);
  console.log("bookings/changeStatus: ", req.body);

  // req.body.checkindate = req.body.checkindate
  //   ? fixTheDate(req.body.checkindate)
  //   : "";
  // req.body.checkoutdate = req.body.checkoutdate
  //   ? fixTheDate(req.body.checkoutdate)
  //   : "";

  const body = Object.fromEntries(
    Object.entries(req.body).filter((el) => el[1])
  );

  // reqchkin = fixTheDate(reqchkin);

  Session.findById({ _id: req.headers.accesstoken })
    .then((sessionFound) => {
      if (!sessionFound) {
        return res.status(200).json({ errorMessage: "session not updated " });
      }

      Booking.findByIdAndUpdate(
        { _id: req.params.id },
        // { bookingstatus: req.body.status },
        body,
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
