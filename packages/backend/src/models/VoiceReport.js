import mongoose from 'mongoose'

const voiceReportSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    audioPath: String,
    transcription: {
      type: String,
      required: true,
    },
    summary: String,
    tags: [String],
    location: {
      latitude: Number,
      longitude: Number,
      address: String,
    },
    relatedTasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'processed', 'archived'],
      default: 'pending',
    },
  },
  { timestamps: true }
)

export default mongoose.model('VoiceReport', voiceReportSchema)
