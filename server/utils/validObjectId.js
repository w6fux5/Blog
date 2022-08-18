// Requiring ObjectId from mongoose npm package
import mongoose from 'mongoose';
import { BadRequestError } from '../errors/index.js';

// const ObjectId = mongoose.Types.ObjectId;

const {
  Types: { ObjectId },
} = mongoose;

const validObjectId = (id) => {
  if (ObjectId.isValid(id)) {
    if (String(new ObjectId(id)) === id) return;
  }

  throw new BadRequestError(`Invalid ID Format: ${id}`);
};

export default validObjectId;
