import fs from 'fs';
// import { StatusCodes } from 'http-status-codes';

import { Post, User } from '../model/index.js';

import {
  checkUserExists,
  cloudinaryUploadImg,
  checkPostExists,
  validObjectId,
  checkPermissions,
} from '../utils/index.js';

import { BadRequestError, BadGatewayError } from '../errors/index.js';

//------------------------------
// Create post
//------------------------------
export const createPost = async (req, res) => {
  const { userID } = req.user;
  checkUserExists(userID);

  const { title, category, description } = req.body;

  if (!title || !category || !description) {
    throw new BadRequestError('Please provide all field value');
  }

  // 上傳圖片
  // 1. get the path to image
  const imagePath = `public/images/posts/${req.file.filename}`;
  const imgUploadUrl = await cloudinaryUploadImg(imagePath);

  // 2. create post
  const post = await Post.create({
    ...req.body,
    image: imgUploadUrl?.url,
    author: userID,
  });

  // 3. update user post count
  const user = await User.findByIdAndUpdate(userID, {
    $inc: { postCount: 1 },
  });

  if (!post || !user) {
    throw new BadGatewayError('發生錯誤，請稍後再試');
  }

  // Remove uploaded img
  fs.unlinkSync(imagePath);
  res.json(post);
};

//------------------------------
// Fetch all post
//------------------------------
export const fetchPosts = async (req, res) => {
  const posts = await Post.find({}).populate('author');
  if (!posts) {
    throw new BadGatewayError('發生錯誤，請稍後再試');
  }
  res.json({ total: posts.length, posts });
};

//------------------------------
// Fetch single post
//------------------------------
export const fetchSinglePost = async (req, res) => {
  const { postID } = req.params;
  const updatePost = await Post.findByIdAndUpdate(
    postID,
    { $inc: { numViews: 1 } },
    { new: true, runValidators: true },
  );

  if (!updatePost) {
    throw new BadGatewayError('發生錯誤，請稍後再試');
  }
  const post = await checkPostExists(
    postID,
    'comments',
    'author',
    'likes',
    'disLikes',
  );
  res.json(post);
};

//------------------------------
// Update post
//------------------------------
export const updatePostCtrl = async (req, res) => {
  const { postID } = req.params;
  validObjectId(postID);
  const post = await checkPostExists(postID);

  checkPermissions(req.user, post.author);
  // runValidators => 執行Schema的驗證邏輯
  const updatePost = await Post.findByIdAndUpdate(
    postID,
    { ...req.body },
    { new: true, runValidators: true },
  );

  if (!updatePost) {
    throw new BadGatewayError('發生錯誤，請稍後再試');
  }

  res.json(updatePost);
};

//------------------------------
// delete post
//------------------------------
export const deletePost = async (req, res) => {
  const { postID } = req.params;
  validObjectId(postID);
  const post = await checkPostExists(postID);

  checkPermissions(req.user, post.author);

  const postDelete = await Post.findOneAndDelete(post);
  if (!postDelete) {
    throw new BadGatewayError('發生錯誤，請稍後再試');
  }
  res.json({ message: 'Success post remove' });
};

//------------------------------
// Like post
//------------------------------
export const likePostToggle = async (req, res) => {
  const { postID } = req.body;
  validObjectId(postID);
  const post = await checkPostExists(postID);

  const { userID } = req.user;

  const isDisliked = post.disLikes.some(
    (author) => author.toString() === userID.toString(),
  );

  const isLiked = post.likes.some(
    (author) => author.toString() === userID.toString(),
  );

  let updatePost = null;

  if (isDisliked && !isLiked) {
    updatePost = await Post.findOneAndUpdate(
      postID,
      {
        $pull: { disLikes: userID },
        $addToSet: { likes: userID },
      },
      { new: true },
    );
  }

  if (isLiked && !isDisliked) {
    updatePost = await Post.findOneAndUpdate(
      postID,
      {
        $pull: { likes: userID },
      },
      { new: true },
    );
  }

  if (!isLiked && !isDisliked) {
    updatePost = await Post.findOneAndUpdate(
      postID,
      {
        $addToSet: { likes: userID },
      },
      { new: true },
    );
  }

  if (isLiked && isDisliked) {
    updatePost = await Post.findOneAndUpdate(
      postID,
      {
        $pull: { likes: userID, disLikes: userID },
      },
      { new: true },
    );
  }

  res.json({ message: 'success', updatePost });
};

//------------------------------
// disLike post
//------------------------------
export const dislikePostToggle = async (req, res) => {
  const { postID } = req.body;
  validObjectId(postID);
  const post = await checkPostExists(postID);

  const { userID } = req.user;

  const isDisliked = post.disLikes.some(
    (author) => author.toString() === userID.toString(),
  );

  const isLiked = post.likes.some(
    (author) => author.toString() === userID.toString(),
  );

  let updatePost = null;

  if (isDisliked && !isLiked) {
    updatePost = await Post.findOneAndUpdate(
      postID,
      {
        $pull: { disLikes: userID },
      },
      { new: true },
    );
  }

  if (isLiked && !isDisliked) {
    updatePost = await Post.findOneAndUpdate(
      postID,
      {
        $pull: { likes: userID },
        $addToSet: { disLikes: userID },
      },
      { new: true },
    );
  }

  if (!isLiked && !isDisliked) {
    updatePost = await Post.findOneAndUpdate(
      postID,
      {
        $addToSet: { disLikes: userID },
      },
      { new: true },
    );
  }

  if (isLiked && isDisliked) {
    updatePost = await Post.findOneAndUpdate(
      postID,
      {
        $pull: { likes: userID, disLikes: userID },
      },
      { new: true },
    );
  }

  res.json({ message: 'Like Post', updatePost });
};
