import { NotFoundError } from '../errors/index.js';
import { User } from '../model/index.js';

const checkUserExists = async (userID, populate) => {
  const user = await User.findById(userID).populate(populate);
  if (!user) {
    throw new NotFoundError(`No user with id: ${userID}`);
  }
  return user;
};

export default checkUserExists;
