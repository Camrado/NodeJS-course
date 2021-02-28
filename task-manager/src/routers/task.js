const express = require('express');
const Task = require('../models/Task.js');
const router = new express.Router();

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (e) {
    res.status(500).send();
  }
});

router.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send({ error: 'Task Not Found' });
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

router.post('/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch('/tasks/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid Updated!' });
  }

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!task) return res.status(404).send({ error: 'Task Not Found' });
    res.send(task);
  } catch (e) {
    // Validation error
    if (e.reason.value) res.status(400).send(e);
    // Server error
    else res.status(500).send();
  }
});

router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).send({ error: 'Task Not Found' });
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
