import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    client: {
      type: String,
      required: true,
    },
    address: String,
    status: {
      type: String,
      enum: ['planning', 'active', 'paused', 'completed'],
      default: 'active',
    },
    startDate: Date,
    endDate: Date,
    budget: Number,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    team: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    plans: [
      {
        url: String,
        uploadedAt: Date,
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    location: {
      latitude: Number,
      longitude: Number,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Project', projectSchema)
