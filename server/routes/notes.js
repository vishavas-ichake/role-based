const express = require('express');
const { authenticate } = require('../middlewares/auth');
const noteCtrl = require('../controllers/noteController');
const { body, validationResult } = require('express-validator');

const router = express.Router();
router.use(authenticate);

const v = (req,res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

router.post('/', [ body('title').notEmpty().trim().escape() ], v, noteCtrl.create);
router.get('/', noteCtrl.list);
router.get('/:id', noteCtrl.get);
router.put('/:id', noteCtrl.update);
router.delete('/:id', noteCtrl.delete);

module.exports = router;
