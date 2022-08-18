import { UnauthenticatedError } from '../errors/index.js';

const checkPermissions = (requestUser, resourcedUserID) => {
  if (requestUser.userID === resourcedUserID.toString()) return;
  throw new UnauthenticatedError('未授權的操作');
};

export default checkPermissions;
