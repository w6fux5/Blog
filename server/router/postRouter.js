import express from 'express';

// import { userController } from "../controller/index.js";
import {
  createPost,
  fetchPosts,
  fetchSinglePost,
  updatePostCtrl,
  deletePost,
  likePostToggle,
  dislikePostToggle,
} from '../controller/postController.js';

import {
  checkUserIsBlocked,
  fileUpload,
  checkUserIsActive,
} from '../middleware/index.js';

const { photoUpload, postImgResize } = fileUpload;

const router = express.Router();

router
  .route('/like')
  .patch(checkUserIsActive, checkUserIsBlocked, likePostToggle);

router
  .route('/dislike')
  .patch(checkUserIsActive, checkUserIsBlocked, dislikePostToggle);

router
  .route('/')
  .get(fetchPosts)
  .post(
    checkUserIsActive,
    checkUserIsBlocked,
    photoUpload.single('image'),
    postImgResize,
    createPost,
  );

router
  .route('/:postID')
  .get(fetchSinglePost)
  .patch(checkUserIsActive, checkUserIsBlocked, updatePostCtrl)
  .delete(checkUserIsActive, checkUserIsBlocked, deletePost);

export default router;
