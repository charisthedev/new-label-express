const jwt = require('jsonwebtoken');

const AuthUtil = async (req) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const { id } = decodedToken.data; // Destructure id from decoded toke
  console.log(id);
  return id;
}

module.exports = AuthUtil;