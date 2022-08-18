import express from 'express';

import {
  fetchAllUsers,
  deleteUser,
  fetchUserDetails,
  fetchUserProfile,
  updateUser,
  updatePassword,
  followingUser,
  unFollowUser,
  generateVerifyTokenEmail,
  verifyAccount,
  forgetPasswordToken,
  passwordReset,
  profilePhotoUpload,
  userBlock,
  userUnblock,
} from '../controller/userController.js';

import {
  fileUpload,
  checkUserIsAdmin,
  checkUserIsBlocked,
} from '../middleware/index.js';

// import {photoUpload, profilePhotoResize} from '../middleware/file-upload.js'

const { photoUpload, profilePhotoResize } = fileUpload;

const router = express.Router();

router.route('/').get(fetchAllUsers).patch(updateUser);

router.route('/:id').get(fetchUserDetails).delete(deleteUser);

router.route('/profile/:id').get(fetchUserProfile);

router.route('/update-password').patch(updatePassword);

router.route('/follow').patch(followingUser);

router.route('/unFollow').patch(unFollowUser);

router.route('/generate-verify-token-email').post(generateVerifyTokenEmail);

router.route('/verify-account').post(verifyAccount);

router.route('/forget-password-token').post(forgetPasswordToken);

router.route('/reset-password').post(passwordReset);

router
  .route('/profile-photo-upload')
  .post(
    checkUserIsBlocked,
    photoUpload.single('image'),
    profilePhotoResize,
    profilePhotoUpload,
  );

router.route('/block-user/:id').post(checkUserIsAdmin, userBlock);

router.route('/unblock-user/:id').post(checkUserIsAdmin, userUnblock);

export default router;
