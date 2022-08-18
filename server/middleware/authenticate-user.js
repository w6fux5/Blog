import jwt from 'jsonwebtoken';
import { UnauthenticatedError } from '../errors/index.js';
import { validObjectId } from '../utils/index.js';

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('無效的TOKEN，請重新登入');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { userID } = payload;
    validObjectId(userID);
    req.user = { userID };
  } catch (error) {
    throw new UnauthenticatedError('無效的TOKEN，請重新登入');
  }
  next();
};

export default authenticateUser;
