const config = require("dotenv").config();
const jwt = require("jsonwebtoken");

const decodeToken = async req => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");
    return await jwt.verify(token, process.env.SECRET_KEY);
  }

  return null;
};

module.exports = decodeToken;
