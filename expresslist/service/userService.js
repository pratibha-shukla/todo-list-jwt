const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users } = require('../models');

const JWT_SECRET = 'your_secret_key';

exports.registerUser = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: users.length + 1, username, password: hashedPassword };
  users.push(user);
  return user;
};

exports.loginUser = async (username, password) => {
  const user = users.find(u => u.username === username);
  if (user && await bcrypt.compare(password, user.password)) {
    return jwt.sign({ userId: user.id, role: 'user' }, JWT_SECRET, { expiresIn: '1h' });
  }
  return null;
};
