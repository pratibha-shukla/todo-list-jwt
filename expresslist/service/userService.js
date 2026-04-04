
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users } = require('../models');

const JWT_SECRET = 'your_secret_key';

const sanitizeUsername = (username) => String(username || '').trim();

const publicUser = (user) => ({
  id: user.id,
  username: user.username
});

exports.registerUser = async (username, password) => {
  const normalizedUsername = sanitizeUsername(username);
  const normalizedPassword = String(password || '');

  if (!normalizedUsername || !normalizedPassword) {
    return { status: 400, message: 'Username and password are required' };
  }

  if (normalizedPassword.length < 6) {
    return { status: 400, message: 'Password must be at least 6 characters long' };
  }

  if (users.some((user) => user.username === normalizedUsername)) {
    return { status: 409, message: 'Username already exists' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = { id: users.length + 1, username: normalizedUsername, password: hashedPassword };
  users.push(user);
  return { status: 201, data: publicUser(user) };
};

exports.loginUser = async (username, password) => {
  const normalizedUsername = sanitizeUsername(username);
  const normalizedPassword = String(password || '');

  if (!normalizedUsername || !normalizedPassword) {
    return { status: 400, message: 'Username and password are required' };
  }

  const user = users.find((existingUser) => existingUser.username === normalizedUsername);

  if (!user || !(await bcrypt.compare(normalizedPassword, user.password))) {
    return { status: 401, message: 'Invalid credentials' };
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username, role: 'user' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  return {
    status: 200,
    data: {
      token,
      user: publicUser(user)
    }
  };
};
