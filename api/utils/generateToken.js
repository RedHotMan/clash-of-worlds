const config = require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.generateToken = async user => {
  return await jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.SECRET_KEY,
    {
      expiresIn: "1h"
    }
  );
};
