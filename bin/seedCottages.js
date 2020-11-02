// require mongoose
const mongoose = require("mongoose");
const Cottages = require("../models/Cottage.model");
require("../config/db.config");

const cottageList = [
  // STANDARD
  {
    cottagetype: "standard",
    costperday: 80,
    cottageimages: [],
    description:
      "These are our budget cottges with cmpact rooms andlimited space and storage.",
    facilities: [
      "Bath amenities",
      "Bathrobes & slippers",
      "2-seater sofa",
      "2 arm chairs",
      "mini TV",
      "Alarm clock",
      "2-chair Dining table",
      "Electirc cooker (2-burner)",
      "coffee machine",
      "Kettle",
      "Kitchen utensils",
      "Refrigerator",
      "wardrobes",
    ],
  },
  // classic
  {
    cottagetype: "classic",
    cottageimages: [],
    costperday: 100,
    description:
      "These provide views over lanscapeed gardens with small deating area",
    facilities: [
      "CHI bath amenities",
      "Bathrobes & slippers",
      "3-seater sofa",
      "2 arm chairs",
      "Flat screen TV",
      "Alarm clock",
      "4-chair Dining table",
      "Electirc cooker (2-burner)",
      "Dishwasher",
      "coffee machine",
      "Kettle",
      "Kitchen utensils",
      "Microwave oven",
      "Refrigerator",
      "wardrobes",
      "Ironing board",
    ],
  },
  // superior
  {
    cottagetype: "superior",
    cottageimages: [],
    costperday: 120,
    description: "These are luxurious cottages with ample space and storage",
    facilities: [
      "CHI bath amenities",
      "CHI hair dryer",
      "Bathrobes & slippers",
      "3-seater sofa",
      "4 arm chairs",
      "Flat screen TV",
      "telephones",
      "Alarm clock",
      "4-chair Dining table",
      "Electirc cooker (4-burner)",
      "Dishwasher",
      "coffee machine",
      "Kettle",
      "Kitchen utensils",
      "Microwave oven",
      "Refrigerator",
      "A mini Freezer",
      "wardrobes",
      "Digital Safe (laptop size)",
      "air conditioning",
      "Ironing board",
      "mini bar",
    ],
  },
];

Cottages.create(cottageList)
  .then((cottagesFromDB) => {
    console.log(`Created ${cottagesFromDB.length} cottages`);
    //close db after file creation
    mongoose.connection.close();
  })
  .catch((error) => console.log(`Error while creating cottages: ${error}`));

//node ./bin/seeds
