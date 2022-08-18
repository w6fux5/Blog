import { ForbiddenError } from '../errors/index.js';
import { checkUserExists } from '../utils/index.js';

const checkUserIsBlocked = async (req, res, next) => {
  const { userID } = req.user;
  const user = await checkUserExists(userID);

  if (user.isBlocked) {
    throw new ForbiddenError('帳號被封鎖');
  }

  next();
};

export default checkUserIsBlocked;
