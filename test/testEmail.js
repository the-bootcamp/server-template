const nodemailer = require("nodemailer");

// Generate SMTP service account from ethereal.email
nodemailer.createTestAccount((err, account) => {
  if (err) {
    console.error("Failed to create a testing account. " + err.message);
    return process.exit(1);
  }

  console.log("Credentials obtained, sending message...");

  // Create a SMTP transporter object
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "kolby.lynch@ethereal.email", // generated ethereal user
      pass: "k64yWPtNZNz21StTHn", // generated ethereal password
    },
  });

  // Message object
  let message = {
    from: "Sender Name <sender@example.com>",
    to: "Recipient <mannam.sunitha@gmail.com>",
    subject: "Nodemailer is unicode friendly ✔",
    text: "Hello to myself!",
    html: "<p><b>Hello</b> to myself!</p>",
  };

  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log("Error occurred. " + err.message);
      return process.exit(1);
    }

    console.log("Message sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  });
});

// async function main() {
//   let testAccount = await nodemailer.createTestAccount();

//   let transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: testAccount.user, // generated ethereal user
//       pass: testAccount.pass, // generated ethereal password
//     },
//   });

//   // send mail with defined transport object
//   let info = await transporter.sendMail({
//     from: "foo@example.com", // sender address
//     to: "mannam.sunitha@gmail.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>", // html body
//   });

//   console.log("Message sent: %s", info);
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
// }

// // main().catch(console.error);
