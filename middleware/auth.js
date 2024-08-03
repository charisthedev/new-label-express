const jwt = require('jsonwebtoken');
const getCurrency = require("../utils/location");
const checkCurrency = require("./location");

const Auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for authorization header
  if (!authHeader) {
    return res.status(401).json({
      status: 'error',
      message: 'Authorization header missing',
    });
  }

  const token = authHeader.split(' ')[1];

  // Check for Bearer token
  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Bearer token missing',
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const { id } = decodedToken.data; // Destructure id from decoded token
    const expiryTime = decodedToken.exp * 1000; // Convert expiry time to milliseconds
    const currentTime = Date.now(); // Get current time in milliseconds

    // Check if token is expired
    if (expiryTime < currentTime) {
      return res.status(401).json({
        status: 'error',
        message: 'Token expired',
      });
    }

    // Get currency based on IP address
    // const currency = await getCurrency(req.connection.remoteAddress || req.socket.remoteAddress || req.ip);
    req.id = id;
    // req.currency = currency;
    // next();
    await checkCurrency(req,res,next)
  } catch (err) {
    return res.status(401).json({
      status: 'error',
      message: 'Token expired, please login',
    });
  }
}

module.exports = Auth;