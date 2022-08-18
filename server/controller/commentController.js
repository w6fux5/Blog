import { Comment } from '../model/index.js';
import {
  BadRequestError,
  BadGatewayError,
  NotFoundError,
} from '../errors/index.js';
import { validObjectId } from '../utils/index.js';

//------------------------------
// Create comment
//------------------------------
export const createComment = async (req, res) => {
  const { postID, description } = req.body;
  if (!postID || !description) {
    throw new BadRequestError('please provide all value');
  }

  const comment = await Comment.create({
    user: req.user.userID,
    post: postID,
    description,
  });

  if (!comment) {
    throw new BadGatewayError('無法新增comment，請稍後再試');
  }

  res.json({ message: 'success', comment });
};

//------------------------------
// Fetch all comment
//------------------------------
export const fetchAllComments = async (rea, res) => {
  const comments = await Comment.find({}).sort('-createdAt');

  if (!comments) {
    throw new BadGatewayError('發生錯誤，請稍後再試');
  }

  res.json({ total: comments.length, comments });
};

//------------------------------
// Fetch single comment
//------------------------------
export const fetchSingleComment = async (req, res) => {
  const { commentID } = req.params;
  validObjectId(commentID);

  const comment = await Comment.findById(commentID);
  if (!comment) {
    throw new NotFoundError(`No comment with id: ${commentID}`);
  }
  res.json({ message: 'success', comment });
};

//------------------------------
// update comment
//------------------------------
export const updateComment = async (req, res) => {
  const { commentID } = req.params;
  validObjectId(commentID);

  const { description } = req.body;
  if (!description) {
    throw new BadRequestError('沒有description');
  }

  const comment = await Comment.findByIdAndUpdate(
    commentID,
    {
      user: req.user.userID,
      description,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.json({ message: 'success', comment });
};

export const deleteComment = async (req, res) => {
  const { commentID } = req.params;
  validObjectId(commentID);
  const comment = await Comment.findOneAndDelete(commentID);
  if (!comment) {
    throw new BadRequestError('刪除comment時發生錯誤');
  }
  res.json({ message: 'success' });
};
