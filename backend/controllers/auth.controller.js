const User = require('../models/user.model');
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require('dotenv').config();

// Create User
const createUser = async (req, res) => {
  const { username, email, password } = req.body

  try {
    const emailExists = await User.findOne({email: email});
    const foundUser = await User.findOne({username: username});

    if (emailExists) {
      res.json({message: "Email already exists"});
      return;
    } 
    else if (foundUser) {
      res.json({message: "Username already exits"})
      return;
    }
    else {
      encrpt_password = await bcrypt.hash(password, 10);
      console.log(encrpt_password);

      const user = await User.create({ username, email, "password": encrpt_password });
      res.json({ message: "Account succesfully created "});
      return;
    }
  }
  catch(error) {
    console.error("Error creating account\n", error);
    res.status(400).json({ error: error.message});
    res.json(error);
    return;
  }
}

// User login request
const loginUser = async (req, res) => {
  const { username, password} = req.body;

  // Looking for user with same username from database
  const foundUser = await User.findOne({username: username});

  if (foundUser) {  
    console.log(foundUser);
    // Compare encrpyted passwords to ensure they match
    bcrypt.compare(password, foundUser.password, function (error, response) {
      if (error) {
        console.log(error);
        res.json(error);
        res.status(400).json({ error: error.message});
      }
      if (response) {
        const payload = {
          username: foundUser.username,
          balance: foundUser.balance
        }
  
        // Creating Access token
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 86400})
        res.json({success: true, message: "Sucessful login", token: "Bearer " + token, user: payload});
      } else {
        return res.json({success: false, message: "Incorrect password"})
      }
    });
  } else {
    res.json({success: false, message: "User does not exist"});
  }
}

const authenticateUser = async (req, res) => {
  const user = req.user;
  res.json({ success: true, username: user.username, id: user.id})
}

module.exports = {
  createUser,
  loginUser,
  authenticateUser
};