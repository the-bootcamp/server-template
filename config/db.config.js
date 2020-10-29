const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/resortzy";
const Session = require("../models/Session.model");
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() =>
    console.log(`Successfully connected to the database ${MONGODB_URI}`)
  )
  .catch((error) => {
    console.error(
      `An error ocurred trying to connect to the database ${MONGODB_URI}: `,
      error
    );
    process.exit(1);
  });

// Session.deleteMany()
//   .then((resDelete) => console.log("Sessions are cleared .... "))
//   .catch((error) => console.log("error in clearing sessions"));
