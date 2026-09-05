import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: String,
    role: {
      type: String,
      enum: ['admin', 'supervisor', 'crew', 'manager'],
      default: 'crew',
    },
    avatar: String,
    company: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  return obj
}

export default mongoose.model('User', userSchema)
