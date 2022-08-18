import { NotFoundError } from '../errors/index.js';
import { Post } from '../model/index.js';

const checkPostExists = async (postID, comments, author, likes, disLikes) => {
  const post = await Post.findById(postID)
    .populate(comments)
    .populate(author)
    .populate(likes)
    .populate(disLikes);

  if (!post) {
    throw new NotFoundError(`No post with id: ${postID}`);
  }
  return post;
};

export default checkPostExists;
