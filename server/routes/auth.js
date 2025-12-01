const express = require('express');
const { register, login, refresh, logout } = require('../controllers/authController');
const { body, validationResult } = require('express-validator');

const router = express.Router();

const validate = (req,res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

router.post('/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('name').notEmpty()
], validate, register);

router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], validate, login);

router.post('/refresh', refresh);
router.post('/logout', logout);

// routes/auth.js
router.get('/me', (req, res) => {
  try {
    const token = req.cookies.accessToken || (req.header('Authorization') && req.header('Authorization').split(' ')[1]);
    console.log(token)
    if (!token) return res.status(401).json({ message: 'Not authenticated' });
    const payload = verifyAccess(token); // from utils/jwt
    return res.json({ id: payload.id, role: payload.role });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
});


module.exports = router;
