const nodemailer = require("nodemailer");

exports.fixTheDate = (date) => {
  return new Date(Date.parse(date)).toString();
};

// exports.sendRegistrationemail = async () => {
//   let testAccount = await nodemailer.createTestAccount();

//   let transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: testAccount.user, // generated ethereal user
//       pass: testAccount.pass,
//     },
//   });

//   transporter
//     .sendMail({
//       from: "mannam.sunitha@gmail.com",
//       to: "mannam.sunithadasari@gmail.com",
//       subject: "Registration success",
//       text: "Awesome Message",
//       html: "<b>Awesome Message</b>",
//     })
//     .then((info) => console.log(info))
//     .catch((error) => console.log(error));
// };
