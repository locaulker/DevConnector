// jshint esversion: 6
const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

// Load Use model
const User = require("../../models/User");

// @route   GET api/users/test
// @desc    Tests users' route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

// @route   GET api/users/register
// @desc    Register a user
// @access  Public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "eMail already exists" });
    } else {
      // Specifications of gravatar
      const avatar = gravatar.url(req.body.email, {
        s: "200", // the Size
        r: "pg", // the Rating
        d: "mm" // Default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar, // because same name-value pair -> avatar: avatar
        password: req.body.password
      });

      // Generating a 'Salt' for the password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

module.exports = router;
