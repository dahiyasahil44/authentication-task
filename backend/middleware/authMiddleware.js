const jwt = require("jsonwebtoken");
const { tokenBlacklist, secret } = require("../controllers/authController");

function auth(req, res, next) {
  const header = req.headers["authorization"] || "";
  const parts = header.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = parts[1];

  if (!token || tokenBlacklist.has(token)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = {
      username: decoded.username,
      loginAt: decoded.loginAt,
    };
    req.token = token;
    next();
  });
}

module.exports = auth;

