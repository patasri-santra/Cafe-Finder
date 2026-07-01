const express = require("express");

const {
  register,
  login,
  approveAdmin,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.patch("/approve-admin/:id", approveAdmin);

module.exports = router;
