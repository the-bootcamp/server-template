// require mongoose
const mongoose = require("mongoose");
const Member = require("../models/Membership.model");
require("../config/db.config");

const memberships = [
  // SILVER
  {
    cottagetype: "standard",
    membership: "silver",
    daysfreestay: 4,
    costperyear: 200,
    description: " ",
    amenities: [
      "Free Car Parking",
      "Swimming Pool",
      "Complimentary Breakfast",
      "Free WiFi",
      "Kids Club",
    ],
  },
  // GOLD
  {
    cottagetype: "classic",
    membership: "gold",
    daysfreestay: 4,
    costperyear: 300,
    description: " ",
    amenities: [
      "Free Car Parking",
      "Swimming Pool",
      "Complimentary Breakfast",
      "Free WiFi",
      "Kids Club",
      "Fitness Center",
      "Concierge",
    ],
  },
  // PLATINUM
  {
    cottagetype: "superior",
    membership: "platinum",
    daysfreestay: 4,
    costperyear: 400,
    description: " ",
    amenities: [
      "Free Car Parking",
      "Swimming Pool",
      "Complimentary Breakfast",
      "Free WiFi",
      "Kids Club",
      "Fitness Center",
      "Concierge",
      "Surfing Lessons",
      "Bar & Lounge",
    ],
  },
];

Member.create(memberships)
  .then((membershipdfromDB) => {
    console.log(`Created ${membershipdfromDB.length} memberships`);
    //close db after file creation
    mongoose.connection.close();
  })
  .catch((error) => console.log(`Error while creating memberships: ${error}`));

//node ./bin/seeds
