const jwt = require('jsonwebtoken');

const Auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      status: 'error',
      message: 'Authorization header missing',
    });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Bearer token missing',
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const id = decodedToken.data.id;
    const expiryTime = decodedToken.exp * 1000; // Convert expiry time to milliseconds
    const currentTime = Date.now(); // Use Date.now() to get the current time in milliseconds


    if (expiryTime < currentTime) {
      return res.status(401).json({
        status: 'error',
        message: 'token expired',
      });
    }

    req.id = id;
    next();
  } catch (err) {
    return res.status(401).json({
      status: 'error',
      message: 'token expired please login',
    });
  }
}

module.exports = Auth
