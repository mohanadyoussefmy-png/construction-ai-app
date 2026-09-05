import express from 'express'
import User from '../models/User.js'

const router = express.Router()

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({ isActive: true }).select('-password')
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get current user
router.get('/me', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const { name, phone, avatar, company } = req.body

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, avatar, company },
      { new: true }
    ).select('-password')

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
