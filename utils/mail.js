// const mailgun = require("mailgun-js")({
//   apiKey: "5c26cf685fd8ed787c50f42d6396298d-af778b4b-159b6bd4",
//   domain:
//     "https://api.mailgun.net/v3/sandbox0ffce76c90d143918fead8f1b6b6d62f.mailgun.org",
// });
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_SECRET_KEY,
});

const sendMail = async (data) => {
  const status = await mg.messages
    .create(process.env.MAILGUN_DOMAIN, data)
    .then((msg) => {
      console.log(msg);
      return true;
    }) // logs response data
    .catch((err) => {
      console.log(err);
      return false;
    }); // logs any error
  return status;
};

module.exports = sendMail;
