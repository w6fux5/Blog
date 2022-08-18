import mongoose from 'mongoose';

const EmailSchema = new mongoose.Schema(
  {
    id: false,

    from: {
      type: String,
      required: true,
    },

    to: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    isFlagged: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,

    timestamps: true,
  },
);

const Email = mongoose.model('Email', EmailSchema);
export default Email;
