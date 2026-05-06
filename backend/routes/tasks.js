const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/tasks
// @desc    Get all tasks (for dashboard)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'Admin') {
      // Member sees only their tasks
      query.assignedTo = req.user._id;
    }
    const tasks = await Task.find(query).populate('projectId', 'name').populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/tasks/project/:projectId
// @desc    Get tasks by project
// @access  Private
router.get('/project/:projectId', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId })
      .populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/tasks
// @desc    Create a task
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, description, status, projectId, assignedTo, dueDate } = req.body;
    
    const task = new Task({
      title,
      description,
      status,
      projectId,
      assignedTo: assignedTo || null,
      dueDate
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task (status or details)
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Admins can update anything. Members can only update status.
    if (req.user.role === 'Admin') {
      task.title = req.body.title || task.title;
      task.description = req.body.description || task.description;
      task.status = req.body.status || task.status;
      task.assignedTo = req.body.assignedTo || task.assignedTo;
      task.dueDate = req.body.dueDate || task.dueDate;
    } else {
      // Check if task is assigned to the member
      if (task.assignedTo && task.assignedTo.toString() === req.user._id.toString()) {
        task.status = req.body.status || task.status;
      } else {
        return res.status(403).json({ message: 'Not authorized to update this task' });
      }
    }

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
