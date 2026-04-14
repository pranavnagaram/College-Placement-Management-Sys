const User = require("../../models/user.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Register = async (req, res) => {
  const { first_name, last_name, email, password, designation } = req.body;

  try {
    if (!first_name || !email || !password)
      return res.status(400).json({ msg: "First name, email and password are required!" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "Email already registered!" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      first_name,
      last_name: last_name || '',
      email,
      password: hashedPassword,
      role: 'recruiter',
      isProfileCompleted: true,
      recruiterProfile: {
        designation: designation || '',
      }
    });

    await newUser.save();

    const payload = { userId: newUser.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    newUser.token = token;
    await newUser.save();

    return res.status(201).json({ token, msg: "Recruiter registered successfully!" });
  } catch (error) {
    console.log("recruiter.register.controller.js => ", error);
    return res.status(500).json({ msg: "Internal Server Error!" });
  }
};

module.exports = Register;
