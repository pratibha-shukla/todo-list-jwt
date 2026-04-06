
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { users } = require('../models');
const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL
} = require('../config/auth');

const sanitizeUsername = (username) => String(username || '').trim();

const publicUser = (user) => ({
  id: user.id,
  username: user.username
});

const buildAccessToken = (user) => jwt.sign(
  { userId: user.id, username: user.username, role: 'user' },
  ACCESS_TOKEN_SECRET,
  { expiresIn: ACCESS_TOKEN_TTL }
);

const buildRefreshToken = (user) => jwt.sign(
  { userId: user.id, tokenType: 'refresh', tokenId: crypto.randomUUID() },
  REFRESH_TOKEN_SECRET,
  { expiresIn: REFRESH_TOKEN_TTL }
);

const removeRefreshTokenHash = (user, tokenHash) => {
  user.refreshTokens = (user.refreshTokens || []).filter((hash) => hash !== tokenHash);
};

const storeRefreshToken = async (user, refreshToken) => {
  const tokenHash = await bcrypt.hash(refreshToken, 10);
  user.refreshTokens = user.refreshTokens || [];
  user.refreshTokens.push(tokenHash);
};

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

  const user = {
    id: users.length + 1,
    username: normalizedUsername,
    password: hashedPassword,
    refreshTokens: []
  };
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

  const accessToken = buildAccessToken(user);
  const refreshToken = buildRefreshToken(user);
  await storeRefreshToken(user, refreshToken);

  return {
    status: 200,
    data: {
      accessToken,
      refreshToken,
      user: publicUser(user)
    }
  };
};

exports.refreshUserToken = async (refreshToken) => {
  if (!refreshToken) {
    return { status: 401, message: 'Refresh token required' };
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const user = users.find((existingUser) => existingUser.id === decoded.userId);

    if (!user) {
      return { status: 401, message: 'Invalid refresh token' };
    }

    const matchedHash = await Promise.all(
      (user.refreshTokens || []).map(async (tokenHash) => (
        (await bcrypt.compare(refreshToken, tokenHash)) ? tokenHash : null
      ))
    );
    const tokenHash = matchedHash.find(Boolean);

    if (!tokenHash) {
      return { status: 401, message: 'Invalid refresh token' };
    }

    removeRefreshTokenHash(user, tokenHash);

    const nextAccessToken = buildAccessToken(user);
    const nextRefreshToken = buildRefreshToken(user);
    await storeRefreshToken(user, nextRefreshToken);

    return {
      status: 200,
      data: {
        accessToken: nextAccessToken,
        refreshToken: nextRefreshToken,
        user: publicUser(user)
      }
    };
  } catch (error) {
    return { status: 401, message: 'Invalid refresh token' };
  }
};

exports.logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    return { status: 200, message: 'Logged out successfully' };
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const user = users.find((existingUser) => existingUser.id === decoded.userId);

    if (user && user.refreshTokens && user.refreshTokens.length > 0) {
      const matchedHash = await Promise.all(
        user.refreshTokens.map(async (tokenHash) => (
          (await bcrypt.compare(refreshToken, tokenHash)) ? tokenHash : null
        ))
      );
      const tokenHash = matchedHash.find(Boolean);

      if (tokenHash) {
        removeRefreshTokenHash(user, tokenHash);
      }
    }
  } catch (error) {
    return { status: 200, message: 'Logged out successfully' };
  }

  return { status: 200, message: 'Logged out successfully' };
};
