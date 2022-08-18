import { StatusCodes } from 'http-status-codes';
import crypto from 'crypto';
import fs from 'fs';
import log from 'log-beautify';

import User from '../model/UserModel.js';

import {
  validObjectId,
  checkUserExists,
  sendEmail,
  // blockUser,
  cloudinaryUploadImg,
} from '../utils/index.js';

import {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} from '../errors/index.js';

//------------------------------
// fetch all users
//-------------------------------
export const fetchAllUsers = async (req, res) => {
  const users = await User.find({});
  res.status(StatusCodes.OK).json({ total: users.length, users });
};

//------------------------------
// update user
//-------------------------------
export const updateUser = async (req, res) => {
  const { userID } = req.user;
  res.send(userID);
};

//------------------------------
// update password
//-------------------------------
export const updatePassword = async (req, res) => {
  const { userID } = req.user;
  const user = await checkUserExists(userID);

  const { password } = req.body;
  if (!password) {
    throw new BadRequestError('請提供有效的密碼');
  }

  user.password = password;
  await user.save();
  res.status(StatusCodes.OK).json({ message: 'Success update password' });
};

//------------------------------
// fetch user detail
//-------------------------------
export const fetchUserDetails = async (req, res) => {
  const { id } = req.params;
  validObjectId(id);
  const user = await checkUserExists(id);
  res.status(StatusCodes.OK).json(user);
};

//------------------------------
// fetch user profile
//-------------------------------
export const fetchUserProfile = async (req, res) => {
  const { id } = req.params;
  validObjectId(id);
  const user = await checkUserExists(id, 'posts');
  res.status(StatusCodes.OK).json(user);
};

//------------------------------
// delete user
//-------------------------------
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  validObjectId(id);
  const user = await checkUserExists(id);
  await user.remove();
  res.status(StatusCodes.OK).json({ message: 'Success user removed' });
};

//------------------------------
// following user
//-------------------------------
export const followingUser = async (req, res) => {
  // Following user
  const { followingID } = req.body;
  if (!followingID) {
    throw new BadRequestError('缺少 followingID 參數');
  }

  validObjectId(followingID);
  await checkUserExists(followingID);

  // Follower user
  const { userID } = req?.user || {};
  await checkUserExists(userID);

  // 自己追蹤自己
  if (followingID === userID) {
    throw new BadRequestError('Invalid following');
  }

  // 重複的追蹤
  const alreadyFollowing = followingUser?.followers?.find(
    (user) => user?.toString() === userID.toString(),
  );

  if (alreadyFollowing) {
    throw new BadRequestError('already following');
  }

  // Update following and follower
  await User.findByIdAndUpdate(followingID, {
    $addToSet: { followers: userID },
  });

  await User.findByIdAndUpdate(userID, {
    $addToSet: { following: followingID },
  });

  res
    .status(StatusCodes.OK)
    .json({ message: 'You have successfully followed this user' });
};

//------------------------------
// unFollow
//------------------------------
export const unFollowUser = async (req, res) => {
  // Following user
  const { unFollowID } = req.body;
  if (!unFollowID) {
    throw new BadRequestError('缺少 unFollowID 參數');
  }
  validObjectId(unFollowID);
  await checkUserExists(unFollowID);

  // Follower user
  const { userID } = req.user;
  const followerUser = await checkUserExists(userID);

  // 確認是否有追蹤
  const hasFollowing = followerUser?.following?.find(
    (user) => user?.toString() === unFollowID.toString(),
  );

  if (!hasFollowing) {
    throw new NotFoundError(`unFollowID 不存在: ${unFollowID}`);
  }

  // Update following and follower
  await User.findByIdAndUpdate(unFollowID, {
    $pull: { followers: userID },
  });

  await User.findByIdAndUpdate(userID, {
    $pull: { following: unFollowID },
  });

  res.status(StatusCodes.OK).json({ message: 'Success cancel following' });
};

