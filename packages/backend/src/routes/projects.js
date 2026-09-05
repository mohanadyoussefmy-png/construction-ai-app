import express from 'express'
import Project from '../models/Project.js'
import Task from '../models/Task.js'

const router = express.Router()

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id })
      .populate('owner', 'name email')
      .populate('team', 'name email')

    res.json(projects)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('team', 'name email')

    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }

    res.json(project)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create project
router.post('/', async (req, res) => {
  try {
    const { name, description, client, address, budget, startDate, endDate } = req.body

    const project = new Project({
      name,
      description,
      client,
      address,
      budget,
      startDate,
      endDate,
      owner: req.user.id,
      team: [req.user.id],
    })

    await project.save()
    await project.populate('owner', 'name email')

    res.status(201).json(project)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update project
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('owner', 'name email')

    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }

    res.json(project)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id)

    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }

    // Delete related tasks
    await Task.deleteMany({ project: req.params.id })

    res.json({ message: 'Project deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get project stats
router.get('/:id/stats', async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.id })

    const stats = {
      totalTasks: tasks.length,
      completedTasks: tasks.filter((t) => t.status === 'completed').length,
      inProgressTasks: tasks.filter((t) => t.status === 'in-progress').length,
      pendingTasks: tasks.filter((t) => t.status === 'pending').length,
      completionRate: tasks.length > 0
        ? Math.round((tasks.filter((t) => t.status === 'completed').length / tasks.length) * 100)
        : 0,
    }

    res.json(stats)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
