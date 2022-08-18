import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './custom-api-error.js';

class BadGatewayError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BadGatewayError;
    this.message = message || '發生錯誤，請稍後再試';
  }
}

export default BadGatewayError;
