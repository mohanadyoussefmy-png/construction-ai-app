import express from 'express'
import Task from '../models/Task.js'

const router = express.Router()

// Get tasks
router.get('/', async (req, res) => {
  try {
    const { projectId, status, assignee } = req.query
    const filter = {}

    if (projectId) filter.project = projectId
    if (status) filter.status = status
    if (assignee) filter.assignee = assignee

    const tasks = await Task.find(filter)
      .populate('assignee', 'name email')
      .populate('project', 'name')
      .populate('createdBy', 'name email')

    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create task
router.post('/', async (req, res) => {
  try {
    const { title, description, project, assignee, priority, dueDate } = req.body

    const task = new Task({
      title,
      description,
      project,
      assignee,
      priority,
      dueDate,
      createdBy: req.user.id,
    })

    await task.save()
    await task.populate('assignee', 'name email')
    await task.populate('project', 'name')

    res.status(201).json(task)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate('assignee', 'name email')
      .populate('project', 'name')

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    res.json(task)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update task status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        status,
        completedDate: status === 'completed' ? new Date() : null,
      },
      { new: true }
    )

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    res.json(task)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Assign task
router.patch('/:id/assign', async (req, res) => {
  try {
    const { userId } = req.body

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { assignee: userId },
      { new: true }
    ).populate('assignee', 'name email')

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    res.json(task)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
