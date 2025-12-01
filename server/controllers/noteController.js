const Note = require('../models/Note');

exports.create = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const note = await Note.create({ title, content, userId: req.user.id });
    res.status(201).json(note);
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { userId: req.user.id };
    const notes = await Note.find(filter).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Not found' });
    if (req.user.role !== 'admin' && note.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    res.json(note);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Not found' });
    if (req.user.role !== 'admin' && note.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    note.title = req.body.title ?? note.title;
    note.content = req.body.content ?? note.content;
    await note.save();
    res.json(note);
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Not found' });
    if (req.user.role !== 'admin' && note.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    await note.remove();
    res.status(204).send();
  } catch (err) { next(err); }
};
