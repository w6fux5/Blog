import { StatusCodes } from 'http-status-codes';
import User from '../model/UserModel.js';

// import { sendEmail } from '../utils/index.js';

import {
  BadRequestError,
  UnauthenticatedError,
  // NotFoundError,
} from '../errors/index.js';

//-------------------------------------
// register
//-------------------------------------
export const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body || {};

  if (!firstName || !lastName || !email || !password) {
    throw new BadRequestError('資訊提供不完整');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new BadRequestError('Email 已經註冊過了');
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
  });
  const token = await user.createJWT();

  const { _id, profilePhoto, isAdmin } = user._doc;

  res.status(StatusCodes.CREATED).json({
    user: {
      _id,
      firstName,
      lastName,
      email,
      profilePhoto,
      isAdmin,
      token,
    },
  });
};

//-------------------------------
// login user
//-------------------------------
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  const existsUser = await User.findOne({ email });

  const passwordIsMatch = await existsUser?.matchPassword(password);

  if (!passwordIsMatch || !existsUser) {
    throw new UnauthenticatedError('無效的Email或密碼');
  }

  const token = existsUser.createJWT();

  const { _id, firstName, lastName, profilePhoto, isAdmin } = existsUser._doc;

  res.status(StatusCodes.OK).json({
    user: {
      _id,
      firstName,
      lastName,
      email,
      profilePhoto,
      isAdmin,
      token,
    },
  });
};
