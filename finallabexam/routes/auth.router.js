const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/user.model");
let router = express.Router();

// Registration Route
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser  = new User({ username, password: hashedPassword });
  await newUser .save();
  res.redirect("/login");
});

// Login Route
router.post("/login", passport.authenticate("local", {
  successRedirect: "/admin/dashboard",
  failureRedirect: "/login",
}));

// Logout Route
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;