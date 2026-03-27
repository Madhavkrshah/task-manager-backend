const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register a new user
const register = async function (req, res) {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Hash password with 10 salt rounds
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generates JWT token with user id
    const token = jwt.sign(
      {
        id: newUser._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d", // Token expires in 7 days
      },
    );

    // response with token
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: error.message,
    });
  }
};

// Login user
const login = async function (req, res) {
  try {
    const { email, password } = req.body;

    // validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // compare password with bcrypt.compare()
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    // Return success response with token
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
};

/*


fix(authController): fix multiple bugs in authController" -m "- fixed success field returning false on successful registration.
- fixed if(!User) to if(!user) in login route
- added missing 401 and 500 status codes for invalid password and server error"
 */
