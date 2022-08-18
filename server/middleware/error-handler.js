import { StatusCodes } from 'http-status-codes';
import log from 'log-beautify';

// eslint-disable-next-line
const errorHandleMiddleware = (error, req, res, next) => {
  const defaultError = {
    statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: error.message || 'Something went wrong, try again later',
  };

  // log.error(`[ ${dayjs().format('YYYY-MM-DD HH:mm')} ]: ${error.message}`);
  // log.debug(`[ Path ]: ${req.url}`);
  // log.debug(`[ Headers ]:`, req.headers);
  // log.debug(`[ Body ]: `, req.body);

  if (error?.code === 11000) {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.message = `${Object.keys(error.keyValue)} 重複`;
  }

  if (error.name === 'ValidationError') {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    // defaultError.message = error.message;
    defaultError.message = Object.values(error.errors)
      .map((item) => item.message)
      .join(',');
  }

  log.error(defaultError);

  const message =
    defaultError.statusCode !== 500
      ? defaultError.message
      : 'Something went wrong';

  res.status(defaultError.statusCode).json({ message });
  // res.status(defaultError.statusCode).json(error);
};

export default errorHandleMiddleware;
