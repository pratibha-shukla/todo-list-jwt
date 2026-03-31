
const userService = require('../service/userService');

// Register a new user
exports.signup = async (req, res) => {
  try {
    await userService.registerUser(req.body.username, req.body.password);
    res.status(201).json({ message: "User created" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
};

// Login existing user (SECURE VERSION)
exports.login = async (req, res) => {
  const token = await userService.loginUser(req.body.username, req.body.password);

  if (token) {
    // 1. Set the cookie with security flags
    res.cookie('token', token, {
      httpOnly: true,     // Prevents JavaScript access (Stops XSS)
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      sameSite: 'Strict', // Prevents CSRF
      maxAge: 3600000     // 1 hour
    });

    // 2. Send a success message (don't send the token in the body anymore!)
    return res.json({ message: "Logged in successfully" });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
};

// Logout (Necessary for Cookies)
exports.logout = (req, res) => {
  // Clear the cookie by setting an expiration date in the past
  res.clearCookie('token');
  res.json({ message: "Logged out successfully" });
};

// Get current user profile
exports.getMe = (req, res) => {
  // req.user is populated by your authentication middleware
  res.json(req.user);
};

