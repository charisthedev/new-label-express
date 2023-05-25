const Users = require('../models/userModel')
const jwt = require('jsonwebtoken');

const authAdmin = async (req, res, next) =>{
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
        const user = await Users.findOne({
            _id: id
        })
        if(user.role === 0)
            return res.status(400).json({msg: "Admin resources access denied"})

        const expiryTime = decodedToken.exp * 1000; // Convert expiry time to milliseconds
        const currentTime = Date.now(); // Use Date.now() to get the current time in milliseconds


        if (expiryTime < currentTime) {
            return res.status(401).json({
                status: 'error',
                message: 'token expired',
            });
        }

        req.id = id;        
        next()
        
    } catch (err) {
        return res.status(401).json({
            status: 'error',
            message: err.message,
          });
    }
}

module.exports = authAdmin