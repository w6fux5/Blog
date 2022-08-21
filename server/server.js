import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import log from 'log-beautify';

import 'colors';
import 'express-async-errors';

// DB
import connectDB from './config/db.js';

// Router
import {
  userRouter,
  postRouter,
  authRouter,
  commentRouter,
  // emailRouter,
  categoryRouter,
} from './router/index.js';

// Middleware
import {
  notFoundMiddleware,
  errorHandleMiddleware,
  authenticateUser,
  // checkUserIsBlocked,
} from './middleware/index.js';

dotenv.config();

const app = express();

if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev'));
}

app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', authenticateUser, userRouter);
app.use('/api/v1/posts', authenticateUser, postRouter);
app.use('/api/v1/comments', authenticateUser, commentRouter);
// app.use('/api/v1/email', authenticateUser, emailRouter);
app.use('/api/v1/category', authenticateUser, categoryRouter);

app.use(errorHandleMiddleware);
app.use(notFoundMiddleware);

const PORT = process.env.PORT || 8080;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(PORT, () => {
      log.success(`Server is running on port ${PORT}...`);
    });
  } catch (error) {
    log.error(`${error.message}`);
    process.exit(1);
  }
};

start();
