const jwt = require("jsonwebtoken");

const secret = "secretkey1234";

const tokenBlacklist = new Set();

function createToken(payload) {
  return jwt.sign(payload, secret, { expiresIn: "1h" });
}

function login(req, res) {
  const { username, password } = req.body || {};

  if (username !== "admin" || password !== "admin123") {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const loginAt = new Date().toISOString();

  const token = createToken({ username, loginAt });

  res.json({ token });
}

function profile(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { username, loginAt } = req.user;

  res.json({
    username,
    message: `Welcome, ${username}`,
    loginAt,
  });
}

function logout(req, res) {
  const token = req.token;

  if (token) {
    tokenBlacklist.add(token);
  }

  res.json({ success: true });
}

module.exports = {
  login,
  profile,
  logout,
  tokenBlacklist,
  secret,
};

