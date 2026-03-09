const express = require("express");
const { login, profile, logout } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", login);
router.get("/profile", auth, profile);
router.post("/logout", auth, logout);

module.exports = router;

