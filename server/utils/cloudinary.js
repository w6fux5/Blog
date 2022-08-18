import cloudinary from 'cloudinary';
import log from 'log-beautify';
import { BadRequestError } from '../errors/index.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const cloudinaryUploadImg = async (fileToUpload) => {
  try {
    const data = await cloudinary.uploader.upload(fileToUpload, {
      resource_type: 'auto',
    });
    return { url: data?.secure_url };
  } catch (error) {
    log.error(error);
    throw new BadRequestError('上傳圖片失敗');
  }
};

export default cloudinaryUploadImg;
