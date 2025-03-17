const getCurrency = require("../utils/location");

const checkCurrency = async (req, res, next) => {
  try {
    const currency = await getCurrency(
      req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.ip
    );
    const validCurrencies = ["ngn", "usd", "gbp", "cad", "eur"];
    req.currency = validCurrencies.includes(currency) ? currency : "usd";
    next();
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: "error",
      message: "an error occurred retry",
    });
  }
};

module.exports = checkCurrency;
