const app = require("express");
const router = new app.Router();
const Session = require("../models/Session.model");
const Cottage = require("../models/Cottage.model");
const mongoose = require("mongoose");
const User = require("../models/User.model");
const uploadCloud = require("../config/cloudinary.config");
const { all } = require("../app");
const Bookings = require("../models/Booking.model");
const { json } = require("express");
const { fixTheDate } = require("../utils");

/**********************************
 *  POST - /cottage/upload
 ************************************/
router.post("/upload", uploadCloud.array("cottageimages", 5), (req, res) => {
  console.log("cottage/upload", req.files.length);
  console.log("/cottage/upload =>", req.headers.accesstoken);

  Session.findById({ _id: req.headers.accesstoken })
    .then((sessionFromDB) => {
      if (sessionFromDB) {
        return res.json(req.files.map((ele) => ele.path));
      } else {
        return res.status(200).json({ errorMessage: "session not updated " });
      }
    })
    .catch((error) =>
      res.status(200).json({ errorMessage: "Session is not active", error })
    );
});

/**********************************
 *  POST - /cottage/new
 ************************************/
router.post("/new", (req, res, next) => {
  console.log(" cottage/new =>", req.body);
  console.log("/cottage/new =>", req.headers.accesstoken);
  let {
    cottagetype,
    cottageimages,
    costperday,
    description,
    // cottagestatus,
  } = req.body;

  // cottagestatus = cottagestatus ? cottagestatus : "free";
  Session.findById({ _id: req.headers.accesstoken })
    .then((sessionFromDB) => {
      if (!sessionFromDB) {
        return res.status(200).json({ errorMessage: "session not updated " });
      }
      Cottage.findOne({ cottagetype }).then((cottageFound) => {
        if (!cottageFound) {
          let newCottage = new Cottage({
            cottagetype,
            cottageimages,
            costperday,
            description,
          });
          newCottage.totalcottages.push(1);
          newCottage
            .save()
            .then((addRes) =>
              res
                .status(200)
                .json({ success: "cottage added successfully ", addRes })
            );
        } else {
          cottageFound.totalcottages.push(
            cottageFound.totalcottages.length + 1
          );

          cottageFound
            .save()
            .then((addRes) =>
              res
                .status(200)
                .json({ success: "cottage added successfully ", addRes })
            );
        } // else
      });
    })
    .catch((error) =>
      res.status(200).json({ errorMessage: "Session is not active", error })
    );
});

/**********************************
 *  POST - /cottage/deleteNum/:id
 ************************************/
router.delete("/deleteNum/:id", (req, res) => {
  console.log("/cottage/deleteNum =>", req.headers.accesstoken);
  console.log("/cottage/deleteNum =>", req.params.id);
  Session.findById({ _id: req.headers.accesstoken })
    .then((sessionFromDB) => {
      if (!sessionFromDB) {
        return res.status(200).json({ errorMessage: "session not updated " });
      }
      Cottage.findById({ _id: req.params.id }).then((foundCottages) => {
        // console.log(foundCottages.totalcottages);
        if (foundCottages.totalcottages.length <= 1) {
          return res.status(200).json({
            errorMessage: "There is ony one cottage, so cannot delet them",
          });
        }
        foundCottages.totalcottages.pop();
        foundCottages.save().then((deletedRes) =>
          res.status(200).json({
            success: "cottage count decremented ",
            deletedRes,
          })
        );
      });
    })
    .catch((error) =>
      res.status(200).json({ errorMessage: "Session is not active", error })
    );
});

/**********************************
 *  POST - /cottage/deleteCategory/:id
 ************************************/
router.delete("/deleteCategory/:id", (req, res) => {
  console.log("/cottage/deleteCategory =>", req.headers.accesstoken);
  console.log("/cottage/deleteCategory =>", req.params.id);
  Session.findById({ _id: req.headers.accesstoken })
    .then((sessionFromDB) => {
      if (!sessionFromDB) {
        return res.status(200).json({ errorMessage: "session not updated " });
      }
      Cottage.findByIdAndDelete({ _id: req.params.id }).then((deletedCottage) =>
        res.status(200).json({
          success: "Successfully deleted the cottage category",
          deletedCottage,
        })
      );
    })
    .catch((error) =>
      res.status(200).json({ errorMessage: "Session is not active", error })
    );
});

/**********************************
 *  POST - /cottage/update
 ************************************/
router.post("/update/:id", (req, res, next) => {
  console.log("/cottage/update =>", req.headers.accesstoken);
  console.log("/cottage/update =>", req.body);
  console.log("/cottage/update =>", req.params.id);

  const body = Object.fromEntries(
    Object.entries(req.body).filter((el) => el[1])
  );

  Session.findById({ _id: req.headers.accesstoken })
    .then((sessionFromDB) => {
      if (!sessionFromDB) {
        return res.status(200).json({ errorMessage: "session not updated " });
      }
      Cottage.findByIdAndUpdate(req.params.id, body, {
        new: true,
      }).then(
        (recordUpdated) =>
          res.status(200).json({
            success: "Cottage details updated successfully ",
            recordUpdated,
          })
        // console.log("  UPDATED RECORD: ", recordUpdated)
      );
    })
    .catch((error) =>
      res.status(200).json({ errorMessage: "Session is not active", error })
    );
});

