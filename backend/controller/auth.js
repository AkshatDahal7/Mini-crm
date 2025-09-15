const express= require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/login");
const router = express.Router();
const jwt = require("jsonwebtoken");


const registerUser = async(req,res)=>{
try
{    const {name , email , password} = req.body;

    const checkEmail = await User.findOne({email})
    if(checkEmail){
        return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password,salt);

    const user = new User({name : name, email : email, password : hashed});
    await user.save();

    res.status(201).json({ message: "User registered successfully", user });}
catch(err){
     res.status(500).json({ message: "Server error", error: err.message });
}
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ message: "Invalid email or password" });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    res.status(500).json({ message: "Server error yoyo", error: err.message });
  }
};

const { OAuth2Client } = require('google-auth-library');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const googleAuth = async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({ idToken: token, audience: GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const { email, name, sub } = payload;
    if (!email) return res.status(400).json({ message: 'No email from Google' });

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, password: sub }); // password is Google sub, not used
      await user.save();
    }
    // Issue JWT
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.SECRET,
      { expiresIn: '1d' }
    );
    res.json({ token: jwtToken, user });
  } catch (err) {
    res.status(401).json({ message: 'Google authentication failed', error: err.message });
  }
};

module.exports = {loginUser, registerUser, googleAuth};