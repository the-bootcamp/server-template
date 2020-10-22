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
  let {
    cottagetype,
    cottageimages,
    costperday,
    description,
    cottagestatus,
  } = req.body;

  cottagestatus = cottagestatus ? cottagestatus : "free";

  let addRes = undefined;
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
          newCottage
            .save()
            .then((addRes) =>
              res
                .status(200)
                .json({ success: "cottage added successfully ", addRes })
            );
        } else {
          //   console.log(cottageFound.totalcottages.length);
          cottageFound.totalcottages.push({
            cottagenumber: cottageFound.totalcottages.length + 1,
            cottagestatus,
          });
          cottageFound
            .save()
            .then((addRes) =>
              res
                .status(200)
                .json({ success: "cottage added successfully ", addRes })
            );
          // return res.json({ success: "cottage added successfully ", addRes });
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
      Cottage.findByIdAndDelete({ _id: req.params.id }).then(
        (deletedCottage) => {
          // console.log(deletedCottage);
          res.status(200).json({
            success: "Successfully deleted the cottage category",
            deletedCottage,
          });
        }
      );
    })
    .catch((error) =>
      res.status(200).json({ errorMessage: "Session is not active", error })
    );
});

/**********************************
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

/**  */
module.exports = router;
