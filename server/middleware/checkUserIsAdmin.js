import { ForbiddenError } from '../errors/index.js';
import { checkUserExists } from '../utils/index.js';

const checkUserIsAdmin = async (req, res, next) => {
  const { userID } = req.user;
  const user = await checkUserExists(userID);

  if (!user.isAdmin) {
    throw new ForbiddenError('權限不足');
  }

  next();
};

export default checkUserIsAdmin;
