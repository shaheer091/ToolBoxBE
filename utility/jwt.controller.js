const jwt = require("jsonwebtoken");

const createToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const verifyToken = (req, res, next) => {
  const token = req.headers.token;

  try {
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }
    const verification = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verification;
    next();
  } catch (error) {
    console.error("Error during token verification:", error.message);
    return res.status(401).json({ message: "Token is invalid" });
  }
};

module.exports = { createToken, verifyToken };
