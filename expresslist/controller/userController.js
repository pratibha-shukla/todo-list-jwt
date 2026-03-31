
const userService = require('../service/userService');

exports.signup = async (req, res) => {
  await userService.registerUser(req.body.username, req.body.password);
  res.status(201).json({ message: "User created" });
};

exports.login = async (req, res) => {
  const token = await userService.loginUser(req.body.username, req.body.password);
  token ? res.json({ token }) : res.status(401).json({ message: "Invalid credentials" });
};

exports.getMe = (req, res) => res.json(req.user);
