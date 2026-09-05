import express from 'express'
import { OpenAI } from 'openai'
import VoiceReport from '../models/VoiceReport.js'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const router = express.Router()

const upload = multer({ dest: path.join(__dirname, '../uploads') })

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Transcribe audio
router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No audio file provided' })
    }

    const audioPath = req.file.path
    const audioStream = fs.createReadStream(audioPath)

    const transcript = await openai.audio.transcriptions.create({
      file: audioStream,
      model: 'whisper-1',
      language: 'en',
    })

    // Clean up uploaded file
    fs.unlinkSync(audioPath)

    res.json({
      transcription: transcript.text,
    })
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path)
    res.status(500).json({ message: error.message })
  }
})

// Create voice report
router.post('/reports', async (req, res) => {
  try {
    const { content, project, location, relatedTasks } = req.body

    const report = new VoiceReport({
      project,
      createdBy: req.user.id,
      transcription: content,
      location,
      relatedTasks: relatedTasks || [],
    })

    await report.save()
    await report.populate('createdBy', 'name email')
    await report.populate('project', 'name')

    res.status(201).json(report)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get voice reports
router.get('/reports', async (req, res) => {
  try {
    const { projectId } = req.query
    const filter = projectId ? { project: projectId } : {}

    const reports = await VoiceReport.find(filter)
      .populate('createdBy', 'name email')
      .populate('project', 'name')
      .sort({ createdAt: -1 })

    res.json(reports)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get voice report by ID
router.get('/reports/:id', async (req, res) => {
  try {
    const report = await VoiceReport.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('project', 'name')
      .populate('relatedTasks')

    if (!report) {
      return res.status(404).json({ message: 'Report not found' })
    }

    res.json(report)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Delete voice report
router.delete('/reports/:id', async (req, res) => {
  try {
    const report = await VoiceReport.findByIdAndDelete(req.params.id)

    if (!report) {
      return res.status(404).json({ message: 'Report not found' })
    }

    res.json({ message: 'Report deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
