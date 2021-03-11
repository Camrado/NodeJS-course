const express = require('express');
const Task = require('../models/Task.js');
const auth = require('../middleware/auth.js');
const router = new express.Router();

// Read all tasks
// GET /tasks?completed=true
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt:asc
router.get('/tasks', auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    //? req.query.completed is a string
    match.completed = req.query.completed === 'true';
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'asc' ? 1 : -1;
  }

  try {
    await req.user
      .populate({
        path: 'tasks',
        match,
        options: {
          limit: parseInt(req.query.limit), //? req.query.limit is a string
          skip: parseInt(req.query.skip), //? req.query.skip is a string
          sort
        }
      })
      .execPopulate();

    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send();
  }
});

// Read task by its id
router.get('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

// Create a task
router.post('/tasks', auth, async (req, res) => {
  const task = new Task({ ...req.body, owner: req.user._id });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Update task
router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid Updated!' });
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

    if (!task) return res.status(404).send({ error: 'Task Not Found' });

    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (e) {
    // Validation error
    if (e.reason.value) res.status(400).send(e);
    // Server error
    else res.status(500).send();
  }
});

// Delete task by its id
router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!task) return res.status(404).send({ error: 'Task Not Found' });
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
