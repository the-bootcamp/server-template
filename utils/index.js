const nodemailer = require("nodemailer");

exports.fixTheDate = (date) => {
  return new Date(Date.parse(date)).toString();
};

exports.sendBookingConfirmation = (BookingInfo, cottageInfo, userInfo) => {
  console.log("sendBookingConfirmation", BookingInfo, userInfo);
  /**
{
    bookingdate: 2020-11-11T10:28:12.194Z,
    bookingstatus: 'open',
    _id: 5fabbcbc70fd221160647b04,
    userId: 5f9f1a3ca9eda106bc4b29dd,
    checkindate: 2020-11-17T23:00:00.000Z,
    checkoutdate: 2020-11-17T23:00:00.000Z,
    cottageId: 5f9fd059297922061372dd5f,
    cottageNumber: 1,
    createdAt: 2020-11-11T10:28:12.234Z,
    updatedAt: 2020-11-11T10:28:12.234Z,
    __v: 0
  } {
    _id: 5f9f1a3ca9eda106bc4b29dd,
    username: 'AAA aaaa',
    email: 'aaa@aaa.com',
    password: '$2a$10$Hq5jWyBU8VDeAYl60FVhuuSB055AX1jvhvScce8kIMl4jFygR/hoy',
    address: 'zandtong 15 ',
    phone: 333333,
    userrole: 'customer',
    createdAt: 2020-11-01T20:27:40.767Z,
    updatedAt: 2020-11-09T18:37:04.346Z,
    __v: 0,
    membership: 'silver'
  } 
  cottageimages: [
    'https://res.cloudinary.com/dqnzc4mlz/image/upload/v1604309470/resortzy-cottage-pictures/yu2tzsycskboa6prsvor.jpg',
    'https://res.cloudinary.com/dqnzc4mlz/image/upload/v1604309470/resortzy-cottage-pictures/ok27viqqm5b6xczaumhr.jpg',
    'https://res.cloudinary.com/dqnzc4mlz/image/upload/v1604309470/resortzy-cottage-pictures/rwkt4izqket3dl8ceozo.jpg',
    'https://res.cloudinary.com/dqnzc4mlz/image/upload/v1604309470/resortzy-cottage-pictures/py3q6zti3cogooqev5qc.jpg',
    'https://res.cloudinary.com/dqnzc4mlz/image/upload/v1604309470/resortzy-cottage-pictures/djbbrfxjqkjl2gaibnxj.jpg',
    'https://res.cloudinary.com/dqnzc4mlz/image/upload/v1604309470/resortzy-cottage-pictures/pmg8qhc3beit9tg250uk.jpg'
  ],
  totalcottages: [ 1, 2, 3 ],
  facilities: [
    'Bath amenities',
    'Bathrobes & slippers',
    '2-seater sofa',
    '2 arm chairs',
    'mini TV',
    'Alarm clock',
    '2-chair Dining table',
    'Electirc cooker (2-burner)',
    'coffee machine',
    'Kettle',
    'Kitchen utensils',
    'Refrigerator',
    'wardrobes'
  ],
  _id: 5f9fd059297922061372dd5f,
  ],
  _id: 5f9fd059297922061372dd5f,
  cottagetype: 'standard',
  costperday: 80,
  description: 'These are our budget cottges with compact rooms and limited space and storage.',
  createdAt: 2020-11-02T09:24:41.211Z,
  updatedAt: 2020-11-02T09:31:15.038Z,
  __v: 3
}
 */
  const emailcontent = {
    toUser: "",
    subject: "",
    text: "",
    html: "",
  };
  emailcontent.toUser = userInfo.email;
  emailcontent.subject = "Resortzy booking confirmation";
  emailcontent.text = "Resortzy booking confirmation";

  const bookId = "ID_" + BookingInfo._id.toString().slice(0, 10).toUpperCase();
  let htmlTemplate = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml"><head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
          <html>
            <body>
              <div class="col-sm-12 text-center mt-3 p-3 bg-success">
                <h5>Dear ${userInfo.username},</h5>
                <h2 class="my-3"> We recieved your payment for the below Booking! <br>
                  Thank you for choosing Resortzy</h2>
                <h4> Booking Details:</h4> <br>
                    ${BookingInfo.checkindate}
              </div>`;
  htmlTemplate += `<hr> <div class="m-2">
                          <h2 class="text-center">BOOKING SUMMARY </h2>
                          <h3 class="text-center">Order Id: <p id="order-id"> ${bookId}</p></h3>
                          </div>`;

  htmlTemplate += ` <hr> <div class="m-2">
                <p> Cottage Number: ${cottageInfo}`;
  emailcontent.html = htmlTemplate;
  return emailcontent;
};

/**
 *   send emai wil nodemailer
 */
exports.sendEmail = (emailcontent) => {
  const options = {
    pool: true,
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    // service: "Gmail",
    auth: {
      user: process.env.EMAIL_USERID,
      pass: process.env.EMAILPASSWORD,
    },
  };
  let transporter = nodemailer.createTransport(options, null);
  let message = {
    from: "<manager@resortzy.com>", // Fred Foo 👥 <foo@blurdybloop.com>
    to: emailcontent.toUser,
    subject: emailcontent.subject,
    text: emailcontent.text,
    html: emailcontent.html,
  };
  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log("Error occurred. " + err);
      return;
    }
    console.log("Message sent: %s", info);
  });
};

/**
 * MAIL GUN WORKING PROPERLY ....
 */
// router.post("/sendemail", (req, res) => {
//   // console.log(" send email request ... ");

//   const auth = {
//     auth: {
//       api_key: "key-93ee67ce13b48562002a34da8df5ef37",
//       domian: "sandboxc404be1d3d254dff83febc409c5042a2.mailgun.org",
//       apiUrl: "https://api.mailgun.net/v3",
//     },
//   };
//   let transporter = nodemailer.createTransport(mailGun(auth));
//   // Message object
//   let message = {
//     from: "mannam.sunitha@gmail.com",
//     to: "sunitha_mannam@yahoo.co.in",
//     subject: "Nodemailer is unicode friendly ✔",
//     text: "Hello to myself!",
//     html: "<p><b>Hello</b> to myself!</p>",
//   };

//   transporter.sendMail(message, (err, info) => {
//     if (err) {
//       console.log("Error occurred. " + err);
//       return;
//     }
//     console.log("Message sent: %s", info);
//   });
// });

// SMTP FOR  mailtrap
// const options = {
//   host: "smtp.mailtrap.io",
//   port: 587,
//   secure: false, // true for 465, false for other ports
//   auth: {
//     user: "c55436a65ac9e2", // generated ethereal user
//     pass: "69d08c493661f7", // generated ethereal password
//   },
// SMTP FOR Ethreal
// host: "smtp.ethereal.email",
// port: 587,
// secure: false, // true for 465, false for other ports
// auth: {
//   user: "erling.kris88@ethereal.email", // generated ethereal user
//   pass: "g9tRk1TaT3fp7K9PPu", // generated ethereal password
// },
// };
