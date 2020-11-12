const nodemailer = require("nodemailer");

exports.fixTheDate = (date) => {
  return new Date(Date.parse(date)).toString();
};

exports.sendBookingConfirmation = (BookingInfo, cottageInfo, userInfo) => {
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
                <h2 style="color:red"> We recieved your payment for the below Booking! <br>
                  Thank you for choosing Resortzy</h2>       
              </div>`;
  htmlTemplate += `<h3 style="display:inline;" >Order Id: ${bookId}</h3>`;
  //  Booking details
  htmlTemplate += `<div style="margin-left:30%;">
                          <h2 >BOOKING SUMMARY </h2>
                            <h4> Check-In Date:   
                             ${BookingInfo.checkindate.toDateString()} </h4>
                           </hr>
                           <h4> Check-Out Date: ${BookingInfo.checkoutdate.toDateString()} </h4>
                       </hr> 
 <h4> Date of Booking: ${BookingInfo.bookingdate.toDateString()} </h4>
 </hr> 
 <h4> Cottage Number ${cottageInfo.cottagetype}-${
    BookingInfo.cottageNumber
  } </h4>
 </hr> 
 <h4> Cost per Day: ${cottageInfo.costperday} </h4>
                            </div>`;

  // cottage images:
  htmlTemplate += `<hr>  <div class="row">`;
  htmlTemplate += cottageInfo.cottageimages.map(
    (picture) => `<img width="100" height="75"  src=${picture} alt="" />`
  );
  htmlTemplate += `</div> </div>`;
  htmlTemplate += `</div> </body>  </html>`;
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
    from: "manager@resortzy.com 👥 <manager@resortzy.com>", //
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
