import express from 'express';

import {
  createComment,
  fetchAllComments,
  fetchSingleComment,
  updateComment,
} from '../controller/commentController.js';

import { checkUserIsBlocked, checkUserIsActive } from '../middleware/index.js';

const router = express.Router();

router
  .route('/')
  .get(fetchAllComments)
  .post(checkUserIsActive, checkUserIsBlocked, createComment);

router
  .route('/:commentID')
  .get(fetchSingleComment)
  .patch(checkUserIsActive, checkUserIsBlocked, updateComment);

export default router;
