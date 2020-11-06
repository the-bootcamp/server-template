// require mongoose
const mongoose = require("mongoose");
const Member = require("../models/Membership.model");
const Cottages = require("../models/Cottage.model");
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
    validity: 2,
    imgurl:
      "https://res.cloudinary.com/dqnzc4mlz/image/upload/v1604244677/resortzy-cottage-pictures/oyicoqqehh7mi3vv478r.png",
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
    validity: 3,
    imgurl:
      "https://res.cloudinary.com/dqnzc4mlz/image/upload/v1604244677/resortzy-cottage-pictures/xhdqvrqljnxlqxn6qsgl.png",
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
    validity: 4,
    imgurl:
      "https://res.cloudinary.com/dqnzc4mlz/image/upload/v1604244677/resortzy-cottage-pictures/dgjfvtqj68ninrvjq31q.png",
  },
];

const cottageList = [
  // STANDARD
  {
    cottagetype: "standard",
    costperday: 80,
    cottageimages: [
      "https://res.cloudinary.com/dqnzc4mlz/image/upload/v1604309470/resortzy-cottage-pictures/yu2tzsycskboa6prsvor.jpg",
      "https://res.cloudinary.com/dqnzc4mlz/image/upload/v1604309470/resortzy-cottage-pictures/ok27viqqm5b6xczaumhr.jpg",
      "https://res.cloudinary.com/dqnzc4mlz/image/upload/v1604309470/resortzy-cottage-pictures/rwkt4izqket3dl8ceozo.jpg",
      "https://res.cloudinary.com/dqnzc4mlz/image/upload/v1604309470/resortzy-cottage-pictures/py3q6zti3cogooqev5qc.jpg",
      "https://res.cloudinary.com/dqnzc4mlz/image/upload/v1604309470/resortzy-cottage-pictures/djbbrfxjqkjl2gaibnxj.jpg",
      "https://res.cloudinary.com/dqnzc4mlz/image/upload/v1604309470/resortzy-cottage-pictures/pmg8qhc3beit9tg250uk.jpg",
    ],
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
    cottageimages: [
      "https://res.cloudinary.com/dqnzc4mlz/image/upload/v1604309539/resortzy-cottage-pictures/mxuxv5xp9lzzo3kobsa1.jpg",
      "https://res.cloudinary.com/dqnzc4mlz/image/upload/v1604309539/resortzy-cottage-pictures/lalmzgr8jxabsxnmeaet.jpg",
      "https://res.cloudinary.com/dqnzc4mlz/image/upload/v1604309539/resortzy-cottage-pictures/qh8oftpqesfbauyrfdif.jpg",
      "https://res.cloudinary.com/dqnzc4mlz/image/upload/v1604309539/resortzy-cottage-pictures/oxupbkvdhoefntdwaps1.jpg",
      "https://res.cloudinary.com/dqnzc4mlz/image/upload/v1604309539/resortzy-cottage-pictures/b9endraslx0uxfuz32tr.jpg",
      "https://res.cloudinary.com/dqnzc4mlz/image/upload/v1604309539/resortzy-cottage-pictures/wghjaxwwpslrel8fktnk.jpg",
    ],
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
    cottageimages: [
      "https://res.cloudinary.com/dqnzc4mlz/image/upload/v1604310007/resortzy-cottage-pictures/ype6wwciqvjl9cvs4xzv.jpg",
      "https://res.cloudinary.com/dqnzc4mlz/image/upload/v1604310007/resortzy-cottage-pictures/pqkaygpanyblsqz2tnf6.jpg",
      "https://res.cloudinary.com/dqnzc4mlz/image/upload/v1604310007/resortzy-cottage-pictures/unvgva9r8dimvnhzush3.jpg",
      "https://res.cloudinary.com/dqnzc4mlz/image/upload/v1604310007/resortzy-cottage-pictures/goaeo6rrv4tv1f8gtrtc.jpg",
      "https://res.cloudinary.com/dqnzc4mlz/image/upload/v1604310007/resortzy-cottage-pictures/yky6hplr1eyqrqe6dhqe.jpg",
      "https://res.cloudinary.com/dqnzc4mlz/image/upload/v1604310007/resortzy-cottage-pictures/yqgxn2vfppe57sypmdk2.jpg",
    ],
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

Member.create(memberships)
  .then((membershipdfromDB) => {
    console.log(`Created ${membershipdfromDB.length} memberships`);
    //close db after file creation
    mongoose.connection.close();
  })
  .catch((error) => console.log(`Error while creating memberships: ${error}`));

Cottages.create(cottageList)
  .then((cottagesFromDB) => {
    console.log(`Created ${cottagesFromDB.length} cottages`);
    //close db after file creation
    mongoose.connection.close();
  })
  .catch((error) => console.log(`Error while creating cottages: ${error}`));

//node ./bin/seeds
