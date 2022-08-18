import express from 'express';

import { sendEmailMessage } from '../controller/emailController.js';
import { checkUserIsActive, checkUserIsBlocked } from '../middleware/index.js';
// import sendEmail from '../utils/mail-service';

const router = express.Router();

router.route('/').post(checkUserIsActive, checkUserIsBlocked, sendEmailMessage);

export default router;
