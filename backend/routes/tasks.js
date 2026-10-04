const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/Task');

const router = express.Router();

// Reject malformed ids early so Mongoose does not throw a CastError
const checkId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid task id' });
  }
  next();
};

// GET /api/tasks  -> all tasks, newest first
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/tasks  -> create a task
router.post('/', async (req, res) => {
  try {
    const task = await Task.create({ title: req.body.title });
    res.status(201).json(task);
  } catch (err) {
    // ValidationError (e.g. empty title) is the client's fault -> 400
    const status = err.name === 'ValidationError' ? 400 : 500;
    res.status(status).json({ message: err.message });
  }
});

// PUT /api/tasks/:id  -> update title and/or completed
router.put('/:id', checkId, async (req, res) => {
  try {
    const updates = {};
    if (req.body.title !== undefined) updates.title = req.body.title;
    if (req.body.completed !== undefined) updates.completed = req.body.completed;

    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,           // return the updated document
      runValidators: true, // keep the "title required" rule on updates
    });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    const status = err.name === 'ValidationError' ? 400 : 500;
    res.status(status).json({ message: err.message });
  }
});

// DELETE /api/tasks/:id  -> remove a task
router.delete('/:id', checkId, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted', id: task._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
