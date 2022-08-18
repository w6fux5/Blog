import { ForbiddenError } from '../errors/index.js';
import { checkUserExists } from '../utils/index.js';

const checkUserIsActive = async (req, res, next) => {
  const { userID } = req.user;
  const user = await checkUserExists(userID);

  if (!user.isAccountVerified) {
    throw new ForbiddenError('帳號尚未驗證');
  }

  next();
};

export default checkUserIsActive;
