
const userService = require('../service/userService');
const {
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_NAME
} = require('../config/auth');

const buildCookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge
});

exports.signup = async (req, res) => {
  try { 
    const result = await userService.registerUser(req.body.username, req.body.password);
    res.status(result.status).json(result.data || { message: result.message });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
};

exports.login = async (req, res) => {
  try {
    const result = await userService.loginUser(req.body.username, req.body.password);

    if (result.status !== 200) {
      return res.status(result.status).json({ message: result.message });
    }

    const { accessToken, refreshToken, user } = result.data;
    res.cookie(ACCESS_COOKIE_NAME, accessToken, buildCookieOptions(15 * 60 * 1000));
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, buildCookieOptions(7 * 24 * 60 * 60 * 1000));

    return res.json({ message: 'Logged in successfully', user, accessToken });
  } catch (error) {
    return res.status(500).json({ message: 'Error logging in' });
  }
};

exports.refresh = async (req, res) => {
  try {
    const result = await userService.refreshUserToken(req.cookies && req.cookies[REFRESH_COOKIE_NAME]);

    if (result.status !== 200) {
      return res.status(result.status).json({ message: result.message });
    }

    const { accessToken, refreshToken, user } = result.data;
    res.cookie(ACCESS_COOKIE_NAME, accessToken, buildCookieOptions(15 * 60 * 1000));
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, buildCookieOptions(7 * 24 * 60 * 60 * 1000));

    return res.json({ message: 'Token refreshed successfully', user, accessToken });
  } catch (error) {
    return res.status(500).json({ message: 'Error refreshing token' });
  }
};

exports.logout = async (req, res) => {
  await userService.logoutUser(req.cookies && req.cookies[REFRESH_COOKIE_NAME]);
  res.clearCookie(ACCESS_COOKIE_NAME);
  res.clearCookie(REFRESH_COOKIE_NAME);
  res.json({ message: 'Logged out successfully' });
};

exports.getMe = (req, res) => {
  res.json(req.user);
};

