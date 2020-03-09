const config = require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateToken = async (user, expiresIn = "1d") => {
  return await jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.SECRET_KEY,
    {
      expiresIn: expiresIn
    }
  );
};

module.exports = generateToken;