//------------------------------
// generate verify token and email
//-------------------------------
export const generateVerifyTokenEmail = async (req, res) => {
  const { userID } = req.user;
  const user = await checkUserExists(userID);

  try {
    const verifyToken = await user.createAccountVerifyToken();
    await user.save();
    const verifyUrl = `${process.env.BASE_URL}/verify-account/${verifyToken}`;
    const htmlStr = `<div>If you were requested to verify your account, verify now within 10 minutes, otherwise ignore this message <a href="${verifyUrl}">Click to verify your account</a></div>`;
    sendEmail(user?.email, htmlStr);
    res.status(StatusCodes.OK).json({ verifyUrl, veryToken: verifyToken });
  } catch (error) {
    log.error(`UserController ${error}`);
    throw new BadRequestError('無法發送驗證信');
  }
};

//------------------------------
// verify account
//-------------------------------
export const verifyAccount = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    throw new BadRequestError('缺少token參數');
  }
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const existsUser = await User.findOne({
    accountVerifyToken: hashedToken,
    accountVerifyTokenExpires: { $gt: new Date() }, // 只有小於當前日期才會把資料抓出來
  });

  if (!existsUser) {
    throw new UnauthenticatedError('Token expired');
  }

  existsUser.isAccountVerified = true;
  existsUser.accountVerifyToken = undefined;
  existsUser.accountVerifyTokenExpires = undefined;
  await existsUser.save();

  res
    .status(StatusCodes.OK)
    .json({ message: 'Success verify account', user: existsUser });
};

//---------------------------------------
// forget password  token and send email
//--------------------------------------
export const forgetPasswordToken = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError('缺少email參數');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError(`Email沒有註冊: ${email}`);
  }

  try {
    const resetPasswordToken = await user.createPasswordResetToken();
    await user.save();
    const verifyUrl = `${process.env.BASE_URL}/reset-password/${resetPasswordToken}`;
    const htmlStr = `<div>If you were requested to reset your password, verify now within 10 minutes, otherwise ignore this message <a href="${verifyUrl}">Click to reset password</a></div>`;
    sendEmail(user?.email, htmlStr);
    res.status(StatusCodes.OK).json({ verifyUrl, resetPasswordToken });
  } catch (error) {
    log.error(`UserController ${error}`);
    throw new BadRequestError('無法發送驗證信');
  }
};

//------------------------------
// Password reset
//------------------------------
export const passwordReset = async (req, res) => {
  const { resetPasswordToken, password } = req.body;
  if (!resetPasswordToken || !password) {
    throw new BadRequestError('參數不完整');
  }

  const hashedToken = crypto
    .createHash('sha256')
    .update(resetPasswordToken)
    .digest('hex');

  const existsUser = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!existsUser) {
    throw new UnauthenticatedError('Token expired');
  }

  // Update/change the password
  existsUser.password = password;
  existsUser.passwordResetToken = undefined;
  existsUser.passwordResetExpires = undefined;
  await existsUser.save();
  res
    .status(StatusCodes.OK)
    .json({ message: 'Success verify account', user: existsUser });
};

//------------------------------
// profile photo upload
//------------------------------
export const profilePhotoUpload = async (req, res) => {
  const { userID } = req.user;
  await checkUserExists(userID);
  // block user
  // 1. Get the oath to img
  const localPath = `public/images/profile/${req.file.filename}`;
  // 2.Upload to cloudinary
  const imgUploadUrl = await cloudinaryUploadImg(localPath);
  // 3. update user profile
  await User.findByIdAndUpdate(userID, { profilePhoto: imgUploadUrl?.url });

  // remove the saved img
  fs.unlinkSync(localPath);

  res.json(imgUploadUrl);
};

//------------------------------
// Block user
//------------------------------
export const userBlock = async (req, res) => {
  const { id } = req.params;
  validObjectId(id);
  await checkUserExists(id);

  const user = await User.findByIdAndUpdate(id, { isBlocked: true });
  if (!user) {
    throw new BadRequestError('Block Fail');
  }

  res.status(StatusCodes.OK).json({ message: 'Block Success' });
};

//------------------------------
// unBlock user
//------------------------------
export const userUnblock = async (req, res) => {
  const { id } = req.params;
  validObjectId(id);
  await checkUserExists(id);
  const user = await User.findByIdAndUpdate(id, { isBlocked: false });
  if (!user) {
    throw new BadRequestError('Unblock Fail');
  }
  res.status(StatusCodes.OK).json({ message: 'Unblock Success' });
};
