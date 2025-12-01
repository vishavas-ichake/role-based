const { verifyAccess } = require('../utils/jwt');

exports.authenticate = (req, res, next) => {
  try {
    const token = req.cookies.accessToken || (req.header('Authorization') && req.header('Authorization').split(' ')[1]);
    if (!token) return res.status(401).json({ message: 'Authentication required' });
    const payload = verifyAccess(token);
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// roles: array of allowed roles e.g. ['admin']
exports.authorize = (roles = []) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Auth required' });
  if (roles.length && !roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  next();
};
