const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  let token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ msg: "Access Denied. No token provided." });
  }

  try {
    // Ensure JWT_SECRET is available
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is missing in environment variables.");
      return res.status(500).json({ msg: "Server error: JWT secret key is missing." });
    }

    // Clean token (remove "Bearer " prefix & trim)
    token = token.replace("Bearer ", "").trim();

    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    console.error("❌ Invalid Token:", err.message);
    return res.status(403).json({ msg: "Invalid or expired token." });
  }
};

module.exports = { authenticateUser };
