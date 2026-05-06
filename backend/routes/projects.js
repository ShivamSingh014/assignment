const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/projects
// @desc    Get all projects
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const projects = await Project.find().populate('adminId', 'name email');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/projects
// @desc    Create a project
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    const project = new Project({
      name,
      description,
      adminId: req.user._id
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/projects/:id
// @desc    Get project by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('adminId', 'name email');
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
