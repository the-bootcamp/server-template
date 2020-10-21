const app = require("express");
const router = new app.Router();
const Session = require("../models/Session.model");
const Cottage = require("../models/Cottage.model");
const mongoose = require("mongoose");
const uploadCloud = require("../config/cloudinary.config");
const { all } = require("../app");

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
  const {
    cottagetype,
    cottageimages,
    costperday,
    description,
    cottagestatus,
  } = req.body;
  let addRes = {};
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
          newCottage.totalcottages.push({ cottagenumber: 1, cottagestatus });
          addRes = newCottage.save();
        } else {
          //   console.log(cottageFound.totalcottages.length);
          cottageFound.totalcottages.push({
            cottagenumber: cottageFound.totalcottages.length + 1,
            cottagestatus,
          });
          addRes = cottageFound.save();
          return res.json({ success: "cottage added successfully ", addRes });
        } // else
        return res.json({ success: "cottage added successfully ", addRes });
      });
    })
    .catch((error) =>
      res.status(200).json({ errorMessage: "Session is not active", error })
    );
});

/**********************************
 *  POST - /cottage/get
 ************************************/
router.get("/all", (req, res, next) => {
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

/**  */
module.exports = router;
