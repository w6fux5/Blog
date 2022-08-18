import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import log from 'log-beautify';
import { BadRequestError } from '../errors/index.js';

// storage
const multerStorage = multer.memoryStorage();

// file type checking
const multerFilter = (req, file, cb) => {
  try {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb({ message: 'Unsupported file format' }, false);
    }
  } catch (error) {
    log.error(`File-Upload ${error}`);
  }
};

const photoUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 1800000 },
});

// Image Resizing
const profilePhotoResize = async (req, res, next) => {
  // check if there is no file
  if (!req.file) {
    throw new BadRequestError(`圖片檔案不正確: ${req.file}`);
  }

  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

  await sharp(req.file.buffer)
    .resize(250, 250)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(path.join(`public/images/profile/${req.file.filename}`));

  return next();
};

// Post Image Resizing
const postImgResize = async (req, res, next) => {
  // check if there is no file
  if (!req.file) {
    throw new BadRequestError(`圖片檔案不正確: ${req.file}`);
  }

  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(path.join(`public/images/posts/${req.file.filename}`));

  return next();
};

export default { photoUpload, profilePhotoResize, postImgResize };
