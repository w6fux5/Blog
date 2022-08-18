/* eslint-disable func-names */
import mongoose from 'mongoose';
import { utcToLocalTime } from '../utils/index.js';

const PostSchema = new mongoose.Schema(
  {
    id: false,

    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
    },
    // Created by only category
    category: {
      type: String,
      required: [true, 'Post category is required'],
    },

    isLiked: {
      type: Boolean,
      default: false,
    },

    isDisLiked: {
      type: Boolean,
      default: false,
    },

    numViews: {
      type: Number,
      default: 0,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    disLikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Post Author is required'],
    },

    description: {
      type: String,
      required: [true, 'Post description is required'],
    },

    image: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2020/10/25/09/23/seagull-5683637_960_720.jpg',
    },
  },
  {
    versionKey: false,

    toJSON: {
      virtuals: true,
    },

    toObject: {
      virtuals: true,
    },

    timestamps: true,
  },
);

// populate comments
PostSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'post',
  localField: '_id',
});

PostSchema.method('toJSON', function () {
  const { __v, createdAt, updatedAt, ...object } = this.toObject();

  return {
    ...object,
    createdAt: utcToLocalTime(createdAt),
    updatedAt: utcToLocalTime(updatedAt),
  };
});

const Post = mongoose.model('Post', PostSchema);

export default Post;