/**********************************s
 *  POST - /cottage/get
 ************************************/
router.get("/all", (req, res, next) => {
  console.log("/cottage/all =>", req.headers.accesstoken);

  Session.findById({ _id: req.headers.accesstoken })
    .then((sessionFromDB) => {
      if (!sessionFromDB) {
        return res.status(200).json({ errorMessage: "session not updated " });
      }
      Cottage.find().then((allCottages) =>
        res.status(200).json({ success: "all cottages", allCottages })
      );
    })
    .catch((error) =>
      res.status(200).json({ errorMessage: "Session is not active", error })
    );
});

/**********************************
 *  POST - /cottage/search
 ************************************/
router.post("/search", (req, res) => {
  console.log(" ************************************");
  console.log("/cottage/search => ", req.headers.accesstoken);
  console.log("cottage/search: ", req.body);
  let {
    checkindate: reqchkin,
    checkoutdate: reqchkout,
    defaultcottage,
    cottageId,
  } = req.body;

  reqchkin = fixTheDate(reqchkin);
  reqchkout = fixTheDate(reqchkout);

  Session.findById({ _id: req.headers.accesstoken })
    .then((sessionFound) => {
      if (!sessionFound) {
        return req.status(200).json({ error: "Invalid session taoken" });
      }
      Bookings.find({
        $and: [
          {
            $or: [
              {
                $and: [
                  { checkoutdate: { $gte: new Date(reqchkin) } },
                  { checkindate: { $lte: new Date(reqchkin) } },
                ],
                $and: [
                  { checkoutdate: { $gte: new Date(reqchkout) } },
                  { checkindate: { $lte: new Date(reqchkout) } },
                ],
              },
            ],
          },
          { bookingstatus: "open" },
          { userId: sessionFound.userId },
        ],
      })
        .populate("cottageId")
        .then((populatedBookigns) => {
          console.log(populatedBookigns);
          const filteredBookings = populatedBookigns
            .filter((ele) => ele.cottageId.cottagetype === defaultcottage)
            .map(({ cottageId: { _id }, cottageNumber }) => ({
              _id,
              cottageNumber,
            }));
          console.log(filteredBookings);
          Cottage.find(
            { cottagetype: defaultcottage },
            { _id: 0, totalcottages: 1 }
          )
            .then((cottagelist) => {
              //5f941d4940d191086d38128b
              console.log(cottagelist);
              // console.log(cottagelist[0].totalcottages);
              if (
                cottagelist &&
                cottagelist[0].totalcottages.length === filteredBookings.length
              ) {
                // There are no bookings availf gor the date
                console.log("cottages NOT avaialble for the requested dates");
                return res.status(200).json({
                  error: "cottages NOT avaialble for the requested dates",
                });
              } else {
                //  booking possible.
                const cottagesFree = cottagelist[0].totalcottages.filter(
                  (ele) =>
                    !filteredBookings
                      .map((book) => book.cottageNumber)
                      .includes(ele)
                );
                const cottagesAvailability = {
                  cottagesFree,
                  cottageId,
                  cottageType: defaultcottage,
                  checkindate: reqchkin,
                  checkoutdate: reqchkout,
                };
                console.group("cottagesFree: ", cottagesFree);
                console.log("cottages  ARE avaialble for the requested dates");
                return res.status(200).json({
                  success: "cottages availbe for the requested dates",
                  cottagesAvailability,
                });
              }
            })
            .catch((error) => console.log(error));
        });
    })
    .catch((error) => console.log(error));
});

/**********************************
 *  GET - /cottage/get/:id
 ************************************/
router.get("/get/:type", (req, res) => {
  console.log("/cottage/get =>", req.headers.accesstoken);
  console.log("/cottage/get =>", req.params.type);

  Session.findById({ _id: req.headers.accesstoken })
    .then((sessionFromDB) => {
      if (!sessionFromDB) {
        return res.status(200).json({ errorMessage: "session not updated " });
      }
      Cottage.findOne({ cottagetype: req.params.type }).then((foundCottages) =>
        // console.log(foundCottages.totalcottages);
        foundCottages
          ? res.status(200).json({ success: "cottage found", foundCottages })
          : res
              .status(200)
              .json({ success: "cottage not found or invalid cottageId" })
      );
    })
    .catch((error) =>
      res.status(200).json({ errorMessage: "Session is not active", error })
    );
});

/**  */
module.exports = router;
