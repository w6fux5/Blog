import { Category } from '../model/index.js';

import { BadRequestError, BadGatewayError } from '../errors/index.js';
import { validObjectId } from '../utils/index.js';

//-------------------------------------
// Create category
//-------------------------------------
export const createCategory = async (req, res) => {
  const { title } = req.body;
  if (!title) {
    throw new BadRequestError('Please provide category title');
  }

  const category = await Category.create({
    user: req.user.userID,
    title,
  });

  if (!category) {
    throw new BadGatewayError();
  }

  res.json({ message: 'success', category });
};

//-------------------------------------
// Fetch all categories
//-------------------------------------
export const fetchAllCategories = async (req, res) => {
  const categories = await Category.find({})
    .populate('user')
    .sort('-createdAt');

  if (!categories) {
    throw new BadGatewayError();
  }

  res.json({ total: categories.length, categories });
};

//-------------------------------------
// Fetch single category
//-------------------------------------
export const fetchSingleCategory = async (req, res) => {
  const { categoryID } = req.params || {};
  validObjectId(categoryID);

  if (!categoryID) {
    throw new BadRequestError('Please provide categoryID');
  }

  const category = await Category.findById(categoryID)
    .populate('user')
    .sort('-createdAt');

  if (!category) {
    throw new BadGatewayError();
  }

  res.json({ message: 'success', category });
};

//-------------------------------------
// Fetch single category
//-------------------------------------
export const updateCategory = async (req, res) => {
  const { categoryID } = req.params;
  validObjectId(categoryID);

  const { title } = req.body;
  if (!title) {
    throw new BadRequestError('Please provide title');
  }

  const newCategory = await Category.findOneAndUpdate(
    categoryID,
    {
      title,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updateCategory) {
    throw new BadGatewayError();
  }

  res.json({ message: 'success', newCategory });
};

//-------------------------------------
// Delete category
//-------------------------------------
export const deleteCategory = async (req, res) => {
  const { categoryID } = req.params;
  validObjectId(categoryID);

  const categoryDelete = await Category.findByIdAndDelete(categoryID);

  if (!categoryDelete) {
    throw new BadGatewayError();
  }

  res.json({ message: `success`, categoryDelete });
};
