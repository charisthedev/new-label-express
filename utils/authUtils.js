const jwt = require('jsonwebtoken');

const AuthUtil = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.split(' ')[1]) {
    return false;
  }
  const token = authHeader.split(' ')[1];
  const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const { id } = decodedToken.data; 
  return id;
}

module.exports = AuthUtil;