/* eslint-disable func-names */
import mongoose from 'mongoose';
import utcToLocalTime from '../utils/utcToLocalTime.js';

const CategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

CategorySchema.method('toJSON', function () {
  const { createdAt, updateAt, ...object } = this.toObject();
  return {
    ...object,
    createdAt: utcToLocalTime(createdAt),
    updatedAt: utcToLocalTime(updateAt),
  };
});

const Category = mongoose.model('Category', CategorySchema);

export default Category;
