/* eslint-disable func-names */
import mongoose from 'mongoose';
import { utcToLocalTime } from '../utils/index.js';

const CommentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Post is required'],
    },

    user: {
      type: Object,
      required: [true, 'User is required'],
    },

    description: {
      type: String,
      required: [true, 'Comment description is required'],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

CommentSchema.method('toJSON', function () {
  const { createdAt, updatedAt, ...object } = this.toObject();
  return {
    createdAt: utcToLocalTime(createdAt),
    updatedAt: utcToLocalTime(updatedAt),
    ...object,
  };
});

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;
