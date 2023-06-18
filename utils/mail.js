const mailgun = require("mailgun-js")({
  apiKey: "5c26cf685fd8ed787c50f42d6396298d-af778b4b-159b6bd4",
  domain:
    "https://app.mailgun.com/app/sending/domains/sandbox0ffce76c90d143918fead8f1b6b6d62f.mailgun.org",
});

const sendMail = async (data) => {
  await mailgun.messages().send(data, (error, body) => {
    if (error) {
      console.error(error);
      return false;
    } else {
      console.log("Email sent:", body);
      return true;
    }
  });
};

module.exports = sendMail;
