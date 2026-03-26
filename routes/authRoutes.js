const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Post/api/auth/register
router.post("/register", authController.register);

// Post/api/auth/register
router.post("/login", authController.login);

module.exports = router;
