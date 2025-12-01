const bcrypt = require('bcrypt');
const User = require('../models/User');
const { signAccess, signRefresh, verifyRefresh } = require('../utils/jwt');

const COOKIE_OPTS = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  path:'/',
  // domain: process.env.COOKIE_DOMAIN
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    console.log(name)
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash, role: role || 'user' });
    res.status(201).json({ id: user._id, email: user.email, name: user.name });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = { id: user._id, role: user.role };
    const accessToken = signAccess(payload);
    const refreshToken = signRefresh(payload);

    res.cookie('accessToken', accessToken, { ...COOKIE_OPTS, maxAge: 15*60*1000 });
    res.cookie('refreshToken', refreshToken, { ...COOKIE_OPTS, maxAge: 7*24*60*60*1000 });

    return res.json({ message: 'Logged in', user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) { next(err); }
};

exports.refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'No refresh token' });
    const payload = verifyRefresh(token);
    const accessToken = signAccess({ id: payload.id, role: payload.role });
    res.cookie('accessToken', accessToken, { ...COOKIE_OPTS, maxAge: 15*60*1000 });
    return res.json({ message: 'Token refreshed' });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};

exports.logout = async (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
};
