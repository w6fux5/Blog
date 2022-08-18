import express from 'express';
import {
  createCategory,
  fetchAllCategories,
  fetchSingleCategory,
  updateCategory,
  deleteCategory,
} from '../controller/categoryController.js';
import { checkUserIsActive, checkUserIsBlocked } from '../middleware/index.js';

const router = express.Router();

router
  .route('/')
  .get(checkUserIsActive, checkUserIsBlocked, fetchAllCategories)
  .post(checkUserIsActive, checkUserIsBlocked, createCategory);

router
  .route('/:categoryID')
  .get(checkUserIsActive, checkUserIsBlocked, fetchSingleCategory)
  .patch(checkUserIsActive, checkUserIsBlocked, updateCategory)
  .delete(checkUserIsActive, checkUserIsBlocked, deleteCategory);

export default router;
