const getCurrency = require ("../utils/location");

const checkCurrency = async (req, res, next) => {
  console.log(req.ip)
  try {
    const currency = await getCurrency(req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.ip);
    req.currency = currency;
    next();
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 'error',
      message: 'an error occurred retry',
    });
  }
}

module.exports = checkCurrency
