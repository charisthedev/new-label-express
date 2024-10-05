const jwt = require('jsonwebtoken');

const AuthUtil = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.split(' ')[1]) {
    return false;
  }
  const token = authHeader.split(' ')[1];
  
  const decodedToken = await new Promise((resolve) => {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        resolve(null);
      } else {
        resolve(decoded);
      }
    });
  });

  if (!decodedToken) {
    return false;
  }
  const { id } = decodedToken.data;
  return id;
}

module.exports = AuthUtil;