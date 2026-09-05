import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'blocked'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    dueDate: Date,
    completedDate: Date,
    checklist: [
      {
        item: String,
        completed: Boolean,
      },
    ],
    attachments: [
      {
        url: String,
        type: String,
        uploadedAt: Date,
      },
    ],
    location: {
      latitude: Number,
      longitude: Number,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
)

export default mongoose.model('Task', taskSchema)
