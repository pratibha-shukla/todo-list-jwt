
const userService = require('../service/userService');

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

    const { token, user } = result.data;
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600000
    });

    return res.json({ message: 'Logged in successfully', user });
  } catch (error) {
    return res.status(500).json({ message: 'Error logging in' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};

exports.getMe = (req, res) => {
  res.json(req.user);
};

